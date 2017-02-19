import React, {Component} from 'react';
import Search from './components/search.container';
import SearchResult from './components/searchResult.component';
import {RatingsList, RatingsListJson} from './components/rate.component';
import Recommendations, {RecommenderButtons, RecommenderJson} from './components/recommendations.container';
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
      search: true,
      recommender: true,
      profile: true
    };
  }

  toggleSearch = () => {
    this.setState({search: !this.state.search});
  };
  toggleRecommenders = () => {
    this.setState({recommender: !this.state.recommender});
  };

  toggleProfile = () => {
    this.setState({profile: !this.state.profile});
  };

  render() {
    return (
      <div className="search-page flex">
        {this.state.search &&
        <Section title={<span>Søg<a href="#" onClick={this.toggleSearch}>Vis gemte</a></span>} Header={<Search />}>
          <SearchResult />
        </Section>
        ||
        <Section title={<span>Gemte poster<a href="#" onClick={this.toggleSearch}>Søg</a></span>} Header="">
          <SavedList />
        </Section>
        }
        {this.state.profile &&
        <Section title={<span>Profil<a href="#" onClick={this.toggleProfile}>Vis JSON</a></span>} Header={<CurrentProfile />}>
          <RatingsList />
        </Section>
        ||
        <Section title={<span>Profil<a href="#" onClick={this.toggleProfile}>Skjul JSON</a></span>} Header={<CurrentProfile />}>
          <RatingsListJson />
        </Section>
        }
        {this.state.recommender &&
        <Section title={<span>Anbefalinger<a href="#" onClick={this.toggleRecommenders}>Vis JSON</a></span>} Header={<RecommenderButtons />}>
          <Recommendations />
        </Section>
        ||
        <Section title={<span>Anbefalinger<a href="#" onClick={this.toggleRecommenders}>Skjul JSON</a></span>} Header={<RecommenderButtons />}>
          <RecommenderJson />
        </Section>
        }
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
