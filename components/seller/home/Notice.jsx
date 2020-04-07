import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Pagination } from 'antd'
import Title from '../common/Title'
import httpRequest from 'utils/ajax'
import { sellerApi } from 'utils/api'
import { actionCreator } from './store'

import '../common/style/notice.scss'

class Notice extends Component {
  constructor() {
    super()
    this.state = {
      noticeData: null,
      page: 1,
      size: 10,
      total: 0
    }
  }
  componentDidMount() {
    this.getNotice()
  }
  getNotice() {
    const { page, size } = this.state
    httpRequest.get({
      url: sellerApi.home.notice,
      data: {
        size,
        page
      }
    }).then(res => {
      this.props.setNoticeCount(res.data.unreadNum)
      this.setState({
        noticeData: res.data.messages,
        total: res.data.total
      })
    })
  }
  render() {
    const { noticeData, total, size, page } = this.state
    return (
      <div className="notice-container">
        <Title title='平台消息' />
        <div className={noticeData && noticeData.length == 0 ? "right-content-page center" : "right-content-page"}>
          {
            noticeData && noticeData.length == 0 ? (
              <div className="noNotice">
                <img src={require('../../../assets/images/seller/no_notice_bg.png')} alt=""/>
                <p>暂无平台消息</p>
              </div>
            ) : (
              <Fragment>
                <div className="header" onClick={this.readAll}>全部标为已读</div>
                <div className="content" style={{position: 'relative'}}>
                  {
                    noticeData && noticeData.map(item => (
                      <div className={item.is_read ? "notice-item read" : "notice-item"}>
                        <div className="notice-item-title">
                          {this.getNoticeTitle(item.message_type)}
                          {
                            !item.is_read ? <img src={require('../../../assets/images/seller/new_icon.png')} alt=""/> : null
                          }
                        </div>
                        <div className="notice-item-content">
                          <span className="desc">{item.message_content}</span>
                          <span className="operate" onClick={() => this.toOperate(item.seller_massage_id, item.message_type, item.order_id, item.buyer_id, item.after_id, item.return_id)}>{this.getNoticeAction(item.message_type)} ></span>
                        </div>
                      </div>
                    ))
                  }
                  <Pagination current={page} pageSize={size} total={total} onChange={this.onPageChange} />
                </div>
              </Fragment>
            )
          }
        </div>
      </div>
    )
  }
  onPageChange = (page) => {
    this.setState({
      page
    }, () => {
      this.getNotice()
    })
  }
  getNoticeTitle(noticeType) {
    switch(noticeType) {
      case 'message_shipment':
        return '发货提醒';
      case 'message_afterSeller':
        return '售后提醒';
      case 'message_sellesReturn':
        return '退款提醒';
      case 'message_newOrder':
        return '待付款提醒';
      case 'message_afterPay':
        return '新订单提醒'
      default:
        return ''
    }
  }
  getNoticeAction(noticeType) {
    switch(noticeType) {
      case 'message_shipment':
        return '前往发货';
      case 'message_afterSeller':
      case 'message_sellesReturn':
        return '前往处理';
      case 'message_newOrder':
      case 'message_afterPay':
        return '前往查看';
      default:
        return ''
    }
  }
  // 去处理通知消息
  toOperate = (messageId, messageType, orderId, buyerId, afterId, returnId) => {
    httpRequest.post({
      url: sellerApi.home.notice,
      data: {
        seller_massage_id: messageId
      }
    }).then(res => {
      this.getNotice()
    })

    if (messageType == 'message_afterSeller') {  // 售后
      this.props.history.push(`/seller/orders/aftermarketDetail/${afterId}/${buyerId}`)
    } else if (messageType == 'message_sellesReturn') {  // 退款
      this.props.history.push(`/seller/orders/refundDetail/${orderId}/${returnId}`)
    } else {  // 发货，新订单
      this.props.history.push(`/seller/orders/orderInfo/${orderId}`)
    }
  }
  // 全部已读
  readAll = () => {
    httpRequest.post({
      url: sellerApi.home.allRead
    }).then(res => {
      this.getNotice()
    })
  }
}
const mapDispatch = (dispatch) => {
	return {
    setNoticeCount(count) {
      dispatch(actionCreator.setNoticeCount(count))
    }
	}
}
export default connect(null, mapDispatch)(Notice)

