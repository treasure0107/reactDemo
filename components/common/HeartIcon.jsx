import React, { Component, Fragment } from 'react';
import { Icon, message } from 'antd';
import { withRouter } from "react-router";
import httpRequest from 'utils/ajax';
import api from 'utils/api';
import './style/heart-icon.scss';




//样式需要再调用地方自己写对应的样式
//调用方法 <HeartIcon ></HeartIcon>


class HeartIcon extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props.goodid,'goods_id')
    this.state = {
      status: 0
    }
  }
  
  // 关注收藏商品方法
  heartFunc(goodsid) {
    let action = 'collect';
    httpRequest.put({
      url: api.mycollection.cancelcollection,
      data: {
        action: action,
        goods_id: goodsid
      }
    }).then(res => {
      message.success(res.msg)
    })
  };

  render() {
    return (
      <Fragment>
        <span className={"heart-box clearfix " + (this.props.status == 1 ? "heart-box-select" : "")} onClick={this.heartFunc.bind(this, this.props.goodsid)}>
          <Icon type="heart" />
          <span className="text">关注</span>
        </span>
      </Fragment>
    )
  }
}

export default withRouter(HeartIcon)