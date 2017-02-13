import React, { Component } from 'react';
import Search from './components/search.container';
import SearchResult from './components/searchResult.component';
import {RatingsList} from './components/rate.component';
import Recommendations from './components/recommendations.container';

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
        <RatingsList />
        <Search/>
        <SearchResult />
        <Recommendations />
      </div>
    );
  }
}

export default App;
