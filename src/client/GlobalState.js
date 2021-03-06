import request from 'superagent';

window.request = request;
class GlobalState {
  constructor() {
    const defaultState = {
      view: 'profileSelect',
      recommenders: [],
      profiles: [],
      profile: {},
      search: {
        query: "",
        searching: false,
        data: []
      },
      saved: [],
      searchUrl: "",
      recommendations: {
        url: '',
        data: [],
        request: {},
        response: {}
      }
    };

    this.state = Object.assign(defaultState, this.getLocalStorage());

    this.listeners = [];
    this.profiles = [];
    this.history = [];

    this.loadInitialState();
  }

  getLocalStorage() {
    const storageString = localStorage.getItem('Duckboots State');
    return (storageString && JSON.parse(storageString)) || {};
  }

  setLocalStorage(state) {
    localStorage.setItem('Duckboots State', JSON.stringify(state));
  }

  loadInitialState() {
    request.get('/buttons')
      .end((err, res) => {
        const recommenders = JSON.parse(res.text);
        this.setState({recommenders});
      });
  }

  setState(newState) {
    this.history.push(Object.assign({}, this.state));
    this.state = Object.assign({}, this.state, newState);
    this.setLocalStorage(this.state);
    this.onChange();
  }

  getState() {
    return Object.assign({}, this.state);
  }

  onChange() {
    const newState = Object.assign({}, this.state);
    this.listeners.forEach(cb => cb(newState));
  }

  listen(cb) {
    this.listeners.push(cb);
    return cb;
  }

  unListen(cb) {
    this.listeners = this.listeners.filter(callback => callback !== cb);
  }

  search(query) {
    this.setState({search: {query: query, searching: true}});
    request.post('/search')
      .send({query, profile: this.getProfile()})
      .end((err, res) => {
        if (res && res.text) {
          const data = JSON.parse(res.text);
          this.setState({search: {data, query: query.q, searching: false}})
        }
        else {
          this.setState({search: {data: [], query: query.q, searching: false}})
        }
      });
  }


  recommenderRequestData() {
    const {boosters = [], filters = []} = this.getState();
    const {likes = [], dislikes = []} = this.getRatings();
    return{likes, dislikes, boosters, filters}
  }

  recommend(recommender) {
    const recommenderRequest = this.recommenderRequestData();
    const recommenders = this.getState().recommenders.map(rec => {
      if (rec.name === recommender.name && rec.url === recommender.url) {
        rec.isActive = true;
      }
      else {
        rec.isActive = false;
      }
      return rec;
    });
    const recommendations = {
      recommender: recommender,
      data: [],
      request: recommenderRequest,
      response: {}
    };
    if (this.getProfile().agencyId) {
      const baseFilter = {
        name: 'baseFilter',
        agencies: [this.getProfile().agencyId]
      };
      let contained = false;
      recommenderRequest.filters.forEach(filter =>{
        if (JSON.stringify(filter) === JSON.stringify(baseFilter)) {
          contained = true;
        }
      });
      if (!contained) {
        recommenderRequest.filters.push(baseFilter);
      }
    }
    this.setState({recommendations, recommenders, recommending: true});
    request.post(recommender.url)
      .send(recommenderRequest)
      .end((err, res) => {
        if (res && res.body) {
          const result = res.body.response;
          recommendations.response = result;
          recommendations.header = res.body.responseHeader;
          recommendations.data = result;
        }
        else {
          recommendations.response = err;
        }
        this.setState({recommendations, recommending: false})
      });
  }

  addLike(element, value) {
    this.removeLike(element)
    const pid = Array.isArray(element.pid) ? element.pid[0] : element.pid;
    const profile = this.getProfile();
    profile.ratings = profile.ratings.concat([{
      pid,
      element,
      like: value
    }]);
    this.setState({profile: Object.assign({}, profile)})
  }

  removeLike(element) {
    const pid = Array.isArray(element.pid) ? element.pid[0] : element.pid;
    const profile = this.getProfile();
    profile.ratings = profile.ratings.filter(like => like.pid !== pid);
    this.setState({profile: Object.assign({}, profile)})
  }

  save(element) {
    const savedInState = this.getState().saved || [];
    element.pid = Array.isArray(element.pid) ? element.pid[0] : element.pid;
    const saved = savedInState.concat([element]);
    this.setState({saved})
  }

  removeSaved(element) {
    const pid = Array.isArray(element.pid) ? element.pid[0] : element.pid;
    const saved = this.getState().saved.filter(saved => saved.pid !== pid);
    this.setState({saved})
  }

  isSaved(element) {
    const pid = Array.isArray(element.pid) ? element.pid[0] : element.pid;
    const saved = this.getState().saved || [];
    return saved.filter(saved => saved.pid === pid).length > 0;
  }

  getRating(element) {
    const pid = Array.isArray(element.pid) ? element.pid[0] : element.pid;
    const profile = this.getProfile();
    return profile.ratings.filter(like => like.pid === pid)[0] || null;
  }

  getRatings() {
    const profile = this.getProfile();
    const likes = profile.ratings.filter(rating => rating.like).map(rating => rating.pid);
    const dislikes = profile.ratings.filter(rating => !rating.like).map(rating => rating.pid);
    return {likes, dislikes};
  }

  getProfile() {
    return this.state.profiles.filter(profile => profile.name === this.state.profile.name)[0];
  }

  addProfile(profile) {
    profile.ratings = [];
    const profiles = this.getState().profiles.concat([profile]);
    this.setState({profiles})
  }

  deleteProfile(selectedProfile) {
    const profiles = this.getState().profiles.filter(profile => profile.name !== selectedProfile.name);
    this.setState({profiles});
  }

  selectProfile(selectedProfile) {
    const profile = this.getState().profiles.filter(profile => profile.name === selectedProfile.name)[0];
    this.setState({profile});
  }

  goto(view) {
    this.setState({view});
  }

}

export default new GlobalState();
