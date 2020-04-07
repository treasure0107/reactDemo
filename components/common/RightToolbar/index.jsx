import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getCartNum } from 'store/shoppingCart/reducer.js'
import MenuNav from './MenuNav'
import BuriedPoint from "components/common/BuriedPoint.jsx";
// import {string, bool} from 'prop-types'
// import Cart from './Cart'
// import Collect from './Collect'
// import FootMark from './FootMark'
// import Coupon from './Coupon'
// import Order from './Order'
import "./index.scss"



class RightToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.menuNavList = [
      {
        tag: "cart",
        txt: "购物车",
        icon: "&#xe67e;",
        url: "//user/myshoppingcart"
      }, {
        tag: "order",
        txt: "我的订单",
        icon: "&#xe67b;",
        aniTip: true,
        url: "//user/order/"
      }, {
        tag: "coupon",
        txt: "我的优惠券",
        icon: "&#xe67c;",
        aniTip: true,
        url: "//user/mypreferential"
      }, {
        tag: "footmark",
        txt: "我的浏览",
        icon: "&#xe67d;",
        aniTip: true,
        url: "//user/browsinghistory"
      }, {
        tag: "collect",
        txt: "我的收藏",
        icon: "&#xe67f;",
        aniTip: true,
        url: "//user/mycollection"
      }]
    this.showContent = this.showContent.bind(this)
    this.showContent1 = this.showContent1.bind(this)
  }


  // 跳到我的个人中心
  showContent1(tag) {
    let linkUrl = tag;
    localStorage.setItem("linkUrl", linkUrl);
    if (this.props.loginInfo.isLogin) {
      if (tag == '//user/UserCenter') {
        this.props.history.push('//user/UserCenter');
      }
      else {
        let tagObj = this.menuNavList.find(item => item.tag == tag);
        typeof tagObj != "undefined" && this.props.history.push(tagObj["url"]);
      }
    } else {
      this.setState({
        visible: true
      })
    }

    // For buried point.
    BuriedPoint.track({
      name: "点击右侧功能导航",
      options: {
        "功能导航": "个人中心"
      }
    });
  }

  // 右边导航栏点击之后获取地址，登录之后跳转到对应的页面
  showContent(url, tag = "") {
    let linkUrl = tag;
    // console.log(tag, this.props, url, '1')
    let my = url;
    localStorage.setItem("linkUrl", linkUrl);
    if (this.props.loginInfo.isLogin) {
      if (tag == '//user/order/') {
        this.props.history.push('//user/order/');
        // For buried point.
        BuriedPoint.track({
          name: "点击右侧功能导航",
          options: {
            "功能导航": "我的订单"
          }
        });
      }
      if (tag == '//user/browsinghistory') {
        this.props.history.push('//user/browsinghistory');
        // For buried point.
        BuriedPoint.track({
          name: "点击右侧功能导航",
          options: {
            "功能导航": "我的浏览"
          }
        });
      }
      if (tag == '//user/mycollection') {
        this.props.history.push('//user/mycollection');
        // For buried point.
        BuriedPoint.track({
          name: "点击右侧功能导航",
          options: {
            "功能导航": "我的收藏"
          }
        });
      }
      if (tag == '//user/mypreferential') {
        this.props.history.push('//user/mypreferential');
        // For buried point.
        BuriedPoint.track({
          name: "点击右侧功能导航",
          options: {
            "功能导航": "我的优惠券"
          }
        });
      }
      if (tag == '//user/myshoppingcart') {
        this.props.history.push('//user/myshoppingcart');
        // For buried point.
        BuriedPoint.track({
          name: "点击右侧功能导航",
          options: {
            "功能导航": "购物车"
          }
        });
      }
      else {
        let tagObj = this.menuNavList.find(item => item.tag == tag);
        typeof tagObj != "undefined" && this.props.history.push(tagObj["url"]);
      }
    } else {
      this.setState({
        visible: true
      });
      if (tag == '//user/order/') {
        // For buried point.
        BuriedPoint.track({
          name: "点击右侧功能导航",
          options: {
            "功能导航": "我的订单"
          }
        });
      }
      if (tag == '//user/browsinghistory') {
        // For buried point.
        BuriedPoint.track({
          name: "点击右侧功能导航",
          options: {
            "功能导航": "我的浏览"
          }
        });
      }
      if (tag == '//user/mycollection') {
        // For buried point.
        BuriedPoint.track({
          name: "点击右侧功能导航",
          options: {
            "功能导航": "我的收藏"
          }
        });
      }
      if (tag == '//user/mypreferential') {
        // For buried point.
        BuriedPoint.track({
          name: "点击右侧功能导航",
          options: {
            "功能导航": "我的优惠券"
          }
        });
      }
      if (tag == '//user/myshoppingcart') {
        // For buried point.
        BuriedPoint.track({
          name: "点击右侧功能导航",
          options: {
            "功能导航": "购物车"
          }
        });
      }
    }
  }

  changeVisibleVal(boolean) {
    this.setState({
      visible: boolean
    })
  }
  render() {

    let countNum = this.props.countNum;
    const menuNavList = this.menuNavList;
    const { currentTag, loginInfo } = this.props;
    // console.log(this.props.loginInfo)
    return (

      <div className="right-toolbar" onClick={(e) => { e.stopPropagation() }} style={{ width: !!currentTag ? "340px" : "40px" }}>
        <div className="toolbar-main">

          <MenuNav
            isLogin={loginInfo && loginInfo.isLogin}
            header={loginInfo && loginInfo.infoData && loginInfo.infoData.header}
            userName={loginInfo && loginInfo.infoData && loginInfo.infoData.nick_name}
            visible={this.state.visible}
            changeVisibleVal={this.changeVisibleVal.bind(this)}
            menuNavList={menuNavList}
            currentTag={currentTag}
            triggerClick={this.showContent}
            triggerClick1={this.showContent1}
            countNum={countNum}>
          </MenuNav>

          {/* <div className="toolbar-content">

                        <div className={`toolbar-sub-content toolbar-content-cart ${!!currentTag ? "" : "hide"}`} >
                            <div className="toolbar-sub-title">
                                <span className="toolbar-close iconfont2" onClick={() => {this.props.switchTag()}}>&#xe62d;</span>
                                {
                                  menuNavList.find( item => item.tag == currentTag) &&
                                  menuNavList.find( item => item.tag == currentTag)["txt"]
                                }
                            </div>
                            {(() => {
                                        switch(currentTag) {
                                            case "cart":
                                             return <Cart countNum={countNum}></Cart>;
                                            case "collect":
                                               return <Collect></Collect>;
                                            case "footmark":
                                              return  <FootMark></FootMark>;
                                            case "coupon":
                                              return <Coupon></Coupon>;
                                            case "order":
                                              return <Order></Order>;
                                            default:
                                              return <></>
                                        }


                                    })()}

                        </div>

                    </div> */}
        </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    loginInfo: state.loginInfo.loginInfo,  //如果在当前组件中需要引用来自redux中的某个值，就需要加上某个值
    currentTag: state.rightToolBar.tag,
    countNum: getCartNum(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    switchTag: (tag) => {
      dispatch({ type: 'SET_RIGHT_TOOL_TAG', tag })
    },
    //    delShopCart: (tag) => {
    //        dispatch({type:'REMOVE_SHOP',shop_id:tag})
    //    }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(RightToolbar))

