import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button } from 'antd'
import api from 'utils/api'
import httpRequest from 'utils/ajax'
import comUtils from 'utils/common'
import { actionCreator } from './store'


class ShopsManage extends Component {
  constructor() {
    super()
    this.state = {
      shopList: JSON.parse(localStorage.getItem('shop_list')) || []
    }
  }
  render() {
    return (
      <div className="shopsManage">
        <div className="header clearfix">
          <img className="logo" src={require('assets/images//login/user_login_logo.png')} alt=""/>
          <i className="line"></i>
          <span className="title">商家管理中心</span>
        </div>
        <p className="subTitle">请选择一个网店铺进行管理</p>
        <div className="shopsWrapper">
          {
            this.state.shopList.map(item => (
              <div className="shop clearfix" key={item.shop_id}>
                <span className="name textover" title={item.shop_name}>{item.shop_name}</span>
                <Button className="manage" onClick={() => this.manageShop(item.shop_id)}>管理</Button>
                <span className="type">{item.open_status == 0 || item.open_status == 2 ? '公有店' : item.open_status == 1 || item.open_status == 5 ? '私有店' : item.open_status == 3 || item.open_status == 4 ? '私域店' : ''}</span>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
  manageShop(shopId) {
    localStorage.setItem('seller_shop_id', shopId)
    // uid和sdktoken给 客服im 免登录使用
    comUtils.setCookie('uid', 's' + shopId, 'd1')
    comUtils.setCookie('sdktoken', 's' + shopId, 'd1')
    // nick_name给 im使用用户名
    comUtils.setCookie('nick_name', 'user_' + shopId, 'd1')
    this.props.history.push('/seller/home')
  }
}

export default withRouter(ShopsManage)
