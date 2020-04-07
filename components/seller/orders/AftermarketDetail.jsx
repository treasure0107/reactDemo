import React, {Component, Fragment} from 'react';
import Title from '../common/Title';
import {Steps, Button, Table, Form, Input, Modal, Tooltip, Col, Row, Cascader, message} from 'antd';
import {CityData} from "assets/js/city";
import moment from 'moment';
import DeliverModel from './common/DeliverModal';
import MoreImgList from 'components/common/MoreImgList';
import {BigNumber} from 'bignumber.js';
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js'
import '../common/style/orderInfo.scss';
import _ from 'lodash'
import lang from "assets/js/language/config"
import $ from "jquery";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";

const dateFormat = 'YYYY-MM-DD HH:mm';
const options = CityData;

const {Step} = Steps;
const confirm = Modal.confirm;
const {TextArea} = Input;
let format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0
}
BigNumber.config({FORMAT: format})

class AftermarketDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '售后详情',
      visible: false,
      visibleRefuse: false,
      WriteCount: 0,
      refuseReason: '',
      isError: false,
      isDisc: true,
      data: {
        after_sale_info: {
          id: 'ID',
          after_sn: '售后单号',
          after_type: '售后类型',
          status: '售后状态',
          money: '售后金额',
          reason: '售后原因',
          images: [
            'image_path 售后图片地址'
          ]
        },
        after_sale_trace: [
          {
            operation: '操作',
            value: '状态',
            create_time: '当前时间',
            creater_id: '当前用户',
            remark: '备注'
          },
        ],
        order_goods: {
          id: 'ID',
          goods_name: '商品名称',
          goods_classify: '商品类型',
          goods_number: '数量',
          money: '单价',
          image_url: '图片地址',
          should_money: '应付金额',
          total_money: '商品总金额'
        },
        order_charge_refund: {
          reason: '退款原因',
          status: '退款状态',
          money: '退款金额',
          pay_type: '退款方式',
          refund_order_trace: [
            {
              operation: '操作方式',
              value: '状态',
              create_time: '操作时间',
              creater_id: '操作用户',
              remark: '备注'
            },
          ],
          shopping_info: {
            consignee: '收货人',
            mobile: '收货人手机号',
            address: '收货人姓名',
            express_type: '配送方式',
            express_company: '物流公司',
            express_sn: '物流单号',
            trance: [
              {
                operation: '操作',
                value: '状态',
                create_time: '操作时间',
                remark: '备注'
              },
            ],
          },
        },
      },
      columns: [
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          render: (text, record, index) => {
            return <div className='goods-info-table-box'>
              <img className='pic-box' src={record.goods_img}/>

              <div>
                <div className='goods-name'>{record.goods_name}</div>
                <div>{record.goods_classify}</div>
              </div>
            </div>
          }
        },
        {
          title: '商品数量',
          dataIndex: 'goods_number',
          key: 'goods_number',
          render: (text, record, index) => {
            return <span>x{text}</span>
          }
        },
        {
          title: '商品单价',
          dataIndex: 'unit_price',
          key: 'unit_price',
          render: (text, record, index) => {
            return <span>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
          }
        },
        {
          title: '商品原总价',
          dataIndex: 'total_price',
          key: 'total_price',
          render: (text, record, index) => {
            return <span
              className='apply-amount'>￥{new BigNumber(parseFloat(record.goods_number) * parseFloat(record.unit_price)).toFormat(2)}</span>
          }
        }
      ],
      tranceList: [
        {
          operation: '买家提交申请',
          create_time: `买家提交申请时间：暂无`
        },
        {
          operation: '商家处理申请',
          create_time: `商家处理时间：暂无`
        },
        {
          operation: '待买家退货',
          create_time: `买家退货时间：暂无`
        },
        {
          operation: '待确认收货',
          create_time: `确认收货时间：暂无`
        },
        {
          operation: '售后完成',
          create_time: ''
        }
      ]
    }
  }

  componentDidMount() {
    // <MoreImgList imglist={list}></MoreImgList>
    this.getData();
  }

  getData = (values) => {
    httpRequest.get({
      url: sellerApi.order.after_saleDetail,
      data: {
        // user_id:parseInt(this.deleteId),
        after_id: this.props.match.params.after_id,
        buyer_id: this.props.match.params.buyer_id,
      }
    }).then(res => {
      this.showStepTime(res.data ? res.data.after_sale_trace : []);
      this.setState({
        data: res.data ? res.data : {},
        self_shop_id: res.data.self_shop_id
      });
      if (res.data.self_shop_id == this.props.loginInfo.shopId) {
        this.setState({
          isDisc: false
        })
      }
    })
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = e => {
    if (_.defaultTo(_.get(this.state.data, 'after_type', '2'), '2') == 1) {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          values.province_id = this.locObj.province;
          values.city_id = this.locObj.city;
          values.area_id = this.locObj.district;
          delete values.locDetail
          httpRequest.post({
            url: sellerApi.order.subAfterSale,
            data: {
              // user_id:parseInt(this.deleteId),
              after_id: this.props.match.params.after_id,
              buyer_id: this.props.match.params.buyer_id,
              ...values
              // buyer_id:this.state.refuseReason,
              // buyer_id:
              //    user_id:parseInt(localStorage.getItem('user_id')),
            }
          }).then(res => {
            this.getData();
            message.success('操作成功')
            // this.props.history.goBack()
          })
        }
      });
    } else {
      httpRequest.post({
        url: sellerApi.order.subAfterSale,
        data: {
          buyer_id: this.props.match.params.buyer_id,
          // user_id:parseInt(this.deleteId),
          after_id: this.props.match.params.after_id,
          // buyer_id:this.state.refuseReason,
          // buyer_id:
          //    user_id:parseInt(localStorage.getItem('user_id')),
        }
      }).then(res => {
        this.getData();
        message.success('操作成功');
        //  this.props.history.goBack()
      })
    }
    this.setState({
      visible: false,
    });
  };

  // 确认收货
  subRecivew = () => {
    comUtil.confirmModal({
      okText: '确定',
      cancelText: '取消',
      className: 'seller-confirm-modal',
      content: '确认已经收到货了吗？',
      // title:'',
      onOk: () => {
        httpRequest.post({
          url: sellerApi.order.subRecivew,
          data: {
            // user_id:parseInt(this.deleteId),
            // shop_id:parseInt(localStorage.getItem('shopId')),
            buyer_id: this.props.match.params.buyer_id,
            after_id: this.props.match.params.after_id
          }
        }).then(res => {
          this.getData();
          message.success('操作成功')
          // this.props.history.goBack()
        })
      }
    })
  }
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  showRefuseModal = () => {
    this.setState({
      visibleRefuse: true,
    });
  };
  handleRefuseOk = e => {
    let refuseReason = $.trim(this.state.refuseReason);
    if (refuseReason) {
      httpRequest.post({
        url: sellerApi.order.cancleAfterSale,
        data: {
          // user_id:parseInt(this.deleteId),
          after_id: this.props.match.params.after_id,
          cause: refuseReason,
          buyer_id: this.props.match.params.buyer_id
          // buyer_id:
          //    user_id:parseInt(localStorage.getItem('user_id')),
        }
      }).then(res => {
        this.getData();
        // this.props.history.goBack();
        message.success('操作成功')
      })
      this.setState({
        visibleRefuse: false,
      });
    } else {
      this.setState({
        isError: true
      })
    }
  };
  handleRefuseCancel = e => {
    this.setState({
      visibleRefuse: false,
      isError: false
    });
  };
  showStepTime = (order_trance) => {
    // let order_trance  = this.state.data.order_trance
    let {tranceList} = this.state;
    for (let i = 0; i < order_trance.length; i++) {
      let create_time;
      if (order_trance[i].create_time) {
        create_time = _.defaultTo(order_trance[i].create_time, lang.common.isNull);
      }
      if (order_trance[i].value == 1) {
        if (create_time != lang.common.isNull) {
          tranceList[0].create_time = `买家提交申请时间：${create_time}`
          tranceList[0].isActive = true;
        }
      } else if (order_trance[i].value == 2) {
        if (create_time != lang.common.isNull) {
          tranceList[1].create_time = `商家处理时间：${create_time}`
          tranceList[1].isActive = true;
        }
      } else if (order_trance[i].value == 3) {
        if (create_time != lang.common.isNull) {
          tranceList[2].create_time = `买家退货时间：${create_time}`
          tranceList[2].isActive = true;
        }
      } else if (order_trance[i].value == 4) {
        if (create_time != lang.common.isNull) {
          tranceList[3].create_time = `确认收货时间：${create_time}`
          tranceList[3].isActive = true;
        }
      }
    }
    // <Step title="未付款" description={`下单时间：${create_time}`} />
    // <Step title="待发货" description={`付款时间：${pay_time}`} />
    // <Step title="待收货" description={`发货时间：${send_time}`} />
    // <Step title="交易成功" description={`确认收货时间：${receive_time}`} />

    this.setState({
      tranceList: tranceList
    })
  }
  status_type = (type, status) => {
    // 0：库存类，1: 定制类，2：生产类
    let text = '';
    if (type == 0) {
      switch (status) {
        case 0:
          text = '售后失败'
          break;
        case 1:
          text = '处理中'
          break;
        case 4:
          text = '售后成功'
          break;
        // case 3:
        //     text = '售后失败'
        //     break;
      }
    } else {
      switch (status) {
        case 0:
          text = '售后失败'
          break;
        case 1:
          text = '处理中'
          break;
        case 2:
          text = '待退货'
          break;
        case 3:
          text = '待卖家收货'
          break;
        case 4:
          text = '售后成功'
          break;
        // case 5:
        //     text = '售后失败'
        //     break;
      }
    }

    return text
  }
  locObj = {}

  render() {
    let {getFieldDecorator} = this.props.form;
    let {columns, dataSource, WriteCount, refuseReason, data, tranceList, isError, isDisc, self_shop_id} = this.state;
    let money = _.defaultTo(_.get(data, 'money', '0'), '0');
    let reason = _.defaultTo(_.get(data, 'reason', lang.common.isNull), lang.common.isNull);
    let after_sn = _.defaultTo(_.get(data, 'after_sn', lang.common.isNull), lang.common.isNull);
    let after_type = _.defaultTo(_.get(data, 'after_type', '2'), '2');
    let images = _.defaultTo(_.get(data, 'images', []), []);

    let cause = _.defaultTo(_.get(data, 'cause', lang.common.isNull), lang.common.isNull);
    let status = _.defaultTo(_.get(data, 'status', 0), 0);
    let shopping_info = _.defaultTo(_.get(data, 'shopping_info', {}), {});
    return (
      <div>
        <Title title={this.state.titleContent}/>
        <div className='order-info-page'>
          {
            after_type == 0 ? <Steps progressDot current={status}>
                {
                  tranceList.map((item, index) => {
                    if (index < 2) {
                      return <Step title={item.operation} description={item.create_time} key={index}/>
                    }
                  })
                }
                <Step title="售后成功" description=""/>
              </Steps> :
              <Steps progressDot current={status}>
                {
                  tranceList.map((item, index) => {
                    return <Step title={item.operation} description={item.create_time} key={index}/>
                  })
                }
                {/* <Step title="买家提交申请" description={`买家提交申请时间：${create_time}`} />
                        <Step title="商家处理申请" description={`商家处理时间：${pay_time}`} />
                        <Step title="待买家退货" description={`买家退货时间：${send_time}`} />
                        <Step title="待确认收货" description={`确认收货时间：${receive_time}`} />
                        <Step title="售后完成" description="" /> */}
              </Steps>
          }

          <div className='steps-next'>
            <div style={{fontSize: 12}}>
              {
                status == 1 ?
                  <section>您可操作”同意”同意申请后，平台将款项按支付方式原路返回至买家付款账户，或拒绝申请，填写拒绝理由</section>
                  : <section>当前订单状态：{this.status_type(after_type, status)}</section>
              }
            </div>
            <section>
              {
                status == 1 ? <div>
                  {isDisc || self_shop_id == null ?
                    <Fragment>
                      <Button type="primary" onClick={this.showModal}>同意</Button>
                      <Button onClick={this.showRefuseModal} className='blue-btn'>拒绝</Button>
                    </Fragment> : null}
                </div> : status == 3 ?
                  <Tooltip placement="bottom" title={<div>
                    <section>退货方式：{
                      shopping_info.express_type == 1 ?
                        '自配送' : shopping_info.express_type == 0 ? '普通快递' : lang.common.isNull
                    }</section>
                    <section>退货物流：{
                      shopping_info.express_company
                    }</section>
                    <section>物流单号：{shopping_info.express_sn}</section>
                  </div>}>
                    <Button type="primary" onClick={this.subRecivew}>确认收货</Button>
                  </Tooltip> : null
              }
            </section>
          </div>
          <div className='order-info'>
            <section className='title'>售后信息</section>
            <div className='info-content-box'>
              <div className='info-content-child'>
                <section className='grow-box'><p>售后编号：</p><p className='grow-box'>{after_sn}</p></section>
                <section className='grow-box'><p>申请类型：</p><p className='grow-box'>
                  {
                    after_type == 0 ? '仅退款' : after_type == 1 ? '退货退款' : lang.common.isNull
                  }
                </p></section>
                <section className='grow-box'><p>申请金额：</p><p
                  className='grow-box'>￥{new BigNumber(parseFloat(money)).toFormat(2)}</p></section>
                <section className='grow-box'><p>申请原因：</p><p className='grow-box'>{reason}</p></section>
              </div>
            </div>
          </div>
          <div className='apply-reason-aftermarketDetail'>
            <div className='title'>申请理由：</div>
            <div className='content'>
              <div>{cause}</div>
              <div className='pic-box-aftermarketDetail'>
                {/* {
                                    images.map((item,index)=>{
                                        return <img src={item.image_path} key={index}/>
                                    })
                                } */}
                <MoreImgList imglist={images}></MoreImgList>
                {/* <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div> */}
              </div>
            </div>
          </div>
          <div className='order-info'>
            <section className='title'>商品信息</section>
          </div>
          <Table rowKey={(data, index) => index} dataSource={data.order_goods ? [data.order_goods] : []}
                 columns={columns} pagination={false} locale={{emptyText: lang.common.tableNoData}}
          />
        </div>
        <Modal
          className='admin-modal-confirm admin-form-box'
          title="确认同意售后申请？"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='同意申请'
          cancelText='取消'
        >
          <div className='content-box'>同意申请后，平台将款项按支付方式原路返回至买家付款账户？</div>
          {
            after_type == 1 ? <Form className="order-search-form" labelCol={{span: 5}} wrapperCol={{span: 18}}>
              <Row gutter={24}>
                <Col span={20}>
                  <Form.Item label="退货地址">
                    {getFieldDecorator('locDetail', {
                      // initialValue: data.locDetail,
                      rules: [
                        {
                          required: true, message: '该项不能为空',
                        }
                      ]
                    })(
                      <Cascader displayRender={(e, b) => {
                        if (b[1]) {
                          this.locObj.city = b[1].value + '_' + b[1].label
                        }
                        if (b[0]) {
                          this.locObj.province = b[0].value + '_' + b[0].label
                        }
                        if (b[2]) {
                          this.locObj.district = b[2].value + '_' + b[2].label
                        }
                        return e
                      }} options={options} placeholder={'请选择'} style={{width: 240}}/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={20}>
                  <Form.Item label={'详细地址'}>
                    {getFieldDecorator('address', {
                      //  initialValue: data.address,
                      rules: [
                        {
                          required: true, message: '该项不能为空且不超过30个字', max: 30, whitespace: true
                        }
                      ],
                    })(<Input placeholder="" style={{width: 240}}/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={20}>
                  <Form.Item label={'手机号码'}>
                    {getFieldDecorator('mobile', {
                      //  initialValue: data.address,
                      rules: [
                        {
                          required: true, message: '请输入正确的手机号', pattern: comUtil.phoneReg, whitespace: true
                        }
                      ],
                    })(<Input placeholder="" style={{width: 240}}/>)}
                  </Form.Item>
                </Col>
              </Row>
            </Form> : null
          }
        </Modal>
        {/* <Modal
                    title="拒绝申请"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText='确定'
                    cancelText='取消'
                >
                    <DeliverModel />
                </Modal> */}
        <Modal
          title="确认拒绝售后申请？"
          visible={this.state.visibleRefuse}
          onOk={this.handleRefuseOk}
          onCancel={this.handleRefuseCancel}
          okText='确认拒绝'
          cancelText='取消'
        >
          <div>
            <div className='textArea-limit-box'>
                            <TextArea className={isError ? 'seller-error-box' : ''} placeholder='拒绝理由'
                                      value={refuseReason} autosize={{minRows: 6, maxRows: 8}} onChange={(e) => {
                              if (e.target.value.length > 200) {
                                e.target.value = refuseReason;
                                return;
                              }
                              if (e.target.value && e.target.value.length && $.trim(e.target.value).length > 0) {
                                let trimValue = $.trim(e.target.value);
                                this.setState({
                                  WriteCount: trimValue && trimValue.length,
                                  refuseReason: e.target.value,
                                  isError: false
                                })
                              } else {
                                this.setState({
                                  WriteCount: 0,
                                  refuseReason: e.target.value,
                                  isError: true
                                })
                              }
                            }}/>
              <div className='textArea-limit'>{WriteCount}/200字</div>
            </div>
            {
              isError ? <div className='seller-error-message'>
                该项不能为空
              </div> : null
            }
          </div>
        </Modal>
      </div>
    )
  }
}

const mapState = (state) => ({
  loginInfo: state.sellerLogin.loginInfo
});
const AftermarketDetailForm = Form.create()(AftermarketDetail);
export default connect(mapState, null)(withRouter(AftermarketDetailForm))
// export default Form.create()(AftermarketDetail)

