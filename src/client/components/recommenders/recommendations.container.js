import React from 'react';
import GlobalState from '../../GlobalState';
import ElementList from '../elements/elementList.component';
import Filters from '../filters/filterContainer.component';
import JsonView from '../jsonView/jsonView.container';

export function RecommenderButton(recommender) {
  const onClick = (e) => {
    e.preventDefault();
    GlobalState.recommend(recommender, GlobalState.getRatings());
  };
  return (
    <button className={`button ${recommender.isActive ? 'active' : 'submit'}`} onClick={onClick}>{recommender.name}</button>
  );
}

export class RecommenderButtons extends React.Component {

  constructor() {
    super();
    this.state = {
      recommenders: GlobalState.getState().recommenders || []
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
    const {recommendations} = GlobalState.getState();
    this.state = {
      recommendations: recommendations,
      profileUpdated: this.didProfileUpdate(recommendations.request)
    };
  }

  didProfileUpdate(request) {
    return JSON.stringify(GlobalState.recommenderRequestData()) !== JSON.stringify(request)
  }

  componentDidMount() {
    this.listener = GlobalState.listen(({recommendations, recommending}) => {
      const profileUpdated = this.didProfileUpdate(recommendations.request);
        this.setState({recommendations, profileUpdated, recommending});
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
    return this.state.profileUpdated && <p>Profilen er opdateret. <button onClick={this.getRecommendations}>Opdater anbefalinger</button></p>;
  }
  render() {
    return(
      <div>

        <div className="filters bg-white pa3 mb1">
            <Filters show={false}/>
        </div>
        {this.profileUpdated()}
        <h2>Resultater</h2>
        {this.state.recommending ? 'Søger...' : ElementList({list: this.state.recommendations.data || []})}
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
      <h3>Response Header</h3>
        {JsonView(this.state.recommendations.header)}
      </div>
    );
    //return ElementList({list: this.state.recommendations.data || []});
  }
}

