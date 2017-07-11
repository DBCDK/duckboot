import React from 'react';
import FilterView from './filterView.component';

export default function FilterList({elements, type, remove}) {
  return (
    <div className="mb1">
      <h3>{type}</h3>
      {
        (elements.length
        && elements.map((el, index) => <FilterView key={index} element={el} remove={e => remove(type, el)}/>))
        || 'Ingen elementer oprettet'
      }
    </div>
  );
}
