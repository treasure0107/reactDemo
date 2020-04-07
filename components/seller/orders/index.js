import React, { Component } from 'react'
import LeftMenu from '../common/LeftMenu';
import {OrderChildrenList} from '../common/sellerConfig';
import { Route, Redirect, Switch } from 'react-router-dom'
import * as sellerRouter from '../../../router/seller';
import { connect } from 'react-redux'

class Orders extends Component {

  render() {
    let { shopType } = this.props;
    let List = [];
    // 暂时不走 这个等于二的逻辑
    shopType = 1;
    if(shopType == 1&&Array.isArray(OrderChildrenList)&&OrderChildrenList.length>0){
      List = OrderChildrenList.filter((item)=>{
        return item.name != '分期订单'
      })
    }else{
      List = OrderChildrenList
    }
    return (
      <div className='wrapper'>
        <LeftMenu menuList={List} />
        <div className='ecsc-layout-right'>
          <Switch>
            <Route path='/seller/orders/orderList/:status?' component={sellerRouter.OrderList} />      
            <Route path='/seller/orders/StagesInfo/:orderInfo' component={sellerRouter.StagesInfo} />
            <Route path='/seller/orders/orderInfo/:orderInfo' component={sellerRouter.OrderInfo} />
            <Route path='/seller/orders/evaluateList' component={sellerRouter.OrderEvaluateList} />
            <Route path='/seller/orders/reply/:replyId' component={sellerRouter.OrderReplyEvaluate} />
            <Route path='/seller/orders/aftermarket' component={sellerRouter.OrderAftermarket} />
            <Route path='/seller/orders/aftermarketDetail/:after_id/:buyer_id' component={sellerRouter.OrderAftermarketDetail} />
            <Route path='/seller/orders/refundList' component={sellerRouter.OrderRefundList} />
            <Route path='/seller/orders/refundDetail/:order_sn/:refund_id' component={sellerRouter.OrderRefundDetail} />
            <Redirect path="/" to={'/seller/orders/OrderList'} />
          </Switch>
        </div>
      </div>
    )
  }
}
const mapState = (state) => {
  let { shopType } = state.sellerLogin.loginInfo;
  return {
    shopType
  }
}

export default connect(mapState)(Orders)




