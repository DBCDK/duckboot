import React from 'react';
import GlobalState from '../GlobalState';
import {ElementList} from './element.component';

export class RatingsList extends React.Component {
  constructor() {
    super();
    this.state = {
      ratings: []
    };
    GlobalState.listen((state) => {
      if (state.ratings !== this.state.ratings) {
        this.setState({ratings: state.ratings});
      }
    });
  }

  render() {
    return(
      <div className="rating-lists">
        <div className="likes">
          <ElementList list={this.state.ratings.filter(rating => rating.like).map(rating => rating.element)} />
        </div>
        <div className="dislikes">
          <ElementList list={this.state.ratings.filter(rating => !rating.like).map(rating => rating.element)} />
        </div>
      </div>
    );
  }
}



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
    <div className="rate-button">
      <Like {...{element, rating}}/>
      <DisLike {...{element, rating}}/>
    </div>
  );
}

