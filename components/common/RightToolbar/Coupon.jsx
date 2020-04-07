import React from 'react';
import {connect} from 'react-redux';
import { Icon } from 'antd';


const CouponItem = (props) => {
  return (
    <div className="item">
       <div className="c_wrap flexHor">
         <p className="flex1 c_price"><span className="token">￥</span>10</p>
         <div className="c_info">
            <p className="c_tit" title="13135">13135</p>
            <p className="condition">满0元可用</p>
          </div>
        </div>
       
        <p className="c_time">2019-06-05至2019-06-06</p>
    </div>
  )
}


class Coupon extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        <div className="coupon_wrap">
            <div className="tit">
              <span>可领取的券</span>
              <p className="line"></p>
            </div>
            <CouponItem></CouponItem>

            <div className="tit">
              <span>已领取的券</span>
              <p className="line"></p>
            </div>

        </div>
        )
    }
}

export default connect(
   
)(Coupon)