import React, {Component, Fragment} from 'react';
import {Timeline} from 'antd';
import './style/logistics.scss';
import lang from "assets/js/language/config";

const logistics = lang.common.logistics;

/**
 * 物流信息组件
 * data 传进来的数据
 * logisticsname 物流名称
 * logisticsnumber 物流单号
 * list 物流具体流程线数据
 * show 是否显示更多 默认不显示全部 只显示前面5条 后面一条
 * showlength 默认显示（前面）多少条 默认5条 最小是1 也就是最少有3条以上的数据才可以展开
 * className 传进来name
 */
class Logistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      // data: props.data ? props.data : { logisticsname: '申通快递', logisticsnumber: '61123121', list: [{ text: '2019-09-08 17:28:09  快件已签收 ,签收人：代风雷【18123733033】。如果您对我的服务感到满意,给个五星好不好?感谢使用韵快递，期待再次为您服务！' }, { text: '2019-09-08 14:58:09【金华市】浙江义乌北苑公司' }, { text: '2019-09-08 15:01:01【金华市】已离开 浙江义乌北苑公司；发往 广东深圳公司1' },{ text: '2019-09-08 14:58:09【金华市】浙江义乌北苑公司' }, { text: '2019-09-08 15:01:01【金华市】已离开 浙江义乌北苑公司；发往 广东深圳公司1' }] },
      data: props.data ? props.data : {
        express_type: 0, "id": 7,
        "consignee": "shawn",
        "mobile": "15899878568",
        "country_id": "1",
        "province_id": "2",
        "city_id": "3",
        "area_id": "4",
        "street_id": "5",
        "address": "",
        "express_id": null,
        "express_sn": null,
        "create_time": 1561532208,
        "express_type": 0,
        "estimated_time": null,
        "express_company": null,
        "email": "huateng@qq.com"
      },
      showlength: props.showlength > 0 ? props.showlength : 5,
      className: props.className ? props.className : '',
    }
  }

  showset(val) {
    this.setState({
      show: val
    })
  }

  render() {
    const {data, modifyExpress, status, from, isDisc} = this.props;
    const showlength = this.props.showlength ? this.props.showlength : 5;
    const className = this.props.className ? this.props.className : '';
    const {show} = this.state;
    // console.log('data', data);
    return (
      <div className={className ? className + ' logistics' : 'logistics'}>
        {/* <h2>物流信息</h2> */}
        <div className={from === 'Order' ? 'goodsImgDiv' : ''}>
          <img
            src={this.props.logisticsImg && this.props.logisticsImg.order_goods[0] ? this.props.logisticsImg.order_goods[0]['goods_img'] : null}/>
        </div>
        <ul>
          <li style={{...this.props.style}}>
            <div>
              <span>
                {logistics.deliveryMode}
                {data.express_type == 0 ? logistics.ordinaryExpress :
                  data.express_type == 1 ? logistics.cityDistribution :
                    data.express_type == 3 ? '无需配送' : logistics.noTime}</span>
            </div>
            <Fragment>
              <div>
                <span>{logistics.logisticsCompany}{data.express_type == 3 ? logistics.noTime : (data.express_company || logistics.noTime)}</span>
              </div>
              <div>
                <span>{logistics.logisticsNum}{data.express_type == 3 ? logistics.noTime : (data.express_sn || logistics.noTime)}</span>
              </div>
            </Fragment>
            {/* status == 5  待收货 */}
            {
              modifyExpress && status == 5 && isDisc ? <div className="modifyExpress"
                                                            onClick={() => modifyExpress(data.express_company, data.express_id, data.express_sn)}>修改</div> : null
            }
          </li>
          <li className={from === 'Order' ? 'logtracking-li' : ''}>
            <span>{logistics.logisticsTracking}{!data.order_trace || data.order_trace.length == 0 ? logistics.noTime : ''}</span>
            {data.order_trace && data.order_trace.length > 0 &&
            <Timeline>

              {data.order_trace && data.order_trace.length >= showlength + 2 ? (
                // data.list.map((i, index) => {
                <Fragment>
                  {data.order_trace.map((i, index) => {
                    return (
                      index < showlength ? <Timeline.Item key={new Date().getTime() + index}><p
                        className={index == 0 ? 'red' : ''}>{i.create_time + i.remark}</p></Timeline.Item> : null
                    )
                  })
                  }
                  {show ? data.order_trace.map((i, index) => {
                      return (

                        index >= showlength ?
                          <Timeline.Item key={new Date().getTime() + index}><p className=''>{i.create_time + i.remark}</p>
                          </Timeline.Item> : null
                      )
                    })
                    :
                    <Fragment>
                      <Timeline.Item>... ... <span className="show"
                                                   onClick={this.showset.bind(this, true)}>{logistics.more}</span></Timeline.Item>

                      <Timeline.Item><p>
                        {data.order_trace[data.order_trace.length - 1].create_time + data.order_trace[data.order_trace.length - 1].remark}</p>
                      </Timeline.Item>
                    </Fragment>
                  }
                </Fragment>
                // })
              ) : data.order_trace && data.order_trace.length > 0 ? (
                data.order_trace.map((i, index) => {
                  return (
                    <Timeline.Item key={new Date().getTime() + index}>
                      <p className={index == 0 ? 'red' : ''}>{i.create_time + i.remark}</p>
                    </Timeline.Item>
                  )
                })
              ) : (
                // <Timeline.Item>
                //   <p>暂无</p>
                // </Timeline.Item>
                null
              )
              }
              {/* <Timeline.Item> <p class='red'>{data.list[0].text}</p></Timeline.Item> */}

              {/* <Timeline.Item> <p>Solve initial network problems 2015-09-01</p></Timeline.Item>
              {
                show ? (
                  <Fragment>
                    <Timeline.Item> <p>Solve initial network problems 2015-09-01</p></Timeline.Item>
                    <Timeline.Item> <p>Solve initial network problems 2015-09-01</p></Timeline.Item>
                  </Fragment>
                ) : <Timeline.Item>... ... <span className="show" onClick={this.showset.bind(this, true)}>展开更多</span></Timeline.Item>
              }
              <Timeline.Item> <p>Solve initial network problems 2015-09-01</p></Timeline.Item> */}
            </Timeline>

            }
          </li>
        </ul>
      </div>
    )
  }

}

export default Logistics;
