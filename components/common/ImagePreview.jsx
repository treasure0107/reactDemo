/*
 * ImagePreview.jsx
 * 
 * props:
 *   visible => {Boolean}
 *   imageUrl => {String}
 *   closeBox => {Function}
 * 
 * Usage:
 * import ImagePreview from "components/common/ImagePreview.jsx";
    {
      this.state.visible ?
      <ImagePreview
        visible={this.state.visible}
        imageUrl={this.state.imageUrl}
        closeBox={() => this.closeBox()}
      >
      </ImagePreview> : null
    }
 */

import React, {Fragment} from "react";
import "./style/imagepreview.scss";

class ImagePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  closeMe() {
    document.body.classList.remove("ml-body-no-scroll");
    this.props.closeBox();
  }

  render() {
    if (this.props.visible) {
      document.body.classList.add("ml-body-no-scroll");
    }

    return (
      <Fragment>
        {
          this.props.visible ?
          <Fragment>
            <div className="ml-fixed ep-image-preview">
              <div className="ml-relative ep-img">
                <div className="ml-table">
                  <div className="ml-table-cell ep-img-inner">
                    <img className="ml-block ml-block-center" src={this.props.imageUrl} />
                  </div>
                </div>
                <div className="ml-abs ml-table ml-pointer ep-close" onClick={() => this.closeMe()}>
                  <div className="ml-table-cell">
                    <div className="ml-block-center ep-inner"></div>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
          : null
        }
      </Fragment>
    )
  }
}

export default ImagePreview;