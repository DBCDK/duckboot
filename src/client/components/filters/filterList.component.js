import React from 'react';
import FilterView from './filterView.component';

export default function FilterList({elements, type, remove}) {
  return (
    <div className="mb1">
      <h3>{type}</h3>
      {
        (elements.length
        && elements.map(el => <FilterView key={JSON.stringify(el)} element={el} remove={e => remove(type, el)}/>))
        || 'Ingen elementer oprettet'
      }
    </div>
  );
}
