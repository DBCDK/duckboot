import React from 'react';
import GlobalState from '../GlobalState';
import {ElementList} from './element.component';

function NoResults() {
  return (
    <div>
      Der er ikke nogen gemte poster
    </div>
  )
}

export default class SavedListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      saved: GlobalState.getState().saved
    };
  }

  componentDidMount() {
    this.listener = GlobalState.listen((state) => {
      this.setState({saved: state.saved});
    });
  }

  componentWillUnmount() {
    GlobalState.unListen(this.listener);
  }

  render() {
    const saved = this.state.saved;
    if (saved.length === 0) {
      return NoResults();
    }
    return ElementList({list: saved})
  }
}