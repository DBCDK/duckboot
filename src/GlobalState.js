class GlobalState {
  constructor() {
    this.listeners = [];
    this.state = {};
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
}

export default new GlobalState();