import React from 'react';
import {RateButtons} from './rate.component';
import request from 'superagent';

export function Element({element}) {
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

export class ImageElement extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      element: props.element,
    }
  }

  componentDidMount() {
    if (!this.state.element.hasFetchedImage && !this.state.element.coverUrlThumbnail) {
      request.post('/image')
        .send({pids: this.props.element.pid})
        .end((err, res) => {
          const element = this.state.element;
          element.hasFetchedImage = true;

          if (res && res.text) {
            const data = JSON.parse(res.text);
            if (data[0].coverUrlThumbnail) {
              element.coverUrlThumbnail = data[0].coverUrlThumbnail;

            }
          }
          this.setState({element});
        });

    }
  }

  render() {
    return Element({element: this.state.element});
  }
}

export function ElementList({header, list}) {
  return (
    <div className="search-result">
      {(list.length && header && <h3>{header}</h3>) || ''}
      {(list.length === 0 && 'Ingen poster') || ''}
      {list.map(element => <ImageElement key={element.pid} element={element}/>)}
    </div>
  )
}
