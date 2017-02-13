import React from 'react';
import GlobalState from '../GlobalState';
import {ElementList} from './element.component';

function NoResults({query}) {
  return (
    <div>
      Der er ikke nogen resultater på <span className="nb">{query}</span>
    </div>
  )
}

function WaitForResults() {
  return (
    <div className="loading">
      Søger...
    </div>
  );
}

export default class SearchResultContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      search: {
        query: "",
        data: [],
        searching: false
      }
    };
    GlobalState.listen((state) => {
      this.setState({search: state.search});
    });
  }

  render() {
    const search = this.state.search;
    if (search.searching) {
      return WaitForResults();
    }
    else if (search.data.length === 0 && search.query) {
      return NoResults({query: search.query});
    }
    return ElementList({list: search.data || []})
  }
}