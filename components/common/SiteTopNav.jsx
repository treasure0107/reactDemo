

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getCartNum } from 'store/shoppingCart/reducer.js'
import { withRouter, Link } from "react-router-dom";
import { Form, Icon, Input, Checkbox, message, Popover, Menu, Dropdown } from 'antd';
import CityOrientation from "./CityOrientation";
import CommonUtil from "utils/common"
import comUtil from 'utils/common.js';
import "./style/site-top-nav.scss"
import httpRequest from "utils/ajax";
import api from "utils/api";
import Im from "./ImIcon"
import lang from "assets/js/language/config";
import BuriedPoint from "components/common/BuriedPoint.jsx";

const sitetopnav = lang.common.sitetopnav;
//顶部横向导航栏
//使用方法 <SiteTopNav></SiteTopNav >
let _pathName = window.location.pathname;
class SiteTopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isLogin: false,
      loginType: "normal",
      nickname: '',
      helplist: [],
      isYunXin: true
    };
  }
  componentWillMount() {
    this.getServiceStyle()
    // let data = this.props.mallentrancedata.mallentrancedata;
    // let arr = []
    // if (data.length.length > 0) {
    //   arr = data.filter(i => {
    //     return i.entrance_position == 1;
    //   })
    // }
    // console.log(111)
    // console.log(arr)
  }
  componentDidMount() {
    // httpRequest.get({
    //   url: api.login.isLogin
    // }).then(res => {
    //   this.props.setLoginInfo({
    //     type: 'setLoginInfo',
    //     payload: { isLogin: true, infoData: res.data },
    //   });
    // }).catch(res => {
    // })
    this.getmallentrance();
  }

  // 获取导航相关配置
  getmallentrance() {
    httpRequest.get({
      url: api.home.getmallentrance,
      data: {}
    }).then(res => {
      if (res.code == 200) {
        this.props.setMallentrance({
          type: 'setMallentrance',
          payload: res.data,
        })
        // 头部导航
        let topnavdata = res.data.filter(i => {
          return i.entrance_position == 0;
        })
        this.props.setTopNavData({
          type: 'setTopNavData',
          payload: topnavdata,
        })
        // 主导航
        let mainnavdata = res.data.filter(i => {
          return i.entrance_position == 1;
        })
        this.props.setMainNavData({
          type: 'setMainNavData',
          payload: mainnavdata,
        })
        // 底部导航
        let footernavdata = res.data.filter(i => {
          return i.entrance_position == 2;
        })
        this.props.setFooterNavData({
          type: 'setFooterNavData',
          payload: footernavdata,
        })
        // 友情链接
        let friendslinkdata = res.data.filter(i => {
          return i.entrance_position == 3;
        })
        this.props.setFirendsLinkData({
          type: 'setFirendsLinkData',
          payload: friendslinkdata,
        })
      }
    })
  }
  getServiceStyle() { //获取当前im 是采用云信 还是 QQ
    httpRequest.get({ url: api.getImType }).then(res => {
      if (res.data.cust_service != 1) {
        this.setState({
          isYunXin: false
        })
      }
    })


  }

  // 退出登录方法
  logout() {
    let session_id = localStorage.getItem('session_id');
    httpRequest.post({
      url: api.loginout.loginout,
      data: { username: session_id }
    }).then(res => {
      this.props.history.push('//login');
      // localStorage.clear();
      window.localStorage.removeItem('session_id')
      window.localStorage.removeItem('linkUrl')
      window.localStorage.removeItem('popuplogin')
      localStorage.removeItem('nick_name');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPhone');
      localStorage.removeItem("session_id");
      window.localStorage.removeItem("userInfoActivity");
      comUtil.delCookie('nick_name');
      comUtil.delCookie('sdktoken');
      comUtil.delCookie('uid');

      this.props.setLoginInfo({
        type: 'setLoginInfo',
        payload: "",
      });
      let pathName = window.location.pathname;
      if (pathName.indexOf("/user") > -1) {
        this.props.history.push('/');
      }

      comUtil.clearTBZLoginCode();
    })
  }

  gotoLogin() {
    let _this = this;

    BuriedPoint.track({ name: "点击登录按钮" });

    setTimeout(doIt, 100);

    function doIt() {
      _this.props.history.push(('//login'+"?back="+window.location.pathname));
    }
  }
  gotoRegister() {
    let _this = this;

    BuriedPoint.track({ name: "点击注册按钮" });

    setTimeout(doIt, 100);

    function doIt() {
      _this.props.history.push('//register');
    }
  }
  gotoHome() {
    let _this = this;

    BuriedPoint.track({
      name: "点击顶部功能导航",
      options: {
        "功能导航": "首页"
      }
    });

    setTimeout(doIt, 100);

    function doIt() {
      _this.props.history.push('/');
    }
  }
  gotoMyOrder() {
    let _this = this;

    BuriedPoint.track({
      name: "点击顶部功能导航",
      options: {
        "功能导航": "我的订单"
      }
    });

    setTimeout(doIt, 100);

    function doIt() {
      _this.props.history.push('//user/order/');
    }
  }
  gotoMyCart() {
    let _this = this;

    BuriedPoint.track({
      name: "点击顶部功能导航",
      options: {
        "功能导航": "我的购物车"
      }
    });

    setTimeout(doIt, 100);

    function doIt() {
      _this.props.history.push('//user/myshoppingcart');
    }
  }
  gotoMyCollection() {
    let _this = this;

    BuriedPoint.track({
      name: "点击顶部功能导航",
      options: {
        "功能导航": "我的收藏"
      }
    });

    setTimeout(doIt, 100);

    function doIt() {
      _this.props.history.push('//user/mycollection');
    }
  }
  gotoMyFile() {
    let _this = this;

    _this.props.history.push('//user/myfile');
  }

  // 点击买家帮助
  gotoHelpCenter() {
    let _this = this;
    BuriedPoint.track({
      name: "点击顶部功能导航",
      options: {
        "功能导航": "买家帮助中心"
      }
    });
    setTimeout(doIt, 100);
    function doIt() {
      window.open('//buyerhelp/buyer')
    }
  }

  // 点击商家帮助
  gotoHelpStore() {
    let _this = this;
    BuriedPoint.track({
      name: "点击顶部功能导航",
      options: {
        "功能导航": "商家帮助中心"
      }
    });
    setTimeout(doIt, 100);
    function doIt() {
      window.open('//merchantshelp/merchantshelpstore')
    }
  }

  gotoMerchantsJoin() {
    let _this = this;

    BuriedPoint.track({
      name: "点击顶部功能导航",
      options: {
        "功能导航": "商家入驻"
      }
    });

    setTimeout(doIt, 100);

    function doIt() {
      _this.props.history.push('//merchantsjoin');
    }
  }

  render() {
    // let countNum = this.props.cartData.reduce( (a,b) => {
    //     return a + (b["countNumber"]||0)
    // },0)
    const menu = (
      <Menu>
        <Menu.Item>
          {/* <a className="buyer-help" rel="noopener noreferrer">
            买家帮助：
          </a> */}
          <a onClick={this.gotoHelpCenter.bind(this)} className="buyer-help" rel="noopener noreferrer"> 买家帮助</a>
          <ul className="help_ul">
            <li><a target='_blank' href="//register?source=ppy">快速注册</a></li>
            <li>
              <a target='_blank' href="//buyerhelp/content/153">新手上路</a>
            </li>
            <li><a target='_blank' href="//bottommenu/feedback">意见反馈</a></li>
          </ul>
        </Menu.Item>
        <Menu.Item>
          <a className="stroe-help" onClick={this.gotoHelpStore.bind(this)} rel="noopener noreferrer">商家帮助</a>
          {/* <a className="stroe-help" onClick={this.gotoHelpStore.bind(this)} target="_blank" rel="noopener noreferrer">
            商家帮助：
          </a> */}
          <ul className="help_ul">
            {/* <li><a target='_blank' href="//buyerhelp/doc/31">合作协议</a></li> */}
            <li><a target='_blank' href="//merchantshelp/merchantshelpdoc/26">合作协议</a></li>
            <li>
              <a target='_blank' href="http://1t.click/hU5">学习专区</a>
            </li>
            <li><a target='_blank' href="/sellerLogin/home">商家后台</a></li>
          </ul>
        </Menu.Item>
      </Menu>
    );
    let countNum = this.props.countNum;
    const { mallentrancedata, loginInfo } = this.props;
    const id = [];
    const content = (
      <div className="usernamepop">
        <a href="//user/UserCenter" >
          {
            loginInfo &&
              loginInfo.infoData &&
              loginInfo.infoData.header &&
              loginInfo.infoData.header.toLowerCase() != "none" &&
              loginInfo.infoData.header.indexOf('https') > -1
              ?
              <img src={loginInfo.infoData.header} />
              :
              <img src={require('assets/images/default_avatar.png')} />
          }
        </a>
        <span onClick={this.logout.bind(this)}>{sitetopnav.logout}</span>
      </div>
    );
    // console.log(this.props, '登录成功数据')
    return (
      <div className="site-top-nav">
        <div className="site-top-nav-sub clearfix">
          <div className="s-t-n-left">
            <div className="s-t-n-city-info">
              {/* <span onClick={this.isSHowNav.bind(this,true)}>深圳</span> */}
              <CityOrientation></CityOrientation>
            </div>
            <div className={loginInfo.isLogin ? "s-t-n-login hide" : "s-t-n-login"}>
              <a onClick={this.gotoLogin.bind(this)}>{sitetopnav.placelogin}</a>
              <a onClick={this.gotoRegister.bind(this)}>{sitetopnav.freeRegister}</a>
            </div>
            <div className={loginInfo.isLogin ? "s-t-n-user-info" : "s-t-n-user-info hide"}>
              {sitetopnav.welcom}<Link to={'/user'}>{''}</Link>
              <Popover placement="bottomLeft" content={content} trigger="hover">
                <a href="//user/UserCenter" className="userinfo">
                  {
                    loginInfo.infoData ? loginInfo.infoData.nick_name : null
                  }
                  <img src={require('assets/images//common/sel1.png')} alt="" />
                </a>
              </Popover>

            </div>
          </div>
          <div className="s-t-n-right">
            {/* {mallentrancedata.topnavdata && mallentrancedata.topnavdata.length > 0 ? mallentrancedata.topnavdata.map((i, index) => {
              return (
                <Fragment key={index}>
                  <a href={i.entrance_url} >{i.entrance_name}</a>{index != mallentrancedata.topnavdata.length - 1 ? '|' : ''}
                </Fragment>
              )
            }) : null
            } */}

            <div className='inblock'>
              <a onClick={this.gotoHome.bind(this)}>{sitetopnav.home}</a>|
                <a onClick={this.gotoMyOrder.bind(this)}>{sitetopnav.order}</a>|
                <a onClick={this.gotoMyCart.bind(this)}>{sitetopnav.mycart}<span>{countNum}</span></a>|
                <a onClick={this.gotoMyCollection.bind(this)}>{sitetopnav.mycollection}</a>|
                <a onClick={this.gotoMyFile.bind(this)}>{sitetopnav.myfile}</a>|
                <Dropdown overlayClassName="Dropdown" overlay={menu}>
                <a className="ant-dropdown-link" href="javascript:void(0)">
                  帮助中心 <Icon type="down" />
                </a>
              </Dropdown>|
              {/* <a onClick={this.gotoHelpCenter.bind(this)} className="bzzx">{sitetopnav.buyerhelp}</a>| */}
              <a onClick={this.gotoMerchantsJoin.bind(this)}>{sitetopnav.merchantsjoin}</a>
              {this.state.isYunXin ? (
                <a href="javascript:void(0)">
                  <Im isConnectSelf={true} ></Im>
                  {/* <span className={"normal"} onClick={() => { document.getElementsByClassName("im-icon-box")[0].click() }}>{sitetopnav.message}</span> */}
                </a>
              ) : null}

            </div>
          </div>
        </div>
      </div>
    )
  }
}



