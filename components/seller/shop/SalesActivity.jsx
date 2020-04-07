import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Table, Cascader, Radio, Modal, Alert, TreeSelect, Tree } from 'antd';
import Title from '../common/Title';

import { withRouter } from 'react-router';
import '../common/style/salesActivity.scss'

class SalesActivity extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <Title title={'促销活动'} />
        <div className='shop-sales-activity'>
          {/* <CouponRelations placeholder='商品ID/商品关键字' needSearch title={['选择商品','已选择商品']}/> */}
          <div className='coupon-content-detail'>
            <div className='coupon-style grey-coupon'>
              <div className='price-box'>
                <div className='main-price'>￥100</div>
                <div className='tips-price'>满888可用</div>
              </div>
              <div className='no-content'>
                <div className='line-box'>
                  <div className='no-content-line'></div>
                  <div className='no-content-line'></div>
                </div>
              </div>
            </div>
            <Button type='primary' onClick={() => {
              this.props.history.push('/seller/promotion/couponindex')
            }}>优惠券</Button>
            <div className='coupon-introduce'>店铺运营必备，百搭又实用的营销利器</div>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Form.create()(SalesActivity))
