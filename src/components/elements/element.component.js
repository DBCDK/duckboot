import React from 'react';
import {RateButtons} from '../rate/rate.component';

export default function Element({element}) {
  const {pid, title, creator, coverUrlThumbnail} = element;
  return (
    <div id={pid} className="element flex justify-between">
      {(coverUrlThumbnail &&
      <div className="mr2 w5">
        <img src={coverUrlThumbnail} alt=""/>
      </div>) || ''}
      <div className="w-100">
        <h2>
          <a target="_blank" rel="noopener noreferrer" href={`https://bibliotek.dk/work/${pid}`}>{element.dcTitleFull || title}</a>
        </h2>
        <h3>{creator || element.creatorAut || ''}</h3>
        <h3>{element.typeBibDKType}</h3>
        <RateButtons element={element}/>
      </div>

    </div>
  );
}