import React from 'react';
import GlobalState from '../GlobalState';
import {ElementList} from './element.component';
import Booster from './booster';
import Filters from './filters';
import JsonView from './jsonView.container';

export function RecommenderButton(recommender) {
  const onClick = (e) => {
    e.preventDefault();
    GlobalState.recommend(recommender, GlobalState.getRatings());
  };
  return (
    <a href="#" className={`button ${recommender.isActive && 'active' || 'submit'}`} onClick={onClick}>{recommender.name}</a>
  );
}

export class RecommenderButtons extends React.Component {

  constructor() {
    super();
    this.state = {
      recommenders: []
    };
  }

  componentDidMount() {
    GlobalState.listen(({recommenders}) => {
      this.setState({recommenders});
    });
  }

  render() {
    return (
      <div className="recommender-buttons">
        {this.state.recommenders.map(recommender => <RecommenderButton key={recommender.url + recommender.name} {...recommender} />)}
      </div>
    );
  }
}

export default class Recommender extends React.Component {
  constructor() {
    super();
    this.state = {
      recommendations: GlobalState.getState().recommendations,
    };
    this.state.profileUpdated = this.didProfileUpdate(this.state.recommendations.request);
  }

  didProfileUpdate(request) {
    return JSON.stringify(GlobalState.recommenderRequestData()) !== JSON.stringify(request)
  }

  componentDidMount() {
    this.listener = GlobalState.listen(({recommendations}) => {
      const profileUpdated = this.didProfileUpdate(recommendations.request);
        this.setState({recommendations, profileUpdated});
    });
  }

  componentWillUnmount() {
    GlobalState.unListen(this.listener);
  }

  getRecommendations = () => {
    const recommender = this.state.recommendations.recommender;
    GlobalState.recommend(recommender, GlobalState.getRatings(), this.state.filters || [], this.state.boosters || []);
  };

  profileUpdated() {
    return this.state.profileUpdated && <p>Profilen er opdateret. <a href="#" onClick={this.getRecommendations}>Opdater anbefalinger</a></p>;
  }
  render() {
    return(
      <div>

        <div className="filters">
          <Filters show={false}/>
        </div>
        {this.profileUpdated()}
        {ElementList({list: this.state.recommendations.data || []})}
      </div>
    );

  }
}

export class RecommenderJson extends Recommender {
  render() {
    return (
      <div>
        {this.profileUpdated()}
        <h3>url</h3>
        <div className="mb2">
          {JsonView(this.state.recommendations.recommender.url)}
        </div>
        <h3>Request</h3>
        <div className="mb2">
          {JsonView(this.state.recommendations.request)}
        </div>
        <h3>Response</h3>
        {JsonView(this.state.recommendations.response)}
      </div>
    );
    //return ElementList({list: this.state.recommendations.data || []});
  }
}

