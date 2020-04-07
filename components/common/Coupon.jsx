import React, { Fragment } from 'react';
import { Popover, message } from "antd";
import CommonUtil from "utils/common";
import httpRequest from "utils/ajax";
import api from "utils/api";
import './style/coupon.scss'
import { withRouter, Link } from 'react-router-dom';
import lang from "assets/js/language/config";

let coupon=lang.common.coupon;
/**
 * 优惠券列表
 * list 为列表数据 具体看接口返回数据结构进行调整
 */
class Coupon extends React.Component {
  static defaultProps = {
  }
  constructor(props) {
    super(props);

    this.state = {
      // list: [
      //   {
      //     type: 1,
      //     is_receive: false,
      //     hasmore: true,
      //   },
      //   {
      //     type: 2,
      //     is_receive: true,
      //   },
      //   {
      //     type: 2,
      //     isexpiredst: true,
      //   },
      // ]
      list: props.data
    }

  }

  moreClick (index) {
    // this.state.list[index].hasmore = true;
    // this.setState({
    //   list: this.state.list
    // });
  }
  // 领取优惠券
  getCoupon (couponId, item) {
    if (!item.is_receive) {
      httpRequest.post({
        url: api.shop.getCoupon,
        data: {
          coupon_id: couponId
        }
      }).then(res => {
        message.success(coupon.getsuccess);
        item.is_receive = 1;
        this.setState({
          list: this.state.list
        });
      })
    } else {
      this.props.history.push(`//search/goods/`)
    }
  }
  render () {
    const { list } = this.state;
    return (
      <div className="couponlist">
        <ul className='clearfix'>
          {
            list.length > 0 ? list.map((item, index) => {
              return (
                <li className={item.use_end_time * 1000 < Date.now() ? 'expiredcoupon' : item.shop_id == 0 ? 'fullplatform' : item.shop_id > 0 ? 'shopcoupon' : ''} key={index}>
                  <div className="couponleftbox">
                    <h4 className="amount_a"><u>{lang.common.$}</u> <span>{item.coupon_type == 0 ? parseInt(item.discount_price) : parseFloat(item.discount_price)}</span></h4>
                    <p className="full_a">
                      {CommonUtil.formatCouponsTit(item)}
                    </p>
                    {
                      /* {item.coupon_type == 0 ?
                      <Fragment>
                        <p className="full_a">满{parseInt(item.start_price)}减{parseInt(item.discount_price)}</p>
                      </Fragment>
                      : <p className="full_a">{item.discount_price}折卷</p>
                    } */
                    }
                  </div>
                  <div className="couponrightbox">
                    <p className="available">{item.shop_id == 0 ? coupon.allcanuse : item.shop_name + coupon.allcanuse}</p>
                    {/* <p className={i.hasmore ? 'userof textover' : 'userof'}>{item.remark}</p> */}
                    <p className={'userof textover'}>{item.remark}</p>
                    <Popover placement="bottomLeft" title={''} content={<p>{item.remark}</p>} trigger="hover">
                      <div className='desciription'>{coupon.moreExplanation} ></div>
                    </Popover>
                    {/* {!i.hasmore ? null : <div className="desciription" onClick={this.moreClick.bind(this, index)}>更多说明>
                    <div className="bubble">
                        <h2>22</h2>
                        <p>111</p>
                      </div>
                    </div>} */}
                    {item.use_time_type_id == 0 ?
                      <p className={"timep"}>{CommonUtil.formatDate(item.use_start_time * 1000, "yyyy-MM-dd hh:mm:ss")} - {CommonUtil.formatDate(item.use_end_time * 1000, "yyyy-MM-dd hh:mm:ss")}</p>
                      :
                      <p className={"timep"}>{coupon.receive}{Number(item.use_days_time) / 3600 / 24}{coupon.day}{coupon.effective}</p>
                    }
                    {item.use_end_time * 1000 < Date.now() ? (<p className="expired"><a><img src={require('assets/images//user/ygq.png')} /></a></p>) :
                      item.is_receive ? <p className="user_p">
                        {
                          item && item.shop_id == 0 &&
                          <Link className="lk-0" to={'//search/goods/'}>{effective.touse}</Link>
                        }
                        {
                          item && item.shop_id !== 0 && item.goods_category_range == 0 &&
                          <Link className="lk-1" to={`//shop/${item.shop_id}/goodslist/search/all`}>{effective.touse}</Link>
                        }
                        {
                          item && item.shop_id !== 0 && item.goods_category_range == 1 &&
                          <Link className="lk-2" to={`//shop/${item.shop_id}/goodslist/search/all?coupon=1&couponId=${item.coupon_id}`}>{effective.touse}</Link>
                        }
                        {/* <a>{item.is_receive ? '去使用' : '领取'}</a> */}

                      </p> : <p className="user_p" onClick={this.getCoupon.bind(this, item.coupon_id, item)}><a>{coupon.receive}</a></p>
                    }
                  </div>
                  {item.is_receive && item.use_end_time * 1000 > Date.now() ?
                    <img className='getcoupon' src={require('assets/images//common/getcoupon1.png')} alt="" /> : null
                  }
                </li>
              )
            }) : null
          }

          {/* <li className='shopcoupon'>
            <div style={{ background: '#DB923C' }} className="couponleftbox">
              <span>
                <a className="amount_a">￥50</a>
                <a className="full_a">满999减50</a>
              </span>
            </div>
            <div className="couponrightbox">
              <p className="available">悟空某店店铺可用</p>
              <p className="userof">用于用于名片、定制设计类目...</p>
              <p className="desciription">更多说明></p>
              <p className="timep">2018.06.28 00:00:00 - 2019.09.56 23:59:59</p>
              <p className="user_p"><a style={{ background: '#DB923C' }}>去使用</a></p>
            </div>
          </li>
          <li>
            <div className="couponleftbox">
              <span>
                <a className="amount_a">￥50</a>
                <a className="full_a">满999减50</a>
              </span>
            </div>
            <div className="couponrightbox">
              <p className="available">全平台可用</p>
              <p className="userof">用于用于名片、定制设计类目...</p>
              <p className="desciription">更多说明></p>
              <p className="timep">2018.06.28 00:00:00 - 2019.09.56 23:59:59</p>
              <p className="user_p"><a>去使用</a></p>
            </div>
          </li>
          <li className='expiredcoupon'>
            <div style={{ background: '#D1D1D1' }} className="couponleftbox">
              <span>
                <a className="amount_a">￥50</a>
                <a className="full_a">满999减50</a>
              </span>
            </div>
            <div className="couponrightbox" style={{ background: '#F3F3F3' }}>
              <p className="available expiredst">全平台可用</p>
              <p className="userof expiredst">用于用于名片、定制设计类目...</p>
              <p className="desciription expiredst">更多说明></p>
              <p className="timep expiredst">2018.06.28 00:00:00 - 2019.09.56 23:59:59</p>
              <p className="expired"><a><img src={require('assets/images//user/ygq.png')} /></a></p>
            </div>
          </li> */}
        </ul>
      </div>
    )
  }
}

export default withRouter(Coupon);
