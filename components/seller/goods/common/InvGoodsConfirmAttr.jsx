import React, {Component} from 'react';
import $ from 'jquery';
import UserDefinedAttrModal from './UserDefinedAttrModal';
import {connect} from 'react-redux'
import {actionCreator} from "../store";
import comUtil from 'utils/common.js'

import {Button, Select, Input, message} from 'antd';

const {Option} = Select;

class InvGoodsConfirmAttr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastActive: 2,
      active: 4,
      attrList: []
    };
  }

  nextStepInvAttr(active) {
    let flagPrice = true;
    let flagqty = true;
    this.props.sku_list && this.props.sku_list.map((item, index) => {
      if (item.price <= 0) {
        flagPrice = false;
      }
      if (item.sku_qty < 0) {
        flagqty = false;
      }
    });
    if (flagPrice && flagqty) {
      this.props.activeValue(active);
    }
    if (!flagPrice) {
      message.error("单价必须大于0");
    }
    if (!flagqty) {
      message.error("请输入库存数量");
    }
  }

  lastStep(active) {
    this.props.activeValue(active);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps, nextContext) {


  }

  handleChangeSkuSn(index, e) {
    let new_sku_list = this.props.sku_list;
    new_sku_list[index].sku_sn = e.target.value;
    this.props.saveSkuList(new_sku_list);
  }

  handleChangePrice(index, e) {
    let new_sku_list = this.props.sku_list;
    new_sku_list[index].price = e.target.value;
    this.props.saveSkuList(new_sku_list);
  }

  handleChangeMarketPrice(index, e) {
    let new_sku_list = this.props.sku_list;
    new_sku_list[index].market_price = e.target.value;
    this.props.saveSkuList(new_sku_list);
  }

  handleChangeSkuQty(index, e) {
    let new_sku_list = this.props.sku_list;
    new_sku_list[index].sku_qty = e.target.value;
    this.props.saveSkuList(new_sku_list);
  }

  render() {
    return (
        <div className="attr-main">
          <div className="goods-tit">
            <span className="tit-icon activeColor">确定商品属性</span>
            <span className="ml5">{this.props.classifyName}</span>
          </div>
          <div className="inv-attr-mian mt20">
            <div className="inv-attr-header inv-item clearfix">
              <div className="h-item w300">商品SKU属性</div>
              <div className="h-item w160">货号</div>
              <div className="h-item w100"><span className="asterisk">* </span> 单价(元)</div>
              <div className="h-item w100">划线价(元)</div>
              <div className="h-item w80"><span className="asterisk">* </span> 库存(个)</div>
            </div>
            {this.props.sku_list &&
            this.props.sku_list.map((item, index) => {
              return (
                  <div className="inv-con clearfix" key={index}>
                    <div className="inv-item  w300">{item.sku_attrs_name}</div>
                    <div className="inv-item w160">

                      <Input className="h28" value={item.sku_sn}
                             onChange={this.handleChangeSkuSn.bind(this, index)}/>
                    </div>
                    <div className="inv-item w100">
                      <Input className="h28" value={item.price} type="number"
                             onChange={this.handleChangePrice.bind(this, index)}/>
                    </div>
                    <div className="inv-item w100">
                      <Input className="h28" value={item.market_price} type="number"
                             onChange={this.handleChangeMarketPrice.bind(this, index)}/>
                    </div>
                    <div className="inv-item w80">
                      <Input className="h28" value={item.sku_qty} type="number"
                             onChange={this.handleChangeSkuQty.bind(this, index)}/>
                    </div>
                  </div>
              )
            })
            }
          </div>
          <div className="btn-box mt60">
            <Button className="btn" onClick={this.lastStep.bind(this, this.state.lastActive)}>上一步</Button>
            <Button type="primary" className="btn ml30"
                    onClick={this.nextStepInvAttr.bind(this, this.state.active)}>下一步</Button>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    specificationList: state.goods.specificationList,
    sku_list: state.goods.sku_list,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveSpecificationListFour(list) {
      dispatch(actionCreator.getQuotationAttrs(list))
    },
    saveQuotationInfo(quotation_info) {
      dispatch(actionCreator.getQuotationInfo(quotation_info))
    },
    saveSkuList(list) {
      dispatch(actionCreator.getSkuList(list))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InvGoodsConfirmAttr);