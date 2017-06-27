import React from 'react';
import FilterList from './filterList.component';
import AddFilter from './addFilter.component';
import GlobalState from '../../GlobalState';

export default class FilterContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      filters: GlobalState.getState()['filters'] || [],
      boosters: GlobalState.getState()['boosters'] || [],
      currentElement: '',
      jsonError: false,
    };
  }

  submit = (e) => {
    const type = this.refs.type.value;
    e.preventDefault();
    if (this.state.jsonError) {
      alert('Invalid JSON: ' + this.state.jsonError);
    }
    else {
      const elements = this.state[type].concat(this.state.currentElement);
      this.setState({[type]: elements});
      GlobalState.setState({[type]: elements});
    }
  }

  changeValue = (value) => {
    try {
      const currentElement = JSON.parse(value);
      this.setState({currentElement, jsonError: false});
    } catch (e) {
      this.setState({jsonError: e});
    }
  }

  removeElement = (type, element) => {
    const elements = this.state[type].filter(el => el !== element);
    this.setState({[type]: elements});
    GlobalState.setState({[type]: elements});
  }

  render() {
    return (
      <div className={"filters--wrapper"}>
        <h2 onClick={e => this.setState({show: !this.state.show})} className="filters--toggle mb0 pa0">Filters/Boosters</h2>
        <div className={(this.state.show && 'show') || 'hide'}>
          <form className={`filters mb1`} onSubmit={this.submit}>
            <AddFilter error={this.state.jsonError} change={value => this.changeValue(value)}/>
            <select className="dib button-select" ref="type" name="type" defaultValue="filters">
              <option value="filters">Filter</option>
              <option value="boosters">Booster</option>
            </select>
            <input className="button active ml2" type="submit" value={`Tilføj`}/>
          </form>
          <div>
            {(this.state.filters.length && <FilterList remove={this.removeElement} elements={this.state.filters} type="filters"/>) || ''}
            {(this.state.boosters.length && <FilterList remove={this.removeElement} elements={this.state.boosters} type="boosters"/>) || ''}
          </div>
        </div>
      </div>
    );
  }
}