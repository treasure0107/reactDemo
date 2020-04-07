import React, {Component} from 'react';
import $ from 'jquery';
import {Input, Button, Select, Icon, Modal, Checkbox, message} from 'antd';
import {connect} from "react-redux";
import {actionCreator} from "../store";
import {Radio} from "antd/lib/radio";

const InputGroup = Input.Group;
const {Option} = Select;

class InvGoodsAttrPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastActive: 3,
      active: 5,
      dataSource: 0,
      benchmark_price: "0.00",
      discountList: [],
      numberArr: [],
      discountArr: [],
      step_price: []
    };
    this.addDiscount = this.addDiscount.bind(this);
    this.handleLadderDiscount = this.handleLadderDiscount.bind(this);
  }

  componentDidMount() {

  }

  //编辑，后台返回的 step_list 重组
  anewDiscountList(step_list) {
    let discountList = [];
    step_list && step_list.map((item, index) => {
      let stepObj = {
        number: "",
        saleNum: ""
      };
      stepObj.number = Object.keys(item)[0];
      stepObj.saleNum = item[Object.keys(item)[0]];
      discountList.push(stepObj)
    });
    this.setState({
      discountList
    })
  }

  ladderDiscount(arr) {
    let numberArr = [];
    let discountArr = [];
    let step_price = [];
    let discountList = [];
    arr.map((item, index) => {
      numberArr.push((item.number || 100));
      discountArr.push((item.saleNum || 100));
    });
    numberArr.sort(function (a, b) {
      return a - b;
    });
    discountArr.sort(function (a, b) {
      return b - a;
    });

    numberArr.map((item, index) => {
      let obj = {};
      obj[item] = discountArr[index];
      step_price.push(obj)
    });
    this.props.saveStepPrice(step_price);
    this.setState({
      step_price: step_price
    });

    this.state.discountList.map((item, index) => {
      item.number = numberArr[index];
      item.saleNum = discountArr[index];
      discountList.push(item)
    });
    this.setState({
      discountList: discountList
    })
  }

  nextStepFive(active) {
    setTimeout(() => {
      let discountList=this.state.discountList;
      this.ladderDiscount(discountList);
      this.props.activeValue(active);
    }, 900)

  }

  lastStepFive(active) {
    this.props.activeValue(active);
  }

  discountOnChange(index, e) {
    let reg = /^([1-9]{1})$|^([1-9]\d)$/;
    // let discount = e.target.value.replace(/[^(\-|\+)?\d+(\.\d+)?$]/g, '');
    let discount = "";
    if (reg.test(e.target.value)) {
      discount = e.target.value
    }
    setTimeout(() => {
      let _newDiscountList = this.state.discountList;
      _newDiscountList[index].saleNum = discount;
      this.setState({
        discountList: _newDiscountList
      });
    }, 100)

  }

  numberOnChange(index, e) {
    let reg = /\D/g;
    let num = e.target.value.replace(reg, "");
    setTimeout(() => {
      let _newDiscountList = this.state.discountList;
      _newDiscountList[index].number = num;
      this.setState({
        discountList: _newDiscountList
      });
    }, 100)
  }

  addDiscount() {
    let objDiscount = {
      number: "",
      saleNum: ""
    };
    this.setState({
      discountList: [...this.state.discountList, objDiscount]
    });
  }

  handleLadderDiscount() {
    this.ladderDiscount(this.state.discountList)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let step_list = nextProps.step_price;
    if (nextProps.goods_id > 0) {
      this.anewDiscountList(step_list);
    }
  }

  delRow(index) {
    let _data = this.state.discountList.splice(index, 1);
    this.setState({
      discountList: this.state.discountList
    });
  }

  getDiscountItem() {
    let _this = this;
    return (_this.state.discountList &&
        _this.state.discountList.map((item, index) => {
          return (
              <div className="discount-item" key={index}>
                <div className="num">
                  <Input placeholder="300" value={item.number} onChange={_this.numberOnChange.bind(_this, index)}
                         className="h28 w80"/>
                </div>
                <div className="discount">
                  <Input placeholder="99" value={item.saleNum} onChange={_this.discountOnChange.bind(_this, index)}
                         className="h28 w80"/> %
                  <span className="dis-num ml29"><span>{item.saleNum / 10}</span>折</span>
                </div>
                <div className="dis-btn">
                  <div className="del-btn">
                    <Icon type="delete"/>
                    <span className="del" onClick={this.delRow.bind(_this, index)}>删除</span>
                  </div>
                </div>
              </div>
          )
        })
    )
  }

  render() {
    return (
        <div className="attr-main attr-offer-main">
          <div className="goods-tit">
            <span className="tit-icon activeColor">确定批量折扣</span>
            <span className="ml5">{this.props.classifyName}</span>
          </div>

          <div>
            <div className="pt20 pb16">
              <span className="tit-icon">阶梯折扣</span>
              <span>(购买数量大于基准印数时的报价，数量越大，折扣越低)</span>
            </div>
            <div className="discount-main">
              <div className="discount-tit discount-item">
                <div className="num">数量</div>
                <div className="discount">折扣</div>
                <div className="dis-btn">
                  <Button type="primary" className="add-discount"
                          onClick={this.addDiscount}>添加阶梯折扣</Button>

                  <Button type="primary" className="ml10 h28"
                          onClick={this.handleLadderDiscount}>排序</Button>
                </div>
              </div>
              <div className="discount-item">
                <div className="num basic-number">100</div>
                <div className="discount">
                  <span className="displayInlineBlock w80">1.00</span>
                  <span className="ml29">原价</span>
                </div>
                <div className="dis-btn">
                  <div className="del-btn">
                  </div>
                </div>
              </div>
              {this.getDiscountItem()}
            </div>

          </div>
          <div className="btn-box mt60">
            <Button className="btn" onClick={this.lastStepFive.bind(this, this.state.lastActive)}>上一步</Button>
            <Button type="primary" className="btn ml30"
                    onClick={this.nextStepFive.bind(this, this.state.active)}>下一步</Button>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    goods_id: state.goods.goods_id,
    step_price: state.goods.step_price,
    goods: state.goods.goods,
  }
};


const mapDispatchToProps = (dispatch) => {
  return {
    saveStepPrice(list) {
      dispatch(actionCreator.getStepPrice(list))
    }
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(InvGoodsAttrPrice);