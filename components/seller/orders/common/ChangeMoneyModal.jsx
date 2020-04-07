import React, {Component, Fragment} from 'react';

import {Form, Input, Select, DatePicker, Table, Button, message} from 'antd';
import _ from 'lodash';
import '../../common/style/deliverModel.scss'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {BigNumber} from 'bignumber.js';
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import lang from "assets/js/language/config"
import comUtil from 'utils/common.js'
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";

let format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0
}
BigNumber.config({FORMAT: format})

class changeMoneyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      choose: 1,
      realityPrice: 0,
      discount: 0,
      deliveryPrice: 0,
      tax: 0,
      columns: [
        {
          title: '商品信息',
          dataIndex: 'goodsInfo',
          key: 'goodsInfo',
          render: (text, record, index) => {
            return <div className='goods-info-table-box'>
              <img className='pic-box' src={record.goods_img}/>

              <div>
                <div>{record.goods_name}</div>
                <div>{record.goods_classify}</div>
                <div>{record.SKU}</div>
              </div>
            </div>
          }
        },
        {
          title: '商品单价',
          dataIndex: 'unit_price',
          key: 'unit_price',
          render: (text) => {
            return <div>￥{text}</div>
          }
        },
        {
          title: '商品数量',
          dataIndex: 'goods_number',
          key: 'goods_number',
          render: (text) => {
            return <div> x{text}</div>
          }
        },
        {
          title: '商品原总价',
          dataIndex: 'total_price',
          key: 'total_price',
          render: (text, record) => {
            return <div>￥{new BigNumber(parseFloat(record.goods_number) * parseFloat(record.unit_price)).toFormat(3)}</div>
          }
        },
      ],
    }
  }

  onChange = (e) => {
    this.setState({
      choose: e.target.value
    })
  }
  moneyVlue = (value, key) => {
    var reg = /^\d+(\.\d{0,2})?$/;
    if (value == '' || value < 0) {
      value = 0;
    } else {
      if (value.indexOf('.') == -1 && value[0] == 0) {
        if (value.substring(1)) {
          value = value.substring(1);
        } else {

        }
      }
      // value =value;
    }
    if (reg.test(value)) {
      this.state[key] = value
      this.setState({})
    }
  }

  componentDidMount() {
    console.log("this.props.orderData......", this.props.orderData);
    console.log("this.props.loginInfo......", this.props.loginInfo);
    this.setState({
      realityPrice: _.get(this.props, 'orderData.order_charge.should_money', 0),
      discount: _.get(this.props, 'orderData.order_charge.discount', 0),
      deliveryPrice: _.get(this.props, 'orderData.order_charge.shopping_money', 0),
      tax: _.get(this.props, 'orderData.order_charge.tax', 0),
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.orderData != nextProps.orderData) {
      this.setState({
        realityPrice: _.get(nextProps, 'orderData.order_charge.should_money', 0),
        discount: _.get(nextProps, 'orderData.order_charge.discount', 0),
        deliveryPrice: _.get(nextProps, 'orderData.order_charge.shopping_money', 0),
        tax: _.get(nextProps, 'orderData.order_charge.tax', 0),
      })
    }
  }

  handleOk = () => {
    let {realityPrice, discount, deliveryPrice, tax, columns} = this.state;
    let coupons = _.get(this.props, 'orderData.order_charge.coupons', 0);
    let shop_coupons = _.get(this.props, 'orderData.order_charge.shop_coupons', 0);
    let total_account = _.get(this.props, 'orderData.order_charge.total_account', 0);
    realityPrice = parseFloat(total_account) - parseFloat(shop_coupons) - parseFloat(coupons) - parseFloat(discount) + parseFloat(deliveryPrice) + parseFloat(tax)
    if (realityPrice >= 0) {
      httpRequest.put({
        url: sellerApi.order.changeChargeInfo,
        data: {
          order_sn: this.props.order_sn,
          should_money: parseFloat(new BigNumber((realityPrice)).decimalPlaces(2)),
          tax: parseFloat(tax),
          shopping_money: parseFloat(deliveryPrice),
          discount: parseFloat(discount)
        }
      }).then(res => {
        message.success('操作成功')
        // this.setState({
        //     data: _.defaultTo(_.get(res, 'data.data', []), []),
        //     total: _.defaultTo(_.get(res, 'data.total', 0), 0),
        // })
      })
      this.props.handleOk();
    } else {
      message.error('修改失败,应付金额不能小于零')
    }
  }


  render() {
    let {realityPrice, discount, deliveryPrice, tax, columns} = this.state;
    let coupons = _.defaultTo(_.get(this.props, 'orderData.order_charge.coupons', 0), 0);
    let shop_order_profile = _.defaultTo(_.get(this.props, 'orderData.order_charge.shop_order_profile', 0), 0);
    let self_shop_id = _.defaultTo(_.get(this.props, 'orderData.self_shop_id', ""), 0);
    let orderType = _.defaultTo(_.get(this.props, 'orderData.order_type', 0), 0);
    let shop_coupons = _.defaultTo(_.get(this.props, 'orderData.order_charge.shop_coupons', 0), 0);
    let total_account = _.defaultTo(_.get(this.props, 'orderData.order_charge.total_account', 0), 0);
    let buyer_id = _.defaultTo(_.get(this.props, 'orderData.order_charge.buyer_id', lang.common.isNull), lang.common.isNull);
    let order_sn = _.defaultTo(_.get(this.props, 'orderData.buyer_id', lang.common.isNull), lang.common.isNull);
    let consignee = _.defaultTo(_.get(this.props, 'orderData.shopping_info.consignee', lang.common.isNull), lang.common.isNull);
    let mobile = _.defaultTo(_.get(this.props, 'orderData.shopping_info.mobile', lang.common.isNull), lang.common.isNull);
    //  let address = _.defaultTo(_.get(this.props,'orderData.shopping_info.address',lang.common.isNull),lang.common.isNull);
    let address = comUtil.getLocaData([_.get(this.props, 'orderData.shopping_info.province_id', ''),
      _.get(this.props, 'orderData.shopping_info.city_id', ''), _.get(this.props, 'orderData.shopping_info.area_id', '')])[1] + _.get(this.props, 'orderData.shopping_info.address', '');
    realityPrice = parseFloat(total_account) - parseFloat(shop_coupons) - parseFloat(coupons) - parseFloat(discount) + parseFloat(deliveryPrice) + parseFloat(tax)
    // changeChargeInfo
    return (
      <div className='deliver-model-page'>
        <div className='order-info'>
          <section className='title'>费用信息</section>
          <div className='info-content-box'>
            <div className='info-content-child'>
              <section><p>实际总价:</p><p>￥{total_account}</p></section>
              <section><p>商店优惠:</p><p>￥-{shop_coupons}</p></section>
              <section><p>平台优惠:</p><p>￥-{coupons}</p></section>
              <section><p style={{minWidth: 40}}>折扣:</p><p>-￥<Input value={discount} style={{width: 72}}
                                                                    onChange={(e) => {
                                                                      this.moneyVlue(e.target.value, 'discount')
                                                                    }}/></p></section>
            </div>
            <div className='info-content-child'>
              <section><p>配送费用:</p><p><Input value={deliveryPrice} style={{width: 72}} onChange={(e) => {
                this.moneyVlue(e.target.value, 'deliveryPrice')
              }}/></p></section>
              <section><p>税费:</p><p><Input value={tax} style={{width: 72}} onChange={(e) => {
                this.moneyVlue(e.target.value, 'tax')
              }}/></p></section>
              {
                this.props.loginInfo.shopId == self_shop_id && orderType == 9 ? <Fragment>
                  <span>预计收益:</span>
                  <span>￥{shop_order_profile}</span>
                </Fragment> : null
              }
            </div>
          </div>
        </div>
        <div className='price-box'><span>应付金额：</span><span className='price'>￥{
          new BigNumber(realityPrice).toFormat(2) + '0'
        }</span></div>
        <div className='order-info'>
          <section className='title'>订单信息</section>
          <div className='info-content-box'>
            <div className='info-content-child'>
              <section><p>用户名:</p><p>{buyer_id}</p></section>
              <section><p>订单号:</p><p>{order_sn}</p></section>
              <section><p>收货人:</p><p>{consignee}</p></section>
              <section><p>手机号码:</p><p>{mobile}</p></section>
            </div>
            <div className='info-content-child'>
              <section style={{width: '100%'}}><p>收货地址:</p><p className='double-line'
                                                              style={{width: 'auto'}}>{address}</p></section>
            </div>
          </div>
        </div>
        <div className='order-info' style={{marginTop: 29}}>
          <section className='title' style={{width: 150}}>商品信息</section>
        </div>
        <Table locale={{emptyText: lang.common.tableNoData}}
               dataSource={_.get(this.props, 'orderData.order_goods', [])} columns={columns} pagination={false}
               rowKey={(data, index) => index}/>

        <div style={{textAlign: 'right'}}>
          {this.props.loginInfo.shopId == self_shop_id && orderType == 9 ? null :
            <Button type='primary' onClick={this.handleOk}>确认</Button>}
          <Button className='cancle-btn' onClick={this.props.handleCancel}>取消</Button>
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  loginInfo: state.sellerLogin.loginInfo
});
const changeMoneyModalForm = Form.create()(changeMoneyModal);
export default connect(mapState, null)(withRouter(changeMoneyModalForm))
// export default Form.create()(changeMoneyModal)


