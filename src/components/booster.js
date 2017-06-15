import React from 'react';
import GlobalState from '../GlobalState';

function PopularityBooster({value, change}) {
  return (
    <div>
      <div className="booster--name">Popularity Booster</div>
      <div className="booster--value">{value}</div>
      <input defaultValue={value.factor} type="range" min='0' max="1000" onChange={e => change({factor: Number(e.currentTarget.value), name: 'popularityBooster'})} />
    </div>
  );
}

PopularityBooster.defaultValue = {factor: name, name: 'popularityBooster'};

const boosterList = {PopularityBooster};

export default class Boosters extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      boosters: [
      ]
    };
  }

  submit = (e) => {
    const booster = boosterList[this.refs.select.value];
    const boosters = this.state.boosters.concat({
      Booster: booster,
      value: booster.defaultValue
    });
    this.setState({boosters});
    e.preventDefault();
  }

  changeBoosterValue(booster, value) {
    const boosters = this.state.boosters.map(b => {
      if (b.Booster == booster) {
        b.value = value;
      }
      return b;
    });
    this.setState({boosters});
    const values = boosters.map(b => b.value);
    GlobalState.setState({boosters: values});
  }

  render() {
    return (
      <div>
      <form className="boosters" onSubmit={this.submit}>
        <select ref="select" name="boost-selector" id="" defaultValue={PopularityBooster}>
          {Object.keys(boosterList).map(boosterName => <option value={boosterName}>{boosterName}</option>)}
        </select>
        <input type="submit" value="opret"/>
      </form>
        <div className="boosters">
          {this.state.boosters.map(({Booster, value}, i) => <Booster key={Booster} value change={value => this.changeBoosterValue(Booster, value)} />)}
        </div>
      </div>
    );
  }
}
