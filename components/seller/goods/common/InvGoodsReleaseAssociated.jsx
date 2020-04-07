import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Button, message} from 'antd';

import {connect} from 'react-redux'
import {actionCreator} from "../store";
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import GoodsReleaseAssociated from "./GoodsReleaseAssociated"

class InvGoodsReleaseAssociated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastActive: 4,
      active: 6
    }
  }


  nextStepSix(active) {
    let goods_id = this.props.goods_id;
    let goodslinkgoods = this.props.goodslinkgoods;
    let shopType = this.props.shopType;
    if (goods_id > 0) {
      let spu_id = this.props.spu_id;
      let goods = this.props.goods;
      goods.goods_id = goods_id;
      goods.spu_id = spu_id;
      let editData = {
        shop_type: shopType,
        goods: goods,
        quotation_info: {
          basic: this.props.basicList,
          specification: this.props.specificationList,
          specification_hide: this.props.specification_hide_list
        },
        sku_list: this.props.sku_list,
        step_price: this.props.step_price,
        unit: this.props.unitId,
        sku_sn: this.props.sku_sn,
        goodslinkgoods: goodslinkgoods
      };
      httpRequest.put({
        url: sellerApi.goods.shopGoods,
        data: editData
      }).then(res => {
        if (res.code == "200") {
          this.props.history.push(`/seller/goods/goodsList/0`)
        } else {
          message.error(res.msg)
        }
      })

    } else {
      let data = {
        shop_type: shopType,
        goods: this.props.goods,
        quotation_info: {
          basic: this.props.basicList,
          specification: this.props.specificationList,
          specification_hide: this.props.specification_hide_list
        },
        sku_list: this.props.sku_list,
        step_price: this.props.step_price,
        unit: this.props.unitObj.id,
        sku_sn: this.props.sku_sn,
        goodslinkgoods: goodslinkgoods
      };
      httpRequest.post({
        url: sellerApi.goods.shopGoods,
        data: data
      }).then(res => {
        if (res.code == "200") {
          this.props.history.push(`/seller/goods/goodsList/0`)
        } else {
          message.error(res.msg)
        }
      })
    }
    this.props.activeValue(active);
  }

  lastStepSix(active) {
    this.props.activeValue(active);
  }

  render() {
    return (
        <div className="attr-main release-main">
          <div className="goods-tit">
            <span className="tit-icon activeColor">确定商品属性</span>
            <span className="ml5">{this.props.classifyName}</span>
          </div>
          <GoodsReleaseAssociated/>
          <div className="btn-box mt60">
            <Button className="btn" onClick={this.lastStepSix.bind(this, this.state.lastActive)}>上一步</Button>
            <Button type="primary" className="btn ml30"
                    onClick={this.nextStepSix.bind(this, this.state.active)}>立即发布</Button>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    goods: state.goods.goods,
    quotation_info: state.goods.quotation_info,
    quotation_attrs: state.goods.quotation_attrs,
    basicList: state.goods.basicList,
    specificationList: state.goods.specificationList,
    specification_hide_list: state.goods.specification_hide_list,
    sku_list: state.goods.sku_list,
    step_price: state.goods.step_price,
    goods_id: state.goods.goods_id,
    unitId: state.goods.unitId,
    shopType: state.sellerLogin.loginInfo.shopType,
    goodslinkgoods: state.goods.goodslinkgoods
  }
};
export default connect(mapStateToProps, null)(withRouter(InvGoodsReleaseAssociated));