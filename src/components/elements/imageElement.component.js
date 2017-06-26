import React from 'react';
import request from 'superagent';
import Element from './element.component';

export default class ImageElement extends React.Component {
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