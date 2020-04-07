import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Button, Select, message} from 'antd';
import {connect} from 'react-redux'
import {actionCreator} from "../store";
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import ProGoodsRecommend from "./ProGoodsRecommend"
import comUtil from 'utils/common.js';

const {Option} = Select;

class ProGoodsReleaseAssociated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastActive: 4,
      active: 6,
      disabledBtn: false,
      draft_id: 0,
      goods_type: 0
    }
  }

  nextStepSix(active) {
    this.setState({
      disabledBtn: true
    }, () => {
      setTimeout(() => {
        this.setState({
          disabledBtn: false
        })
      }, 3000)
    });
    let draft_id = this.props.match.params.draft_id;
    let goodslinkgoods = this.props.goodslinkgoods;
    let shopType = this.props.shopType;
    let payment_info = this.props.payment_info;
    let private_shop_id = 0;
    let goods = this.props.goods;
    let goods_type = goods.goods_type;
    let sku_list = this.props.sku_list;
    let quantity = this.props.quantity;
    if (payment_info) {
      if (payment_info.buyer_id == 0) {
        payment_info = ""
      } else {
        private_shop_id = payment_info.buyer_id;
      }
    }
    if (this.props.goods_id > 0) {
      let goods_id = this.props.goods_id || this.props.match.params.goods_id;
      if (this.props.valid_id != 5) {
        goods.weight = 0
      }
      let editData = {};
      if (goods_type == 0) {
        editData = {
          shop_type: shopType,
          goods: goods,
          basicList: this.props.basicList,
          unit: this.props.unitId,
          sku_sn: this.props.sku_sn,
          goodslinkgoods: goodslinkgoods,
          payment_info: payment_info,
          specification_hide: this.props.specification_hide_list,
          sku_list: sku_list,
          quantity: quantity,
          quotation_attr: {
            quotation_attrs: this.props.specificationList,
            step_price: [],
          },
          valid_id: this.props.valid_id
        };
      } else {
        editData = {
          shop_type: shopType,
          goods: goods,
          quotation_info: this.props.quotation_info,
          quotation_attr: {
            quotation_attrs: this.props.quotation_attrs,
            step_price: this.props.step_price,
          },
          basicList: this.props.basicList,
          unit: this.props.unitId,
          sku_sn: this.props.sku_sn,
          goodslinkgoods: goodslinkgoods,
          payment_info: payment_info,
          specification_hide: this.props.specification_hide_list,
          valid_id: this.props.valid_id
        };

      }

      httpRequest.post({
        url: sellerApi.goods.sellerGoods + "?goods_id=" + goods_id,
        data: editData
      }).then(res => {
        if (res.code == "200") {
          if (shopType != 0 && private_shop_id != 0) {
            this.sePermissions(private_shop_id);
          }
          this.props.activeValue(active);
          this.props.history.push(`/seller/goods/goodsList/0`);
        } else {
          message.error(res.data)
        }
      })
    } else {
      let data = {};
      if (goods_type == 0) {
        data = {
          shop_type: shopType,
          goods: this.props.goods,
          basicList: this.props.basicList,
          unit: this.props.unitId,
          sku_sn: this.props.sku_sn,
          goodslinkgoods: goodslinkgoods,
          payment_info: payment_info,
          specification_hide: this.props.specification_hide_list,
          sku_list: sku_list,
          quantity: quantity,
          quotation_attr: {
            quotation_attrs: this.props.specificationList,
            step_price: [],
          },
        };
      } else {
        data = {
          shop_type: shopType,
          goods: this.props.goods,
          quotation_info: this.props.quotation_info,
          quotation_attr: {
            quotation_attrs: this.props.quotation_attrs,
            step_price: this.props.step_price,
          },
          basicList: this.props.basicList,
          unit: this.props.unitId,
          sku_sn: this.props.sku_sn,
          goodslinkgoods: goodslinkgoods,
          payment_info: payment_info,
          specification_hide: this.props.specification_hide_list,
          valid_id: this.props.valid_id,
        };
      }
      httpRequest.post({
        url: sellerApi.goods.sellerGoods,
        data: data
      }).then(res => {
        if (res.code == "200") {
          if (shopType != 0 && private_shop_id != 0) {
            this.sePermissions(private_shop_id);
          }
          if (draft_id > 0) {
            let draft_list = [];
            draft_list.push(draft_id);
            this.deleteDraft(draft_list)
          }
          this.props.activeValue(active);
          this.props.history.push(`/seller/goods/goodsList/0`)
        } else {
          message.error(res.data)
        }
      })
    }
    window.sessionStorage.setItem("isPublish", "0");
  }

  lastStepSix(active) {
    let {goods_type} = this.state;
    if (goods_type == 1) {
      this.props.activeValue(active);
    } else {
      this.props.activeValue(3);
    }
  }

  sePermissions(private_shop_id) {
    httpRequest.patch({
      url: sellerApi.goods.sePermissions + private_shop_id + "/",
      data: {
        "private_pay": 1
      }
    }).then(res => {

    })
  }

//删除接口草稿
  deleteDraft(draft_list) {
    httpRequest.delete({
      url: sellerApi.goods.draft,
      data: {
        draft_list: draft_list,
      }
    }).then(res => {
      if (res.code == "200") {

      }
    })

  }

  componentDidMount() {
    let draft_id = window.sessionStorage.getItem("draft_id");
    this.setState({draft_id});
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return
    }
  }

  render() {
    const {draft_id} = this.state;
    return (
      <div className="attr-main release-main">
        <div className="goods-tit">
          <span className="tit-icon activeColor">确定商品属性</span>
          <span className="ml5">{this.props.classifyName}</span>
        </div>
        <ProGoodsRecommend/>
        <div className="btn-box mt60">
          <Button className={`btn ${draft_id > 0 ? "hide" : null}`}
                  onClick={this.lastStepSix.bind(this, this.state.lastActive)}>上一步</Button>
          <Button type="primary" className="btn ml30" disabled={this.state.disabledBtn}
                  onClick={this.nextStepSix.bind(this, this.state.active)}>立即发布</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    goods_id: state.goods.goods_id,
    goods: state.goods.goods,
    quotation_info: state.goods.quotation_info,
    quotation_attrs: state.goods.quotation_attrs,
    specification_hide_list: state.goods.specification_hide_list,
    basicList: state.goods.basicList,
    step_price: state.goods.step_price,
    shopType: state.sellerLogin.loginInfo.shopType,
    goodslinkgoods: state.goods.goodslinkgoods,
    payment_info: state.goods.payment_info,
    unitId: state.goods.unitId,
    sku_list: state.goods.sku_list,
    specificationList: state.goods.specificationList,
    quantity: state.goods.quantity,
    unit_name: state.goods.unit_name,
    valid_id: state.goods.valid_id
  }
};
export default connect(mapStateToProps, null)(withRouter(ProGoodsReleaseAssociated));