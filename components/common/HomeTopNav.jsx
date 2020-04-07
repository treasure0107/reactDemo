import React, { Component, Fragment } from 'react';
import { getCartNum } from 'store/shoppingCart/reducer.js'
import { Badge, message } from 'antd';
import './style/hometopnav.scss';
import CategoryList from './CategoryList';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import httpRequest from 'utils/ajax';
import api from 'utils/api';

import Cart from './RightToolbar/Cart.jsx'
import HeaderSearch from "./HeaderSearch";

import HelpSearch from "./HelpSearch";
import MerchantsHelpSearch from './MerchantsHelpSearch'
import comUtil from 'utils/common.js'
import lang from "assets/js/language/config";
import BuriedPoint from "components/common/BuriedPoint.jsx";

const common = lang.common;

/**
 * 头部内容 中间logo和搜索框内容等等
 * show 判断是否显示fix的头部
 * value 输入框内容
 */
class HomeTopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      value: '',
      homepage: false,
      helpSearch: false,
      merchantshelp: false
    }
  }
  logout() {
    let username = this.props.loginInfo.loginInfo.infoData.mobile;
    httpRequest.post({
      url: api.loginout.loginout,
      data: { username: username }
    }).then(res => {
      if (res.code == 200) {
        message.success(res.msg);
        comUtil.delCookie('nick_name');
        this.props.setLoginInfo({
          type: 'setLoginInfo',
          payload: { isLogin: false },
        });
        let pathName = window.location.pathname;
        if (pathName.indexOf("/user") > -1) {
          this.props.history.push('/');
        }
      } else if (res.code == 4002 || res.code == 4201) {
        this.props.history.push('//login');
      }
      localStorage.setItem("session_id", "");
      comUtil.clearTBZLoginCode();
    })
  }

  onChangeValue(e) {
    this.setState({
      value: e.target.value
    });
  }
  search(type) {
    let value = this.state.value;
    let url = '//search/' + type + '/' + value;
    this.props.history.push(url)
  }

  componentDidMount() {
    let _this = this;
    let test = window.location.href;
    setTimeout(() => {
      if (test.indexOf('buyerhelp') > 0) {
        _this.setState({
          helpSearch: true,

        })
      } else {
        // console.log('其他')
        _this.setState({
          helpSearch: false
        })
      }
      if (test.indexOf('merchantshelp') > 0) {
        _this.setState({
          merchantshelp: true
        })
      } else {
        _this.setState({
          merchantshelp: false
        })
      }
    }, 200)

    let params = this.props.match.params;
    let patname = this.props.history.location.pathname;
    if (patname == '/') {
      this.setState({
        homepage: true,
      });
      window.addEventListener('scroll', this.scroll)
    }
    if (patname.indexOf('//search') > -1) {
      this.setState({
        value: params.name
      });
    }
  }
  debounce(func, wait = 500) {
    this.timeout = null;  // 定时器变量
    return function (event) {
      clearTimeout(this.timeout);  // 每次触发时先清除上一次的定时器,然后重新计时
      event.persist && event.persist()   //保留对事件的引用
      //const event = e && {...e}   //深拷贝事件对象
      this.timeout = setTimeout(() => {
        func(event)
      }, wait);  // 指定 xx ms 后触发真正想进行的操作 handler
    };
  }
  scroll = this.debounce(() => {
    setTimeout(() => {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let patname = this.props.history.location.pathname;
      let hometopnavt = 0;
      if (patname == '/' && document.getElementById('swiper')) {
        hometopnavt = document.getElementById('swiper').offsetTop;
      }
      this.setState({
        show: scrollTop > hometopnavt ? true : false
      });
    }, 0)

  }, 0)
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scroll);
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  gotoMyCart() {
    this.props.history.push("//user/myshoppingcart");
    // For buried point.
    BuriedPoint.track({ name: "点击我的购物车按钮" });
  }

  // 我要求购埋点
  asktobuy(){
    this.props.history.push('//purchase/form/add/')
    BuriedPoint.track({ name: "点击求购按钮" });
  }


  render() {
    const { show, value, homepage } = this.state;
    const { loginInfo } = this.props;
    let countNum = this.props.countNum;
    return (
      <Fragment>
        {homepage ? <div className={show ? 'hometopnav hometopnavfix show' : 'hometopnav hometopnavfix'}>
          <div className="mg">
            {/* <CategoryList ></CategoryList> */}
            <div className="left">
              <Link to="/"><img src={require('assets/images//common/logo-min.png')} alt="" /></Link>
            </div>
            <HeaderSearch hidekeywords={true}></HeaderSearch>
            {/* <div className="login">
              {
                this.props.loginInfo.loginInfo.isLogin ?
                (
                  <Fragment>
                    欢迎您,<Link to={'/user'}>{loginInfo.loginInfo.infoData && loginInfo.loginInfo.infoData.nick_name}</Link> <span onClick={this.logout.bind(this)}>[退出]</span>
                  </Fragment>
                )
                : (
                    <Fragment>
                      <Link to={"//login"} style={{ marginRight: '10px' }}>登录</Link>
                      <Link to={"//register"}>注册</Link>
                    </Fragment>
                  )
              }

            </div> */}
            <a onClick={this.asktobuy.bind(this)} className="topurchase">
              <img src={require('assets/images//home/purchase2.png')} alt="" />
              <span>我要求购</span>
            </a>
            <div className="shopcar">
              <a onClick={this.gotoMyCart.bind(this)} className="cart_border">
                {/* <em className="iconfont2 icon_cart">&#xe618;</em> */}
                <img src={require('assets/images//common/cart.png')} alt="" />
                <span className='name'>{common.mycart}</span>
                <Badge showZero count={countNum}>
                  <span className="head-example"></span>
                </Badge>
              </a>
              {/* <div className="cart_top">
                <Cart attrType={"top"}></Cart>
              </div> */}
            </div>
            {/* <Link to='//user/myshoppingcart' className="shopcar">
              <em className="iconfont2 icon_cart icon_cart_nano">&#xe618;</em>
              <Badge count={countNum}>
                <span className="head-example"></span>
              </Badge>
            </Link> */}
          </div>
        </div> : null}
        <div id='hometopnav' className="hometopnav">
          <div className="mg clearfix">
            <div className="left">
              <Link to="/"><img src={require('assets/images//common/logo.png')} alt="" /></Link>
            </div>
            {
              this.state.helpSearch ? <HelpSearch></HelpSearch> :
                this.state.merchantshelp ? <MerchantsHelpSearch></MerchantsHelpSearch>
                  : <HeaderSearch isShop={this.props.isShop}></HeaderSearch>
            }
            {/* <HeaderSearch isShop={this.props.isShop}></HeaderSearch> */}
            <a onClick={this.asktobuy.bind(this)} className="topurchase">
              <img src={require('assets/images//home/purchase2.png')} alt="" />
              <span>我要求购</span>
            </a>
            <div className="shopcar">
              <a onClick={this.gotoMyCart.bind(this)} className="cart_border">
                {/* <em className="iconfont2 icon_cart">&#xe618;</em> */}
                <img src={require('assets/images//common/cart.png')} alt="" />
                <span className='name'>{common.mycart}</span>
                <Badge showZero count={countNum}>
                  <span className="head-example"></span>
                </Badge>
              </a>
              {/* <div className="cart_top">
                <Cart attrType={"top"}></Cart>
              </div> */}
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}
function mapStateToProps(state) {
  return {
    loginInfo: state.loginInfo,
    countNum: getCartNum(state)
  }
}
// mapDispatchToProps
// mapDispatchToProps用于建立组件跟store.dispatch的映射关系,可以是一个object，也可以传入函数
// 如果mapDispatchToProps是一个函数，它可以传入dispatch,ownProps, 定义UI组件如何发出action，实际上就是要调用dispatch这个方法
function mapDispatchToProps(dispatch) {
  return {
    setLoginInfo: (state) => dispatch(state),
  }
}
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeTopNav))
