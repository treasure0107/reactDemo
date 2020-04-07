import React, { Component, Fragment } from 'react'
import SellerImList from 'components/common/SellerImList'
import "components/common/style/im-icon.scss";


class Message extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHideIm: true,
      messageAnimation: false,
      sellerTotalUnread: ''
    }
  }

  openSellerIm = () => {
    this.IM.imIframeWin.location.reload()
    setTimeout(() => {
      this.IM.openIm()
      this.setState({
        isHideIm: false,
        messageAnimation: false
      })
    }, 500)
  }
  hideSellerIm = () => {
    // this.IM.imIframeWin.location.reload()
    this.setState({
      isHideIm: true
    })
  }
  getMessageAnimation = (status) => {
    const sellerTotalUnread = sessionStorage.sellerTotalUnread
    this.setState({
      messageAnimation: status == '1' ? true : false,
      sellerTotalUnread: sellerTotalUnread != '0' ? sellerTotalUnread : ''
    })
  }
  onRef = (el) => {
    this.IM = el
  }

  render() {
    const { isHideIm, messageAnimation, sellerTotalUnread } = this.state
    return (
      <Fragment>
        <div id="sellerIm" className={isHideIm ? "msg-box hide" : "msg-box"} style={{position: "fixed", zIndex: 1000}}>
          <SellerImList 
            onRef={this.onRef}
            isConnectSelf={true}
            elId='sellerIm'
            hideSellerIm={this.hideSellerIm}
            getMessageAnimation={this.getMessageAnimation}
          ></SellerImList>
        </div>
        <div className="msg-box" onClick={this.openSellerIm}>
          <div className={messageAnimation ? "seller-im-icon-box2 im-icon-animation" : "seller-im-icon-box2"}>
            <span className="im-icon-style"></span>
            {
              sellerTotalUnread ? <span className="unreadCounts">{sellerTotalUnread}</span> : null
            }
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Message