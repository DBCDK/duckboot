import request from 'superagent';

window.request = request;
class GlobalState {
  constructor() {
    const defaultState = {
      token: "5d34b46edd8e0f1ec358602cc23a2ce875c1f64b",
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
    // TODO make this a configuration
    request.get('settings.json')
      .end((err, res) => {
        const initState = JSON.parse(res.text);
        const {recommenders, search} = initState;
        this.setState({recommenders, searchUrl: search});
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
    request.post(this.state.searchUrl)
      .send(query)
      .end((err, res) => {
        if (res && res.text) {
          const data = JSON.parse(res.text).data;
          const pids = data.map(post => post.pid);
          this.getCoverImage(pids, 'search');
          this.setState({search: {data, query: query.q, searching: false}})
        }
        else {
          this.setState({search: {data: [], query: query.q, searching: false}})
        }
      });
  }

  recommend(recommender, {like, dislike}) {
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
      request: {like, dislike},
      response: {}
    };
    this.setState({recommendations, recommenders});
    request.post(recommender.url)
      .send({like, dislike})
      .end((err, res) => {
        if (res && res.text) {
          const result = JSON.parse(res.text).result;
          recommendations.response = result;
          recommendations.data = result.map(element => element[1]);
        }
        else {
          recommendations.response = err;
        }
        this.setState({recommendations})
      });
  }

  getCoverImage(list, type) {
    console.log({access_token: this.state.token, pids: list});
    request.get('https://openplatform.dbc.dk/v1/work')
      .query({access_token: this.state.token, pids: list, fields:['pid', 'coverUrlThumbnail']})
      .end((err, res) => {
        const {data} = JSON.parse(res.text);
        const images = data.map(element => {
          return {
            pid: element.pid[0],
            image: element.coverUrlThumbnail && element.coverUrlThumbnail[0]
          }
        });
        console.log(this.getProfile(), type);
        const elements = this.getState()[type].map(element => {
          const image = images.filter(image => image.pid === element.pid);
          if (image && image.image) {
            element.image = image.image;
          }
        });
        this.setState({[type]: elements});
      });
  }

  addLike(element, value) {
    this.removeLike(element);
    const profile = this.getProfile();
    profile.ratings = profile.ratings.concat([{
      pid: element.pid,
      element,
      like: value
    }]);
    this.setState({profile: Object.assign({}, profile)})
  }

  removeLike(element) {
    const profile = this.getProfile();
    profile.ratings = profile.ratings.filter(like => like.pid !== element.pid);
    this.setState({profile: Object.assign({}, profile)})
  }

  save(element) {
    const savedInState = this.getState().saved || [];
    const saved = savedInState.concat([element]);
    this.setState({saved})
  }

  removeSaved(element) {
    const saved = this.getState().saved.filter(saved => saved.pid !== element.pid);
    this.setState({saved})
  }

  isSaved(element) {
    const saved = this.getState().saved || [];
    return saved.filter(saved => saved.pid === element.pid).length > 0;
  }

  getRating(element) {
    const profile = this.getProfile();
    return profile.ratings.filter(like => like.pid === element.pid)[0] || null;
  }

  getRatings() {
    const profile = this.getProfile();
    const like = profile.ratings.filter(rating => rating.like).map(rating => rating.pid);
    const dislike = profile.ratings.filter(rating => !rating.like).map(rating => rating.pid);
    return {like, dislike};
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