class GlobalState {
  constructor() {
    this.listeners = [];
    this.state = {
      ratings: []
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