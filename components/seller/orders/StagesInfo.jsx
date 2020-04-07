import React, { Component, Fragment } from 'react';
import Title from '../common/Title';
import { Steps, Button, Table, Form, Input, Modal, message, Statistic, Icon } from 'antd';
import DeliverModel from './common/DeliverModal';
import Logistics from 'components/common/Logistics';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import comUtil from 'utils/common.js'
import lang from "assets/js/language/config"
import ChangeRecivewInfo from './common/ChangeRecivewInfo'
import '../common/style/orderInfo.scss';
import { BigNumber } from 'bignumber.js';
// import { setupMaster } from 'cluster';
import _ from 'lodash'

import moment from 'moment';
const { Step } = Steps;
const Countdown = Statistic.Countdown;
const { confirm } = Modal;

const dateFormat = 'YYYY-MM-DD HH:mm';
let format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0
}
BigNumber.config({ FORMAT: format })


class StagesInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '订单详情',
      visible: false,
      showConsigneeEditor: false,
      showSellerEditor: false,
      realityPrice: 0,
      discount: 0,
      deliveryPrice: 0,
      tax: 0,
      //  费用信息编辑显示
      showCostEditor: false,
      //  商家备注
      sellerRemark: '',
      visibleRecivew: false,
      data: {
        order_trance: [{
          "id": 115, //[订单追踪id]
          "operation": "确认收货", //[操作行为]
          "value": 5, //[操作后状态]
          "create_time": 1562052578, //[创建时间]
          "creator_id": 7, //[创建的用户]
          "remark": "确认收货: 2019-07-02 15:29:38"// [跟踪备注]
        },
        {
          "id": 116, //[订单追踪id]
          "operation": "确认收货", //[操作行为]
          "value": 3, //[操作后状态]
          "create_time": 1562052578, //[创建时间]
          "creator_id": 7, //[创建的用户]
          "remark": "确认收货: 2019-07-02 15:29:38"// [跟踪备注]
        }],
      },
      tranceList: [

      ],
      // 原价
      originalPrice: 0,
      pay_time: lang.common.isNull,
      send_time: lang.common.isNull,
      columns: [
        {
          title: '商品信息',
          dataIndex: 'goodsInfo',
          key: 'goodsInfo',
          render: (text, record, index) => {
            return <div className='goods-info-table-box'>
              <img className='pic-box' src={record.goods_img} />
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
            return <div className='goods-info-table-box'>
              ￥{text}
            </div>
          }
        },
        {
          title: '商品数量',
          dataIndex: 'goods_number',
          key: 'goods_number',
          render: (text, record, index) => {
            return <div className='goods-info-table-box'>
              x{text}
            </div>
          }
        },
        {
          title: '商品原总价',
          dataIndex: 'total_price',
          key: 'total_price',
          render: (text, record, index) => {
            return <div className='goods-info-table-box'>
              ￥{new BigNumber(parseFloat(record.goods_number) * parseFloat(record.unit_price)).toFormat(3)}
            </div>
          }
        },
      ],
    }
  }
  componentDidMount() {
    // orderDetail
    this.getData();
  }
  showRecivewModal = (data) => {
    this.setState({
      visibleRecivew: true,
      orderData: data
    });
  };
  handleRecivewOk = e => {
    this.getData();
    this.setState({
      visibleRecivew: false,
    });
  };
  handleRecivewCancel = e => {
    this.setState({
      visibleRecivew: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = e => {
    this.getData();
    this.setState({
      visible: false,
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  getData = () => {
    httpRequest.get({
      url: sellerApi.order.installment_order,
      data: {
        // shop_id: parseInt(localStorage.getItem('shopId')),
        // user_id: '',
        order_sn: this.props.match.params.orderInfo,
      }
    }).then(res => {
      this.showStepTime(res.data.order_trance, res.data.order_type);
      this.getOriginalPrice(res.data.order_goods)
      this.setState({
        data: res.data,
        //  realityPrice:res.data.should_money,
        discount: _.get(res, 'data.order_charge.discount', 0),
        deliveryPrice: _.get(res, 'data.order_charge.shopping_money', 0),
        tax: _.get(res, 'data.order_charge.tax', 0),
        sellerRemark: _.get(res, 'data.seller_remark', ''),
      })
    })
  }
  editorRemark = () => {
    let { sellerRemark } = this.state;
    httpRequest.post({
      url: sellerApi.order.editorRemark,
      data: {
        // shop_id: parseInt(localStorage.getItem('shopId')),
        // user_id: '',
        order_sn: this.props.match.params.orderInfo,
        seller_remark: sellerRemark
      }
    }).then(res => {
      this.getData();
      // this.setState({
      //   data:res.data,
      // })
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

  statusType = (type, index, status) => {
    //  0：取消订单， 1：待接单，2：待付款，3：待确认，4：待发货，  5：待收货，6：待评价，7：已完成
    let text = '';
    //  0：取消订单， 1：待接单，2：待付款，3：待确认，4：待发货，  5：待收货，6：待评价，7：已完成
    if (index == 0) {
      switch (type) {
        case 0:
          text = '取消订单'
          break;
        case 1:
          text = '待接单'
          break;
        case 2:
          text = '待付款'
          break;
        case 3:
          text = '待确认'
          break;
        case 4:
          text = '待发货'
          break;
        case 5:
          text = '待收货'
          break;
        case 6:
          text = '待评价'
          break;
        case 7:
          text = '已完成'
          break;
        default:
          text = lang.common.isNull
      }
    } else {
      if (status == 0) {
        text = '已取消'
      } else {
        if (type > 2) {
          text = '已付款'
        } else {
          text = '未付款'
        }
      }
    }
    return text
  }

  order_type = (type) => {
    // 0：库存类，1: 定制类，2：生产类
    let text = '';
    switch (type) {
      // case 0:
      //   text = '库存商品订单'
      //   break;
      case 1:
        text = '生产类订单'
        break;
      case 2:
        text = '定制商品订单'
        break;
      default:
        text = lang.common.isNull
    }
    return text
  }

  currentIndex = (index) => {
    let { order_type } = this.state.data;
    // if(order_type == 0){
    //   switch (index) {
    //     case 2:
    //       index = 0
    //       break;
    //     case 4:
    //         index = 1
    //      // text = '待确认'
    //       break;
    //     case 5:
    //       index = 2
    //      // text = '待发货'
    //       break;
    //     case 6:
    //         index = 3
    //       // text = '待评价'
    //       break;
    //     case 7:
    //         index = 3
    //       // text = '已完成'
    //       break;
    //   }
    // }else
    if (order_type == 2) {
      switch (index) {
        case 0:

          break;
        case 1:
          index = 0
          break;
        case 2:
          index = 1
          break;
        case 3:
          index = 2
          // text = '待确认'
          break;
        case 4:
          index = 3
          // text = '待发货'
          break;
        case 5:
          index = 4
          // text = '待收货'
          break;
        case 6:
          index = 5
          // text = '待评价'
          break;
        case 7:
          index = 5
          // text = '已完成'
          break;
      }
    } else {
      switch (index) {
        case 0:

          break;
        case 2:
          index = 0
          break;
        case 3:
          index = 1
          // text = '待确认'
          break;
        case 4:
          index = 2
          // text = '待发货'
          break;
        case 5:
          index = 3
          // text = '待收货'
          break;
        case 8:
          index = 4
          // text = '待付尾款'
          break;
        case 7:
          index = 5
          // text = '已完成'
          break;
      }
    }

    return index
  }
  changeMoney = () => {
    let { showConsigneeEditor, realityPrice, discount, deliveryPrice, tax, data } = this.state;
    let coupons = _.get(data, 'order_charge.coupons', 0);
    let shop_coupons = _.get(data, 'order_charge.shop_coupons', 0);
    let total_account = _.get(data, 'order_charge.total_account', 0);
    let should_money = parseFloat(total_account) - parseFloat(shop_coupons) - parseFloat(coupons) - parseFloat(discount) + parseFloat(deliveryPrice) + parseFloat(tax)
    if (should_money >= 0) {
      httpRequest.put({
        url: sellerApi.order.changeChargeInfo,
        data: {
          order_sn: this.props.match.params.orderInfo,
          should_money: parseFloat(new BigNumber(should_money).decimalPlaces(2)),
          tax: tax,
          shopping_money: deliveryPrice,
          discount: discount
        }
      }).then(res => {
        message.success('操作成功')
        this.getData()
        // this.setState({
        //     data: _.defaultTo(_.get(res, 'data.data', []), []),
        //     total: _.defaultTo(_.get(res, 'data.total', 0), 0),
        // })
      })
    } else {
      this.getData()
      message.error('修改失败,应付金额不能小于零')
    }
    this.setState({
      showCostEditor: false
    })
  }





  // 顶上的step时间显示隐藏
  showStepTime = (order_trance, order_type) => {
    //  0：取消订单， 1：待接单，2：待付款，3：待确认，4：待发货，  5：待收货，6：待评价，7：已完成
    // 0：库存类，1: 定制类，2：生产类
    let { data, tranceList, pay_time, send_time } = this.state;
    // 库存类订单逻辑隐藏
    // if(order_type == 0){
    //   tranceList=[
    //     {
    //       operation: '待付款',
    //       create_time: `${lang.common.isNull}`,
    //       text:'下单时间：'
    //     },
    //     {
    //       operation: '待发货',
    //       create_time: `${lang.common.isNull}`,
    //       text:'付款时间：'
    //     },
    //     {
    //       operation: '待收货',
    //       create_time: `${lang.common.isNull}`,
    //       text:'发货时间：'
    //     },
    //     {
    //       operation: '交易成功',
    //       create_time: `${lang.common.isNull}`,
    //       text:'确认收货时间：'
    //     }
    //   ]
    //   for(let i=0;i<order_trance.length;i++){
    //     let create_time;
    //     if(order_trance[i].create_time){
    //       create_time = _.defaultTo(order_trance[i].create_time,lang.common.isNull);
    //     }
    //     if(order_trance[i].value == 2){
    //       if(create_time != lang.common.isNull){
    //         tranceList[0].create_time = `${create_time}`
    //       }
    //     }else if(order_trance[i].value == 4){
    //       if(create_time != lang.common.isNull){
    //         tranceList[1].create_time =  `${create_time}`
    //         pay_time = create_time;
    //       }
    //     }else if(order_trance[i].value == 5){
    //       if(create_time != lang.common.isNull){
    //         tranceList[2].create_time = `${create_time}`
    //         send_time = create_time;
    //       }
    //     }else if(order_trance[i].value == 6){
    //       if(create_time != lang.common.isNull){
    //         tranceList[3].create_time = `${create_time}`
    //       }
    //     }
    //   }
    // }else
    if (order_type == 2) {
      tranceList = [
        {
          operation: '待接单',
          create_time: `${lang.common.isNull}`,
          text: '下单时间：'
        },
        {
          operation: '待付款',
          create_time: `${lang.common.isNull}`,
          text: '接单时间：'
        },
        {
          operation: '待确认',
          create_time: `${lang.common.isNull}`,
          text: '付款时间：'
        },
        {
          operation: '待发货',
          create_time: `${lang.common.isNull}`,
          text: '确认时间:'
        },
        {
          operation: '待收货',
          create_time: `${lang.common.isNull}`,
          text: '发货时间：'
        },
        {
          operation: '交易成功',
          create_time: `${lang.common.isNull}`,
          text: '确认收货时间：'
        }
      ]
      for (let i = 0; i < order_trance.length; i++) {
        let create_time;
        if (order_trance[i].create_time) {
          create_time = _.defaultTo(order_trance[i].create_time, lang.common.isNull);
        }
        if (order_trance[i].value == 1) {
          if (create_time != lang.common.isNull) {
            tranceList[0].create_time = `${create_time}`
          }
        } else if (order_trance[i].value == 2) {
          if (create_time != lang.common.isNull) {
            tranceList[1].create_time = `${create_time}`
          }
        } else if (order_trance[i].value == 3) {
          if (create_time != lang.common.isNull) {
            tranceList[2].create_time = `${create_time}`
            pay_time = create_time;
          }
        } else if (order_trance[i].value == 4) {
          if (create_time != lang.common.isNull) {
            tranceList[3].create_time = `${create_time}`
          }
        } else if (order_trance[i].value == 5) {
          if (create_time != lang.common.isNull) {
            tranceList[4].create_time = `${create_time}`
            send_time = create_time;
          }
        } else if (order_trance[i].value == 6) {
          if (create_time != lang.common.isNull) {
            tranceList[5].create_time = `${create_time}`
          }
        }
      }
    } else if (order_type == 1) {

      tranceList = [
        {
          operation: '待付款',
          create_time: `${lang.common.isNull}`,
          text: '下单时间：'
        },
        {
          operation: '待确认',
          create_time: `${lang.common.isNull}`,
          text: '付款时间：'
        },
        {
          operation: '待发货',
          create_time: `${lang.common.isNull}`,
          text: '确认时间:'
        },
        {
          operation: '待收货',
          create_time: `${lang.common.isNull}`,
          text: '发货时间：'
        },
        {
          operation: '交易成功',
          create_time: `${lang.common.isNull}`,
          text: '确认收货时间：'
        }
      ]
      for (let i = 0; i < order_trance.length; i++) {
        let create_time;
        if (order_trance[i].create_time) {
          create_time = _.defaultTo(order_trance[i].create_time, lang.common.isNull);
        }
        if (order_trance[i].value == 2) {
          if (create_time != lang.common.isNull) {
            tranceList[0].create_time = `${create_time}`
          }
        } else if (order_trance[i].value == 3) {
          if (create_time != lang.common.isNull) {
            tranceList[1].create_time = `${create_time}`
            pay_time = create_time;
          }
        } else if (order_trance[i].value == 4) {
          if (create_time != lang.common.isNull) {
            tranceList[2].create_time = `${create_time}`
          }
        } else if (order_trance[i].value == 5) {
          if (create_time != lang.common.isNull) {
            tranceList[3].create_time = `${create_time}`
            send_time = create_time;
          }
        } else if (order_trance[i].value == 6) {
          if (create_time != lang.common.isNull) {
            tranceList[4].create_time = `${create_time}`
          }
        }
      }
    } else if (order_type == 3) {
      tranceList = [
        {
          operation: '待付款',
          create_time: `${lang.common.isNull}`,
          text: '下单时间：'
        },
        {
          operation: '待确认',
          create_time: `${lang.common.isNull}`,
          text: '付款时间：'
        },
        {
          operation: '待发货',
          create_time: `${lang.common.isNull}`,
          text: '付款时间：'
        },
        {
          operation: '待收货',
          create_time: `${lang.common.isNull}`,
          text: '发货时间：'
        },
        {
          operation: '待付尾款',
          create_time: `${lang.common.isNull}`,
          text: '收货时间：'
        },
        {
          operation: '交易成功',
          create_time: `${lang.common.isNull}`,
          text: '确认收货时间：'
        }
      ]
      for (let i = 0; i < order_trance.length; i++) {
        let create_time;
        if (order_trance[i].create_time) {
          create_time = _.defaultTo(order_trance[i].create_time, lang.common.isNull);
        }
        if (order_trance[i].value == 2) {
          if (create_time != lang.common.isNull) {
            tranceList[0].create_time = `${create_time}`
          }
        } else if (order_trance[i].value == 3) {
          if (create_time != lang.common.isNull) {
            tranceList[1].create_time = `${create_time}`
            pay_time = create_time;
          }
        } else if (order_trance[i].value == 4) {
          if (create_time != lang.common.isNull) {
            tranceList[2].create_time = `${create_time}`
          }
        } else if (order_trance[i].value == 5) {
          if (create_time != lang.common.isNull) {
            tranceList[3].create_time = `${create_time}`
            send_time = create_time;
          }
        }
        else if (order_trance[i].value == 8) {
          if (create_time != lang.common.isNull) {
            tranceList[4].create_time = `${create_time}`
            send_time = create_time;
          }
        }
        else if (order_trance[i].value == 7) {
          if (create_time != lang.common.isNull) {
            tranceList[5].create_time = `${create_time}`
            send_time = create_time;
          }
        }
        // else if(order_trance[i].value == 6){
        //   if(create_time != lang.common.isNull){
        //     tranceList[4].create_time = `${create_time}`
        //   }
        // }
      }
    }



    // <Step title="未付款" description={`下单时间：${create_time}`} />
    // <Step title="待发货" description={`付款时间：${pay_time}`} />
    // <Step title="待收货" description={`发货时间：${send_time}`} />
    // <Step title="交易成功" description={`确认收货时间：${receive_time}`} />

    this.setState({
      tranceList: tranceList,
      pay_time: pay_time,
      send_time: send_time
    })
  }
  // 获取原价
  getOriginalPrice = (tableList) => {
    let originalPrice = 0;
    for (let i = 0; i < tableList.length; i++) {
      originalPrice = parseFloat(originalPrice) + (parseFloat(tableList[i].goods_number) * parseFloat(tableList[i].unit_price))
    }
    this.setState({
      originalPrice: new BigNumber(originalPrice).toFormat(2)
    })
  }

  render() {
    let { getFieldDecorator } = this.props.form;
    let { pay_time, send_time, showConsigneeEditor, columns, originalPrice, discount, deliveryPrice, tax, showCostEditor, showSellerEditor, sellerRemark, data, tranceList } = this.state;
    let coupons = _.get(data, 'order_charge.coupons', 0);
    let shop_coupons = _.get(data, 'order_charge.shop_coupons', 0);
    let total_account = _.get(data, 'order_charge.total_account', 0);
    let create_time = tranceList[0] ? tranceList[0].create_time : lang.common.isNull;
    let express_type = _.defaultTo(_.get(data, 'shopping_info.express_type', ''), '');
    let express_sn = _.defaultTo(_.get(data, 'shopping_info.express_sn', '未发货'), '未发货');
    let order_sn = _.defaultTo(_.get(data, 'order_sn', lang.common.isNull), lang.common.isNull);
    let consignee = _.defaultTo(_.get(data, 'shopping_info.consignee', lang.common.isNull), lang.common.isNull)
    let mobile = _.defaultTo(_.get(data, 'shopping_info.mobile', lang.common.isNull), lang.common.isNull)
    let address = _.defaultTo(comUtil.getLocaData([_.get(data, 'shopping_info.province_id', ''), _.get(data, 'shopping_info.city_id', ''), _.get(data, 'shopping_info.area_id', '')])[1] + _.get(data, 'shopping_info.address', ''), lang.common.isNull);
    let shopping_info = _.defaultTo(_.get(data, 'shopping_info', {}), {});
    let user_name = _.defaultTo(_.get(data, 'username', lang.common.isNull), lang.common.isNull)
    let remark = _.defaultTo(_.get(data, 'remark', lang.common.isNull), lang.common.isNull)
    let child_orders = _.defaultTo(_.get(data, 'child_orders', []), [])
    let { status, receive_time } = data;
    // console.log('receive_time',moment().unix(data.receive_time).format())
    let should_money = parseFloat(total_account) - parseFloat(shop_coupons) - parseFloat(coupons) - parseFloat(discount) + parseFloat(deliveryPrice) + parseFloat(tax)
    return (
      <div>
        <Title title={this.state.titleContent} />
        <div className='order-info-page'>
          <div className='stages-info-box'>
            <div className='content-next'>
              {
                child_orders && child_orders.map((childItem, index) => {
                  return <div className='step-box' key={index}>
                    <div className='step-content-box' style={{minWidth:182}}>
                      <div>
                        <span className='step-title'>
                          {
                            index == 0 ? '阶段一:商品订金' : '阶段二:商品尾款'
                          }
                        </span>
                      </div>
                      {
                        !childItem.pay_time&&index == 0 ? <div>
                          需在<span className='order-type'>
                            {
                              childItem.down_payment_expired
                            }
                          </span> 前支付
                        </div> :
                          !childItem.pay_time&&status > 4 ?
                            <div>
                              需在<span className='order-type'>
                                {
                                  childItem.balance_payment_expired
                                }
                              </span> 前支付
                        </div> : null
                      }

                    </div>
                    <div className='step-content-box height36'>
                      订单号：{
                        childItem.order_sn
                      }
                    </div>
                    <div className='step-content-box height36'>
                      ¥{childItem.should_money}
                    </div>
                    <div className='step-content-box height36'>
                      <span className='order-type'>{this.statusType(childItem.status, index, status)}</span>
                    </div>
                    <div className='step-content-box height36'>
                      {/* {
                          index == 0 ? childItem.down_payment_pay_time +'已付': childItem.balance_payment_pay_time +'已付'
                        } */}
                      {
                        childItem.pay_time ? childItem.pay_time + '已付' : null
                      }
                    </div>

                  </div>
                })
              }
            </div>
          </div>
          {
            status > 0 ? <Steps progressDot current={this.currentIndex(status)}>
              {
                tranceList.map((item, index) => {
                  return <Step title={item.operation} description={item.text + item.create_time} key={index} />
                })
              }
              {/* <Step title="未付款" description={`下单时间：${create_time}`} />
           <Step title="待发货" description={`付款时间：${pay_time}`} />
           <Step title="待收货" description={`发货时间：${send_time}`} />
           <Step title="交易成功" description={`确认收货时间：${receive_time}`} /> */}
            </Steps> : null
          }
          <div className='steps-next'>
            {
              status == 4 ? <section className='flex-section'>当前订单状态：{this.statusType(status)}，请尽快安排物流上传物流单号您可操作发货按钮完成上传物流操作</section>
                : status == 5 ? <section>当前订单状态：{this.statusType(status)}，请查看页面下方物流信息了解寄送情况买家还有 <Countdown value={Date.now() + receive_time * 1000} format="D 天 H 时 m 分 s 秒" />来完成“确认收货”操作，如果期间用户没有"确认收货"，，以上宝贝将自动确认收货</section>
                  : <section className='flex-section'>当前订单状态：{this.statusType(status)}</section>
            }
            {
              status > 0 && status == 4 ? <Button type="primary" onClick={this.showModal}>发货</Button> : null
            }
          </div>
          <Logistics className={'hen'} data={shopping_info}></Logistics>
          <div className='order-info'>
            <section className='title'>基本信息</section>
            <div className='info-content-box'>
              <div className='info-content-child'>
                <section><p>订单号:</p><p>{order_sn}</p></section>
                <section><p>用户名:</p><p>{user_name}</p></section>
                <section><p>订单状态:</p><p>{this.statusType(status)}</p></section>
                <section><p>订单类型:</p><p>分期订单</p></section>
                <section><p>下单时间:</p><p>{create_time}</p></section>
              </div>
              <div className='info-content-child'>
                <section><p>付款时间:</p><p className='double-line'>{pay_time}</p></section>
                <section><p>发货时间:</p><p>{send_time}</p></section>
                {/* 0：普通快递，1：同城配送 */}
                <section><p>配送方式:</p><p>{
                  express_type == 0 ? '普通快递' :
                    express_type == 1 ? '同城配送' : lang.common.isNull
                }</p></section>
                <section><p>发货单号:</p><p>{express_sn}</p></section>
              </div>
            </div>
          </div>
          <div className='order-info Consignee-info'>
            <section className='title' style={status > 0 && status <= 4 ? { width: 150, cursor: 'pointer' } : { width: 150 }} onClick={() => {
              if (status > 0 && status <= 4) {
                this.showRecivewModal(data)
              }
            }}>收货人信息 {status > 0 && status <= 4 ? <span className='iconfont iconbianji' style={{ marginLeft: 4 }}></span> : null}</section>
            <div className='info-content-box'>
              <div className='need-border'>
                <Form layout="inline" className='info-content-child'>
                  <section><p style={{ minWidth: 60 }}>收货人:</p><div>
                    {consignee}
                  </div></section>
                  <section><p style={{ minWidth: 60 }}>手机号:</p><div>
                    {mobile}
                  </div></section>
                  <section><p style={{ minWidth: 60 }}>收货地址:</p><div>
                    {address}
                  </div></section>
                </Form>
              </div>
            </div>
          </div>
          <div className='order-info Consignee-info'>
            <section className='title' style={{ width: 150 }}>商品信息</section>
          </div>
          <Table rowKey={(data, index) => index} dataSource={data.order_goods} columns={columns} pagination={false} locale={{ emptyText: lang.common.tableNoData }} />
          <div style={{ overflow: 'hidden' }}>
            <section className='total-price'>实际总价：<span>￥{total_account > 0 ? new BigNumber(parseFloat(total_account)).toFormat(2) + 0 : '0.000'}</span></section>
            <section className='original-price'>商品原总价：<span>￥{originalPrice + 0}</span></section>
          </div>

          <div className='order-info'>
            <section className='title'>费用信息
            {/* {
              status>0&&status<=2?<span className='iconfont iconbianji' style={{ marginLeft: 4 }}></span>:null
            } */}

            </section>
            <div className='info-content-box'>
              <div className='info-content-child'>
                <section><p>实际总价:</p><p>￥{total_account > 0 ? total_account : 0}</p></section>
                <section><p>店铺优惠:</p><p>￥-{shop_coupons}</p></section>
                <section><p>平台优惠:</p><p>￥-{coupons}</p></section>
                <section><p style={{ minWidth: 40 }}>折扣:</p>
                  <p>
                    -￥{
                      showCostEditor ? <Input value={discount} style={{ width: 72 }} onChange={(e) => {
                        this.moneyVlue(e.target.value, 'discount')
                      }} /> : discount
                    }
                  </p>
                </section>
                <section>
                  <p>税费:</p>
                  <p>
                    {
                      showCostEditor ? <Input value={tax} style={{ width: 72 }} onChange={(e) => {
                        this.moneyVlue(e.target.value, 'tax')
                      }} /> : tax
                    }
                  </p>
                </section>
              </div>
              <div className='info-content-child'>
                <section><p>配送费用:</p>
                  <p>
                    {
                      showCostEditor ? <Input value={deliveryPrice} style={{ width: 72 }} onChange={(e) => {
                        this.moneyVlue(e.target.value, 'deliveryPrice')
                      }} /> : deliveryPrice
                    }

                  </p>
                </section>
                <section><p>应付金额:</p><p>￥{
                  // new BigNumber((realityPrice-parseFloat(discount)+parseFloat(deliveryPrice)+parseFloat(tax))).toFormat(2)
                  new BigNumber(should_money).toFormat(2) + '0'
                }</p></section>
                <section><p>实付金额:</p><p>￥{
                  _.get(data, 'order_charge.paid_money', 0) > 0 ? new BigNumber(parseFloat(_.get(data, 'order_charge.paid_money', 0))).toFormat(2) + 0 : '0.000'
                }</p></section>
              </div>
            </div>
            {
              showCostEditor ? <div className='sub-box'>
                <Button type='primary' onClick={this.changeMoney}>确定</Button>
                <Button onClick={() => {
                  this.setState({
                    showCostEditor: false
                  })
                }}>取消</Button>
              </div> : null
            }
          </div>
          <div className='order-info Consignee-info'>
            <section className='title'>订单备注
            </section>
            <div className='info-content-box'>
              <div className='info-content-child'>
                <section><p style={{ marginRight: 5 }}>买家订单备注:</p><p style={{ flexGrow: 1 }}>
                  <span className='-remark'>{remark ? remark : lang.common.isNull}</span>
                </p></section>
              </div>
              <div className='info-content-child'>
                <section><p style={{ marginRight: 5 }}>商家订单备注:</p><p className='seller-remark'>
                  {
                    showSellerEditor ? <Input style={{ width: 140 }} value={sellerRemark} onChange={(e) => {
                      this.setState({
                        sellerRemark: e.target.value
                      })
                    }} /> : sellerRemark
                  }
                  <span className='iconfont' onClick={() => {
                    if (showSellerEditor) {
                      this.editorRemark()
                    }
                    this.setState({
                      showSellerEditor: !showSellerEditor
                    })
                  }}>
                    {showSellerEditor ? '确定' : '编辑'}
                  </span>
                </p></section>
              </div>
            </div>
          </div>
          <Modal
            className='deliver-goods-modal'
            title="发货"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
            width={840}
            destroyOnClose={true}
          >
            <DeliverModel destroyOnClose={true} handleOk={this.handleOk} handleCancel={this.handleCancel} orderData={data} order_sn={data.order_sn} />
          </Modal>
          <Modal
            title="修改收货人信息"
            width={450}
            visible={this.state.visibleRecivew}
            onOk={this.handleRecivewOk}
            onCancel={this.handleRecivewCancel}
            footer={null}
            className='change-money-modal'
          >
            <ChangeRecivewInfo order_sn={data.order_sn} handleOk={this.handleRecivewOk} handleCancel={this.handleRecivewCancel} orderData={data} />
          </Modal>
        </div>
      </div>
    )
  }
}
export default Form.create()(StagesInfo)

