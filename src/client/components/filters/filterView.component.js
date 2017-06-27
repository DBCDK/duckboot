import React from 'react';
import JSONView from '../jsonView/jsonView.container';
import {CloseSvg} from '../svg/svg.container'

export default function FilterView({element, remove}) {
  return (
    <div className="filter">
      <div className="filter--remove">
        <span className="filter--close" onClick={remove}>
          <span className="icon medium round">
            <CloseSvg />
          </span>
        </span>
      </div>

      <JSONView {...element} />
    </div>
  );
}