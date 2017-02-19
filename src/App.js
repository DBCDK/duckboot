import React, {Component} from 'react';
import Search from './components/search.container';
import SearchResult from './components/searchResult.component';
import {RatingsList} from './components/rate.component';
import Recommendations, {RecommenderButtons} from './components/recommendations.container';
import Profiles, {CurrentProfile} from './components/profile.container';
import SavedList from './components/savedList.container';
import GlobalState from './GlobalState';


function Section({title, Header, children}) {
  return (
    <div className="section">
      <h2>{title}</h2>
      <div className="header">
        {Header}
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
}


class SearchPage extends React.Component {
  constructor() {
    super();
    this.state = {
      search: true
    };
  }

  toggleState = () => {
    this.setState({search: !this.state.search});
  };

  render() {
    return (
      <div className="search-page flex">
        {this.state.search &&
        <Section title={<span>Søg<a href="#" onClick={this.toggleState}>Vis gemte</a></span>} Header={<Search />}>
          <SearchResult />
        </Section>
        ||
        <Section title={<span>Gemte poster<a href="#" onClick={this.toggleState}>Søg</a></span>} Header="">
          <SavedList />
        </Section>

        }
        <Section title="Profil" Header={<CurrentProfile />}>
          <RatingsList />
        </Section>
        <Section title="Anbefalinger" Header={<RecommenderButtons />}>
          <Recommendations />
        </Section>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      view: []
    };
  }

  componentDidMount() {
    GlobalState.listen(({view}) => {
      if (view !== this.state.view) {
        this.setState({view});
      }
    });
    //GlobalState.goto('search');
  }

  router() {
    switch (this.state.view) {
      case 'search':
        return <SearchPage />;
        break;
      case 'selectProfile':
      default :
        return <Profiles/>;
        break;
    }
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <h2>Duckboots</h2>
        </div>
        <div className="container">
          {this.router()}
        </div>
      </div>
    );
  }
}

export default App;
