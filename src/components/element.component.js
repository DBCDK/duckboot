import React from 'react';
import {RateButtons} from './rate.component';

export function Element({element}) {
  const {pid, title, creator} = element;
  return (
    <div id={pid} className="element">
      <h2>{title}</h2>
      <h3>{creator}</h3>
      <RateButtons element={element} />
    </div>
  );
}

export function ElementList({list}) {
  return (
    <div className="search-result">
      {list.map(element => <Element key={element.pid} element={element} />)}
    </div>
  )
}
