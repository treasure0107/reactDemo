import React, {Component} from 'react';

import {Tabs, Table, Form, Row, Col, Input, Select, DatePicker, Button, Modal, Tooltip, Icon} from 'antd';
import moment from 'moment';

import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import {Link} from 'react-router-dom';
import {BigNumber} from 'bignumber.js';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {withRouter} from 'react-router';
import Handling from 'components/common/Handling';
import lang from "assets/js/language/config"
import comUtil from 'utils/common.js'

import '../../common/style/business.scss'

let format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0
}
BigNumber.config({FORMAT: format})
const Searchdate = 'YYYY-MM-DD';

const {RangePicker} = DatePicker;

const {Option} = Select;
const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD HH:mm';

let pageSize = 10;

class CouponIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '订单号',
          dataIndex: 'order_sn',
          key: 'order_sn',
          render: (text, record, index) => {
            return <div>
              {text}
            </div>
          }
        },
        {
          title: '订单总额',
          dataIndex: 'order_money',
          key: 'order_money',
          render: (text, record, index) => {
            return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
          }
        },
        {
          title: '优惠金额',
          dataIndex: 'coupons_total_money',
          key: 'coupons_total_money',
          render: (text, record, index) => {
            return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
          }
        },
        {
          title: '买家实付金额',
          dataIndex: 'actual_pay_money',
          key: 'actual_pay_money',
          render: (text, record, index) => {
            return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
          }
        },
        {
          title: '补贴金额',
          dataIndex: 'mall_allowance_money',
          key: 'mall_allowance_money',
          render: (text, record, index) => {
            return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
          }
        },
        {
          title: '技术服务费金额',
          dataIndex: 'service_money',
          key: 'service_money',
          render: (text, record, index) => {
            return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
          }
        },
        {
          title: '分销佣金',
          dataIndex: 'brokerage',
          key: 'brokerage',
          render: (text, record, index) => {
            return <span className='apply-amount'>￥{new BigNumber(parseFloat(text || 0)).toFormat(2)}</span>
          }
        },
        {
          title: '退款金额',
          dataIndex: 'return_money',
          key: 'return_money',
          render: (text, record, index) => {
            return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
          }
        },
        {
          title: '应结算金额',
          dataIndex: 'create_time1',
          key: 'create_time1',
          render: (text, record, index) => {
            return <span
              className='apply-amount'>￥{new BigNumber(parseFloat(record.settlement_money)).toFormat(2)}</span>
          }
        }, {
          title: '实际结算金额',
          dataIndex: 'settlement_money',
          key: 'settlement_money',
          render: (text, record, index) => {
            return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
          }
        }, {
          title: '结算完成时间',
          dataIndex: 'create_time',
          key: 'create_time',
          render: (text, record, index) => {
            return <span>{moment.unix(text).format(dateFormat)}</span>
          }
        }, {
          title: '结算状态',
          dataIndex: 'pay_status',
          key: 'pay_status',
          render: (text, record, index) => {
            return <span>{text == 0 ? '待结算' : text == 2 ? '已结算' : '未结算'}</span>
          }
        }, {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          render: (text, record, index) => {
            return <span>{text}</span>
          }
        },
      ],
      data: [],
      idList: [],
      visible: false,
      total: 0,
      selectedRowKeys: []
    }
  }

  componentDidMount() {
    // 财富统计点击订单号跳转过来
    const order_sn = comUtil.getQueryString('orderSn')
    if (order_sn) {
      this.props.form.setFieldsValue({
        order_sn,
      }, () => {
        this.SubSearchData()
      });
    } else {
      if (this.props.activeKey == '0') {
        this.getListData({
          size: pageSize,
          page: 1,
          pay_status: 2
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeKey == '0' && nextProps.activeKey != this.props.activeKey) {
      this.getListData({
        size: pageSize,
        page: 1,
        pay_status: 2
      })
    }
  }

  getListData = (values) => {
    Handling.start();
    httpRequest.get({
      url: sellerApi.business.settlementList,
      data: {
        ...values
      }
    }).then(res => {
      Handling.stop();
      this.setState({
        data: _.get(res, 'data.result', []),
        total: _.get(res, 'data.count', 0),
        idList: [],
        selectedRowKeys: [],
        page: values.page
      })
    }).catch(() => {
      Handling.stop();
    })
  }

  SubSearchData = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.dealTime && values.dealTime.length > 0) {
          values.start_time = moment(values.dealTime[0]).format(Searchdate);
          values.end_time = moment(values.dealTime[1]).format(Searchdate);
        }
        for (let key in values) {
          if (!values[key]) {
            delete values[key];
          }
        }
        values.size = pageSize;
        values.page = 1;
        values.pay_status = 2;
        delete values.dealTime;
        // 搜索接口
        this.getListData(values);
      }
    });

    // let Data = getFieldsValue();
    // Data.orderState == '订单状态' ? '' : orderState;
    // Data.orderType == '订单类型' ? '' : orderType;
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = e => {
    this.setState({
      visible: false,
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let array = [];
    for (let i = 0; i < selectedRows.length; i++) {
      array.push(selectedRows[i].order_sn);
    }
    this.setState({
      idList: array,
      selectedRowKeys,
    })
    //  this.setState({ selectedRowKeys });
  };

  render() {
    const {columns, data, total, selectedRowKeys, idList} = this.state;
    const {getFieldDecorator, getFieldsValue} = this.props.form;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <div className='account-Info-box'>
          <div className='form-box'>
            <Form layout="inline" onSubmit={this.handleSubmit} labelCol={{span: 6}} wrapperCol={{span: 18}}>
              <Row gutter={24}>
                <Col span={6} style={{paddingRight: 0}}>
                  <Form.Item label={'订单号'}>
                    {getFieldDecorator('order_sn', {})(<Input
                      placeholder="订单号"
                      style={{width: 160}}
                    />)}
                  </Form.Item>
                </Col>
                <Col span={16} style={{paddingLeft: 0}}>
                  <Form.Item label="查询时段">
                    {getFieldDecorator('dealTime')(
                      <RangePicker format={Searchdate} placeholder={['开始时间', '结束时间']}/>
                    )}
                  </Form.Item>
                  <div style={{lineHeight: '40px', display: 'inline-block'}}>
                    <Button type="primary" onClick={this.SubSearchData}>搜索</Button>
                    <Button type="primary" className='no-bg-btn' style={{marginLeft: 12}} onClick={() => {
                      if (idList.length == 0) {
                        comUtil.confirmModal({
                          okText: '确定',
                          cancelText: '取消',
                          className: 'seller-confirm-modal',
                          content: '请选择要导出的结算订单',
                          cancelButtonProps: {style: {display: 'none'}},
                          // title:'',
                          onOk: () => {
                            // window.location.href = loc;
                          }
                        })
                        return;
                      }
                      // return
                      Handling.start();
                      httpRequest.get({
                        url: sellerApi.business.profit_export + '?' + `order_list=[${idList.toString()}]`
                      }).then(res => {
                        Handling.stop();
                        window.location.href = sellerApi.business.profit_down + `?file_name=${res.data}`
                      }).catch(() => {
                        Handling.stop();
                      })
                    }}>导出订单</Button>
                  </div>
                </Col>
                {/* <Col span={6}>
                                <Form.Item label={'结算状态'}>
                                    {getFieldDecorator('order_type', {
                                        initialValue:''
                                        // rules: [{ required: true, message: 'Please input your username!' }],
                                    })(
                                        <Select size={'default'} style={{ width: 160 }}>
                                            <Option key={'全部订单'} value={''}>{'全部订单'}</Option>
                                            <Option key={'库存商品订单'} value={0}>{'库存商品订单'}</Option>
                                            <Option key={'生成商品订单'} value={2}>{'生成商品订单'}</Option>
                                            <Option key={'定制商品订单'} value={1}>{'定制商品订单'}</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col> */}
              </Row>
              {/* <Row gutter={24} className='timer-row'>
                            <Col span={16}>
                                <Form.Item label="查询时段">
                                    <LocaleProvider locale={zh_CN}>
                                        {getFieldDecorator('dealTime')(
                                            <RangePicker format={dateFormat} style={{width:350}}/>
                                        )}
                                    </LocaleProvider>
                                </Form.Item>
                                <div style={{lineHeight:'40px',display:'inline-block'}}>
                                    <Button type="primary" onClick={this.SubSearchData}>搜索</Button>
                                    <Button type="primary" className='no-bg-btn' style={{ marginLeft: 12 }}>导出订单</Button>
                                </div>
                            </Col>
                        </Row> */}
            </Form>
          </div>


          <Table rowKey={(data, index) => index} dataSource={data} columns={columns}
                 rowSelection={rowSelection}
                 locale={{emptyText: lang.common.tableNoData}}
                 pagination={{
                   total: total,
                   showTotal: (total, page) => {
                     if (total < pageSize) {
                       return `共${Math.ceil(total / pageSize)}页，每页${total}条`
                     } else {
                       return `共${Math.ceil(total / pageSize)}页，每页${pageSize}条`
                     }
                   },
                   pageSize: pageSize,
                   onChange: (e) => {
                     this.getListData({
                       page: e,
                       size: pageSize,
                       pay_status: 2
                     })
                   },
                   current: this.state.page

                   //   size: 'small'
                 }}/>
        </div>
      </div>
    )
  }
}

export default withRouter(Form.create()(CouponIndex))


