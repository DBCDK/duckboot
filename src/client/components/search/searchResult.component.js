import React from 'react';
import GlobalState from '../../GlobalState';
import ElementList from '../elements/elementList.component';

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
  }

  componentDidMount() {
    this.listener = GlobalState.listen(({search}) => {
      this.setState({search});
    });
  }

  componentWillUnmount() {
    GlobalState.unListen(this.listener);
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