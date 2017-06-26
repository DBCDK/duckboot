import React from 'react';
import ImageElement from './imageElement.component';

export default function ElementList({header, list}) {
  return (
    <div className="search-result">
      {(list.length && header && <h3>{header}</h3>) || ''}
      {(list.length === 0 && 'Ingen poster') || ''}
      {list.map(element => <ImageElement key={element.pid} element={element}/>)}
    </div>
  )
}
