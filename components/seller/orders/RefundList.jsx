import React, {Component, Fragment} from 'react';
import {Tabs, Form, Input, Select, Table, Button, Modal, Row, Col, message} from 'antd';
import Title from '../common/Title';
// import 'moment/locale/zh-cn';
import '../common/style/evaluateList.scss';
import {Link} from 'react-router-dom';
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import moment from 'moment';
import {BigNumber} from 'bignumber.js';
import _ from 'lodash'
import lang from "assets/js/language/config"
import Handling from 'components/common/Handling';
import comUtil from 'utils/common.js'
import $ from "jquery";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router";

const {TabPane} = Tabs;
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


let pageSize = 10;

class RefundList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '订单号',
          dataIndex: 'order_sn',
          key: 'order_sn',
          render: (text, record, index) => {
            return <div className='table-first-data'>{text}</div>
          }
        },
        {
          title: '申请金额',
          dataIndex: 'money',
          key: 'money',
          render: (text, record, index) => {
            return <div>￥{new BigNumber(parseFloat(text)).toFormat(2)}</div>
          }
        },
        {
          title: '申请用户',
          dataIndex: 'buyer_id',
          key: 'buyer_id',
          render: (text, record, index) => {
            return <div>{text}</div>
          }
        },
        {
          title: '申请原因',
          dataIndex: 'reason',
          key: 'reason',
          render: (text, record, index) => {
            return <div className='refundContent-Info'>{_.defaultTo(text, lang.common.isNull)}</div>
          }
        },
        {
          title: '申请理由',
          dataIndex: 'cause',
          key: 'cause',
          render: (text, record, index) => {
            return <div className='refund-Info'>{_.defaultTo(text, lang.common.isNull)}</div>
          }
        },
        {
          title: '申请时间',
          dataIndex: 'create_time',
          key: 'create_time',
          render: (text, record, index) => {
            return <div>{text}</div>
          }
        },
        {
          title: '处理状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, record, index) => {
            return <div>{_.defaultTo(this.order_type(text), lang.common.isNull)}</div>
          }
        },
        {
          title: '操作',
          dataIndex: 'opreat',
          key: 'opreat',
          render: (text, record, index) => {
            return <div className='opreat-box-refundList'>
              {
                record.status == 1 && record.self_shop_id != this.props.loginInfo.shopId
                || record.self_shop_id == null ?
                  <Fragment>
                    <div>
                      <a onClick={() => {
                        this.showModal(record.order_sn)
                      }}>同意</a>
                    </div>
                    <div>
                      <a onClick={() => {
                        this.showRefuseModal(record.order_sn)
                      }}>拒绝</a>
                    </div>
                  </Fragment> : null}
              <Link to={`/seller/orders/refundDetail/${record.order_sn}/${record.id}`}>查看详情</Link>
            </div>
          }
        },
      ],
      data: [],
      visible: false,
      visibleRefuse: false,
      typeCount: {},
      page: 1,
      values: {},
      idList: [],
      selectedRowKeys: [],
      WriteCount: 0,
      refuseReason: '',
      isError: false
    }
    this.onPaginationChange = this.onPaginationChange.bind(this);
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

  SubSearchData = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for (let key in values) {
          if (!values[key]) {
            delete values[key];
          }
        }
        delete values.dealTime;
        this.setState({
          values: values
        }, () => {
          values.size = pageSize;
          values.page = 1;
          // 搜索接口
          this.getListData(values);
        })
      }
    });

    // let Data = getFieldsValue();
    // Data.orderState == '订单状态' ? '' : orderState;
    // Data.orderType == '订单类型' ? '' : orderType;
  }

  onPaginationChange(pageNumber) {
    this.getListData({size: pageSize, page: pageNumber})
  }

  // refundOrder=(id)=>{
  //     httpRequest.get({
  //         url:sellerApi.order.afterSalesList,
  //         data:{
  //             // user_id:parseInt(this.deleteId),
  //            shop_id:parseInt(localStorage.getItem('shopId')),
  //            order_id:id,
  //            // ...values
  //         }
  //       }).then(res =>{
  //             console.log('res',res)
  //       })
  // }

  showModal = (order_sn) => {
    comUtil.confirmModal({
      okText: '确定',
      cancelText: '取消',
      className: 'seller-confirm-modal',
      content: '同意申请后订单取消，平台将款项按支付方式原路返回至买家付款账户',
      title: '同意申请',
      onOk: () => {
        this.handleOk(order_sn);
      }
    })
    // this.setState({
    //     visible: true,
    //     order_sn:order_sn
    // });
  };
  handleOk = order_sn => {
    httpRequest.post({
      url: sellerApi.order.subRefundOrder,
      data: {
        order_sn: order_sn,
        // user_id:parseInt(this.deleteId),
        //    shop_id:parseInt(localStorage.getItem('shopId')),
        //    refund_id:this.state.id,
        // ...values
      }
    }).then(res => {
      message.success('操作成功');
      this.getListData({size: pageSize, page: this.state.page}, 'put')
    });
    // this.getStatusCount();
    this.setState({
      visible: false,
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  showRefuseModal = (order_sn) => {
    this.setState({
      visibleRefuse: true,
      order_sn: order_sn
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
          order_sn: this.state.order_sn,
          cause: refuseReason
        }
      }).then(res => {
        message.success('操作成功')
        this.getListData({size: pageSize, page: this.state.page}, 'put')
      })
      this.setState({
        visibleRefuse: false,
      });
    } else {
      this.setState({
        isError: true
      })
    }
    // this.getStatusCount();

  };
  handleRefuseCancel = e => {
    this.setState({
      visibleRefuse: false,
      isError: false
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    let array = [];
    for (let i = 0; i < selectedRows.length; i++) {
      array.push(selectedRows[i].id);
    }
    this.setState({
      idList: array,
      selectedRowKeys
    })
    //  this.setState({ selectedRowKeys });
  };
  // rowSelection = {
  //     onChange: (selectedRowKeys, selectedRows) => {
  //         let array = [];
  //         for(let i=0;i<selectedRows.length;i++){
  //             array.push(selectedRows[i].id);
  //         }
  //         this.setState({
  //             idList:array,

  //         })
  //     },
  //     getCheckboxProps: record => ({
  //         disabled: record.name === 'Disabled User', // Column configuration not to be checked
  //         name: '',
  //     })
  // };
  componentDidMount() {
    this.getListData({size: pageSize, page: 1});
    // this.getStatusCount();
  }

  getListData = (data, type) => {
    let {status, total, values, idList, page, selectedRowKeys} = this.state;
    let isNowStatus = (status == data.status);
    if (status != 10) {
      data.status = status;
      if (total % pageSize == 1 && type == 'put' && data.page > 1) {
        data.page = data.page - 1;
      }
    }
    Handling.start();
    this.setState({
      page: data.page,
      // idList:page == data.page&&isNowStatus?idList:[],
      idList: [],
      // selectedRowKeys:page == data.page&&isNowStatus?selectedRowKeys:[],
      selectedRowKeys: [],

    })
    for (let key in values) {
      if (!values[key]) {
        delete values[key]
      }
    }
    // console.log(data)
    httpRequest.get({
      url: sellerApi.order.refundList,
      data: {
        // shop_id: parseInt(localStorage.getItem('shopId')),
        ...values,
        ...data
      }
    }).then(res => {
      Handling.stop();
      this.setState({
        data: res.data ? res.data.data : [],
        total: res.data.total,
        typeCount: res.status_count ? res.status_count : {}
      })
    }).catch(() => {
      Handling.stop();
    })
  }

  // getStatusCount=()=>{
  //     httpRequest.get({
  //         url:sellerApi.order.getStatusCount,
  //       }).then(res =>{
  //           this.setState({
  //             typeCount:_.defaultTo(_.get(res,'data',{}),{}),
  //           })
  //       })
  // }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {columns, data, total, typeCount, page, idList, selectedRowKeys, WriteCount, refuseReason, isError} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className='refund-list-page'>
        <Title title={'退款订单'}/>
        <div className='refundList-form-box'>
          <Form layout="inline" onSubmit={this.handleSubmit} labelCol={{span: 8}} wrapperCol={{span: 16}}>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label={'订单编号'}>
                  {getFieldDecorator('order_sn', {})(<Input
                    placeholder="订单编号"
                    style={{width: 160}}
                  />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={'用户名'}>
                  {getFieldDecorator('username', {})(<Input
                    placeholder="用户名"
                    style={{width: 160}}
                  />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <div style={{lineHeight: '40px', display: 'inline-block'}}>
                  <Button type="primary" onClick={this.SubSearchData}>搜索</Button>
                  <Button type="primary" className='no-bg-btn' style={{marginLeft: 12}} onClick={() => {
                    const {idList} = this.state;
                    if (idList.length == 0) {
                      comUtil.confirmModal({
                        okText: '确定',
                        cancelText: '取消',
                        className: 'seller-confirm-modal',
                        content: '请选择要导出的订单',
                        cancelButtonProps: {style: {display: 'none'}},
                        // title:'',
                        onOk: () => {
                          // window.location.href = loc;
                        }
                      })
                      return
                    }
                    Handling.start();
                    httpRequest.get({
                      url: sellerApi.order.refundOrder + '?' + `refund_id_list=[${idList.toString()}]`,
                      // data: {
                      //     order_list:
                      // }
                    }).then(res => {
                      Handling.stop();
                      window.location.href = sellerApi.order.refundOrderDownload + `?file_name=${res.data}`
                    }).catch(() => {
                      Handling.stop();
                    })
                    //   window.location.href = sellerApi.order.refundOrder+'?'+`refund_id_list=[${idList.toString()}]`

                  }}>导出订单</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <Tabs type="card" onChange={(e) => {
          this.setState({
            status: e
          }, () => {
            this.getListData({size: pageSize, page: 1})
          })
          // if(e!=10){
          //     this.setState({
          //         status:e
          //     },()=>{
          //         this.getListData({size:pageSize,page:1})
          //     })
          // }else{
          //     this.setState({
          //         status:10
          //     })
          // }
        }}>
          <TabPane tab="全部订单" key="10">

          </TabPane>
          <TabPane tab={`待处理${typeCount.o1 ? `(${typeCount.o1})` : ''}`} key="1">

          </TabPane>
          <TabPane tab={`已同意${typeCount.o2 ? `(${typeCount.o2})` : ''}`} key="2">

          </TabPane>
          <TabPane tab={`已拒绝${typeCount.o0 ? `(${typeCount.o0})` : ''}`} key="0">

          </TabPane>
        </Tabs>
        <div className='evaluate-list-page'>
          <Table rowKey={(data, index) => {
            return index
          }} dataSource={data} columns={columns} rowSelection={rowSelection}
                 locale={{emptyText: lang.common.tableNoData}}
                 pagination={{
                   pageSize: pageSize,
                   total: total,
                   current: page,
                   showTotal: (total, page) => {
                     if (total < pageSize) {
                       return `共${Math.ceil(total / pageSize)}页，每页${total}条`
                     } else {
                       return `共${Math.ceil(total / pageSize)}页，每页${pageSize}条`
                     }
                   },
                   onChange: (e) => {
                     this.getListData({size: pageSize, page: e})
                   }
                   // size:'small'
                 }}/>
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
            <div className='before-require-content'>确认拒绝取消订单申请？</div>
            {/* <div>
                            <TextArea autosize={{ minRows: 5, maxRows: 8 }} onChange={(e)=>{
                                this.setState({
                                    refundReson:e.target.value
                                })
                            }}/>
                            <div></div>
                        </div> */}
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
const WrappedHorizontalForm = Form.create()(RefundList);
export default connect(mapState, null)(withRouter(WrappedHorizontalForm))
// export default WrappedHorizontalForm


