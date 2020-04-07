import React, {Component} from 'react';

import {Radio, Form, Input, Select, DatePicker, LocaleProvider, Button, Table, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import _ from 'lodash';
import moment from 'moment';
import {BigNumber} from 'bignumber.js';
import comUtil from 'utils/common.js'
import lang from "assets/js/language/config"
import '../../common/style/deliverModel.scss'

let format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0
}
BigNumber.config({FORMAT: format})
const {Option} = Select;
const dateFormat = 'YYYY-MM-DD HH:mm';

class DeliverModel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      choose: _.get(this.props, 'orderData.shopping_info.express_type'),
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
          render: (text, record, index) => {
            return <div>￥{text}</div>
          }
        },
        {
          title: '商品数量',
          dataIndex: 'goods_number',
          key: 'goods_number',
          render: (text, record, index) => {
            return <div>x{text}</div>
          }
        },
        {
          title: '商品原总价',
          dataIndex: 'total_price',
          key: 'total_price',
          render: (text, record, index) => {
            return <div>￥{new BigNumber(parseFloat(record.goods_number) * parseFloat(record.unit_price)).toFormat(3)}</div>
          }
        },
      ],
      data: [{
        "id": 9,
        "logistics_name": "德邦快递",
        "logistics_code": "deBang",
        "logistics_link": "www.deBang.com",
        "is_electronic": 0,
        "logistics_status": 0,
        "add_user": "connor",
        "add_time": "2019-06-27T12:55:09",
        "update_user": null,
        "update_time": null,
        "desc": "若先选择开始时间，则结束时间内备选项的状态会随之改变"
      },
        {
          "id": 12,
          "logistics_name": "快递",
          "logistics_code": "PPy",
          "logistics_link": "www.PPy.com",
          "is_electronic": 0,
          "logistics_status": 0,
          "add_user": "connor",
          "add_time": "2019-06-27T12:55:09",
          "update_user": null,
          "update_time": null,
          "desc": "若先选择开始时间，则结束时间内备选项的状态会随之改变"
        },
        {
          "id": 15,
          "logistics_name": "亚马逊快递",
          "logistics_code": "yMx",
          "logistics_link": "www.yMx.com",
          "is_electronic": 0,
          "logistics_status": 1,
          "add_user": "connor",
          "add_time": "2019-06-27T12:55:09",
          "update_user": null,
          "update_time": null,
          "desc": "若先选择开始时间，则结束时间内备选项的状态会随之改变"
        }]
    }
  }

  componentDidMount() {
    this.getDeliveryList()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.orderData != this.props.orderData) {
      this.setState({
        choose: _.get(nextProps, 'orderData.shopping_info.express_type'),
      })
    }
  }

  onChange = (e) => {
    this.setState({
      choose: e.target.value
    })
  }
  getDeliveryList = () => {
    httpRequest.post({
      url: sellerApi.order.getDeliveryList,
    }).then(res => {
      this.setState({
        data: res.data ? res.data : [{
          "id": 9,
          "logistics_name": "德邦快递",
          "logistics_code": "deBang",
          "logistics_link": "www.deBang.com",
          "is_electronic": 0,
          "logistics_status": 0,
          "add_user": "connor",
          "add_time": "2019-06-27T12:55:09",
          "update_user": null,
          "update_time": null,
          "desc": "若先选择开始时间，则结束时间内备选项的状态会随之改变"
        },
          {
            "id": 12,
            "logistics_name": "快递",
            "logistics_code": "PPy",
            "logistics_link": "www.PPy.com",
            "is_electronic": 0,
            "logistics_status": 0,
            "add_user": "connor",
            "add_time": "2019-06-27T12:55:09",
            "update_user": null,
            "update_time": null,
            "desc": "若先选择开始时间，则结束时间内备选项的状态会随之改变"
          },
          {
            "id": 15,
            "logistics_name": "亚马逊快递",
            "logistics_code": "yMx",
            "logistics_link": "www.yMx.com",
            "is_electronic": 0,
            "logistics_status": 1,
            "add_user": "connor",
            "add_time": "2019-06-27T12:55:09",
            "update_user": null,
            "update_time": null,
            "desc": "若先选择开始时间，则结束时间内备选项的状态会随之改变"
          }]
      })
      // this.props.handleOk();
    })
  }

  onSub = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.time) {
          values.estimated_time = moment(values.time).unix()
          delete values.time
        }
        // 普通快递
        if (values.express_detail) {
          values.express_id = values.express_detail.key
          values.express_company = values.express_detail.label
          delete values.express_detail
        }
        // 无需配送
        if (values.express_sn_no === 0) {
          values.express_sn =''
          values.express_company = ''
          delete values.express_sn_no
        }
        values.order_sn = this.props.order_sn
        values.express_type = this.state.choose
        const params = {
          url: sellerApi.order.sendGoodsOff,
          data: {
            ...values
          }
        }
        if (this.props.isModify) {
          httpRequest.put(params).then(res => this.requestSucc(res))
        } else {
          httpRequest.post(params).then(res => this.requestSucc(res))
        }
        //登录接口
      } else {
        // _this.props.changeLoginState(false)
      }
    })
  }

  requestSucc(res) {
    if (res.code == 200) {
      message.success('操作成功')
      this.props.handleOk();
    }
  }

  render() {
    const { form: {getFieldDecorator}, expressDetail, expressSn } = this.props;
    let { dataSource, columns, data, choose } = this.state;
    return (
      <div className='deliver-model-page'>
        <div className='choose-box'>
          <div>发货方式：</div>
          <Radio.Group onChange={this.onChange} value={choose}>
            <Radio value={0}>普通快递</Radio>
            {/*<Radio value={1}>自配送(请与买家联系确认)</Radio>*/}
            <Radio value={3}>无需配送</Radio>
          </Radio.Group>
        </div>
        {
          this.state.choose == 0 ? (
            <Form labelCol={{span: 4}} wrapperCol={{span: 12}}>
              <Form.Item label={'物流公司'}>
                {getFieldDecorator('express_detail', {
                  initialValue: expressDetail && {key: expressDetail.split('_')[0], label: expressDetail.split('_')[1]} || '',
                  rules: [{ required: true, message: '物流公司不能为空' }],
                })(
                  <Select
                    size={'default'}
                    style={{ width: 240 }}
                    labelInValue
                  >
                    {
                      data.map((item, index) => {
                        return <Option key={item.logistics_name} value={item.id} text={item.logistics_name}>{item.logistics_name}</Option>
                      })
                    }
                  </Select>
                )}
              </Form.Item>
              <Form.Item label={'物流单号'}>
                {getFieldDecorator('express_sn', {
                  initialValue: expressSn || '',
                  rules: [{ required: true, message: '物流单号不能为空', whitespace: true }],
                })(
                  <Input
                    placeholder='请选择物流单号'
                    style={{width: 240}}
                  />
                )}
              </Form.Item>
            </Form>
          ) : (
            <Form.Item className="hide" label={'物流单号'}>
              {getFieldDecorator('express_sn_no', {
                initialValue: 0,
              })(
                <Input/>
              )}
            </Form.Item>
          )
          // 自配送
          // <Form labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
          //   <Form.Item label={'预计配送时间'}>
          //     <LocaleProvider locale={zh_CN}>
          //       {getFieldDecorator('time', {
          //         // initialValue: '',
          //         rules: [{ required: true, message: '预计配送时间不能为空' }],
          //       })(
          //         <DatePicker onChange={() => { console.log(666) }} />
          //       )}
          //     </LocaleProvider>
          //   </Form.Item>
          // </Form>
        }


        <div className='order-info'>
          <section className='title'>订单信息</section>
          <div className='info-content-box'>
            <div className='info-content-child'>
              <section><p>用户名:</p><p>{_.get(this.props, 'orderData.username', '')}</p></section>
              <section><p>订单号:</p><p>{_.get(this.props, 'orderData.order_sn', '')}</p></section>
              <section><p>收货人:</p><p>{_.get(this.props, 'orderData.shopping_info.consignee', '')}</p></section>
              <section><p>手机号码:</p><p>{_.get(this.props, 'orderData.shopping_info.mobile', '')}</p></section>
            </div>
            <div className='info-content-child'>
              <section style={{width: '100%'}}><p>收货地址:</p><p className='double-line' style={{width: 'auto'}}>
                {comUtil.getLocaData([_.get(this.props, 'orderData.shopping_info.province_id', ''),
                  _.get(this.props, 'orderData.shopping_info.city_id', ''), _.get(this.props, 'orderData.shopping_info.area_id', '')])[1] + _.get(this.props, 'orderData.shopping_info.address', '')}
              </p></section>
            </div>
          </div>
        </div>
        <div className='order-info' style={{marginTop: 29}}>
          <section className='title' style={{width: 150}}>商品信息</section>
        </div>
        <Table dataSource={_.get(this.props, 'orderData.order_goods', [])} columns={columns} pagination={false}
               rowKey={(data, index) => index}
               locale={{emptyText: lang.common.tableNoData}}
        />
        <div style={{textAlign: 'right'}}>
          <Button type='primary' onClick={this.onSub}>确认发货</Button>
          <Button className='cancle-btn' onClick={this.props.handleCancel}>取消</Button>
        </div>
      </div>
    )
  }
}

export default Form.create()(DeliverModel)


