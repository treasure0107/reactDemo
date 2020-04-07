import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router";

import {Popover, Checkbox, Button, Modal, Form, Input, message} from 'antd';
import {Link} from 'react-router-dom';
import DeliverModel from './DeliverModal';
import ChangeMoneyModal from './ChangeMoneyModal';
import comUtil from 'utils/common.js'
import httpRequest from 'utils/ajax';
import {sellerApi, SFAPI} from 'utils/api';
import moment from 'moment';
import SellerIm from "components/common/SellerImIcon";
import ChangeRecivewInfo from './ChangeRecivewInfo';
import FileSaver from 'file-saver';
import lang from "assets/js/language/config";
import PreflightReport from 'components/common/PreflightReport';
import Handling from 'components/common/Handling';
import Order_defult_img from 'seller/images/order_defult_img.png';
import $ from "jquery";
import "./style/listtabledetail.scss";
import connect from "react-redux/es/connect/connect";

const {TextArea} = Input;
const dateFormat = 'YYYY-MM-DD HH:mm';

const fileTypeMustDownload = comUtil.fileTypeMustDownload;

const remarkText = [
  '文件已下载处理',
  '文件存在问题，需与买家沟通'
]

class ListTableDetail extends Component {
  constructor(props) {
    super(props)
    this.props.onRef(this)

    this.state = {
      checkedList: [],
      checkAll: false,
      visible: false,
      visibleMoney: false,
      // 0代表取消
      editorIndex: 0,
      orderData: {},
      ImIframeVisible: false,
      visibleRecivew: false,
      visibleSub: false,
      sfPopBoxPreflightReportVisible: false,
      sfJobData: "",
      preflightReportData: "",
      visibleRemark: false,	// 备注弹窗显示
      visibleRatify: false,
      order_sn: "",
      pickUpNumber: "",
      orderSn: '',	// 订单号
      remark: '',		// 备注
      deliveryWarnModal: false,  // 退款点击发货时的提醒弹窗
      refund: ''    // 退款id
    };
    this.onCheckAllChange = this.onCheckAllChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.jumpToOperationPage = this.jumpToOperationPage.bind(this);
    this.checkPreflightReport = this.checkPreflightReport.bind(this);
    this.openBoxPreflightReport = this.openBoxPreflightReport.bind(this);
    this.closeBoxPreflightReport = this.closeBoxPreflightReport.bind(this);
    this.getSFJob = this.getSFJob.bind(this);
    this.getSFJobFilesData = this.getSFJobFilesData.bind(this);
    this.getSFJobFilePreflightReportData = this.getSFJobFilePreflightReportData.bind(this);
    this.handleRemarkOk = this.handleRemarkOk.bind(this);
    this.handleRemarkCancel = this.handleRemarkCancel.bind(this);
    this.toRemark = this.toRemark.bind(this);
    this.onRemarkChange = this.onRemarkChange.bind(this);
    this.handleRatifyOk = this.handleRatifyOk.bind(this);
    this.handleRatifyCancel = this.handleRatifyCancel.bind(this);
    this.handleaAfterClose = this.handleaAfterClose.bind(this);
    this.handlePickUp = this.handlePickUp.bind(this);
  }

