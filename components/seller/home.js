import React, {Component, Fragment} from 'react'
import {Route, Redirect, Switch, withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import * as sellerRouter from '../../router/seller';
import HeadLayout from './common/HeadLayout'
import Message from './common/Message'
import {menuList as menuListConfig} from './common/sellerConfig'
import {actionCreator} from './login/store'
import {actionCreatorPurchase} from './purchase/store'
import comUtils from 'utils/common'
import httpRequest from 'utils/ajax'
import api, {IMApi, sellerApi} from 'utils/api'
import './common/style/index.scss'


class Home extends Component {
  constructor() {
    super()
    this.state = {
      menuList: [],
      isYunXin: true,
      waitOfferNum: "",
    }
  }

  componentDidMount() {
    this.getMenuList()
    this.getServiceStyle()
    document.title = '商家中心'
  }

  getServiceStyle() { //获取当前im 是采用云信 还是 QQ
    httpRequest.get({url: api.getImType}).then(res => {
      if (res.data.cust_service != 1) {
        this.setState({
          isYunXin: false
        })
      }
    })
  }

  getMenuList() {
    httpRequest.post({
      url: sellerApi.login,
      data: {
        // token: localStorage.getItem('token'),
        shop_id: localStorage.getItem('seller_shop_id')
      }
    }).then(res => {
      // 员工在商家入驻被 删除账号
      if (res.data.is_deleted) {
        localStorage.removeItem('token')
        // this.props.history.push('/sellerLogin/home')
      } else {
        const data = res.data
        const shopId = data.shop_id
        const menuList = []
        const loginInfo = {
          username: data.username,
          avatar: data.user_picture,
          lastLoginTime: comUtils.formatDate(data.login_time * 1000, 'yyyy-MM-dd hh:mm:ss'),
          shopName: data.shop_name,
          shopType: data.shop_type,
          shopLabel: data.label,
          shopId: shopId,
          logo: data.logo,
          isDirectShop: data.direct_type == 1
        }
        this.props.setLoginInfo(loginInfo)  // redux 存取登录的一些信息
        this.registerIM(shopId, data.shop_name)  // 注册IM
        localStorage.setItem('token', data.token)  // 后台更新token为当前对应店铺信息
        localStorage.setItem('currentShop', data.shop_name)
        
        menuListConfig.forEach(itemConfig => {
          data.menu_list.forEach((item, index) => {
            if (itemConfig.path == item.permission_url) {
              // 如果基本资料，设置物流和发布商品都没操作的话，设置首页为商家准备页面
              if (itemConfig.path == 'se_home') {
                if (data.shop_status == 2) {
                  itemConfig.url = '/seller/prepare'
                } else {
                  itemConfig.url = '/seller/home'
                }
              }
              menuList.push(itemConfig)
            }
          })
        })
        // 这个数据是调测用的。
        //  menuList[menuList.length] = { name: '商家', url: '/seller/business', id: 7 }x
        this.setState({
          menuList
        });
        data.menu_list && data.menu_list.length > 0 && data.menu_list.map((item, index) => {
          if (item.permission_url == "se_purchase") {
            this.getPurchaseCat();
          }
        })
      }
    })
  }

  getPurchaseCat() {
    httpRequest.get({
      url: sellerApi.home.purchase_cat,
      data: {
        page: 1,
        size: 10,
        type: 0
      }
    }).then(res => {
      if (res.code == "200") {
        this.props.saveSetWaitOfferNum(res.total)
      }
    })
  }

  authorizeRoute() {

    // const components = [
    //   { name: SellerIndex, url: '/seller/home' },
    //   { name: SellerOrder, url: '/seller/orders' },
    //   { name: SellerDelivery, url: '/seller/delivery' },
    //   { name: SellerShop, url: '/seller/shop' },
    //   { name: SellerGoods, url: '/seller/goods' },
    //   { name: SellerBusiness, url: '/seller/business' },
    //   { name: SellerPromotion, url: '/seller/promotion'}
    // ]
    const menuList = this.state.menuList
    // console.log('menuList',menuList)
    const newMenuList = JSON.parse(JSON.stringify(menuList))
    newMenuList.forEach(list => {
      menuListConfig.forEach(component => {
        if (component.path == list.path) {
          list.component = component.component;
        }
      })
    })
    if (newMenuList[0]) {
      newMenuList[newMenuList.length] = <Redirect path="/" to={newMenuList[0].url}/>
    }
    return (
      <Switch>
        <Route path='/seller/shopClose' component={sellerRouter.ShopClose}/>
        <Route path='/seller/prepare' component={sellerRouter.PreparePage}/>
        {
          newMenuList.length > 1 && newMenuList.map((item, index) => {
            if (index == newMenuList.length - 1) {
              return <Redirect path="/" to={newMenuList[0].url} key={index}/>
            } else {
              return <item.component key={item.url} path={item.url}></item.component>
            }
          })
        }
      </Switch>
    )
  }

  // 注册IM客服账号
  registerIM(shopId, shopName) {
    httpRequest.noMessage().post({
      url: IMApi.register,
      data: {
        type: "shop",
        shop_id: 's' + shopId,
        rz_shop_name: shopName
      }
    }).then((res) => {
    })
  }

  render() {
    const {isYunXin, menuList} = this.state
    return (
      <div className='seller-admin-box'>
        {
          menuList.length > 0 ? <HeadLayout menuList={menuList}/> : null
        }

        <div className='seller-admin-content-box'>
          {this.authorizeRoute()}
        </div>
        {
          isYunXin ? <Message/> : null
        }
      </div>
    )
  }
}

const mapDispatch = (dispatch) => ({
  setLoginInfo(loginInfo) {
    dispatch(actionCreator.setSellerLoginInfo(loginInfo))
  },
  saveSetWaitOfferNum(count) {
    dispatch(actionCreatorPurchase.setWaitOfferNum(count))
  }
});

export default connect(null, mapDispatch)(withRouter(Home))

/**
 <Switch>
 <Route path='/seller/shopClose' component={sellerRouter.ShopClose} />
 <Route path='/seller/prepare' component={sellerRouter.PreparePage} />
 <SellerIndex path='/seller/home' component={sellerRouter.SellerIndex}></SellerIndex>
 <SellerOrder path='/seller/orders' component={sellerRouter.Orders}></SellerOrder>
 <SellerDelivery path='/seller/delivery'></SellerDelivery>
 <SellerShop path='/seller/shop'></SellerShop>
 <Route path='/seller/goods' component={sellerRouter.Goods} />
 <Route path='/seller/promotion' component={sellerRouter.Promotion} />
 <Route path='/seller/authority' component={sellerRouter.Privilege} />
 <Redirect path="/" to={'/seller/home'} />
 </Switch>
 */
