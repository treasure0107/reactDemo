import React, {Component, Fragment} from 'react';
import Title from '../common/Title';
import {Steps, Button, Table, Form, Input, Modal, message} from 'antd';
import DeliverModel from './common/DeliverModal';
import '../common/style/orderInfo.scss';
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import moment from 'moment';
import {BigNumber} from 'bignumber.js';
import _ from 'lodash'
import {withRouter} from 'react-router';
import lang from "assets/js/language/config"
import MoreImgList from 'components/common/MoreImgList';
import comUtil from 'utils/common.js'
import $ from "jquery";
import connect from "react-redux/es/connect/connect";

const {Step} = Steps;
const confirm = Modal.confirm;
const {TextArea} = Input;
const dateFormat = 'YYYY-MM-DD HH:mm';
let format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0
}
BigNumber.config({FORMAT: format})

class RefundDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '退款详情',
      visible: false,
      visibleRefuse: false,
      showCostEditor: false,
      WriteCount: 0,
      refuseReason: '',
      originalPrice: 0,
      isError: false,
      self_shop_id: "",
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
      OpreatColumns: [{
        title: '操作人ID',
        dataIndex: 'creator_id',
        key: 'creator_id',
        render: (text, record, index) => {
          return <span>{text}</span>
        }
      }, {
        title: '操作时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (text, record, index) => {
          return <span>{text}</span>
        }
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record, index) => {
          return <span>{text}</span>
        }
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: (text, record, index) => {
          return <span>{text}</span>
        }
      }],
      OpreatDataSource: [
        {
          key: '1',
          opreatId: 'Coral',
          opreatTime: '2019-5-26 09:39:26',
          opreat: '同意退款',
          remark: '不想要了',
        },
      ],
      data: {}
    }
  }

  componentDidMount() {
    // refundOrderDetail
    this.getData();
  }

  getData = (values) => {
    httpRequest.get({
      url: sellerApi.order.refundOrderDetail,
      data: {
        order_sn: this.props.match.params.order_sn,
        refund_id: this.props.match.params.refund_id
        // user_id:parseInt(this.deleteId),
        //    after_id:parseInt(localStorage.getItem('shopId')),
        //    user_id:parseInt(localStorage.getItem('user_id')),
      }
    }).then(res => {
      console.log("res.data...", res.data);
      this.setState({
        data: res.data,
        self_shop_id: res.data.self_shop_id,
      })
      this.getOriginalPrice(res.data.order_goods)
    })
  }

  showModal = () => {
    comUtil.confirmModal({
      okText: '确定',
      cancelText: '取消',
      className: 'seller-confirm-modal',
      content: '同意申请后订单取消，平台将款项按支付方式原路返回至买家付款账户',
      title: '同意申请',
      onOk: () => {
        this.handleOk();
      }
    })
    // this.setState({
    //     visible: true,
    // });
  };
  handleOk = e => {
    httpRequest.post({
      url: sellerApi.order.subRefundOrder,
      data: {
        order_sn: this.props.match.params.order_sn,
      }
    }).then(res => {
      message.success('操作成功')
      this.getData();
      // this.props.history.goBack()
    })
    this.setState({
      visible: false,
    });
  };
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
      httpRequest.put({
        url: sellerApi.order.cancleRefundOrder,
        data: {
          // user_id:parseInt(this.deleteId),
          // shop_id:parseInt(localStorage.getItem('shopId')),
          order_sn: this.props.match.params.order_sn,
          cause: refuseReason
        }
      }).then(res => {
        message.success('操作成功');
        this.getData();
        // this.props.history.goBack()
      })
      this.setState({
        visibleRefuse: false,
      });
    } else {
      this.setState({
        isError: true,
      });
    }

  };
  handleRefuseCancel = e => {
    this.setState({
      visibleRefuse: false,
      isError: false
    });
  };
  // 获取原价
  getOriginalPrice = (tableList) => {
    let {originalPrice} = this.state;
    for (let i = 0; i < tableList.length; i++) {
      originalPrice = parseFloat(originalPrice) + (parseFloat(tableList[i].goods_number) * parseFloat(tableList[i].unit_price))
    }
    this.setState({
      originalPrice: new BigNumber(originalPrice).toFormat(2)
    })
  }

  order_type = (text) => {
    // 0：库存类，1: 定制类，2：生产类
    switch (text) {
      case 0:
        text = '已拒绝'
        break;
      case 1:
        text = '待处理'
        break;
      case 2:
        text = '已同意'
        break;
    }
    return text
  }

  render() {
    // let { getFieldDecorator } = this.props.form;
    let {columns, OpreatColumns, data, refuseReason, WriteCount, originalPrice, isError, self_shop_id} = this.state;
    let {status} = data;
    let reason = _.defaultTo(_.get(data, 'reason', lang.Null), lang.Null);
    let pay_sn = _.defaultTo(_.get(data, 'pay_sn', lang.Null), lang.Null);
    let total_account = new BigNumber(parseFloat(_.defaultTo(_.get(data, 'order_chargs.total_account', 0), 0))).toFormat(2);
    let shop_coupons = new BigNumber(parseFloat(_.defaultTo(_.get(data, 'order_chargs.shop_coupons', 0), 0))).toFormat(2);
    let coupons = new BigNumber(parseFloat(_.defaultTo(_.get(data, 'order_chargs.coupons', 0), 0))).toFormat(2);
    let discount = new BigNumber(parseFloat(_.defaultTo(_.get(data, 'order_chargs.discount', 0), 0))).toFormat(2);
    let shopping_money = new BigNumber(parseFloat(_.defaultTo(_.get(data, 'order_chargs.shopping_money', 0), 0))).toFormat(2);
    let tax = new BigNumber(parseFloat(_.defaultTo(_.get(data, 'order_chargs.tax', 0), 0))).toFormat(2);
    let should_money = new BigNumber(parseFloat(_.defaultTo(_.get(data, 'order_chargs.should_money', 0), 0))).toFormat(2);
    let paid_money = new BigNumber(parseFloat(_.defaultTo(_.get(data, 'order_chargs.paid_money', 0), 0))).toFormat(2);
    let money = new BigNumber(parseFloat(_.defaultTo(_.get(data, 'money', 0), 0))).toFormat(2);
    let cause = _.defaultTo(_.get(data, 'cause', lang.Null), lang.Null);
    let images = _.defaultTo(_.get(data, 'images', []), []);
    // let after_type = _.defaultTo(_.get(data,'after_type',3),3);
    return (
      <div>
        <Title title={this.state.titleContent}/>
        <div className='order-info-page'>
          <div className='page-introduce-refund'>
            *用户在商品未发货状态申请退款，同意申请后订单取消，平台将款项按支付方式原路返回至买家付款账户
          </div>
          <div className='steps-next'>
            <div style={{fontSize: 12}}>
              {
                status == 1 ? <Fragment>
                  <section>当前状态：用户提交售后状态，等待您审核</section>
                  <section>您可操作”同意”同意申请后，平台将款项按支付方式原路返回至买家付款账户，或拒绝申请，填写拒绝理由</section>
                </Fragment> : <section>{`当前状态：${this.order_type(status)}`}</section>
              }

            </div>
            {self_shop_id && self_shop_id == this.props.loginInfo.shopId ? null : <Fragment>
              {
                status == 1 ? <section>
                  <Button type="primary" onClick={this.showModal}>同意 </Button>
                  <Button onClick={this.showRefuseModal} className='blue-btn'>拒绝</Button>
                </section> : null
              }
            </Fragment>}
          </div>
          <div className='order-info'>
            <section className='title'>售后信息</section>
            <div className='info-content-box'>
              <div className='info-content-child'>
                <section className='grow-box'><p>退款编号：</p><p className='grow-box'>{pay_sn}</p></section>
                <section className='grow-box'><p>申请类型：</p><p className='grow-box'>  {
                  '仅退款'
                  // after_type == 0?'仅退款':after_type ==1 ?'退货退款':lang.common.isNull
                }</p></section>
                <section className='grow-box'><p>申请金额：</p><p className='grow-box'>￥{money}</p></section>
                <section className='grow-box'><p>申请原因：</p><p className='grow-box'>{reason}</p></section>
              </div>
            </div>
          </div>
          <div className='apply-reason-aftermarketDetail'>
            <div className='title'>申请理由：</div>
            <div className='content'>
              <div>{cause}</div>
              <div className='pic-box-aftermarketDetail'>
                <MoreImgList imglist={images}></MoreImgList>
                {/* {
                                    images.map((item,index)=>{
                                        return <img src={item.image_path} key={index}/>
                                    })
                                } */}
              </div>
            </div>
          </div>
          <div className='order-info'>
            <section className='title'>商品信息</section>
          </div>
          <Table rowKey={(data, index) => index} dataSource={_.get(data, 'order_goods', [])} columns={columns}
                 pagination={false} locale={{emptyText: lang.common.tableNoData}}/>
          <div style={{overflow: 'hidden'}}>
            <section className='total-price'>实际总价：<span>￥{total_account}</span></section>
            <section className='original-price'>商品原总价：<span>￥{originalPrice}</span></section>
          </div>
          {/* <div className='total-price-refund-detail'>
                        商品总价:<span>￥{total_account}</span>
                    </div> */}
          <div className='order-info'>
            <section className='title'
              // style={{ width: 150,cursor:'pointer' }}
              // onClick={() => {
              // this.setState({
              //     showCostEditor: !showCostEditor
              // })
              // }}
            >费用信息
              {/* <span className='iconfont iconbianji' style={{ marginLeft: 4 }}></span> */}
            </section>
            <div className='info-content-box'>
              <div className='info-content-child'>
                <section><p>实际总价：</p><p>￥{total_account}</p></section>
                <section><p>店铺优惠:</p><p>-￥{shop_coupons}</p></section>
                <section><p>平台优惠:</p><p>￥-{coupons}</p></section>
                <section><p style={{minWidth: 40}}>折扣:</p>
                  <p>
                    -￥{discount}
                  </p>
                </section>
                <section><p>配送费用:</p>
                  <p>
                    ￥{shopping_money}
                  </p>
                </section>
              </div>
              <div className='info-content-child'>
                <section>
                  <p>税费:</p>
                  <p>
                    ￥{tax}
                  </p>
                </section>
                <section><p>应付金额:</p><p>￥{should_money}</p></section>
              </div>
            </div>
          </div>
          <div className='total-price-refund-detail'>
            实付金额:<span>￥{paid_money}</span>
          </div>
          <div className='order-info'>
            <section className='title'>操作日志</section>
          </div>

          {/* <div>
                        <div>操作信息</div>
                        <TextArea autosize={{ minRows: 5, maxRows: 8 }} />
                        <Button>同意申请</Button>
                        <Button>拒绝申请</Button>
                    </div> */}
          <Table dataSource={data.traces} columns={OpreatColumns} pagination={false} rowKey={(data, index) => index}
                 locale={{emptyText: lang.common.tableNoData}}/>
        </div>
        <Modal
          className='admin-modal-confirm'
          title="同意申请"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='同意申请'
          cancelText='取消'
        >
          <div className='content-box'>同意申请后订单取消，平台将款项按支付方式原路返回至买家付款账户</div>
        </Modal>
        <Modal
          title="拒绝申请"
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
const RefundDetailForm = Form.create()(RefundDetail);
export default connect(mapState, null)(withRouter(RefundDetailForm))
// export default withRouter(Form.create()(RefundDetail))

