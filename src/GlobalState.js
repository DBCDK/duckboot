import request from 'superagent';

window.request = request;
class GlobalState {
  constructor() {
    this.listeners = [];
    this.profiles = [];
    this.current = {
      profile: {},
      state: {
        recommenders: [],
        recommendations: [],
        ratings: [],
        search: {
          query: "",
          searching: false,
          data: []
        }
      }
    };
    this.history = [];

    this.loadInitialState();
  }

  loadInitialState() {
    request.get('settings.json')
      .end((err, res) => {
        const initState = JSON.parse(res.text);
        const recommenders = initState.recommenders;
        this.setState({recommenders})
      });
  }

  setState(newState) {
    this.history.push(Object.assign({}, this.state));
    this.current.state = Object.assign({}, this.current.state, newState);
    this.onChange();
  }

  getState() {
    return this.current.state;
  }

  onChange() {
    const newState = Object.assign({}, this.current.state);
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
    const ratings = this.getState().ratings.concat([{
      pid: element.pid,
      element,
      like: value
    }]);
    this.setState({ratings})
  }

  removeLike(element) {
    const ratings = this.getState().ratings.filter(like => like.pid !== element.pid);
    this.setState({ratings})
  }

  getRating(element) {
    return this.getState().ratings.filter(like => like.pid === element.pid)[0] || null;
  }

  getRatings() {
    const like = this.getState().ratings.filter(rating => rating.like).map(rating => rating.pid);
    const dislike = this.getState().ratings.filter(rating => !rating.like).map(rating => rating.pid);
    return {like, dislike};
  }

  addProfile({name}) {

  }

  removeProfile({name}) {

  }

  selectProfile({name}) {

  }

}

export default new GlobalState();