// mapStateToProps可以不传，如果不传，组件不会监听store的变化，也就是说Store的更新不会引起UI的更新
function mapStateToProps(state) {
  return {
    loginInfo: state.loginInfo.loginInfo,
    mallentrancedata: state.mallentrancedata,
    cartData: state.cartShopData.goods_info,
    countNum: getCartNum(state),
    defaultSelectedKeys: state.helpsearch.defaultSelectedKeys,
    openKeys: state.helpCenter.openKeys,

  }
}
// mapDispatchToProps
// mapDispatchToProps用于建立组件跟store.dispatch的映射关系,可以是一个object，也可以传入函数
// 如果mapDispatchToProps是一个函数，它可以传入dispatch,ownProps, 定义UI组件如何发出action，实际上就是要调用dispatch这个方法

function mapDispatchToProps(dispatch) {
  return {
    setLoginInfo: (state) => dispatch(state),
    editMallentrance: (state) => dispatch(state),
    setMallentrance: (state) => dispatch(state),
    setTopNavData: (state) => dispatch(state),
    setMainNavData: (state) => dispatch(state),
    setFooterNavData: (state) => dispatch(state),
    setFirendsLinkData: (state) => dispatch(state),
    changeOpenKey: (state) => dispatch(state),
    changeListId: (state) => dispatch(state),
  }
}

export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(SiteTopNav)));
