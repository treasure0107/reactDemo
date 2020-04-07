import React, { Component } from 'react'
import LeftMenu from '../common/LeftMenu';
import {shopChildrenList} from '../common/sellerConfig';
import { Route, Redirect, Switch } from 'react-router-dom'
import * as sellerRouter from '../../../router/seller';
class shop extends Component {

  render() {
    return (
      <div className='wrapper'>
        <LeftMenu menuList={shopChildrenList} />
        <div className='ecsc-layout-right'>
          <Switch>
            <Route path='/seller/shop/locSet' component={sellerRouter.LocSet} />
            <Route path='/seller/shop/ShopSet/:type?' component={sellerRouter.ShopSet} />
            <Route path='/seller/shop/salesActivity' component={sellerRouter.SalesActivity} />
            <Route path='/seller/shop/shopDecoration' component={sellerRouter.ShopDecoration} />
            <Route path='/seller/shop/switchshop' component={sellerRouter.SwitchShop} />
            <Route path='/seller/shop/cloudstorage/:page?' component={sellerRouter.CloudStorage} />
            <Redirect path="/" to={'/seller/shop/shopSet'} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default shop