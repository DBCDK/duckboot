import React from 'react';
import JSONView from './jsonView.container';
import GlobalState from '../GlobalState';
import {CloseSvg} from './svg.container'

function CustomFilter({error, value, change}) {
  const style = {};
  if (error) {
    style.border = "1px solid red";
  }
  return (
    <div>
      <h2>Filter</h2>
      <textarea className="w-100 h4" style={style} defaultValue='{"name": ""}'
                onChange={e => change(e.currentTarget.value)}/>
    </div>
  );
}

export default class Filters extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filters: GlobalState.getState().filters || [],
      filter: '',
      jsonError: false,
    };
  }

  submit = (e) => {
    e.preventDefault();
    if (this.state.jsonError) {
      alert('Invalid JSON: ' + this.state.jsonError);
    }
    else {
      const filters = this.state.filters.concat(this.state.filter);
      this.setState({filters});
      GlobalState.setState({filters});
    }
  }

  changeFilter(value) {
    try {
      console.log('hep');
      const filter = JSON.parse(value);
      this.setState({filter, jsonError: false});
    } catch (e) {
      this.setState({jsonError: e});
    }
  }

  removeFilter(filter) {
    const filters = this.state.filters.filter(f => f !== filter);
    this.setState({filters});
    GlobalState.setState({filters});
  }

  render() {
    return (
      <div>
        <form className="boosters" onSubmit={this.submit}>
          <CustomFilter error={this.state.jsonError} change={value => this.changeFilter(value)}/>
          <input type="submit" value="Tilføj filter"/>
          {this.state.filters.map(filter => <FilterView key={filter.name} filter={filter} remove={e => this.removeFilter(filter)} />)}
        </form>
      </div>
    );
  }
}

function FilterView({filter, remove}) {
  return (
    <div className="filter">
      <div className="filter--remove">
        <span className="filter--close" onClick={remove}>
          <span className="icon medium round">
            <CloseSvg />
          </span>
        </span>
      </div>
      <h3>{filter.name}</h3>
      <JSONView {...filter} />
    </div>
  );
}