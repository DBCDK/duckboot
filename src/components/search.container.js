import React from 'react';
import request from 'superagent';
import GlobalState from '../GlobalState';

export default class Search extends React.Component {
  constructor() {
    super();
    this.limit = 10;
  };

  onSubmit = (e) => {
    e.preventDefault();
    const query = {
      limit: this.limit,
      q: this.input.value
    };
    GlobalState.setState({search: {query: query, searching: true}});
    request.post('http://localhost:3001/search')
      .send(query)
      .end((err, res) => {

        if (res && res.text) {
          const data = JSON.parse(res.text).data;
          console.log(data);
          GlobalState.setState({search: {data, query: query.q, searching: false}})
        }
        else {
          GlobalState.setState({search: {data: [], query: query.q, searching: false}})
        }
      });
  };

  componentDidMount() {
    this.onSubmit({preventDefault: () => {}});
  }

  render() {
    return(
      <form className="search" action="" onSubmit={this.onSubmit}>
        <input ref={ref => this.input = ref} type="text" defaultValue="hest" placeholder="Søg på f.eks. min kamp"/>
      </form>
    );

  }
}