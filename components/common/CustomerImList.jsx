import React, { Fragment } from 'react'
import { withRouter, Link } from "react-router-dom"
import { message, Modal } from "antd"
import ImUtil from "utils/imUtil"
import comUtil from "utils/common"
import { sellerApi } from "utils/api"
import httpRequest from "utils/ajax"

// 商家后台，IM消息列表组件
// 调用示例：
// <ImList></ImList>

class ImList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAnimationClass: false
    }
  }
  componentDidMount() {
    window.isTopIm = this.props.isTopIm  // 是否是顶部消息入口
    const { onRef } = this.props
    if (onRef && typeof onRef == 'function') {
      onRef(this)
    }
    this.getUserStatus()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    clearInterval(this.timer2)
  }

  getUserStatus = () => {
    this.timer = setInterval(() => {
      ImUtil.getUserStatus("", this.addAnimationClass);
    }, 10000)
  }

  addAnimationClass = (status) => {
    const { getMessageAnimation } = this.props
    if (status == "1") {
      this.circulationChangeTitle();
    } else {
      clearInterval(this.timer2);
      setTimeout(()=>{

        document.title = "";
      },1500)

    }
    if (getMessageAnimation && typeof getMessageAnimation == 'function') {
      getMessageAnimation(status)
    }
  }

  circulationChangeTitle() {
    clearInterval(this.timer2)
    this.timer2 = setInterval(() => {
      document.title = document.title == "" ? "您有新消息未读" : "";
    }, 500)
  }

  handleCancel = () => {
    this.props.hideIm()
  }

  showTotalUnread = (unread) => {
    const { showTotalUnread } = this.props
    if (showTotalUnread && typeof showTotalUnread == 'function') {
      showTotalUnread(unread)
    }
  }

  render() {
    const { visible, account, spuId, shopId, shopName, orderSn, isSeller, orderType, elId } = this.props
    return (
      <Modal
        className={"im-iframe"}
        // width={(spuId || orderSn || !isSeller) ? 1250 : 1000}
        width={1250}
        title=""
        visible={true}
        getContainer={() => {return document.getElementById(elId)}}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={null}
        bodyStyle={{padding: 0, maxHeight: '656px'}}
      >
        <p className="notice">
          <img src={require('assets/images/notice.png')} />与商家交流中若涉及汇款、转账等脱离平台的资金往来，要求加其他第三方软件的账号沟通的要求，请谨慎操作
        </p>
        <div className="imMain">
          <iframe
            id='imiframe'
            onLoad={() => {
              this.imIframeWin = document.getElementById('imiframe').contentWindow
            }}
            src={`/webdemo/im/main.html?to=${account}&spuId=${spuId}&shopId=${shopId}&orderSn=${orderSn}&isSeller=${isSeller}&orderType=${orderType}`}
            frameBorder="0"
            style={{ width: "100%", height: "620px"}}
          ></iframe>
        </div>
      </Modal>
    )
  }
}

window.openGoodsDetail = (shopId, goodsId) => {
  window.open(`//shop/${shopId}/goods/${goodsId}`)
}
window.openOrderDetail = (orderSn, orderType) => {
  if (comUtil.getCookie("uid").indexOf('s') > -1 && comUtil.getCookie('sdktoken').indexOf('s') > -1) {
    message.warn('聊天已过期，请重新登录')
    return
  }
  if (orderType == 3) {
    window.open(`//user/orderdetail/${orderSn}/1`)
  } else {
    window.open(`//user/orderdetail/${orderSn}`)
  }
}
window.openAfterSalesDetail = (afterId) => {
  window.open(`//user/aftersalesdetail/${afterId}`)
}

export default withRouter(ImList)
