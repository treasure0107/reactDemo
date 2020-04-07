import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Table, Cascader, Radio, Modal, Alert, TreeSelect, Tree } from 'antd';
import Title from '../common/Title';

import { withRouter } from 'react-router';
import '../common/style/salesActivity.scss'
import { hidden } from 'ansi-colors';
// import '../common/style/orderList.scss';
const { SHOW_PARENT } = TreeSelect;
const { TreeNode } = Tree;
const { Search } = Input;

const treeData = [
  {
    title: 'Node1',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        key: '001',
      },
    ],
  },
  {
    title: 'Node2',
    value: '',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        key: '01',
      },
      {
        title: 'Child Node4',
        key: '02',
      },
      {
        title: 'Child Node5',
        key: '03',
      },
    ],
  },
  {
    title: 'Node4',
    value: '',
    key: '0-2',
    children: [
      {
        title: '测试数据很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
        key: '020',
      },
      {
        title: '测试数据1',
        key: '021',
      },
      {
        title: '测试数据2',
        key: '022',
      },
    ],
  },
];
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
