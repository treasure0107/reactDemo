import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { Icon } from 'antd';


const OrderItem = (props) => {
  return(
    <div className="order_item">
                  <p className="time">2019-06-19 12:31:20</p>
                  <p>
                    <Link to="/">
                   <img src="https://oss.ecoprint.tech/data/gallery_album/142/thumb_img/1559764927619723203.png" width="50" height="50" />
                   </Link>
                  </p>
                  <p className="flexHor">
                    <span className="flex1"><em>¥10.00</em><em>在线支付</em></span>
                    <span className="name">曾星星</span>
                  </p>
                  <p className="flexHor">
                    <Link to="/" className="flex1">查看</Link>
                    <Link to="/" className="flex1 track">跟踪&gt;</Link>
                  </p>
                </div>
  )
}

class Order extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="order_wrap">
                <OrderItem></OrderItem>
            </div>
        )
    }
}

export default connect(
   
)(Order)