  componentDidMount() {
    let checkTypeList = [];
    for (let i = 0; i < this.props.data.length; i++) {
      checkTypeList.push({
        type: false, value: this.props.data[i].order_sn
      });
    }

    this.setState({
      checkedList: checkTypeList
    });
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.data != nextprops.data) {
      let checkTypeList = [];
      for (let i = 0; i < nextprops.data.length; i++) {
        checkTypeList.push({type: false, value: nextprops.data[i].order_sn});
      }
      this.setState({
        checkedList: checkTypeList,
        checkAll: false
      });
    }
  }

  showModal = (data,) => {
    this.setState({
      visible: true,
      orderData: data
    });
  };

  // 发货 成功
  handleOk = e => {
    this.props.getListData({
      page: this.props.page,
      size: this.props.pageSize
    }, 'put')
    // this.props.getStatusCount();
    this.setState({
      visible: false,
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  showMoneyModal = (data) => {
    this.setState({
      visibleMoney: true,
      orderData: data
    });
  };
  // 修改钱成功
  handleMoneyOk = e => {
    this.props.getListData({
      page: this.props.page,
      size: this.props.pageSize
    })
    // this.props.getStatusCount();
    this.setState({
      visibleMoney: false,
    });
  };
  handleMoneyCancel = e => {
    this.setState({
      visibleMoney: false,
    });
  };

  showRecivewModal = (data) => {
    this.setState({
      visibleRecivew: true,
      orderData: data
    });
  };


  handleDownloadOk = () => {
    // var a = document.createElement("a");
    // a.href = "https://www.test.papa4print.com/api-job/jobs/2BD35580A45011E9A9B4E13D570BA202/files/b1a8ed86-f3e4-476b-8461-30ee0aee1412/download?attachment=true&filename=10";
    // a.download = "test.mp3";
    // a.click();
    window.location.href = this.state.loc;
    this.setState({
      visibleDownload: false,
    });
  };
  handleDownloadCancel = e => {
    this.setState({
      visibleDownload: false,
    });
  };

  showDownloadModal = (loc, fileName, orderSn, printStatus, templateId) => {
    let _this = this;

    // this.setState({
    //     visibleDownload: true,
    //     loc:loc
    // });
    comUtil.confirmModal({
      okText: '确定',
      cancelText: '取消',
      className: 'seller-confirm-modal',
      content: '用户还未确认哦，建议您等用户确认后再进行下载。',
      // title:'',
      onOk: () => {
        _this.dlFile(loc, fileName, orderSn, printStatus, templateId, true);
      }
    })
  };

  dlFile(url, fileName, orderSn, printStatus, templateId, isUnconfirmed) {
    const fileTypeOne = fileName.split('.').pop()
    const fileTypeTwo = url.split('.').pop()
    if (printStatus == 1) { // 文件已确认
      orderSn = orderSn + '.' + fileTypeOne
    } else if (printStatus === 0) { // 文件未确认
      if (templateId > 0) { // 图帮主模板选择的文件
        orderSn = orderSn + '.' + fileTypeTwo
      } else {
        orderSn = orderSn + '.' + fileTypeOne
      }
    }
    // 未确认文件，文件名加上标识
    if (isUnconfirmed) {
      const orderSnArr = orderSn.split('.')
      orderSn = orderSnArr[0] + '-未确认文件' + '.' + orderSnArr[1]
    }
    comUtil.dlFile(url, orderSn);
  }

  handleSubOk = () => {
    // var a = document.createElement("a");
    // a.href = "https://www.test.papa4print.com/api-job/jobs/2BD35580A45011E9A9B4E13D570BA202/files/b1a8ed86-f3e4-476b-8461-30ee0aee1412/download?attachment=true&filename=10";
    // a.download = "test.mp3";
    // a.click();
    this.subDownload();
    this.setState({
      visibleSub: false,
    });
  };
  handleSubCancel = e => {
    this.setState({
      visibleSub: false,
    });
  };

  showSubModal = (order_sn, goods_id) => {
    comUtil.confirmModal({
      okText: '确定',
      cancelText: '取消',
      className: 'seller-confirm-modal',
      content: lang.user.confirmNotPrintTipsSeller,
      // title:'',
      onOk: () => {
        this.subDownload(order_sn, goods_id);
      }
    })
    // this.setState({
    //     visibleSub: true,
    //     order_sn:order_sn,
    //     goods_id:goods_id
    // });
  };


  // 修改用户信息
  handleRecivewOk = e => {
    this.props.getListData({
      page: this.props.page,
      size: this.props.pageSize
    })
    // this.props.getStatusCount();
    this.setState({
      visibleRecivew: false,
    });
  };
  handleRecivewCancel = e => {
    this.setState({
      visibleRecivew: false,
    });
  };


  onChange(e, index) {
    const {checkedList} = this.state;
    checkedList[index].type = !checkedList[index].type;
    let newArray = checkedList.filter((item, index) => {
      return item.type == true;
    });
    this.setState({
      checkedList: checkedList,
      checkAll: newArray.length == this.props.data.length
    })
  };


  statusType = (item) => {
    //  0：取消订单， 1：待接单，2：待付款，3：待确认，4：待发货，  5：待收货，6：待评价，7：已完成
    let text = '';
    const type = item.status
    const isRefund = item.is_after == 1  // 退款
    const isAfter = item.is_after == 2   // 售后
    switch (type) {
      case 0:
        text = '取消订单';
        break;
      case 1:
        text = '待接单';
        break;
      case 2:
        text = '待付款';
        break;
      case 3:
        text = isRefund ? '待确认-退款中' : '待确认';
        break;
      case 4:
        text = isRefund ? '待发货-退款中' : '待发货';
        break;
      case 5:
        text = isAfter ? '待收货-售后中' : '待收货';
        break;
      case 6:
        text = '待评价';
        break;
      case 7:
        text = '已完成';
        break;
    }
    return text
  };

  order_type = (type) => {
    // 0：库存类，2: 定制类，1：生产类
    let text = '';
    switch (type) {
      //   case 0:
      //     text = '库存商品订单'
      //     break;
      case 6:
        text = '采购订单';
        break;
      case 2:
        text = '定制商品订单';
        break;
      case 1:
        text = '生产类订单';
        break;
      case 7:
        text = '自提订单';
        break;
      case 8:
        text = '线下快印订单';
        break;
      case 9:
        text = '分销订单';
        break;
    }
    return text
  };

  onCheckAllChange(e) {
    this.setState({
      checkedList: e.target.checked ? this.state.checkedList.map((item, index) => {
        return {type: true, value: item.value}
      }) : this.state.checkedList.map((item, index) => {
        return {type: false, value: item.value}
      }),
      checkAll: e.target.checked,
    });
  };


  showEditor = (index, listIndex) => {
    this.setState({
      editorListIndex: listIndex,
      editorIndex: index
    })
  };


  changeVisible = (value) => {
    this.setState({
      ImIframeVisible: value
    })
  };
  ChildStatusType = (type, index, status) => {
    //  0：取消订单， 1：待接单，2：待付款，3：待确认，4：待发货，  5：待收货，6：待评价，7：已完成
    let text = '';
    if (index == 0) {
      switch (type) {
        case 0:
          text = '取消订单';
          break;
        case 1:
          text = '待接单';
          break;
        case 2:
          text = '待付款';
          break;
        case 3:
          text = '待确认';
          break;
        case 4:
          text = '待发货';
          break;
        case 5:
          text = '待收货';
          break;
        case 6:
          text = '待评价';
          break;
        case 7:
          text = '已完成';
          break;
          // case 8:
          //     text = '待尾款付款'
          break;
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
        // switch (type) {
        //     case 7:
        //         text = '已付款'
        //         break;
        //         default: text = '未付款'
        // }
      }
    }

    return text
  }
  // 确认接单
  subReciveOrder = (order_sn) => {
    httpRequest.post({
      url: sellerApi.order.subReciveOrder,
      data: {
        order_sn: order_sn
      }
    }).then(res => {
      message.success('操作成功');
      this.props.getListData({
        page: this.props.page,
        size: this.props.pageSize
      }, 'put')
      // this.props.getStatusCount();
      // this.props.handleOk();
    })
  }
  //确认不需要下载文件
  subDownload = (order_sn, goods_id) => {
    //  let {order_sn,goods_id} = this.state;
    httpRequest.post({
      url: sellerApi.order.printSub,
      data: {
        order_sn: order_sn,
        order_goods_id: goods_id,
        print_status: 2
      }
    }).then(res => {
      message.success('操作成功')
      this.props.getListData({
        page: this.props.page,
        size: this.props.pageSize
      }, 'put')
      // this.props.getStatusCount();
    });
  };

  // 跳转到操作页面
  jumpToOperationPage(type) {
    this.props.history.push(`/seller/orders/OrderOperation/${type}`)
  }

  uploadTextStatus = (order_type, print_status, status, upload_img_url) => {
    // if(order_type !=0){
    //     if(print_status == 2){
    //         return '不需要上传文件'
    //     }else if(upload_img_url&&status<=3){
    //         return '已上传生产文件，未确认'
    //     }else if(status>3){
    //         return '已确认生产文件'
    //     }else{
    //         return '未上传生产文件'
    //     }
    // }
    if (print_status == 2) {
      return '不需要上传文件'
    } else if (upload_img_url && status <= 3) {
      return '已上传生产文件，未确认'
    } else if (status > 3) {
      return '已确认生产文件'
    } else {
      return '未上传生产文件'
    }
  }

  // 取消订单
  seller_order_cancel = (order_sn) => {
    httpRequest.post({
      url: sellerApi.order.seller_order_cancel,
      data: {
        order_sn: order_sn,
      }
    }).then(res => {
      message.success('操作成功')
      this.props.getListData({
        page: this.props.page,
        size: this.props.pageSize
      })
      // this.props.getStatusCount();
    });
  }

  /**
   * Show pop-box of preflight report.
   */
  checkPreflightReport(orderSN, orderGoodsId) {
    this.getSFJob(orderSN, orderGoodsId);
  }

  /**
   * Get SF job data.
   * @param {String} orderSN
   * @param {Number} orderGoodsId
   */
  getSFJob(orderSN, orderGoodsId) {
    let _this = this;
    Handling.start();
    httpRequest.noMessage().get({
      url: SFAPI.base + SFAPI.job,
      data: {
        order_sn: orderSN,
        order_goods_id: orderGoodsId
      }
    }).then(res => {
      Handling.stop();
      if (res.code == 200) {
        _this.getSFJobFilesData(res.data, res.data._links.files.href);
      }
    }).catch(res => {
      Handling.stop();
    });
  }

  /**
   * Get SF job files data.
   * @param {Object} sfJobData
   * @param {String} filesLink
   */
  getSFJobFilesData(sfJobData, filesLink) {
    let _this = this;
    $.ajax({
      url: filesLink,
      type: 'GET',
      success: function (data) {
        let file = data._embedded.files[0];
        if (file.pdf || file.image) {
          _this.getSFJobFilePreflightReportData(sfJobData, file._links.preflightReport.href);
        } else {
          message.info(lang.common.noPreflightReportAvailable);
        }
      },
      error: function (res) {
        console.log(res);
        message.error(lang.common.networkError);
      }
    });
  }

  /**
   * Get SF job file preflight report data.
   * @param {*} sfJobData
   * @param {*} preflightReportLink
   */
  getSFJobFilePreflightReportData(sfJobData, preflightReportLink) {
    let _this = this;
    $.ajax({
      url: preflightReportLink,
      type: 'GET',
      success: function (data) {
        _this.openBoxPreflightReport(sfJobData, data);
      },
      error: function (res) {
        console.log(res);
        message.error(lang.common.networkError);
      }
    });
  }

  /**
   * Do Open pop-box of preflight report.
   */
  openBoxPreflightReport(sfJobData, preflightReportData) {
    this.setState({
      sfPopBoxPreflightReportVisible: true,
      sfJobData: sfJobData,
      preflightReportData: preflightReportData
    });
  }

  /**
   * Do Close pop-box of preflight report.
   */
  closeBoxPreflightReport() {
    this.setState({
      sfPopBoxPreflightReportVisible: false
    });
  }

//核销,合并需要此代码 by leite 20191123
  handleRatify(id) {
    this.setState({
      visibleRatify: true,
      order_sn: id
    });
  }

  openNewTab(url) {
    window.open(url)
  }

  // 备注
  handleRemarkOk() {
    const {orderSn, remark} = this.state;
    httpRequest.post({
      url: sellerApi.order.editorRemark,
      data: {
        order_sn: orderSn,
        seller_remark: remark
      }
    }).then(res => {
      if (res.code == 200) {
        message.success('添加备注成功')
        this.setState({
          visibleRemark: false
        })
        this.props.getListData({
          page: this.props.page,
          size: this.props.pageSize
        })
      }
    })
  }

  handleRemarkCancel() {
    this.setState({
      visibleRemark: false
    })
  }

  toRemark(orderSn, sellerRemark) {
    this.setState({
      visibleRemark: true,
      orderSn,
      remark: sellerRemark ? sellerRemark : ''
    })
  }

  handleRatifyOk() {
    setTimeout(() => {
      let {order_sn, pickUpNumber} = this.state;
      if (comUtil.isEmpty(pickUpNumber)) {
        message.warning("请输入提货码！");
        return false;
      }
      httpRequest.post({
        url: sellerApi.order.sellerOrderPickUp,
        data: {
          order_sn: order_sn,
          number: pickUpNumber,
        }
      }).then(res => {
        if (res.code == 200) {
          message.success('操作成功');
          this.props.getListData({
            page: this.props.page,
            size: this.props.pageSize
          });
          this.setState({
            visibleRatify: false
          })
        } else {
          message.error(res.msg)
        }
      });
    }, 600);
  }

  handleRatifyCancel() {
    this.setState({
      visibleRatify: false,
    });
  }

  handleaAfterClose() {
    this.setState({
      pickUpNumber: ""
    })
  }

  handlePickUp(e) {
    this.setState({
      pickUpNumber: e.target.value
    })
  }

  onRemarkChange(e) {
    this.setState({
      remark: e.target.value
    })
  }

  onClickWord = (remark) => {
    this.setState({
      remark
    })
  }

  // 售后/退款中 发货 弹窗操作
  showDeliveryWarn = (item) => {
    this.setState({
      deliveryWarnModal: true,
      orderSn: item.order_sn,
      refund: item.refund
    })
  }
  handleRefund = () => {
    const {orderSn, refund} = this.state
    this.setState({
      deliveryWarnModal: false
    }, () => {
      this.props.history.push(`/seller/orders/refundDetail/${orderSn}/${refund}`)
    })
  }
  closeDeliveryWarnModal = () => {
    this.setState({
      deliveryWarnModal: false
    })
  }

  render() {
    const {checkedList, editorIndex, editorListIndex, remark, pickUpNumber} = this.state;
    let checked = (checkedList.filter((item, index) => {
      return item.type == true;
    }));
    let {getFieldDecorator} = this.props.form;
    let loginInfoShopId = this.props.loginInfo.shopId;
    return (
      <div>
        <div className='table-head'>
          <section className='head-check-btn checkbox-box'>
            <Checkbox
              // indeterminate={this.state.indeterminate}
              disabled={this.props.data.length == 0}
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}
              indeterminate={checked.length > 0 && checked.length < this.props.pageSize}
            >
              全选
            </Checkbox>
          </section>
          <section className='goods-name'>商品名称</section>
          <section className='goods-price'>商品单价</section>
          <section className='count'>商品数量</section>
          <section className='goods-opreat'>商品操作</section>
          <section className='order-opreat'>订单操作</section>
        </div>
        {this.props.data.length > 0 ? this.props.data.map((item, index) => {
          // order_type 3 表示分期订单
          if (item.order_type == 3) {
            return <div className='table-body' key={index}>
              <div className='body-head'>
                <div className='body-head-box'>
                  <div className='body-content-box'>
                    <div className='content-box message-icon-box'>
                      <div>用户名:{item.username}<SellerIm uid={item.buyer_id}
                                                        msg={'https://' + window.location.hostname + '//user/orderdetail/' + item.order_sn}
                                                        isSeller={true} iconClass={'iconfont iconmessage'}></SellerIm>
                      </div>
                    </div>
                    <div className='content-box'>
                      <div>订单类型：分期订单</div>
                    </div>
                    <div className='content-box'>
                      <div>下单时间：{item.create_time}</div>
                    </div>
                    <div className='content-box'>
                      <div>订单号：{item.order_sn}</div>
                    </div>
                  </div>
                  <div className='body-content-box'>
                    <div className='content-box'>
                      <div>收货人:</div>
                      {/* <div>coral<span className='iconfont iconeditor' onClick={()=>{
                                        this.showEditor(1)
                                    }}></span></div> */}
                      <div>{_.get(item, 'shopping_info.consignee', '')}
                        {
                          item.status > 0 && item.status <= 4 ? <span className='iconfont iconeditor' onClick={() => {
                            this.showRecivewModal(item)
                          }}></span> : null
                        }
                      </div>
                    </div>
                    <div className='content-box'>
                      <div>手机号:</div>
                      <div>{_.get(item, 'shopping_info.mobile', '')}
                        {
                          item.status > 0 && item.status <= 4 ? <span className='iconfont iconeditor' onClick={() => {
                            this.showRecivewModal(item)
                          }}></span> : null
                        }
                      </div>
                    </div>
                    <div className='content-box'>
                      <div>收货地址:</div>
                      <div>{comUtil.getLocaData([_.get(item, 'shopping_info.province_id', ''),
                        _.get(item, 'shopping_info.city_id', ''), _.get(item, 'shopping_info.area_id', '')])[1] + _.get(item, 'shopping_info.address', '')}
                        {
                          item.status > 0 && item.status <= 4 ? <span className='iconfont iconeditor' onClick={() => {
                            this.showRecivewModal(item)
                          }}></span> : null
                        }
                      </div>
                    </div>
                    <div className='content-box'>
                      <div>订单预计费用:</div>
                      <div className='price'>￥{item.should_money}元</div>
                    </div>
                  </div>
                </div>
                {/* <div className='price type'>{this.statusType(item.status)}</div> */}
                {
                  item.status == 2 ?
                    <div className='type'>
                      <Button type='primary' className='no-bg-btn' onClick={() => {
                        comUtil.confirmModal({
                          okText: '确定',
                          cancelText: '取消',
                          className: 'seller-confirm-modal',
                          content: '确认取消订单吗？',
                          // title:'',
                          onOk: () => {
                            this.seller_order_cancel(item.order_sn)
                          }
                        })

                      }}>取消订单</Button>
                    </div> : null
                }
              </div>
              <div className='conntent-body'>
                <div className='list-content-box'>
                  <div className='checkbox-box content-box'>
                    <Checkbox
                      checked={checkedList[index].type}
                      onChange={(e) => {
                        this.onChange(e, index);
                      }}>
                    </Checkbox>
                  </div>
                  <div style={{float: 'right', marginLeft: 25}}>
                    {
                      item.order_goods && item.order_goods.map((childItem, i) => {
                        return <div className='conntent-body-box' key={i}>
                          <div className='content-box'>
                            <img src={childItem.goods_img} style={{width: 68, height: 68, display: 'inline-block'}}/>
                          </div>
                          <div className='content-box'>
                            <div>
                              <div className='goods-name'>{childItem.goods_name}</div>
                              <div className='goods-name'>颜色分类:{childItem.goods_classify}</div>
                              <div className='goods-status'>{
                                this.uploadTextStatus(item.order_type, childItem.print_status, item.status, childItem.upload_img_url)
                              }</div>
                            </div>
                          </div>
                          <div className='goods-price content-box'>￥{childItem.unit_price}</div>
                          <div className='count content-box'>x{childItem.goods_number}</div>
                          <div className='goods-opreat content-box has-opreat'>
                            <div>
                              <div>
                                {
                                  childItem.print_status != 2 && childItem.goods_type != 0 && item.status == 3 ?
                                    <a onClick={() => {
                                      this.showSubModal(item.order_sn, childItem.id)
                                    }}>不需要上传文件</a> : null
                                }
                              </div>
                              <div>
                                {
                                  childItem.goods_type != 0 && item.status >= 2 && childItem.upload_img_url && childItem.print_status !== 2 ?
                                    <a onClick={() => {
                                      let text = '';
                                      item.status == 2 ? text = '未付款' : item.status == 3 ? text = '未确认生产' : ''
                                      // 'upload_file_name'
                                      childItem.print_status === 0 ?
                                        // this.showDownloadModal(childItem.upload_img_url + `&filename=${childItem.upload_file_name}(${text})`)
                                        // this.showDownloadModal(childItem.upload_img_url + `(${text})${encodeURIComponent(childItem.upload_file_name)}`)
                                        this.showDownloadModal(childItem.upload_img_url, childItem.upload_file_name, childItem.order_sn, childItem.print_status, childItem.template_id)
                                        // this.showDownloadModal(childItem.upload_img_url)
                                        : this.dlFile(childItem.upload_img_url, childItem.upload_file_name, childItem.order_sn, childItem.print_status, childItem.template_id)
                                    }}>下载文件</a> : null
                                }
                              </div>
                              <div>
                                {
                                  childItem.goods_type != 0 && item.status >= 2 && childItem.upload_img_url
                                    ?
                                    <Fragment>
                                      {
                                        childItem.detection_status
                                          ?
                                          <span
                                            className={"ml-block ml-left ep-preflight-report-icon" + childItem.detection_status}></span>
                                          :
                                          null
                                      }
                                      {
                                        /**
                                         * childItem.valid_id == 5 means no preflight report is available.
                                         * If childItem.valid_id == 5, then the item (user used to check preflight report) will not show.
                                         */
                                        item.order_type != 6 && childItem.goods_type !== 0 && childItem.print_status === 1 && childItem.valid_id != 5
                                          ?
                                          <a
                                            onClick={() => this.checkPreflightReport(item.order_sn, childItem.id)}>{lang.common.preflightReport}</a>
                                          :
                                          null
                                      }
                                      <PreflightReport
                                        visible={this.state.sfPopBoxPreflightReportVisible}
                                        jobData={this.state.sfJobData}
                                        data={this.state.preflightReportData}
                                        closeBox={this.closeBoxPreflightReport}
                                        fileName={childItem.upload_file_name}
                                        type={"seller"}
                                      >
                                      </PreflightReport>
                                    </Fragment>
                                    :
                                    null
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      })
                    }
                  </div>
                </div>
                <div className='order-opreat content-box'>
                  <Fragment>
                    {
                      item.status == 1 && <span onClick={() => {
                        this.subReciveOrder(item.order_sn)
                      }}>确认接单</span>
                    }
                  </Fragment>
                  <div style={{width: '100%'}}>
                    {item.status == 4 &&
                    <div onClick={() => this.showModal(item)}>发货</div>}
                    <div onClick={() => this.openNewTab('/seller/orders/orderInfo/' + item.order_sn)}>查看订单详情</div>
                    <div onClick={() => this.toRemark(item.order_sn, item.seller_remark)}>备注</div>
                    {
                      item.seller_remark ? (
                        <Popover placement="bottomLeft" content={(
                          <div style={{maxWidth: 150, wordWrap: 'break-word'}}>{item.seller_remark}</div>
                        )}>
                          <div style={{color: "#e6240f", width: '100%'}} className="textover">{item.seller_remark}</div>
                        </Popover>
                      ) : null
                    }
                  </div>
                </div>
              </div>
              <div className='content-next'>
                {
                  item.child_orders && item.child_orders.map((childItem, index) => {
                    return <div className='step-box' key={index}>
                      <div className='step-type-box'>
                        <span className='order-type'>{this.ChildStatusType(childItem.status, index, item.status)}</span>
                      </div>
                      <div className='step-next-content-box'>
                        <div className='step-content-box'>
                          <div>
														<span className='step-title'>
															{
                                index == 0 ? '阶段一:商品订金' : '阶段二:商品尾款'
                              }
														</span>
                          </div>
                          <div>
                            {
                              !childItem.pay_time && index == 0 ? (
                                <Fragment>
                                  需在<span className='order-type'>{childItem.down_payment_expired}</span> 前支付
                                </Fragment>
                              ) : !childItem.pay_time && item.status > 4 ? (
                                <Fragment>
                                  需在<span className='order-type'>{childItem.balance_payment_expired}</span>前支付
                                </Fragment>
                              ) : childItem.pay_time ? <span>已在 {childItem.pay_time} 支付</span> : null
                            }
                          </div>
                        </div>
                        <div className='step-content-box'>
                          订单号：{
                          childItem.order_sn
                        }
                        </div>
                        <div className='step-content-box'>
                          ¥{childItem.should_money}
                        </div>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
          } else if (item.order_type == 8) { // 快印订单
            return (
              <div className='table-body' key={index}>
                <div className='body-head'>
                  <div className='body-head-box' style={{paddingBottom: "10px"}}>
                    <div className='body-content-box'>
                      <div className='content-box message-icon-box'>
                        <div>
                          用户名:{item.username}
                          <SellerIm
                            uid={item.buyer_id}
                            msg={'https://' + window.location.hostname + '//user/orderdetail/' + item.order_sn}
                            isSeller={true}
                            iconClass={'iconfont iconmessage'}
                          />
                        </div>
                      </div>
                      <div className='content-box'>
                        <div>订单类型：{this.order_type(item.order_type)}</div>
                      </div>
                      <div className='content-box'>
                        <div>下单时间：{item.create_time}</div>
                      </div>
                      <div className='content-box'>
                        <div>订单号：{item.order_sn}</div>
                      </div>
                    </div>
                  </div>
                  <div className='price type'>{this.statusType(item)}</div>
                </div>
                <div className='conntent-body'>
                  <div className='list-content-box'>
                    <div className='checkbox-box content-box'>
                      <Checkbox
                        checked={checkedList[index].type}
                        onChange={(e) => {
                          this.onChange(e, index);
                        }}>
                      </Checkbox>
                    </div>
                    <div style={{float: 'right', marginLeft: 25}}>
                      {
                        item.order_goods.map((childItem, i) => {
                          return <div className='conntent-body-box' key={i}>
                            <div className='content-box'>
                              <img src={childItem.goods_img ? childItem.goods_img : Order_defult_img}
                                   style={{width: 68, height: 68, display: 'inline-block'}}/>
                            </div>
                            <div className='content-box'>
                              <div>
                                <div className='goods-name'>{childItem.goods_name}</div>
                                {
                                  item.order_type != 8 ?
                                    <div className='goods-name'>颜色分类:{childItem.goods_classify}</div>
                                    : null
                                }
                                {
                                  item.order_type != 8 ? <div className='goods-status'>{
                                    this.uploadTextStatus(item.order_type, childItem.print_status, item.status, childItem.upload_img_url)
                                  }</div> : null
                                }

                              </div>
                            </div>
                            <div className='goods-price content-box'>
                              {/*{item.order_type != 6 ? '￥' + childItem.unit_price : childItem.unit_price <= 0 ? */}
                              {/*  '' : '￥' + childItem.unit_price}*/}
                            </div>
                            <div className='count content-box'>
                              {/*x{childItem.goods_number}*/}
                            </div>
                            <div className='goods-opreat content-box has-opreat'>
                              {
                                item.order_type != 8 ? <div>
                                  <div>
                                    {
                                      childItem.print_status != 2 && childItem.goods_type != 0 && item.status == 3 ?
                                        <a onClick={() => {
                                          this.showSubModal(item.order_sn, childItem.id)
                                        }}>不需要上传文件</a> : null
                                    }
                                  </div>
                                  <div>
                                    {/* {
                                      childItem.goods_type != 0 && item.status >= 2 && childItem.upload_img_url ?
                                        <a onClick={() => {
                                          let text = '';
                                          item.status == 2 ? text = '未付款' : item.status == 3 ? text = '未确认生产' : ''
                                          // 'upload_file_name'
                                          item.status <= 3 ?
                                            // this.showDownloadModal(childItem.upload_img_url + `&filename=${childItem.upload_file_name}(${text})`)
                                            //this.showDownloadModal(childItem.upload_img_url + `(${text})${encodeURIComponent(childItem.upload_file_name)}`)
                                            this.showDownloadModal(childItem.upload_img_url)
                                            : window.location.href = childItem.upload_img_url
                                        }}>下载文件</a> : null
                                    } */}
                                  </div>
                                  <div>
                                    {
                                      childItem.goods_type != 0 && item.status >= 2 && childItem.upload_img_url
                                        ?
                                        <Fragment>
                                          {
                                            childItem.detection_status
                                              ?
                                              <span
                                                className={"ml-block ml-left ep-preflight-report-icon" + childItem.detection_status}></span>
                                              :
                                              null
                                          }
                                          {/* <a onClick={() => this.checkPreflightReport(item.order_sn, childItem.id)}>{lang.common.preflightReport}</a>
                                          <PreflightReport
                                            visible={this.state.sfPopBoxPreflightReportVisible}
                                            jobData={this.state.sfJobData}
                                            data={this.state.preflightReportData}
                                            closeBox={this.closeBoxPreflightReport}
                                            fileName={childItem.upload_file_name}
                                            type={"seller"}
                                          >
                                          </PreflightReport> */}
                                        </Fragment>
                                        :
                                        null
                                    }
                                  </div>
                                </div> : null
                              }
                            </div>
                          </div>
                        })
                      }
                    </div>
                  </div>
                  <div className='order-opreat content-box'>
                    <Fragment>
                      {
                        item.status == 1 && <span onClick={() => {
                          this.subReciveOrder(item.order_sn)
                        }}>确认接单</span>
                      }
                    </Fragment>
                    <div style={{width: '100%'}}>
                      {item.status == 4 && <div onClick={() => this.showModal(item)}>发货</div>}
                      <div onClick={() => this.openNewTab('/seller/orders/orderInfo/' + item.order_sn)}>查看订单详情</div>
                      <div onClick={() => this.toRemark(item.order_sn, item.seller_remark)}>备注</div>
                      {
                        item.seller_remark ? (
                          <Popover placement="bottomLeft" content={(
                            <div style={{maxWidth: 150, wordWrap: 'break-word'}}>{item.seller_remark}</div>
                          )}>
                            <div style={{color: "#e6240f", width: '100%'}}
                                 className="textover">{item.seller_remark}</div>
                          </Popover>
                        ) : null
                      }
                    </div>
                  </div>
                </div>
              </div>
            )
          } else if (item.order_type == 9) { // 分销订单 item.self_shop_id == loginInfoShopId
            return <div className='table-body' key={index}>
              <div className='body-head'>
                <div className='body-head-box'>
                  <div className='body-content-box'>
                    <div className='content-box message-icon-box'>
                      <div>
                        用户名:{item.username}
                        <SellerIm
                          uid={item.buyer_id}
                          msg={'https://' + window.location.hostname + '//user/orderdetail/' + item.order_sn}
                          isSeller={true}
                          iconClass={'iconfont iconmessage'}
                        />
                      </div>
                    </div>
                    <div className='content-box'>
                      <div>订单类型：{this.order_type(item.order_type)}</div>
                    </div>
                    <div className='content-box'>
                      <div>下单时间：{item.create_time}</div>
                    </div>
                    <div className='content-box'>
                      <div>订单号：{item.order_sn}</div>
                    </div>
                  </div>
                  {item.order_type != 7 ?
                    <div className='body-content-box'>
                      <div className='content-box'>
                        <div>收货人:</div>
                        {/* <div>coral<span className='iconfont iconeditor' onClick={()=>{
                                        this.showEditor(1)
                                    }}></span></div> */}
                        <div>{_.get(item, 'shopping_info.consignee', '')}
                          {
                            item.status > 0 && item.status <= 4 ?
                              <span className='iconfont iconeditor' onClick={() => {
                                this.showRecivewModal(item)
                              }}></span> : null
                          }
                        </div>
                      </div>
                      <div className='content-box'>
                        <div>手机号:</div>
                        <div>{_.get(item, 'shopping_info.mobile', '')}
                          {
                            item.status > 0 && item.status <= 4 ?
                              <span className='iconfont iconeditor' onClick={() => {
                                this.showRecivewModal(item)
                              }}></span> : null
                          }
                        </div>
                      </div>
                      <div className='content-box'>
                        <div>收货地址:</div>
                        <div>{comUtil.getLocaData([_.get(item, 'shopping_info.province_id', ''),
                          _.get(item, 'shopping_info.city_id', ''), _.get(item, 'shopping_info.area_id', '')])[1] + _.get(item, 'shopping_info.address', '')}
                          {
                            item.status > 0 && item.status <= 4 ?
                              <span className='iconfont iconeditor' onClick={() => {
                                this.showRecivewModal(item)
                              }}></span> : null
                          }
                        </div>
                      </div>
                      <div className='content-box' onClick={() => {
                        item.order_type != 6 && item.status > 0 && item.status <= 2 && this.showMoneyModal(item)
                      }} style={item.status > 0 && item.status <= 2 ? {cursor: 'pointer'} : null}>
                        <div>订单预计费用:</div>
                        <div className='price'>￥{item.should_money}元</div>
                      </div>
                    </div> : null}
                </div>
                <div className='price type'>{this.statusType(item)}</div>
              </div>
              <div className='conntent-body'>
                <div className='list-content-box'>
                  <div className='checkbox-box content-box'>
                    <Checkbox
                      checked={checkedList[index].type}
                      onChange={(e) => {
                        this.onChange(e, index);
                      }}>
                    </Checkbox>
                  </div>
                  <div style={{float: 'right', marginLeft: 25}}>
                    {
                      item.order_goods.map((childItem, i) => {
                        return <div className='conntent-body-box' key={i}>
                          <div className='content-box'>
                            <img src={childItem.goods_img ? childItem.goods_img : Order_defult_img}
                                 style={{width: 68, height: 68, display: 'inline-block'}}/>
                          </div>
                          <div className='content-box'>
                            <div>
                              <div className='goods-name'>{childItem.goods_name}</div>
                              {
                                item.order_type != 6 ? <div className='goods-name'>颜色分类:{childItem.goods_classify}</div>
                                  : null
                              }
                              {
                                item.order_type != 6 ? <div className='goods-status'>{
                                  this.uploadTextStatus(item.order_type, childItem.print_status, item.status, childItem.upload_img_url)
                                }</div> : null
                              }

                            </div>
                          </div>
                          <div className='goods-price content-box'>
                            {item.order_type != 6 ? '￥' + childItem.unit_price : childItem.unit_price <= 0 ? '' : '￥' + childItem.unit_price}</div>
                          <div className='count content-box'>x{childItem.goods_number}</div>
                          <div className='goods-opreat content-box has-opreat'>
                            {
                              item.order_type != 6 ? <div>
                                <div>
                                  {
                                    childItem.print_status != 2 && childItem.goods_type != 0 && item.status == 3 && item.self_shop_id != loginInfoShopId ?
                                      <a onClick={() => {
                                        this.showSubModal(item.order_sn, childItem.id)
                                      }}>不需要上传文件</a> : null
                                  }
                                </div>
                                <div>
                                  <Fragment>
                                    {
                                      childItem.goods_type != 0 && item.status >= 2 && childItem.upload_img_url && childItem.print_status !== 2 ?
                                        <a onClick={() => {
                                          let text = '';
                                          item.status == 2 ? text = '未付款' : item.status == 3 ? text = '未确认生产' : ''
                                          // 'upload_file_name'
                                          childItem.print_status === 0 ?
                                            // this.showDownloadModal(childItem.upload_img_url + `&filename=${childItem.upload_file_name}(${text})`)
                                            //this.showDownloadModal(childItem.upload_img_url + `(${text})${encodeURIComponent(childItem.upload_file_name)}`)
                                            this.showDownloadModal(childItem.upload_img_url, childItem.upload_file_name, childItem.order_sn, childItem.print_status, childItem.template_id)
                                            : this.dlFile(childItem.upload_img_url, childItem.upload_file_name, childItem.order_sn, childItem.print_status, childItem.template_id)
                                        }}>下载文件</a> : null
                                    }
                                  </Fragment>
                                </div>
                                <div>
                                  {
                                    childItem.goods_type != 0 && item.status >= 2 && childItem.upload_img_url
                                      ?
                                      <Fragment>
                                        {
                                          childItem.detection_status
                                            ?
                                            <span
                                              className={"ml-block ml-left ep-preflight-report-icon" + childItem.detection_status}></span>
                                            :
                                            null
                                        }
                                        {
                                          /**
                                           * childItem.valid_id == 5 means no preflight report is available.
                                           * If childItem.valid_id == 5, then the item (user used to check preflight report) will not show.
                                           */
                                          item.order_type != 6 && childItem.goods_type !== 0 && childItem.print_status === 1 && childItem.valid_id != 5
                                            ?
                                            <a
                                              onClick={() => this.checkPreflightReport(item.order_sn, childItem.id)}>{lang.common.preflightReport}000</a>
                                            :
                                            null
                                        }
                                        <PreflightReport
                                          visible={this.state.sfPopBoxPreflightReportVisible}
                                          jobData={this.state.sfJobData}
                                          data={this.state.preflightReportData}
                                          closeBox={this.closeBoxPreflightReport}
                                          fileName={childItem.upload_file_name}
                                          type={"seller"}
                                        >
                                        </PreflightReport>
                                      </Fragment>
                                      :
                                      null
                                  }
                                </div>
                              </div> : null
                            }
                          </div>
                        </div>
                      })
                    }
                  </div>
                </div>
                <div className='order-opreat content-box'>
                  <Fragment>
                    {
                      item.status == 1 && <span onClick={() => {
                        this.subReciveOrder(item.order_sn)
                      }}>确认接单</span>
                    }
                  </Fragment>
                  <div style={{width: '100%'}}>
                    {item.status == 4 && item.self_shop_id != loginInfoShopId && <div onClick={() => {
                      item.is_after == 1 ? this.showDeliveryWarn(item) : this.showModal(item)
                    }}>发货</div>}
                    {/*{item.status == 9 ? <div onClick={this.handleRatify.bind(this, item.order_sn)}>核销</div> : null}*/}
                    <div onClick={() => {
                      this.openNewTab('/seller/orders/orderInfo/' + item.order_sn)
                    }}>查看订单详情
                    </div>
                    <div onClick={() => this.toRemark(item.order_sn, item.seller_remark)}>备注</div>
                    {
                      item.seller_remark ? (
                        <Popover placement="bottomLeft" content={(
                          <div style={{maxWidth: 150, wordWrap: 'break-word'}}>{item.seller_remark}</div>
                        )}>
                          <div style={{color: "#e6240f", width: '100%'}} className="textover">{item.seller_remark}</div>
                        </Popover>
                      ) : null
                    }
                  </div>
                </div>
              </div>
            </div>
          } else {
            return <div className='table-body' key={index}>
              <div className='body-head'>
                <div className='body-head-box'>
                  <div className='body-content-box'>
                    <div className='content-box message-icon-box'>
                      <div>
                        用户名:{item.username}
                        <SellerIm
                          uid={item.buyer_id}
                          msg={'https://' + window.location.hostname + '//user/orderdetail/' + item.order_sn}
                          isSeller={true}
                          iconClass={'iconfont iconmessage'}
                        />
                      </div>
                    </div>
                    <div className='content-box'>
                      <div>订单类型：{this.order_type(item.order_type)}</div>
                    </div>
                    <div className='content-box'>
                      <div>下单时间：{item.create_time}</div>
                    </div>
                    <div className='content-box'>
                      <div>订单号：{item.order_sn}</div>
                    </div>
                  </div>
                  {item.order_type != 7 ?
                    <div className='body-content-box'>
                      <div className='content-box'>
                        <div>收货人:</div>
                        {/* <div>coral<span className='iconfont iconeditor' onClick={()=>{
                                        this.showEditor(1)
                                    }}></span></div> */}
                        <div>{_.get(item, 'shopping_info.consignee', '')}
                          {
                            item.status > 0 && item.status <= 4 ?
                              <span className='iconfont iconeditor' onClick={() => {
                                this.showRecivewModal(item)
                              }}></span> : null
                          }
                        </div>
                      </div>
                      <div className='content-box'>
                        <div>手机号:</div>
                        <div>{_.get(item, 'shopping_info.mobile', '')}
                          {
                            item.status > 0 && item.status <= 4 ?
                              <span className='iconfont iconeditor' onClick={() => {
                                this.showRecivewModal(item)
                              }}></span> : null
                          }
                        </div>
                      </div>
                      <div className='content-box'>
                        <div>收货地址:</div>
                        <div>{comUtil.getLocaData([_.get(item, 'shopping_info.province_id', ''),
                          _.get(item, 'shopping_info.city_id', ''), _.get(item, 'shopping_info.area_id', '')])[1] + _.get(item, 'shopping_info.address', '')}
                          {
                            item.status > 0 && item.status <= 4 ?
                              <span className='iconfont iconeditor' onClick={() => {
                                this.showRecivewModal(item)
                              }}></span> : null
                          }
                        </div>
                      </div>
                      <div className='content-box' onClick={() => {
                        item.order_type != 6 && item.status > 0 && item.status <= 2 && this.showMoneyModal(item)
                      }} style={item.status > 0 && item.status <= 2 ? {cursor: 'pointer'} : null}>
                        <div>订单预计费用:</div>
                        <div className='price'>￥{item.should_money}元</div>
                      </div>
                    </div> : null}
                </div>
                <div className='price type'>{this.statusType(item)}</div>
              </div>
              <div className='conntent-body'>
                <div className='list-content-box'>
                  <div className='checkbox-box content-box'>
                    <Checkbox
                      checked={checkedList[index].type}
                      onChange={(e) => {
                        this.onChange(e, index);
                      }}>
                    </Checkbox>
                  </div>
                  <div style={{float: 'right', marginLeft: 25}}>
                    {
                      item.order_goods.map((childItem, i) => {
                        return <div className='conntent-body-box' key={i}>
                          <div className='content-box'>
                            <img src={childItem.goods_img ? childItem.goods_img : Order_defult_img}
                                 style={{width: 68, height: 68, display: 'inline-block'}}/>
                          </div>
                          <div className='content-box'>
                            <div>
                              <div className='goods-name'>{childItem.goods_name}</div>
                              {
                                item.order_type != 6 ? <div className='goods-name'>颜色分类:{childItem.goods_classify}</div>
                                  : null
                              }
                              {
                                item.order_type != 6 ? <div className='goods-status'>{
                                  this.uploadTextStatus(item.order_type, childItem.print_status, item.status, childItem.upload_img_url)
                                }</div> : null
                              }

                            </div>
                          </div>
                          <div className='goods-price content-box'>
                            {item.order_type != 6 ? '￥' + childItem.unit_price : childItem.unit_price <= 0 ? '' : '￥' + childItem.unit_price}</div>
                          <div className='count content-box'>x{childItem.goods_number}</div>
                          <div className='goods-opreat content-box has-opreat'>
                            {
                              item.order_type != 6 ? <div>
                                <div>
                                  {
                                    childItem.print_status != 2 && childItem.goods_type != 0 && item.status == 3 ?
                                      <a onClick={() => {
                                        this.showSubModal(item.order_sn, childItem.id)
                                      }}>不需要上传文件</a> : null
                                  }
                                </div>
                                <div>
                                  <Fragment>
                                    {
                                      childItem.goods_type != 0 && item.status >= 2 && childItem.upload_img_url && childItem.print_status !== 2 ?
                                        <a onClick={() => {
                                          let text = '';
                                          item.status == 2 ? text = '未付款' : item.status == 3 ? text = '未确认生产' : ''
                                          // 'upload_file_name'
                                          childItem.print_status === 0 ?
                                            // this.showDownloadModal(childItem.upload_img_url + `&filename=${childItem.upload_file_name}(${text})`)
                                            //this.showDownloadModal(childItem.upload_img_url + `(${text})${encodeURIComponent(childItem.upload_file_name)}`)
                                            this.showDownloadModal(childItem.upload_img_url, childItem.upload_file_name, childItem.order_sn, childItem.print_status, childItem.template_id)
                                            : this.dlFile(childItem.upload_img_url, childItem.upload_file_name, childItem.order_sn, childItem.print_status, childItem.template_id)
                                        }}>下载文件</a> : null
                                    }
                                  </Fragment>
                                </div>
                                <div>
                                  {
                                    childItem.goods_type != 0 && item.status >= 2 && childItem.upload_img_url
                                      ?
                                      <Fragment>
                                        {
                                          childItem.detection_status
                                            ?
                                            <span
                                              className={"ml-block ml-left ep-preflight-report-icon" + childItem.detection_status}></span>
                                            :
                                            null
                                        }
                                        {
                                          /**
                                           * childItem.valid_id == 5 means no preflight report is available.
                                           * If childItem.valid_id == 5, then the item (user used to check preflight report) will not show.
                                           */
                                          item.order_type != 6 && childItem.goods_type !== 0 && childItem.print_status === 1 && childItem.valid_id != 5
                                            ?
                                            <a
                                              onClick={() => this.checkPreflightReport(item.order_sn, childItem.id)}>{lang.common.preflightReport}</a>
                                            :
                                            null
                                        }
                                        <PreflightReport
                                          visible={this.state.sfPopBoxPreflightReportVisible}
                                          jobData={this.state.sfJobData}
                                          data={this.state.preflightReportData}
                                          closeBox={this.closeBoxPreflightReport}
                                          fileName={childItem.upload_file_name}
                                          type={"seller"}
                                        >
                                        </PreflightReport>
                                      </Fragment>
                                      :
                                      null
                                  }
                                </div>
                              </div> : null
                            }
                          </div>
                        </div>
                      })
                    }
                  </div>
                </div>
                <div className='order-opreat content-box'>
                  <Fragment>
                    {
                      item.status == 1 && <span onClick={() => {
                        this.subReciveOrder(item.order_sn)
                      }}>确认接单</span>
                    }
                  </Fragment>
                  <div style={{width: '100%'}}>
                    {item.status == 4 && <div onClick={() => {
                      item.is_after == 1 ? this.showDeliveryWarn(item) : this.showModal(item)
                    }}>发货</div>}
                    {item.status == 9 ? <div onClick={this.handleRatify.bind(this, item.order_sn)}>核销</div> : null}
                    <div onClick={() => {
                      this.openNewTab('/seller/orders/orderInfo/' + item.order_sn)
                    }}>查看订单详情
                    </div>
                    <div onClick={() => this.toRemark(item.order_sn, item.seller_remark)}>备注</div>
                    {
                      item.seller_remark ? (
                        <Popover placement="bottomLeft" content={(
                          <div style={{maxWidth: 150, wordWrap: 'break-word'}}>{item.seller_remark}</div>
                        )}>
                          <div style={{color: "#e6240f", width: '100%'}} className="textover">{item.seller_remark}</div>
                        </Popover>
                      ) : null
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        }) : '暂无数据'}
        <Modal
          className='deliver-goods-modal'
          title="发货"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width={860}
          destroyOnClose={true}
        >
          <DeliverModel destroyOnClose={true} handleOk={this.handleOk} handleCancel={this.handleCancel}
                        orderData={this.state.orderData} order_sn={this.state.orderData.order_sn}/>
        </Modal>
        <Modal
          title="修改订单金额"
          width={860}
          visible={this.state.visibleMoney}
          onOk={this.handleMoneyOk}
          onCancel={this.handleMoneyCancel}
          footer={null}
          className='change-money-modal'
        >
          <ChangeMoneyModal order_sn={this.state.orderData.order_sn} handleOk={this.handleMoneyOk}
                            handleCancel={this.handleMoneyCancel} orderData={this.state.orderData}/>
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
          <ChangeRecivewInfo order_sn={this.state.orderData.order_sn} handleOk={this.handleRecivewOk}
                             handleCancel={this.handleRecivewCancel} orderData={this.state.orderData}/>
        </Modal>
        <Modal
          className='admin-modal-confirm admin-form-box'
          title="提示"
          visible={this.state.visibleDownload}
          onOk={this.handleDownloadOk}
          onCancel={this.handleDownloadCancel}
          okText='下载'
          cancelText='取消'
        >
          <div className='content-box'>该文件暂未确认生产或付款，请谨慎操作</div>
        </Modal>
        <Modal
          className='admin-modal-confirm admin-form-box'
          title="提示"
          visible={this.state.visibleSub}
          onOk={this.handleSubOk}
          onCancel={this.handleSubCancel}
          okText='确定'
          cancelText='取消'
        >
          <div className='content-box'>{lang.user.confirmNotPrintTipsSeller}</div>
        </Modal>
        <Modal
          className='admin-modal-confirm admin-form-box'
          title="商家备注（仅商家可见）"
          visible={this.state.visibleRemark}
          onOk={this.handleRemarkOk}
          onCancel={this.handleRemarkCancel}
          okText='确认添加'
          cancelText='取消'
          destroyOnClose={true}
        >
          <TextArea rows={4} value={remark} onChange={this.onRemarkChange}/>
          <div>
            {
              remarkText.map((remark, index) => (
                <span onClick={() => this.onClickWord(remark)}
                      style={{marginRight: 15, cursor: 'pointer', textDecoration: 'underline'}}
                      key={index}>{remark}</span>
              ))
            }
          </div>
        </Modal>
        <Modal
          className='ratify-modal-confirm'
          title="请输入提货码"
          visible={this.state.visibleRatify}
          onOk={this.handleRatifyOk}
          onCancel={this.handleRatifyCancel}
          afterClose={this.handleaAfterClose}
          okText='确定'
          cancelText='取消'>
          <div className='ratify-con'>
            <Input placeholder="请输入提货码" value={pickUpNumber} onChange={this.handlePickUp}/>
          </div>
        </Modal>
        <Modal
          visible={this.state.deliveryWarnModal}
          onOk={this.handleRefund}
          onCancel={this.closeDeliveryWarnModal}
          okText='前往处理'
          cancelText='我再想想'
        >
          <div>该订单用户已申请退款，请先处理！</div>
        </Modal>
      </div>
    )
  }
}

const mapState = (state) => ({
  loginInfo: state.sellerLogin.loginInfo
});
const ListTableDetailForm = Form.create()(ListTableDetail);
export default connect(mapState, null)(withRouter(ListTableDetailForm))
// export default Form.create()(withRouter(ListTableDetail))


