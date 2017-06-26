import React from 'react';
import GlobalState from '../GlobalState';
import {ElementList} from './element.component';
import JsonView from './jsonView.container';
import {PlusSvg, MinusSvg, StarSvg} from './svg.container';

export class RatingsList extends React.Component {
  constructor() {
    super();
    this.state = {
      ratings: GlobalState.getProfile().ratings
    };
  }

  componentDidMount() {
    GlobalState.listen(({profile}) => {
      this.setState({ratings: profile.ratings});
    });
  }

  componentWillUnmount() {
    GlobalState.unListen(this.listener);
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

export class RatingsListJson extends React.Component {
  constructor() {
    super();
    this.state = {
      ratings: GlobalState.getRatings()
    };
  }

  componentDidMount() {
    GlobalState.listen(({profile}) => {
      this.setState({ratings: GlobalState.getRatings()});
    });
  }

  componentWillUnmount() {
    GlobalState.unListen(this.listener);
  }

  render() {
    return (
      <div className="rating-lists">
          <h3>Profil JSON</h3>
          <JsonView {...this.state.ratings} />
      </div>
    );
  }
}

function Like({element, rating}) {
  const isLiked = rating && rating.like;
  const color = isLiked ? 'green' : 'grey';
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
          <PlusSvg />
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
  const color = isDisliked ? 'red' : 'grey';

  return (
    <div className={`dislike rate-button ${color}`} onClick={onCLick}>
      <span className="icon medium round">
        <MinusSvg />
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

  const color = isSaved ? 'yellow' : 'grey';

  return (
    <div className={`dislike rate-button ${color}`} onClick={onCLick}>
        <span className="icon medium round">
          <StarSvg />
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

