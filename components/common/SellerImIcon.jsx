import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from "react-router-dom";
import { Icon, message } from "antd"
import "./style/im-icon.scss";
import ImUtil from "utils/imUtil";
import ImIframe from "./ImIframe";
import WindowLogin from 'components/common/WindowLogin';
import httpRequest from 'utils/ajax'
import api, { sellerApi } from 'utils/api'
import CommonUtil from 'utils/common'
import comUtil from 'utils/common'

// 商家的客服信息图标，比如商品列表页，商品详情页 客服小图标
// 调用方法:
// uid 表示商家IM 的shop_id（必传!!!,不传不会报错会用默认的商家ID）\
// msg 可选，强烈要求给值!!!! msg 内容为商品详情页绝对url 或 店铺主页 绝对url （不传不会报错,会发送‘你好’给商家）
// <SellerIm uid={"134"} msg={'/'}></SellerIm>



class Im extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isYunXin: true,
      visible2: false
    };
  }
  componentWillMount() {
    /*httpRequest.get({ url: api.hasPicVerify }).then(res=>{
      if(res.data._service == 1){
        this.setState({
          isYunXin : false
        })
      }
    })*/
  }

  changeReceiverStatus() {
    let { isSeller } = this.props;    // 商家IM标识
    // 买家端,判断用户是否登录,没登录的话就弹出登录窗
    if (!isSeller) {
      if (!comUtil.checkLogin() || comUtil.getCookie('uid') == "" || comUtil.getCookie('sdktoken') == "") {
        this.setState({
          visible2: true
        });
        // let popup_login = this.props.location.pathname;
        // localStorage.setItem('popuplogin', popup_login)
        return
      }
      this.openImChat();
    } else {
      httpRequest.post({
        url: sellerApi.login,
        data: {
          shop_id: localStorage.getItem('seller_shop_id')
        }
      }).then(res => {
        // 已登录
        if (res.code == 200) {
          this.openImChat();
        }
      })
    }
  };

  async openImChat() {
    let { isSeller } = this.props;    // 商家IM标识
    window.isConnectSeller = true;
    let res2 = await httpRequest.get({ url: api.getImType });
    let isYunXin = true;
    if (res2.data.cust_service != 1) {
      isYunXin = false;
      this.setState({
        isYunXin: false
      })
    }
    //如果不是 云信
    if (!isYunXin && !isSeller) {
      let res = await httpRequest.get({ url: "/api/application_seller/se_store/baseinfo/" + this.props.uid + "/" });
      let qq = res.data._service_qq;
      if (qq) {
        qq = qq.replace(/Q|客|服|\|/gm, '');

      }
      if (qq) {
        window.open("http://wpa.qq.com/msgrd?v=3&uin=" + qq + "&site=qq&menu=yes")
      } else {
        message.warn("商家还未配置客服QQ，不能联系商家哦")
      }
      return false;
    }
    this.setState({
      visible: true
    });


    let statusTo = isSeller ? (this.props.uid || "261") : "s" + (this.props.uid || "261");
    let msgContent = this.props.msg || "你好";
    msgContent = msgContent.indexOf(',,,+++---') > -1 ? "你好" : msgContent; //,,,+++--- 特值商家后台 评论列表的内容。

    window.sessionId = statusTo;
    let sessionKey = this.props.msg + CommonUtil.getCookie("uid");
    //给商家发送第一条信息，唤醒IM 右边聊天框, 只能发送一条，
    if (!sessionStorage.getItem(sessionKey)) {
      // ImUtil.sendMsg(statusTo,msgContent);
      sessionStorage.setItem(sessionKey, "true")
    } else {

    }


    //自己点开商家的消息小图标，表示要给商家发送消息，改变商家端消息小图片为闪烁
    if (statusTo) {
      ImUtil.changeUserStatus(statusTo, "1");
    }
  }

  // 关闭弹窗登录
  changeVisibleVal() {
    this.setState({
      visible2: false
    })
    // localStorage.removeItem("popuplogin")
  }
  changeVisible = (value) => {
    this.setState({
      visible: value
    })
  };

  render() {
    let { iconClass, isSeller, uid, spuId, orderSn, shopName, orderType } = this.props;
    return (
      <Fragment>
        {/* 买家联系商家，未登录时的登录弹窗 */}
        <WindowLogin visible={this.state.visible2} isFromRightSidebar={true} changeVisibleVal={this.changeVisibleVal.bind(this)}></WindowLogin>
        <ImIframe
          visible={this.state.visible}
          shopName={shopName}
          spuId={spuId}
          shopId={uid}
          orderSn={orderSn}
          isSeller={isSeller}
          orderType={orderType}
          account={isSeller ? '' + uid : 's' + uid}
          changeVisible={this.changeVisible}
        />
        <div title={isSeller ? '联系买家' : '联系卖家'} className="seller-im-icon-box" onClick={this.changeReceiverStatus.bind(this)}>
          <span className={iconClass ? iconClass : 'im-icon-style'}></span>
        </div>
      </Fragment>
    )
  }
}

window.openGoodsDetail = (shopId, goodsId) => {
  window.open(`//shop/${shopId}/goods/${goodsId}`)
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


export default withRouter(Im)
