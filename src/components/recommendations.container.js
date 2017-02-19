import React from 'react';
import GlobalState from '../GlobalState';
import {ElementList} from './element.component';

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
      recommendations: []
    };
  }

  componentDidMount() {
    GlobalState.listen(({recommendations}) => {
        this.setState({recommendations});
    });
  }

  render() {
    return ElementList({list: this.state.recommendations});
  }

}