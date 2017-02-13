import request from 'superagent';

class GlobalState {
  constructor() {
    this.listeners = [];
    this.state = {
      recommendations: [],
      ratings: [],
      search: {
        query: "",
        searching: false,
        data: []
      }
    };
    this.history = [];
  }
  setState(newState) {
    this.history.push(Object.assign({}, this.state));
    this.state = Object.assign({}, this.state, newState);
    this.onChange();
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

  recommend({like, dislike}) {
    this.setState({recommendations: []});
    request.post('http://localhost:3001/recommend')
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
    const ratings = this.state.ratings.concat([{
      pid: element.pid,
      element,
      like: value
    }]);
    this.setState({ratings})
  }
  removeLike(element) {
    const ratings = this.state.ratings.filter(like => like.pid !== element.pid);
    this.setState({ratings})
  }

  getRating(element) {
    return this.state.ratings.filter(like => like.pid === element.pid)[0] || null;
  }
}

export default new GlobalState();