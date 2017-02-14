import React from 'react';
import GlobalState from '../GlobalState';

export default class Search extends React.Component {
  constructor() {
    super();
    this.limit = 10;
  };

  onSubmit = (e) => {
    e.preventDefault();
    GlobalState.search({
      limit: this.limit,
      q: this.input.value
    });
  };

  componentDidMount() {
    this.onSubmit({preventDefault: () => {}});
  }

  render() {
    return(
      <form className="search" action="" onSubmit={this.onSubmit}>
        <input className="underline" ref={ref => this.input = ref} type="text" defaultValue="hest" placeholder="Søg på f.eks. min kamp"/>
      </form>
    );
  }
}