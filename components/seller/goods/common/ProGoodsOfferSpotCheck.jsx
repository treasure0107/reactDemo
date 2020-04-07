import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Input, Button, Select, Icon, Modal, message} from 'antd';
import {connect} from "react-redux";
import {actionCreator} from "../store";
import {Radio} from "antd/lib/radio";
import comUtil from 'utils/common.js';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import SpotPricesModal from './SpotPricesModal';

const InputGroup = Input.Group;
const {Option} = Select;

class ProGoodsOfferSpotCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastActive: 3,
      active: 5,
      dataSource: 0,
      ModalTitle: "名片",
      visible: false,
      benchmark_price: "0.00",
      discountList: [],
      numberArr: [],
      discountArr: [],
      step_price: [],
      weight: 0,
      isDraft: 0,
      draft_id: 0,
    };
    this.addDiscount = this.addDiscount.bind(this);
    this.handleLadderDiscount = this.handleLadderDiscount.bind(this);
  }

  componentDidMount() {
    let goods_id = this.props.match.params.goods_id;
    let draft_id = window.sessionStorage.getItem("draft_id");
    if (goods_id > 0) {
      this.setState({isDraft: false, draft_id});
    } else {
      this.setState({isDraft: true, draft_id});
    }
  }

  //编辑，后台返回的 step_list 重组
  anewDiscountList(step_list) {
    let discountList = [];
    step_list && step_list.length > 0 && step_list.map((item, index) => {
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

  componentWillReceiveProps(nextProps, nextContext) {
    let step_list = nextProps.step_price || [];
    if (nextProps.goods_id > 0) {
      this.anewDiscountList(step_list);
    } else {
      let draft_id = this.props.match.params.draft_id;
      if (draft_id > 0) {
        this.anewDiscountList(step_list);
      }
    }
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
    // numberArr.sort(function (a, b) {
    //   return a - b;
    // });
    // discountArr.sort(function (a, b) {
    //   return b - a;
    // });

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

  sum(arr) {
    let s = 0;
    arr.forEach(function (val, idx, arr) {
      let item = parseFloat(val);
      s += item;
    }, 0);
    return s;
  }

  nextStepFive(active) {
    let flag = false;
    let status = false;
    let benchmark_price = this.props.quotation_info.benchmark_price;
    let minArr = [];
    let sumPrice = "";
    let minPriceArr = [];
    this.props.quotation_attrs && this.props.quotation_attrs.map((item, index) => {
      let arr = [];
      item && item.attr_value.map((param, i) => {
        let sumPrice = this.sumWay(param.price, benchmark_price);
        arr.push(param.price);
        if (sumPrice == "NaN") {
          flag = true;
        }
        if (sumPrice <= 0) {
          status = true;
        }
        if (comUtil.isEmpty(param.price)) {
          param.price = 0
        }
      });

      arr.sort(function (a, b) {
        return a - b;
      });
      let min = arr[0];
      minArr.push(min)
    });
    if (!comUtil.isEmpty(minArr)) {
      minArr.map((item, index) => {
        let price = item.toString();
        if (price.indexOf("-") == 0) {
          minPriceArr.push(price)
        }
      });
      if (minPriceArr.length == 0) {
        sumPrice = benchmark_price
      } else {
        sumPrice = this.sum(minPriceArr)
      }
    }
    if (parseFloat(benchmark_price) + parseFloat(sumPrice) <= 0) {
      message.error("商品属性的差价组合必须大于0！");
      return false;
    }
    if (flag) {
      message.error("商品属性的差价输入有误！");
      return false;
    }

    if (status) {
      message.error("商品价格必须大于0！");
      return false;
    }
    setTimeout(() => {
      let discountList = this.state.discountList;
      this.ladderDiscount(discountList);
      this.props.activeValue(active);
    }, 900)
  }

  lastStepFive(active) {
    this.props.activeValue(active);
  }

  //保存草稿，返回列表
  saveDrafts() {
    let draft_id = window.sessionStorage.getItem("draft_id");
    this.nextStepFive(4);
    let unitId = this.props.unitId;
    let unit_name = this.props.unit_name;
    setTimeout(() => {
      let discountList = this.state.discountList;
      this.ladderDiscount(discountList);
      if (draft_id > 0) {
        httpRequest.put({
          url: sellerApi.goods.draft,
          data: {
            draft_id: draft_id,
            page_index: 4,
            goods_draft: {
              goods: this.props.goods,
              basicList: this.props.basicList,
              specificationList: this.props.specificationList,
              specification_hide: this.props.specification_hide,
              quotation_info: this.props.quotation_info,
              quotation_attrs: this.props.quotation_attrs,
              step_price: this.state.step_price,
              unit: unitId,
              unit_name: unit_name
            }
          }
        }).then(res => {
          if (res.code == "200") {
            this.props.history.push(`/seller/goods/GoodsDraftList`);
          }
        })
      } else {
        httpRequest.post({
          url: sellerApi.goods.draft,
          data: {
            page_index: 4,
            goods_draft: {
              goods: this.props.goods,
              basicList: this.props.basicList,
              specificationList: this.props.specificationList,
              specification_hide: this.props.specification_hide,
              quotation_info: this.props.quotation_info,
              quotation_attrs: this.props.quotation_attrs,
              step_price: this.props.step_price,
              unit: unitId,
              unit_name: unit_name
            }
          }
        }).then(res => {
          if (res.code == "200") {
            this.props.history.push(`/seller/goods/GoodsDraftList`);
          }
        })
      }
    }, 900);
  }

  //获取重量
  getWeight(attr_values_list, count) {
    httpRequest.post({
      url: sellerApi.goods.getWeight,
      data: {
        attr_values_list: attr_values_list,
        count: count
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          weight: res.data.weight
        })
      }
    })
  }

  showModal() {
    this.setState({
      visible: true,
    });
    this.ladderDiscount(this.state.discountList);
    let list = this.props.quotation_attrs;
    let quotation_info = this.props.quotation_info;
    let attrIdArr = [];
    let printNum = 1;
    list && list.map((item, index) => {
      let param = item.attr_value[0].attr_value_id;
      attrIdArr.push(param)
    });
    if (!comUtil.isEmpty(quotation_info)) {
      printNum = parseFloat(quotation_info.benchmark_num)
    }

    if (this.props.valid_id == 5) {
      this.setState({
        weight: this.props.goods.weight
      })
    } else {
      this.getWeight(attrIdArr, printNum);
    }
  };

  handleOk(e) {
    this.setState({
      visible: false,
    });
  };

  handleCancel(e) {
    this.setState({
      visible: false,
    });
  };

  discountOnChange(index, e) {
    let reg = /^([1-9]{1})$|^([1-9]\d)$/;
    let discount = "";
    if (reg.test(e.target.value)) {
      discount = e.target.value
    }
    // let discount = e.target.value.replace(/[^(\-|\+)?\d+(\.\d+)?$]/g, '');
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

  handleOnChangeAttr(index, i, e) {
    let val = e.target.value.replace(/[^(\-|\+)?\d+(\.\d+)?$]/g, '');
    let newQuotation_attrs = this.props.quotation_attrs;
    newQuotation_attrs[index].attr_value.map((item, j) => {
      if (j == i) {
        item.price = val;
      }
    });
    this.props.saveSpecificationListFive(newQuotation_attrs);
  }

  numberOnBlur(index, e) {

  }

  discountOnBlur(index, e) {
    this.ladderDiscount(this.state.discountList);
  }

  addDiscount() {
    let obj = {number: "", saleNum: ""};
    this.setState({
      discountList: [...this.state.discountList, obj]
    });
  }

  handleLadderDiscount() {
    this.ladderDiscount(this.state.discountList)
  }

  delRow(index) {
    let _data = this.state.discountList.splice(index, 1);
    this.setState({
      discountList: this.state.discountList
    })
  }

  sumWay(a, b) {
    if (comUtil.isEmpty(a) || a == "-" || a == "+") {
      a = 0
    }
    if (comUtil.isEmpty(b)) {
      b = 0
    }
    let sum = (parseFloat(a) + parseFloat(b)).toFixed(2);
    return sum;
  }

  getDiscountItem() {
    let _this = this;
    return (_this.state.discountList &&
      _this.state.discountList.map((item, index) => {
        return (
          <div className="discount-item" key={index}>
            <div className="num">
              <Input placeholder="300" value={item.number} onChange={_this.numberOnChange.bind(_this, index)}
                // onBlur={this.numberOnBlur.bind(_this, index)}
                     className="h28 w80"/>
            </div>
            <div className="discount">
              <Input placeholder="99" value={item.saleNum} onChange={_this.discountOnChange.bind(_this, index)}
                // onBlur={this.discountOnBlur.bind(_this, index)}
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
    const {isDraft, draft_id} = this.state;
    return (
      <div className="attr-main attr-offer-main">
        <div className="goods-tit">
          <span className="tit-icon activeColor">确定生产成品报价</span>
          <span className="ml5">{this.props.classifyName}</span>
          <span className="fs12">经典名片  (基准报价
            <span>{this.props.quotation_info && this.props.quotation_info.benchmark_price}</span>
            元)</span>
        </div>
        <div className="pt20 pb20">
          <span className="tit-icon">基准商品属性</span>
          <span className="tit-icon" style={{"marginLeft": 160}}>其它属性组合的商品报价</span>
          <span>(填写 <span>{this.props.quotation_info && this.props.quotation_info.benchmark_num}</span>
            <span>{this.props.unit_name}</span> 时, 每项属性与基准商品属性的差价, + 或 - )</span>
        </div>
        <div>
          <table className="attr-table">
            <tbody>
            {this.props.quotation_attrs &&
            this.props.quotation_attrs.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="w80 textAlignCenter bgceb">{item.attr.attr_name}</td>
                  {item.attr_value && item.attr_value.map((params, i) => {
                    if (i == 0) {
                      return (
                        <React.Fragment key={i}>
                          <td className="w120 textAlignCenter bgcF">{params.attr_value}</td>
                        </React.Fragment>
                      )
                    }
                  })}
                  <td>
                    <ul>
                      {item.attr_value && item.attr_value.map((params, i) => {
                        if (i > 0) {
                          return (
                            <React.Fragment key={i}>
                              <li className="ml40 pr10">
                                <div className="attr-name">{params.attr_value}</div>
                                <div>
                                  <Input placeholder="如0.5或-0.5" value={params.price}
                                         onChange={this.handleOnChangeAttr.bind(this, index, i)}
                                         className="h28 w100"/>
                                  <span className="price addColor">
                                          {this.sumWay(params.price, this.props.quotation_info.benchmark_price)}
                                        </span>
                                  <span>元</span>
                                </div>
                              </li>
                            </React.Fragment>
                          )
                        }
                      })}
                    </ul>
                  </td>
                </tr>
              )
            })
            }
            </tbody>
          </table>
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
                <Button type="primary" className="add-discount" onClick={this.addDiscount}>
                  添加阶梯折扣
                </Button>
                {/*<Button type="primary" className="ml10 h28" onClick={this.handleLadderDiscount}>*/}
                {/*  排序*/}
                {/*</Button>*/}
              </div>
            </div>
            {/* <div className="discount-item">
                <div className="num basic-number">{this.props.quotation_info.benchmark_num}</div>
                <div className="discount">
                  <span className="displayInlineBlock w80">1.00</span>
                  <span className="ml29">原价</span>
                </div>
                <div className="dis-btn">
                  <div className="del-btn">
                  </div>
                </div>
              </div>*/}
            {this.getDiscountItem()}
          </div>

        </div>
        <div className=" mt30 pt10 pb10">
          <Button type="primary" className="btn ml16" onClick={this.showModal.bind(this)}>报价抽查</Button>
        </div>
        <div className="btn-box mt60">
          <Button className={`fl ml30 goods-btn ${isDraft ? "show" : " hide"}`}
                  onClick={this.saveDrafts.bind(this)}>保存草稿，返回列表</Button>
          <Button className={`btn ${draft_id > 0 ? "hide" : null}`}
                  onClick={this.lastStepFive.bind(this, this.state.lastActive)}>上一步</Button>
          <Button type="primary" className="btn ml30"
                  onClick={this.nextStepFive.bind(this, this.state.active)}>下一步</Button>
        </div>
        <Modal
          title={this.state.ModalTitle}
          visible={this.state.visible}
          width={640}
          footer={null}
          destroyOnClose={true}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          wrapClassName="spot-Modal">
          <div>
            <SpotPricesModal quotation_attrs={this.props.quotation_attrs}
                             unit={this.props.unit_name}
                             quotation_info_basic={this.props.quotation_info}
                             weight={this.state.weight}
                             step_price_new={this.state.step_price}/>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    quotation_attrs: state.goods.quotation_attrs,
    quotation_info: state.goods.quotation_info,
    goods_id: state.goods.goods_id,
    step_price: state.goods.step_price,
    goods: state.goods.goods,
    specificationList: state.goods.specificationList,
    basicList: state.goods.basicList,
    unitId: state.goods.unitId,
    unit_name: state.goods.unit_name,
    valid_id: state.goods.valid_id
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveSpecificationListFive(list) {
      dispatch(actionCreator.getQuotationAttrs(list))
    },
    saveStepPrice(list) {
      dispatch(actionCreator.getStepPrice(list))
    }
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProGoodsOfferSpotCheck));
