import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Title from '../common/Title';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import { BigNumber } from 'bignumber.js';
import comUtil from 'utils/common.js'
import defultShopLogo from 'assets/images/defultShopLogo.png';
import homeIndexBanner from 'seller/images/homeIndexBanner.png';

let format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0
}
BigNumber.config({ FORMAT: format })
import _ from 'lodash';
import '../common/style/welcome.scss';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        "sales": {
          "h5_sales_data": [0, 0],[笔数，金额]
          "yesterday_sales_data": [2, 2.3],
          "total_sales_data": [2, 2.3],
          "daily_sales_data": [[0, 1], [0, 2], [0, 3]],[pc端[笔数，金额]，app端[笔数，金额],h5端[笔数，金额]]
          "pc_sales_data": [2, 2.3],pc端总销量，总金额
          "monthly_sales_data": [0, 0],
          "app_sales_data": [0, 0]
        },
        "goods": {
          "goods_hot": 0,热销
          "goods_waitcheck": 23,待审核
          "goods_promotion": 25,促销中
          "goods_sellout": 25,已售罄
          "goods_onsales": 2,出售中
          "goods_offsales": 23已下架
        },
        "order": {
          "order_day_after": 0,已完成
          "as_back": 0,待退货
          "order_recevied": 0,待收货
          "order_obligations": 0,待付款
          "order_cofirm": 1,待确认
          "order_waitcomment": 0,待评价
          "as_wait_deal": 0,待处理
          "order_send": 0,待发货
          "order_accept": 0,待接单
          "as_recevied": 0待卖家收货
        }
      }
    }
  }
  componentDidMount() {
    this.getData()
  }
  getData = (data, type) => {
     console.log(data)
    httpRequest.get({
      url: sellerApi.home.home_report,
    }).then(res => {
      this.setState({
        data: res.data
      })
    }).catch(() => {
    })
  }
  render() {
    let { data } = this.state;
    let h5_sales_data = _.get(data, 'sales.h5_sales_data', [0, 0]);
    let yesterday_sales_data = _.get(data, 'sales.yesterday_sales_data', [0, 0]);
    let total_sales_data = _.get(data, 'sales.total_sales_data', [0, 0]);
    let daily_sales_data = _.get(data, 'sales.daily_sales_data', [[0, 0], [0, 0], [0, 0]]);
    let pc_sales_data = _.get(data, 'sales.pc_sales_data', [0, 0]);
    let monthly_sales_data = _.get(data, 'sales.monthly_sales_data', [[0, 0], [0, 0], [0, 0]]);
    let app_sales_data = _.get(data, 'sales.app_sales_data', [0, 0]);

    let all_order = _.get(data, 'sales.all_order', 0);
    let as_all_order = _.get(data, 'order.as_all_order', 0);
    let coupons_count = _.get(data, 'activity.coupons_count', 0);

    let goods_hot = _.get(data, 'goods.goods_hot', 0);
    let goods_waitcheck = _.get(data, 'goods.goods_waitcheck', 0);
    let goods_promotion = _.get(data, 'goods.goods_promotion', 0);
    let goods_sellout = _.get(data, 'goods.goods_sellout', 0);
    let goods_onsales = _.get(data, 'goods.goods_onsales', 0);
    let goods_offsales = _.get(data, 'goods.goods_offsales', 0);

    let order_day_after = _.get(data, 'order.order_day_after', 0);
    let as_back = _.get(data, 'order.as_back', 0);
    let order_recevied = _.get(data, 'order.order_recevied', 0);
    let order_obligations = _.get(data, 'order.order_obligations', 0);
    let order_cofirm = _.get(data, 'order.order_cofirm', 0);
    let order_waitcomment = _.get(data, 'order.order_waitcomment', 0);
    let as_wait_deal = _.get(data, 'order.as_wait_deal', 0);
    let order_send = _.get(data, 'order.order_send', 0);
    let order_accept = _.get(data, 'order.order_accept', 0);

    let mobile = _.get(data, 'shop_baseinfo.shop_mobile', 0);
    let email = _.get(data, 'shop_baseinfo.shop_email', '邮箱暂未填写');

    let as_recevied = _.get(data, 'order.as_recevied', '');

    let address = _.get(data, 'shop_baseinfo.shop_address', '');
     console.log('this.props.shopType', this.props.shopType)
    const { logo, shopName, lastLoginTime, username, shopType, history } = this.props
    return (
      <div className='seller-welcome-page'>
        <Title title={'欢迎使用商家管理中心'} />
        {/*<img src={homeIndexBanner} className='banner-img' onClick={()=>{*/}
        {/*window.open('/pc/cash/index.html')*/}
        {/*}}/>*/}
        <div className='head-box'>
          <div className='head-left-detail'>
            <img className='user-icon' src={logo ? logo : defultShopLogo} />
            <div className='content-box-welcome'>
              <div className='user-detail-box'>
                <div className='detaile-title-box'>
                  <div className='title'>{shopName}</div>
                  <div className='last-lgoin-time'>最后登录时间：{lastLoginTime}</div>
                </div>
                <div className='user-type-box'>
                  <div className='type-box'>
                    <div>用户名</div>
                    <div>{username}</div>
                  </div>
                  <div className='type-box'>
                    <div>店铺类型</div>
                    <div>{
                      shopType == 0 || shopType == 2 ? '公有店' : shopType == 1 || shopType == 5 ? '私有店' : shopType == 3 || shopType == 4 ? '私域店' : ''
                    }</div>
                  </div>
                  <div className='type-box'>
                    <div>管理权限</div>
                    <div>管理员</div>
                  </div>
                </div>
              </div>
              <div className='user-service-box'>
                <div className='service-content' style={{ cursor: 'pointer' }} onClick={() => {
                  history.push('/seller/orders/OrderList')
                }}>
                  <div><span className='iconfont icondaichuli'></span>全部订单</div>
                  <div>{all_order}</div>
                </div>
                <div className='service-content' style={{ cursor: 'pointer' }} onClick={() => {
                  history.push('/seller/orders/aftermarket')
                }}>
                  <div><span className='iconfont iconshouhou'></span>售后订单</div>
                  <div>{as_all_order}</div>
                </div>
                <div className='service-content' style={{ cursor: 'pointer' }} onClick={() => {
                  history.push('/seller/promotion/salesactivity')
                }}>
                  <div><span className='iconfont iconyouhuiquan'></span>当前优惠活动</div>
                  <div>{coupons_count}</div>
                </div>
                {/* <div className='service-content'>
                  <div><span className='iconfont iconmessage'></span>待回复商品咨询</div>
                  <div>0</div>
                </div> */}
              </div>
            </div>
            {/* <div>
              <section className='title'>
                黑白
                 </section>
              <section className='content-box'>
                <section>用户名:<span>anny</span></section>
                <section>店铺类型:<span>公有店</span></section>
              </section>
              <section className='content-box'>
                <section>管理权限:<span>管理员</span></section>
                <section>最后登录:<span>2019-09-10</span></section>
              </section>
              <section className='content-box needBorder'>
                <section>待处理订单 <span>1</span></section>
                <section>当前优惠活动 <span>1</span></section>
                <section>售后订单 <span>1</span></section>
                <section>待回复商品咨询 <span>1</span></section>
              </section>
            </div> */}
          </div>
          <div className='head-right-detail'>
            <div className='right-content-box'>
              <div className='icon-box'><span className='iconfont icondianhuashouye'></span></div>
              <div className='detail-box'>{mobile}</div>
            </div>
            <div className='right-content-box'>
              <div className='icon-box'><span className='iconfont iconyouxiangshouye'></span></div>
              <div className='detail-box'>{email ? email : '邮箱暂未填写'}</div>
            </div>
            <div className='right-content-box'>
              <div className='icon-box'><span className='iconfont iconlocation'></span></div>
              <div className='detail-box'>{address}</div>
            </div>
          </div>

          {/* <div>
            <section className='content-box'>
              联系方式
            </section>
            <section className='content-box'>
              电话:<span>0755-26881688</span>
            </section>
            <section className='content-box'>
              邮箱:<span>annyloveyou@qq.com</span>
            </section>
            <section className='content-box'>
              地址:<span>深圳大道1688号企鹅大厦52F</span>
            </section>
          </div> */}
        </div>
        <Title title={'商品提示'} />
        <div className='goods-Prompt-box'>
          {
            [{ title: '出售中', count: goods_onsales, status: 1 }, { title: '已下架', count: goods_offsales, status: 2 },
            { title: '待审核', count: goods_waitcheck, status: 3 },
             { title: '已售罄', count: goods_sellout, status: 4 },
            { title: '促销中', count: goods_promotion, status: 0 }].map((item, index) => {
              return <section key={new Date().getTime() + index}>
                <Link to={"/seller/goods/goodsList/" + item.status}>
                  {item.title}<span>{item.count}</span>
                </Link>

              </section>
            })
          }
        </div>
        <Title title={'订单提示'} />
        <div className='goods-Prompt-box'>
          {
            [{ title: '待接单', count: order_accept, status: 1, type: 1 }, { title: '待付款', count: order_obligations, status: 2, type: 1 },
            { title: '待发货', count: order_send, status: 4, type: 1 }, {
              title: '待售后', count:
                as_wait_deal + as_back + as_recevied
              , status: 1, type: 2
            },
            { title: '已完成', count: order_day_after, status: 7, type: 1 }].map((item, index) => {
              return <section key={new Date().getTime() + index}>
                <Link to={item.type == 1 ? "/seller/orders/OrderList/" + item.status : "/seller/orders/aftermarket"}>
                  {item.title}<span>{item.count}</span>
                </Link>
              </section>
            })
          }
        </div>
        <Title title={'销售统计'} />
        <div className='statistics-box'>
          <div className='count-statistics-box'>
            <div className='count-line-box'>
              <div className='count-content-box'>
                <div className='title'>今日销售</div>
                <div className='count-detail today-count'>
                  <div><span>
                    {
                      parseFloat(new BigNumber(daily_sales_data.reduce((pre, next) => {
                        if (next) {
                          if (Array.isArray(pre)) {
                            return pre[0] + next[0]
                          } else {
                            return pre + next[0]
                          }
                        } else {
                          if (Array.isArray(pre)) {
                            return pre[0]
                          } else {
                            return pre
                          }
                        }
                      })).decimalPlaces(2))
                    }
                  </span>笔</div>
                  <div><span>
                    {
                      parseFloat(new BigNumber(daily_sales_data.reduce((pre, next) => {
                        if (next) {
                          if (Array.isArray(pre)) {
                            return pre[1] + next[1]
                          } else {
                            return pre + next[1]
                          }
                        } else {
                          if (Array.isArray(pre)) {
                            return pre[1]
                          } else {
                            return pre
                          }
                        }
                      })).decimalPlaces(2))
                    }
                  </span>元</div>
                </div>
              </div>
              <div className='count-content-box'>
                <div className='title'>月销售</div>
                <div className='count-detail'>
                  <div><span>{monthly_sales_data[0]}</span>笔</div>
                  <div><span>{monthly_sales_data[1]}</span>元</div>
                </div>
              </div>
            </div>
            <div className='count-line-box'>
              <div className='count-content-box'>
                <div className='title'>昨日销售</div>
                <div className='count-detail'>
                  <div><span>{yesterday_sales_data[0]}</span>笔</div>
                  <div><span>{yesterday_sales_data[1]}</span>元</div>
                </div>
              </div>
              <div className='count-content-box'>
                <div className='title'>总销售</div>
                <div className='count-detail'>
                  <div><span>{total_sales_data[0]}</span>笔</div>
                  <div><span>{total_sales_data[1]}</span>元</div>
                </div>
              </div>
            </div>
          </div>
          <div className='sell-count-box'>
            <div className='count-line-box'>
              <div className='count-content-box'>
                <div className='title'><span className='iconfont icondiannaoshouye'></span>PC销售</div>
                <div className='count-detail today-count'>
                  <div><span>{pc_sales_data[0]}</span>笔</div>
                  <div><span>{pc_sales_data[1]}</span>元</div>
                </div>
              </div>
            </div>
            <div className='count-line-box'>
              <div className='count-content-box'>
                <div className='title'><span className='iconfont iconshoujishouye'></span>手机销售</div>
                <div className='count-detail today-count'>
                  <div><span>{app_sales_data[0]}</span>笔</div>
                  <div><span>{app_sales_data[1]}</span>元</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  let { lastLoginTime, username, logo, shopName, shopType } = state.sellerLogin.loginInfo;
  return {
    lastLoginTime, username, logo, shopName, shopType
  }
}

export default connect(mapState, null)(Welcome)
