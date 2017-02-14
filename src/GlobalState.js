import request from 'superagent';

window.request = request;
class GlobalState {
  constructor() {
    this.state = {
      recommenders: [],
      profiles: [{
          name: "test",
          ratings: []
        }],
      profile: {},
      search: {
        query: "",
        searching: false,
        data: []
      },
      recommendations: [],
      ratings: "<= profiles.selected.ratings"
    };
    this.state.profile = this.state.profiles[0];

    this.listeners = [];
    this.profiles = [];
    this.history = [];

    this.loadInitialState();
  }

  loadInitialState() {
    // TODO make this a configuration
    request.get('settings.json')
      .end((err, res) => {
        const initState = JSON.parse(res.text);
        const recommenders = initState.recommenders;
        this.setState({recommenders})
      });
  }

  setState(newState) {
    this.history.push(Object.assign({}, this.state));
    this.state = Object.assign({}, this.state, newState);
    this.onChange();
  }

  getState() {
    return this.state;
  }

  onChange() {
    const newState = Object.assign({}, this.state);
    this.listeners.forEach(cb => cb(newState));
  }

  listen(cb) {
    this.listeners.push(cb);
  }

  search(query) {
    this.setState({search: {query: query, searching: true}});
    request.post('http://localhost:3001/search')
      .send(query)
      .end((err, res) => {
        if (res && res.text) {
          const data = JSON.parse(res.text).data;
          this.setState({search: {data, query: query.q, searching: false}})
        }
        else {
          this.setState({search: {data: [], query: query.q, searching: false}})
        }
      });
  }

  recommend(url, {like, dislike}) {
    this.setState({recommendations: []});
    request.post(url)
      .send({like, dislike})
      .end((err, res) => {
        if (res && res.text) {
          const result = JSON.parse(res.text).result;
          const elements = result.map(element => element[1]);
          this.setState({recommendations: elements})
        }
        else {
          this.setState({recommendations: []});
        }
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
    this.setState({profile})
  }

  removeLike(element) {
    const profile = this.getProfile();
    profile.ratings = profile.ratings.filter(like => like.pid !== element.pid);
    this.setState({profile})
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
    return this.getState().profile;
  }

  addProfile(profile) {
    profile.ratings = [];
    const profiles = this.getState().profiles.concat([profile]);
    this.setState({profiles})
  }

  removeProfile({name}) {

  }

  selectProfile(selectedProfile) {
    const profile = this.getState().profiles.filter(profile => profile.name === selectedProfile.name)[0];
    this.setState({profile});
  }

}

export default new GlobalState();