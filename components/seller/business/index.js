import React, {Component} from 'react'
import LeftMenu from '../common/LeftMenu';
import {businessChildrenList} from '../common/sellerConfig';
import {Route, Redirect, Switch} from 'react-router-dom'
import * as sellerRouter from '../../../router/seller';
import {connect} from 'react-redux'

class business extends Component {
  render() {
    let {shopType} = this.props;
    let List = [];
    // // 2 个人公有店，4个人私域店，5个人私有店 无需显示发票
    // if((shopType == 2 || shopType == 4 || shopType == 5) && Array.isArray(businessChildrenList)&&businessChildrenList.length>0){
    //   List = businessChildrenList.filter((item)=>{
    //     return item.name != '发票'
    //   })
    // }else{
    //   List = businessChildrenList
    // }
    // 2 个人公有店，4个人私域店，5个人私有店 无需显示发票
    if ((shopType == 3 || shopType == 4) && Array.isArray(businessChildrenList) && businessChildrenList.length > 0) {
      List = businessChildrenList
    } else {
      List = businessChildrenList.filter((item) => {
        return item.name != '分销收益'
      })
    }
    return (
      <div className='wrapper'>
        <LeftMenu menuList={List}/>
        <div className='ecsc-layout-right'>
          <Switch>
            <Route path='/seller/business/settlement/:type?' component={sellerRouter.Settlement}/>
            <Route path='/seller/business/account/:activeKey?' component={() => {
              return <sellerRouter.Account screenProps={{
                shopType: shopType
              }}/>
            }}/>
            <Route path='/seller/business/invoice' component={sellerRouter.Invoice}/>
            <Route path='/seller/business/distributionEarning' component={sellerRouter.DistributionEarning}/>
            <Route path='/seller/business/cashwithdrawal' component={() => {
              return <sellerRouter.CashWithdrawal screenProps={{
                shopType: shopType
              }}/>
            }}/>
            <Route path='/seller/business/invoiceinfo/:invoiceId' component={sellerRouter.InvoiceInfo}/>
            <Route path='/seller/business/editinvoiceinfo/:invoice_list' component={sellerRouter.EditInvoiceInfo}/>
            <Route path='/seller/business/success/:number' component={sellerRouter.InvoiceSuccess}/>

            {/* <Route path='/seller/business/coupongetlist' component={sellerRouter.CouponGetList} />
            <Route path='/seller/business/shopDecoration' component={sellerRouter.ShopDecoration} />
            <Route path='/seller/business/couponeditor' component={sellerRouter.CouponEditor} /> */}
            <Redirect path="/" to={'/seller/business/account'}/>
          </Switch>
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  let {shopType} = state.sellerLogin.loginInfo;
  return {
    shopType
  }
};

export default connect(mapState)(business)
