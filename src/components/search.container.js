import React from 'react';
import GlobalState from '../GlobalState';
import {SearchSvg} from './svg.container';

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
      <div className="black-box">
        <form className="search" action="" onSubmit={this.onSubmit}>
          <input className="" ref={ref => this.input = ref} type="text" defaultValue="hest" placeholder="Søg på title eller forfatter"/>
          <SearchSvg />
        </form>
      </div>
    );
  }
}