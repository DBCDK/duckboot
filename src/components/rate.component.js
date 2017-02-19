import React from 'react';
import GlobalState from '../GlobalState';
import {ElementList} from './element.component';
import minus from '../assets/minus.svg';
import plus from '../assets/plus.svg';
import star from '../assets/star.svg';

export class RatingsList extends React.Component {
  constructor() {
    super();
    this.state = {
      ratings: []
    };
  }

  componentDidMount() {
    GlobalState.listen(({profile}) => {
      this.setState({ratings: profile.ratings});
    });
  }

  render() {
    return (
      <div className="rating-lists">
        <div className="likes mb2">
          <ElementList header="Kan godt lide"
                       list={this.state.ratings.filter(rating => rating.like).map(rating => rating.element)}/>
        </div>
        <div className="dislikes">
          <ElementList header="Kan ikke lide"
                       list={this.state.ratings.filter(rating => !rating.like).map(rating => rating.element)}/>
        </div>
      </div>
    );
  }
}

function Like({element, rating}) {
  const isLiked = rating && rating.like;
  const color = isLiked && 'green' || 'grey';
  const onCLick = () => {
    if (isLiked) {
      GlobalState.removeLike(element);
    }
    else {
      GlobalState.addLike(element, true)
    }
  };

  return (
    <div className={`like rate-button ${color}`} onClick={onCLick}>
        <span className="icon medium round">
          <img src={plus} role="presentation"/>
        </span>
      <span className="icon-description">like</span>
    </div>
  );
}

function DisLike({element, rating}) {
  const isDisliked = rating && !rating.like;
  const onCLick = () => {
    if (isDisliked) {
      GlobalState.removeLike(element);
    }
    else {
      GlobalState.addLike(element, false)
    }
  };
  const color = isDisliked && 'red' || 'grey';

  return (
    <div className={`dislike rate-button ${color}`} onClick={onCLick}>
      <span className="icon medium round">
        <img src={minus} role="presentation"/>
      </span>
      <span className="icon-description">dislike</span>
    </div>
  );
}
function Save({element, isSaved}) {
  const onCLick = () => {
    if (isSaved) {
      GlobalState.removeSaved(element);
    }
    else {
      GlobalState.save(element)
    }
  };

  const color = isSaved && 'yellow' || 'grey';

  return (
    <div className={`dislike rate-button ${color}`} onClick={onCLick}>
        <span className="icon medium round">
          <img src={star} role="presentation"/>
        </span>
      <span className="icon-description">Gem</span>
    </div>
  );
}

export function RateButtons({element}) {
  const rating = GlobalState.getRating(element);
  const isSaved = GlobalState.isSaved(element);
  return (
    <div className="rate-buttons">
      <Like {...{element, rating}}/>
      <DisLike {...{element, rating}}/>
      <Save {...{element, isSaved}}/>
    </div>
  );
}

