import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from "react-router-dom";
import {Icon, message} from "antd"
import "./style/im-icon.scss";
import ImIframe from  "./ImIframe";
import ImList from './ImList'
import ImUtil from "utils/imUtil";
import comUtil from "utils/common";
import WindowLogin from 'components/common/WindowLogin';
import api from "utils/api";

import httpRequest from "utils/ajax";
import BuriedPoint from "components/common/BuriedPoint.jsx";



// 商城顶部Im
// 调用方法，无需参数，
// <Im></Im>

class Im extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // visible : false, //是否显示im弹窗
      hasAnimationClass : false,
      timer : "",
      isSellerPath : window.location.pathname.indexOf('/seller') > -1,
      visible2 : false, //是否显示登录弹窗
      TotalUnread: '',
      isHideIm: true,
      isInitIm: false  // 登录过再初始化Im
    };
  }

  componentDidMount() {
    this.getUserStatus()
    this.checkLogin(res => {
      if (res) {
        this.setState({
          isInitIm: true
        })
      } else {
        this.setState({
          isInitIm: false
        })
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    clearInterval(this.timer2)
  }

  openIm = () =>{
    // For buried point.
    BuriedPoint.track({
      name: "点击顶部功能导航",
      options: {
        "功能导航": "消息"
      }
    });

    this.checkLogin(res => {
      if (res) {
        this.IM.imIframeWin.location.reload()
        setTimeout(() => {
          this.setState({
            isHideIm: false
          })
          //自己点开自己的消息小图标，表示已阅读自己的消息，改变自身消息小图片为不闪烁
          let statusTo = comUtil.getCookie("uid");
          if(statusTo){
            ImUtil.changeUserStatus(statusTo,"0");
          }

          // if(this.props.openIm){
          //   this.props.openIm();
          // }

          if(this.props.isConnectSelf){
            window.isConnectSeller = false;
          }
        }, 500)
      } else {
        this.setState({
          visible2 : true
        })
      }
    })

    // httpRequest.get({
    //   url: api.address.addaddress,
    // }).then(res => {
    //   this.setState({
    //     visible : true
    //   });
    // });
  }
  // changeVisible = (value) =>{
  //   this.setState({
  //     visible:value
  //   })
  // }

  checkLogin(callback) {
    httpRequest.noMessage().get({
      url: api.login.isLogin
    }).then(res => {
      // 已登录
      if (res.code == 200) {
        callback(true)
      }
    }).catch(res => {
      if (res.code == 415) {
        callback(false)
      }
    })
  }

  getUserStatus  = () =>{
    this.timer = setInterval(()=>{
       ImUtil.getUserStatus("",this.addAnimationClass);
    },10000)
  }

  addAnimationClass = (status) =>{
    if( status == "1" ){
      clearInterval(this.timer2)
      if( window.location.href.indexOf("/seller/") > -1 ){
        this.circulationChangeTitle();
      }else{
        clearInterval(this.timer2);
        setInterval(()=>{
          document.title == "商家中心";
        },1000)
      }
    }else{
      clearInterval(this.timer2);
      if( window.location.href.indexOf("/seller/") > -1 ){
        setInterval(()=>{
          document.title == "商家中心";
        },1000)
      }
    }
    const TotalUnread = sessionStorage.TotalUnread
    this.setState({
      hasAnimationClass : status == "1" ? true : false,
      TotalUnread: TotalUnread != '0' ? TotalUnread : ''
    })
  }

  circulationChangeTitle(){
    this.timer2 = setInterval(()=>{
      document.title = document.title == "商家中心" ? "您有新消息未读" : "商家中心";
    },500)
  }

  changeVisibleVal = (boolean) =>{
    this.setState({
      visible2: boolean,
      isInitIm: true
    })
  }

  // 隐藏弹窗
  hideIm = () => {
    this.setState({
      isHideIm: true
    })
  }

  onRef = (el) => {
    this.IM = el
  }

  render() {
    const { TotalUnread, isHideIm, isInitIm } = this.state
    return(
      <Fragment>
        <WindowLogin visible={this.state.visible2} isFromRightSidebar={true} changeVisibleVal={this.changeVisibleVal}></WindowLogin>
        <div id="Im" style={{position: "fixed", zIndex: 1000}} className={isHideIm ? "msg-box hide" : "msg-box"}>
          {
            isInitIm ? (
              <ImList
                onRef={this.onRef}
                isTopIm={true}
                isSeller={this.state.isSellerPath}
                elId={"Im"}
                hideIm={this.hideIm}
              />
            ) : null
          }
        </div>
        {/* <ImIframe isTopIm={true} visible={this.state.visible} changeVisible={this.changeVisible} isSeller={this.state.isSellerPath}></ImIframe> */}
        <div title="我的消息" className={(this.state.isSellerPath ? "seller-im-icon-box2 " :"im-icon-box")} onClick={this.openIm}>
          <span className={(this.state.hasAnimationClass ? "im-icon-animation " : "" )+ "im-icon-style"}></span>
          <span className="normal">消息</span>
          <span>{TotalUnread}</span>
        </div>
      </Fragment>
    )
  }
}
function mapStateToProps (state) {
  return {
    loginInfo: state.loginInfo
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
window.openInstallmentOrderDetail = (orderSn) => {
  window.open(`/seller/orders/StagesInfo/${orderSn}`)
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

export default withRouter(connect(mapStateToProps)(Im))
