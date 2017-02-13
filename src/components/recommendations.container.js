import React from 'react';
import GlobalState from '../GlobalState';
import {ElementList} from './element.component';

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