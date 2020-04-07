import React, { Fragment } from 'react';
import { withRouter, Link } from "react-router-dom";
import { message, Modal } from "antd"
import ImUtil from "utils/imUtil";
import comUtil from "utils/common";
import { sellerApi } from "utils/api";
import httpRequest from "utils/ajax";

 商家后台，IM消息列表组件
 调用示例：
 <SellerImList></SellerImList>

class SellerImList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAnimationClass: false
    };
  }
  componentDidMount() {
    const { onRef } = this.props
    if (onRef && typeof onRef == 'function') {
      onRef(this)
    }
    this.getUserStatus()
    httpRequest.post({
      url: sellerApi.login,
      data: {
        shop_id: localStorage.getItem('seller_shop_id')
      }
    }).then(res => {
      if (res.code == 200) {
        const data = res.data
        localStorage.setItem('token', data.token)   后台更新token为当前对应店铺信息
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    clearInterval(this.timer2)
  }
  openIm = () => {
    httpRequest.post({
      url: sellerApi.login,
      data: {
         token: localStorage.getItem('token'),
        shop_id: localStorage.getItem('seller_shop_id')
      }
    }).then(res => {
       已登录
      if (res.code == 200) {
        const data = res.data
        localStorage.setItem('token', data.token)   后台更新token为当前对应店铺信息
        自己点开自己的消息小图标，表示已阅读自己的消息，改变自身消息小图片为不闪烁
        let statusTo = comUtil.getCookie("uid");
        if (statusTo) {
          ImUtil.changeUserStatus(statusTo, "0");
        }
        
        if (this.props.isConnectSelf) {
          window.isConnectSeller = false;
        }
      }
    })
  };

  getUserStatus = () => {
    this.timer = setInterval(() => {
      ImUtil.getUserStatus("", this.addAnimationClass);
    }, 10000)
  };

  addAnimationClass = (status) => {
    const { getMessageAnimation } = this.props
    if (status == "1") {
      this.circulationChangeTitle();
    } else {
      clearInterval(this.timer2);
      document.title == "商家中心";
    }
    if (getMessageAnimation && typeof getMessageAnimation == 'function') {
      getMessageAnimation(status)
    }
  };
  circulationChangeTitle() {
    clearInterval(this.timer2)
    this.timer2 = setInterval(() => {
      document.title = document.title == "商家中心" ? "您有新消息未读" : "商家中心";
    }, 500)
  }
  handleCancel = () => {
    this.props.hideSellerIm()
  };
  render() {
     const { account, visible, spuId, shopId } = this.state
    return (
      <Fragment>
        <Modal
          className={"im-iframe sellerIm"}
          width={1250}
          title=""
          visible={true}
          getContainer={() => {return document.getElementById(this.props.elId)}}
          onCancel={this.handleCancel}
          maskClosable={false}
          footer={null}
        >
          <iframe
            id='imiframe'
            onLoad={() => {
               this.myYX = document.getElementById('imiframe').contentWindow.yunXin
              this.imIframeWin = document.getElementById('imiframe').contentWindow
            }}
             src={visible ? `/webdemo/im/main.html?to=${account}&spuId=${spuId}&shopId=${shopId}&isSeller=${isSeller}` : ''}
            src={`/webdemo/im/main.html?isSeller=${true}`}
            frameBorder="0"
            style={{ width: "100%", height: "620px", position: "absolute", top: 0, left: 0 }}
          ></iframe>
        </Modal>
      </Fragment>
    )
  }
}

window.openGoodsDetail = (shopId, goodsId) => {
  window.open(`shop/${shopId}/goods/${goodsId}`)
}
window.openSellerOrderDetail = (orderSn) => {
  if (comUtil.getCookie("uid").indexOf('s') == -1 && comUtil.getCookie('sdktoken').indexOf('s') == -1) {
    message.warn('聊天已过期，请重新登录')
    return
  }
  window.open(`/seller/orders/orderInfo/${orderSn}`)
}
window.openSellerAfterSalesDetail = (afterId, buyerId) => {
  window.open(`/seller/orders/aftermarketDetail/${afterId}/${buyerId}`)
}
window.openInstallmentOrderDetail = (orderSn) => {
  window.open(`/seller/orders/StagesInfo/${orderSn}`)
}
window.openOrderDetail = (orderSn, orderType) => {
  if (comUtil.getCookie("uid").indexOf('s') > -1 && comUtil.getCookie('sdktoken').indexOf('s') > -1) {
    message.warn('聊天已过期，请重新登录')
    return
  }
  if (orderType == 3) {
    window.open(`user/orderdetail/${orderSn}/1`)
  } else {
    window.open(`user/orderdetail/${orderSn}`)
  }
}
window.openAfterSalesDetail = (afterId) => {
  window.open(`user/aftersalesdetail/${afterId}`)
}

export default withRouter(SellerImList)
