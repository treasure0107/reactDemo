import React, { Component } from 'react'
import Title from '../common/Title'
import { Message } from 'antd'
import './style/switchShop.scss'

class SwitchShop extends Component {
  render() {
    const shopList = localStorage.getItem('shop_list')
    return (
      <div className="switchShopPage">
        <Title title='切换店铺管理' />
        <div className="right-content-page">
          <div className="currentShop">
            <span className="title">当前店铺：</span>
            <span>{localStorage.getItem('currentShop')}</span>
          </div>
          <div className="shops clearfix">
            <span className="title fl">切换店铺：</span>
            <ul className="fl">
              {
                shopList && JSON.parse(shopList).map(shop => {
                  const shopId = shop.shop_id
                  const shopName = shop.shop_name
                  return (
                    <li title={shopName} className="textover" key={shopId} onClick={() => this.onSwitchShop(shopId, shopName)}>{shopName}</li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    )
  }
  onSwitchShop(shopId, shopName) {
    localStorage.setItem('seller_shop_id', shopId)
    Message.success('已切换至' + shopName)
    setTimeout(() => {
      location.reload()
    }, 300)
  }
}

export default SwitchShop