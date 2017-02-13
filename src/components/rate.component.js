import React from 'react';
import GlobalState from '../GlobalState';


function Like({element, rating}) {
  return (
    <div className="like">
      {rating && rating.like && (<span onClick={() => GlobalState.removeLike(element)}>Remove Like</span>) || (<span onClick={() => GlobalState.addLike(element, true)}>Add Like</span>)}
    </div>
  );
}

function DisLike({element, rating}) {
  return (
    <div className="dislike">
      {rating && !rating.like && (<span onClick={() => GlobalState.removeLike(element)}>Remove dislike</span>) || (<span onClick={() => GlobalState.addLike(element, false)}>Add Dislike</span>)}
    </div>
  );
}
export function RateButtons({element}) {
  const rating = GlobalState.getRating(element);
  return (
    <div className="">
      <Like {...{element, rating}}/>
      <DisLike {...{element, rating}}/>
    </div>
  );
}