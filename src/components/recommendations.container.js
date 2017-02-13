import React from 'react';
import GlobalState from '../GlobalState';
import {ElementList} from './element.component';

export function RecommenderButton({url, name}) {
  const onClick = (e) => {
    e.preventDefault();
    GlobalState.recommend(url, GlobalState.getRatings());
  };
  return (
    <a onClick={onClick}>{name}</a>
  );
}

export class RecommenderButtons extends React.Component {

  constructor() {
    super();
    this.state = {
      recommenders: []
    };
    GlobalState.listen(({recommenders}) => {
      if (recommenders !== this.state.recommenders) {
        this.setState({recommenders});
      }
    });
  }
  render() {
    return (
      <div>
        {this.state.recommenders.map(recommender => <RecommenderButton key={recommender.url} {...recommender} />)}
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
    GlobalState.listen(({recommendations}) => {
      if (recommendations !== this.state.recommendations) {
        this.setState({recommendations});
      }
    });
  }

  render() {
    return ElementList({list: this.state.recommendations});
  }

}