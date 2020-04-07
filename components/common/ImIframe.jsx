import React, { Fragment } from "react";
import { Modal } from "antd";
import BuriedPoint from "components/common/BuriedPoint.jsx";





//调用方法
// <ImIframe visible={this.state.visible} changeVisible={this.changeVisible}></ImIframe>
//visible 是否显示客服弹出
// 父组件的改变visible 的方法
//现在还需要登录（需要paipaiyin登录成功之后设置cookie免登陆），测试账号有 user001,user002,user003 密码都是123456

class ImIframe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

  }

  componentDidMount() {
    window.isTopIm = this.props.isTopIm  // 是否是顶部消息入口
  }

  handleOk = e => {
    console.log(e);
    this.props.changeVisible(false)
  };

  handleCancel = e => {
    console.log(e);
    this.props.changeVisible(false)
  };
  render() {
    const { visible, account, spuId, shopId, shopName, orderSn, isSeller, orderType } = this.props

    if (visible) {
      let path = window.location.href;
      let bpOptions = {};
      bpOptions["所属店铺"] = shopName;
      if (path.indexOf("/search/category/") > -1) {
        bpOptions["页面"] = "商品列表";
      } else if (path.indexOf("/goods/") > -1 && path.indexOf("/shop/") > -1) {
        bpOptions["页面"] = "商品详情";
      } else if (path.indexOf("/myshoppingcart") > -1) {
        bpOptions["页面"] = "购物车";
      } else if (path.indexOf("/shop/") > -1 && path.indexOf("/goods/") == -1 && path.indexOf("/goodslist/") == -1) {
        bpOptions["页面"] = "店铺首页";
      } else if (path.indexOf("/shop/") > -1 && path.indexOf("/goodslist/") > -1) {
        bpOptions["页面"] = "店铺商品列表";
      } else if (path.indexOf("/user/order/") > -1) {
        bpOptions["页面"] = "订单列表";
      } else if (path.indexOf("/user/orderdetail/") > -1) {
        bpOptions["页面"] = "订单详情";
      } else if (path.indexOf("/user/mycollection") > -1) {
        bpOptions["页面"] = "我的收藏";
      }
      BuriedPoint.track({
        name: "点击商家客服按钮",
        options: bpOptions
      });
    }


    return (
      // <div id={"ImContainer"} style={{ display: (!visible ? "none" : "block") }}>
        <Modal
          className={isSeller ? "im-iframe sellerIm" : "im-iframe"}
          // width={(spuId || orderSn || !isSeller) ? 1250 : 1000}
          width={1250}
          title=""
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
          footer={null}
          bodyStyle={!isSeller ? {padding: 0, backgroundColor: 'transparent', maxHeight: '656px'} : {padding: 0}}
        >
          {
            !isSeller ? (
              <p className="notice">
                <img src={require('assets/images/notice.png')} />与商家交流中若涉及汇款、转账等脱离平台的资金往来，要求加其他第三方软件的账号沟通的要求，请谨慎操作
              </p>
            ) : null
          }
          <div className="imMain">
            <iframe
              src={visible ? `/webdemo/im/main.html?to=${account}&spuId=${spuId}&shopId=${shopId}&orderSn=${orderSn}&isSeller=${isSeller}&orderType=${orderType}` : ''}
              frameBorder="0"
              // style={{ width: "100%", height: "620px", position: "absolute", top: 0, left: 0 }}
              style={{ width: "100%", height: "620px"}}
            ></iframe>
          </div>
        </Modal>
      // </div>
    )
  }
}


export default ImIframe;
