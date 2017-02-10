import React, { Component } from 'react';
import request from 'superagent';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="app-header">
          <h2>Duckboots</h2>
        </div>
        <p className="app-intro">
          What should I read...?
        </p>
      </div>
    );
  }
}

export default App;
