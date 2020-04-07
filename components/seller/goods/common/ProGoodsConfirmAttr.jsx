import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import UserDefinedAttrModal from './UserDefinedAttrModal';
import {Icon, Button, Select, Input, message, Modal} from 'antd';
import {actionCreator} from '../store';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js';

const {Option} = Select;

class ProGoodsConfirmAttr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goods_id: "",
      lastActive: 1,
      active: 3,
      sku_sn: '',
      attrDefinedList: [],
      attrList: [],
      specificationList: [],
      oldSpecificationList: [],
      specification_hide_list: [],
      basicList: [],
      attr_list_hide: [],
      attrId: "",
      attrName: "",
      isAddAttrItemSelect: 0,
      isDraft: 0,
      draft_id: 0
    }
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

  componentWillReceiveProps(nextProps, nextContext) {
    let basicList = nextProps.basicList;
    let specificationList = nextProps.specificationList;
    let specification_hide_list = nextProps.specification_hide_list;
    let oldSpecificationList = JSON.parse(JSON.stringify(specificationList));
    this.setState({
      basicList: basicList,
      specificationList: specificationList,
      specification_hide_list: specification_hide_list,
      oldSpecificationList: oldSpecificationList
    })
  }

  //下一步
  nextStepThree() {
    let active = this.state.active;
    let specificationList = this.state.specificationList;
    let oldSpecificationList = this.state.oldSpecificationList;
    let goods_id = this.props.goods_id;
    let arrSkuList = [];
    if (!comUtil.isEmpty(specificationList)) {
      if (specificationList.length == 0) {
        message.warning("您选择的商品分类没有规格属性(请添加)");
        return false;
      }
      //庫存类才SKU组合
      if (this.props.goods_type == 0) {
        let oldSpecificationList = this.state.oldSpecificationList;
        let oldSpecListStr = JSON.stringify(oldSpecificationList);
        let specListStr = JSON.stringify(specificationList);
        if (oldSpecListStr == specListStr) {
          arrSkuList = this.attrSKU(oldSpecificationList);
        } else {
          arrSkuList = this.attrSKU(specificationList);
          this.props.saveSkuList(arrSkuList);
        }
      }

    } else {
      message.warning('请添加规格属性');
      return false;
    }
    let basicList = this.state.basicList;
    let attr_is_default_num = 0;
    let basicAttrIdList = [];
    basicList && basicList.map((item, index) => {
      if (item.attr.is_must == 1) {
        basicAttrIdList.push(item.attr.attr_id);
      }
    });
    basicAttrIdList && basicAttrIdList.map((params, index) => {
      basicList && basicList.map((item, index) => {
        if (item.attr.attr_id == params) {
          item.attr_value && item.attr_value.map((param, i) => {
            if (param.is_default == 1) {
              attr_is_default_num += 1
            }
          })
        }
      });
    });
    if (attr_is_default_num < basicAttrIdList.length) {
      message.warning('必选的基本属性不能为空');
      return false;
    }
    this.props.activeValue(active);
    this.props.saveBasicList(this.state.basicList);
    let oldSpecificationListStr = JSON.stringify(oldSpecificationList);
    let specificationListStr = JSON.stringify(specificationList);
    if (oldSpecificationListStr != specificationListStr) {
      this.props.saveSkuList("");
      specificationList && specificationList.length > 0 && specificationList.map((item, index) => {
        item.attr.is_checked = 0;
      })
    }
    this.props.saveSpecificationListThree(specificationList);
  }

  //上一步
  lastStepThree(active) {
    this.props.activeValue(active);
  }

  //保存草稿，返回列表
  saveDrafts() {
    let draft_id = window.sessionStorage.getItem("draft_id");
    let {basicList, specificationList, specification_hide_list} = this.state;
    let attr_is_default_num = 0;
    let basicAttrIdList = [];
    basicList && basicList.map((item, index) => {
      if (item.attr.is_must == 1) {
        basicAttrIdList.push(item.attr.attr_id);
      }
    });
    basicAttrIdList && basicAttrIdList.map((params, index) => {
      basicList && basicList.map((item, index) => {
        if (item.attr.attr_id == params) {
          item.attr_value && item.attr_value.map((param, i) => {
            if (param.is_default == 1) {
              attr_is_default_num += 1
            }
          })
        }
      });
    });
    this.props.saveBasicList(basicList);
    this.props.saveSpecificationListThree(specificationList);

    let unitId = this.props.unitId;
    let unit_name = this.props.unit_name;
    let goods_draft = {
      goods: this.props.goods,
      basicList: basicList,
      specificationList: specificationList,
      specification_hide: specification_hide_list,
      unit: unitId,
      unit_name: unit_name
    };

    if (draft_id > 0) {
      httpRequest.put({
        url: sellerApi.goods.draft,
        data: {
          draft_id: draft_id,
          page_index: 2,
          goods_draft: goods_draft

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
          page_index: 2,
          goods_draft: goods_draft
        }
      }).then(res => {
        if (res.code == "200") {
          this.props.history.push(`/seller/goods/GoodsDraftList`);
        }
      })
    }

  }

  //删除单个属性
  delAttr(index, attr_id, i) {
    let specificationList = this.state.specificationList;
    let arr = specificationList[index].attr_value;
    let attr_list_hide = specificationList[index].attr_list_hide || [];
    if (arr.length == 1) {
      message.warning("属性值最少保留一项");
      return false;
    }
    let attr_item = specificationList[index].attr_value.splice(i, 1);
    attr_list_hide.push(attr_item[0]);
    this.setState({
      specificationList,
      attr_list_hide
    })
  }

  //添加属性值
  handleChangeGoodsAttrName(index, value, params) {
    if (comUtil.isEmpty(value)) {
      return false;
    }
    let newSpecificationList = this.state.specificationList;
    let attr_list_hide = newSpecificationList[index].attr_list_hide;
    let attr_id = attr_list_hide[0].attr_id;
    let attrObj = {};
    attrObj.attr_value = value;
    attrObj.attr_value_id = parseFloat(params.key);
    attrObj.price = 0;
    attrObj.is_default = 0;
    attrObj.attr_id = attr_id;
    newSpecificationList[index].attr_value.push(attrObj);
    newSpecificationList[index].attr_list_hide = attr_list_hide.filter((item) => {
      if (item.attr_value_id != attrObj.attr_value_id) {
        return item;
      }
    });
    this.setState({
      specificationList: newSpecificationList,
      attrId: '',
      attrName: '',
    })
  }

  //  库存类
  specificationListFun(specificationList) {
    let newList = [];
    for (let i = 0; i < specificationList.length; i++) {
      newList.push(specificationList[i].attr_value)
    }
    return newList
  }

  //SKU 组合
  attrSKU(specificationList) {
    var arr = this.specificationListFun(specificationList);
    //初始化
    var result = new Array();
    var arrSKU = new Array();
    //字符串形式填充数组
    for (var i = 0; i < arr[0].length; i++) {
      result.push(JSON.stringify(arr[0][i]));
    }
    //从下标1开始遍历二维数组
    for (var i = 1; i < arr.length; i++) {
      //使用临时遍历替代结果数组长度(这样做是为了避免下面的循环陷入死循环)
      var size = result.length;
      for (var j = 0; j < size; j++) {
        for (var k = 0; k < arr[i].length; k++) {
          var temp = result[0] + "," + JSON.stringify(arr[i][k]);
          result.push(temp);
        }
        //当第一个成员组合完毕，删除这第一个成员
        result.shift();
      }
    }
    //转换字符串为json对象
    for (var i = 0; i < result.length; i++) {
      result[i] = JSON.parse("[" + result[i] + "]");
    }
    result && result.map((item, index) => {
      let objSKU = {}
      let sku_attrs_name = "";
      let sku_attrs_id_list = [];
      item.map((param, i) => {
        sku_attrs_name = param.attr_value + "   " + sku_attrs_name;
        sku_attrs_id_list.push(param.attr_value_id)
      });
      objSKU.sku_attrs_name = sku_attrs_name;
      objSKU.sku_attrs_id_list = sku_attrs_id_list;
      objSKU.price = "";
      objSKU.market_price = "";
      objSKU.sku_sn = "";
      objSKU.sku_qty = "";
      arrSKU.push(objSKU)
    });
    return arrSKU;
  }

  //选择基本属性
  handleChangeGoodsTypeBasic(attr_id, value) {
    let newBasicList = this.state.basicList;
    let attr_value_id = value;
    newBasicList.map((item, index) => {
      if (item.attr.attr_id == attr_id) {
        item.attr_value.map((param, i) => {
          if (attr_value_id == param.attr_value_id) {
            param.is_default = 1;
            item.attr.attr_value_id = param.attr_value_id
          } else {
            param.is_default = 0;
          }
        })
      }
    });
    setTimeout(() => {
      this.setState({
        basicList: newBasicList
      })
    });
    this.props.saveBasicList(newBasicList);
  }

  //添加属性值
  addAttr(id, i) {
    let {specificationList} = this.state;
    if (specificationList[i].attr_value && specificationList[i].attr_value.length >= 8) {
      message.warning("设置属性值，不能超过8个!")
    } else {
      this.setState({
        attrId: id
      })
    }
  }

  //添加选择属性项
  addAttrItem() {
    let specification_hide_list = this.state.specification_hide_list;
    this.setState({
      specification_hide_list: specification_hide_list,
      isAddAttrItemSelect: 1
    });
  }

  //选择属性项 组件
  addAttrItemSelect() {
    let _this = this;
    let isAddAttrItemSelect = this.state.isAddAttrItemSelect;
    return (
      <div className={`mt5 ${isAddAttrItemSelect == 1 ? null : " hide"}`}>
        <Select
          value=""
          className="select-item ml16 add-attr-item"
          onChange={this.handleAddAttrItemSelect.bind(_this)}
        >
          <Option value="">选择属性项</Option>
          {_this.state.specification_hide_list && _this.state.specification_hide_list.length > 0 &&
          _this.state.specification_hide_list.map((item, index) => {
            return (
              <Option value={item.attr.attr_id} key={index}>{item.attr.attr_name}</Option>
            )
          })
          }

        </Select>
      </div>
    )
  }

  //选择属性项
  handleAddAttrItemSelect(value) {
    if (value) {
      let specification_hide_list = this.state.specification_hide_list;
      let new_specification_hide_list = specification_hide_list.filter((item) => {
        if (item.attr.attr_id != value) {
          return item;
        }
      });
      let list = specification_hide_list.filter((item) => {
        if (item.attr.attr_id == value) {
          return item;
        }
      });
      if (list.length > 0) {
        let oldSpecificationList = this.state.specificationList;
        let newSpecificationList = oldSpecificationList.concat(list);
        this.setState({
          specificationList: newSpecificationList,
          specification_hide_list: new_specification_hide_list,
          isAddAttrItemSelect: 0
        }, () => {
          let specificationList = this.state.specificationList;
          let specification_hide_list = this.state.specification_hide_list;
          this.props.saveSpecificationListThree(specificationList);
          this.props.saveSpecificationHideList(specification_hide_list);
        })
      }
    }

  }

  //添加自定义属性项目
  addCustomAttr() {
    let customNum = 0;
    let specificationList = this.state.specificationList;
    specificationList && specificationList.map((item, index) => {
      if (item.attr.custom == 1) {
        customNum += 1
      }
    });
    if (customNum >= 3) {
      message.warning("自定义属性最多增加三条！");
      return false
    }
    let obj = {
      attr: {attr_name: "", attr_alias_name: ""},
      attr_value: [{attr_value: "",}]
    };
    let list = [obj];
    this.setState({
      // attrDefinedList: [...this.state.attrDefinedList, obj]
      attrDefinedList: list
    });
  }


  // 自定义属性值
  handleDefinedAttrVal(index) {
    let newAttrDefinedList = this.state.attrDefinedList;
    let new_attr_value = newAttrDefinedList[index].attr_value;
    if (new_attr_value.length >= 8) {
      message.warning("自定义属性值不能超过8个");
      return false
    }
    let attr_value = {attr_value: "",};
    new_attr_value.push(attr_value);
    this.setState({
      attrDefinedList: newAttrDefinedList
    })
  }

  //自定义属性 输入属性值
  handleDefinedAttrValueInput(index, j, e) {
    let newAttrDefinedList = this.state.attrDefinedList;
    newAttrDefinedList[index].attr_value[j].attr_value = e.target.value;
    this.setState({
      attrDefinedList: newAttrDefinedList
    })
  }

  //确定 创建属性项
  addSureDefinedAttr() {
    let attrDefinedListObj = this.state.attrDefinedList[0];
    let attr = attrDefinedListObj.attr;
    let isEmpty = false;
    if (comUtil.isEmpty(attr.attr_name)) {
      message.error("自定义属性项中属性名不能为空！");
      return false
    }
    attrDefinedListObj && attrDefinedListObj.attr_value.map((item, index) => {
      if (comUtil.isEmpty(item.attr_value)) {

        isEmpty = true
      }
    });
    if (isEmpty) {
      message.error("自定义属性项中属性值不能为空！");
      return false
    }
    httpRequest.post({
      url: sellerApi.goods.goodsShopAttr,
      data: attrDefinedListObj
    }).then(res => {
      if (res.code == "200") {
        let newAttrDefinedList = this.state.attrDefinedList.splice(0);
        this.setState({
          specificationList: [...this.state.specificationList, res.data]
        }, () => {
          let specificationList = this.state.specificationList;
          this.props.saveSpecificationListThree(specificationList);
        })
      }
    });
  }

  handleDefinedAttrItemInput(index, e) {
    let newAttrDefinedList = this.state.attrDefinedList;
    newAttrDefinedList[index].attr.attr_name = e.target.value;
    newAttrDefinedList[index].attr.attr_alias_name = e.target.value;
    this.setState({
      attrDefinedList: newAttrDefinedList
    })
  }

  //取消自定义属性项
  delUserDefinedAttrItem(index) {
    let _data = this.state.attrDefinedList.splice(index, 1);
    this.setState({
      attrDefinedList: this.state.attrDefinedList
    })
  }

  getAttrValueList(index, attrValue) {
    let newSpecificationList = this.state.specificationList;
    newSpecificationList[index].attr_value = newSpecificationList[index].attr_value.concat(attrValue);
    this.setState({
      specificationList: newSpecificationList
    })
  }

  //删除属性项
  delAttrRow(index) {
    let newSpecificationList = this.state.specificationList.splice(index, 1);
    this.setState({
      specificationList: this.state.specificationList,
      specification_hide_list: newSpecificationList
    })
  }

  //添加自定义属性项目 组件
  addUserDefinedAttrItem() {
    let _this = this;
    return (_this.state.attrDefinedList &&
      _this.state.attrDefinedList.map((item, index) => {
        return (
          <div className="UserDefinedAttrItem" key={index}>
            <div className="spec-attr-main mt15">
              <div className="spec-item">
                <div className="spec-tit bgc pt19 pb16 pl20">
                  <Input placeholder="300g铜版纸"
                         value={item.attr.attr_name}
                         onChange={this.handleDefinedAttrItemInput.bind(_this, index)}
                         className="w120 ml10"/>
                </div>
                <div className="spec-attr pt19 pb16">
                  <span className="tit pb16">属性值：</span>
                  {item.attr_value &&
                  item.attr_value.map((param, j) => {
                    return (
                      <Input key={j} value={param.attr_value}
                             onChange={this.handleDefinedAttrValueInput.bind(_this, index, j)}
                             className="w120 ml10"/>
                    )
                  })
                  }
                  <a href="javascript:void (0);"
                     className="ml16 add-attr attr-box borderNone displayInlineBlock"
                     onClick={this.handleDefinedAttrVal.bind(_this, index)}>
                    <span className={`${item.attr_value.length >= 8 ? "attr-d" : null}`}>自定义属性值</span>
                  </a>
                  <Button type="primary" className="btn ml20 h28"
                          onClick={this.addSureDefinedAttr.bind(_this)}>确定</Button>
                  <Button className="btn ml30 h28"
                          onClick={this.delUserDefinedAttrItem.bind(_this, index)}>取消</Button>
                </div>
              </div>
            </div>
          </div>
        )
      })
    )
  }

  render() {
    const {attrId, attrName, isDraft, draft_id} = this.state;
    return (
      <div className="attr-main">
        <div className="goods-tit">
          <span className="tit-icon activeColor">确定商品属性</span>
          <span className="ml5">{this.props.classifyName}</span>
          <span className="fs12">(多选，确定能够进行生产的所有商品；您选择的属性将供买家选择)</span>
        </div>
        <div className="pt20 pb20">
          <span className="tit-icon">基本属性</span>
          <span>(错误填写基本属性，可能导致您的产品下架或搜索流量减少，影响产品正常销售，请认真准确填写。标*必填)</span>
        </div>
        <div>
          {this.state.basicList &&
          this.state.basicList.map((item, index) => {
            return (
              <div className="pt10 pb10 displayInlineBlock" key={index}>
                  <span className="tit">
                    <span className={`asterisk ${item.attr.is_must == 1 ? null : " hide"}`}>* </span>
                    {item.attr.attr_name}：
                    </span>
                <Select
                  defaultValue={item.attr.attr_value_id}
                  value={item.attr.attr_value_id}
                  className="select-item"
                  onChange={this.handleChangeGoodsTypeBasic.bind(this, item.attr.attr_id)}>
                  {/*<Option value="">请选择</Option>*/}
                  {item.attr_value && item.attr_value.map((params, i) => {
                    return (
                      <Option value={params.attr_value_id} key={i}>
                        {params.attr_value}
                      </Option>
                    )
                  })}
                </Select>
              </div>
            )
          })
          }
        </div>
        <div>
          <div className="pt20 pb16"><span className="tit-icon">规格属性</span></div>
          <div className="spec-attr-main mt15">
            {this.state.specificationList &&
            this.state.specificationList.map((item, index) => {
              return (
                <div className="spec-item" key={index}>
                  <div className="spec-tit bgc pt19 pb16 pl20">
                      <span>
                        <span className={`asterisk ${item.attr.is_must == 1 ? null : " hide"}`}>* </span>
                        <span className={`${item.attr.is_must == 1 ? null : "ml10"}`}
                              data-attr_id={item.attr.attr_id}>
                          {item.attr.attr_name}
                        </span>
                      </span>
                  </div>
                  <div className="spec-attr pb10">
                    <span className="tit attr-box borderNone">属性值：</span>
                    {item.attr_value && item.attr_value.map((params, i) => {
                      return (
                        <div className="mb10 spec-attr-item displayInlineBlock ml10"
                             key={i}>
                            <span className="attr-box">
                              <span> {params.attr_value} </span>
                              {params.fixed != 1 ?
                                <Icon type="close-circle" className="close-icon" theme={"twoTone"}
                                      data-attr_id={params.attr_value_id}
                                      onClick={this.delAttr.bind(this, index, params.attr_value_id, i)}/> : null
                              }

                            </span>
                        </div>
                      )
                    })}
                    <Select
                      value={attrName}
                      className={`select-item ml30 add-attr-select mt10 ${item.attr.attr_id == attrId ? null : " hide"}`}
                      onChange={this.handleChangeGoodsAttrName.bind(this, index)}>
                      <Option value="">添加属性值</Option>
                      {
                        item.attr_list_hide &&
                        item.attr_list_hide.map((param, j) => {
                          return (
                            <Option value={param.attr_value}
                                    key={param.attr_value_id}>{param.attr_value}</Option>
                          )
                        })
                      }

                    </Select>
                    <a href="javascript:void (0);"
                       className={`ml30 ml10 add-attr attr-box borderNone displayInlineBlock ${item.attr_list_hide && item.attr_list_hide.length == 0 ? " hideNone" : null}`}
                       onClick={this.addAttr.bind(this, item.attr.attr_id, index)}>
                        <span
                          className={`${item.attr_value && item.attr_value.length >= 8 ? "attr-d" : null}`}>添加属性值</span>
                    </a>
                    {item.attr.is_limit_seller &&
                    item.attr.is_limit_seller == 1 ?
                      <UserDefinedAttrModal definedAttrValue={item.param_key_value}
                                            attrId={item.attr.attr_id}
                                            attrValueArr={item.attr_value}
                                            classifyId={this.props.classifyId}
                                            attrValueList={this.getAttrValueList.bind(this, index)}/> : null}

                  </div>
                  <div className="icon-close">
                      <span className={`iconfont iconguanbi1 fs20 ${item.attr.is_must == 1 ? "hide" : null}`}
                            onClick={this.delAttrRow.bind(this, index)}>
                      </span>
                  </div>
                </div>
              )
            })
            }
          </div>
        </div>
        <div className="bgc-tit mt30 pt10 pb10">
          <Button type="primary" className="btn ml16" onClick={this.addAttrItem.bind(this)}>添加属性项目</Button>
          <Button className="btn goods-btn ml16" onClick={this.addCustomAttr.bind(this)}>添加自定义属性项目</Button>
        </div>
        {this.addAttrItemSelect()}
        {this.addUserDefinedAttrItem()}
        <div className="btn-box mt60">
          <Button className={`fl ml30 goods-btn ${isDraft ? "show" : " hide"}`}
                  onClick={this.saveDrafts.bind(this)}>保存草稿，返回列表</Button>
          <Button className={`btn ${draft_id > 0 ? "hide" : null}`}
                  onClick={this.lastStepThree.bind(this, this.state.lastActive)}>上一步</Button>
          <Button type="primary" className="btn ml30"
                  onClick={this.nextStepThree.bind(this)}>下一步</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    classifyId: state.goods.classifyId,
    goods_id: state.goods.goods_id,
    unitId: state.goods.unitId,
    unit_name: state.goods.unit_name,
    basicList: state.goods.basicList,
    specificationList: state.goods.specificationList,
    specification_hide_list: state.goods.specification_hide_list,
    goods: state.goods.goods,
  }
};
const mapDispatch = (dispatch) => {
  return {
    saveSpecificationListThree(list) {
      dispatch(actionCreator.getSpecicationList(list))
    },
    saveBasicList(list) {
      dispatch(actionCreator.getBasicList(list))
    },
    saveSkuList(list) {
      dispatch(actionCreator.getSkuList(list))
    },
    saveSpecificationHideList(list) {
      dispatch(actionCreator.getSpecicationHideList(list))
    }
  }
};

export default connect(mapStateToProps, mapDispatch)(withRouter(ProGoodsConfirmAttr));


