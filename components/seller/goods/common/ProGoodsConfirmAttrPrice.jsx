import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom'
import {Radio, Button, Select, Input, message, Checkbox, Icon, Modal} from 'antd';
import {connect} from 'react-redux'
import {actionCreator} from "../store";
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js';
import $ from 'jquery';

const {Option} = Select;

class ProGoodsConfirmAttrPrice extends Component {
  static defaultProps = {
    specificationList: []
  };

  constructor(props) {
    super(props);
    this.state = {
      lastActive: 2,
      active: 4,
      value: "1",
      specificationList: [],
      benchmark_attr: [],
      benchmark_num: "",
      benchmark_price: "",
      benchmark_unit_price: "0.00",
      allow_print_num: "",
      is_allow_int: "0",
      list: [],
      isNext: true,
      isDraft: 0,
      draft_id: 0,
      goods_type: 0,
      quantity: [],
      attr_id_list: [],
      attrList: [],
      skuList: [],
      skuListTable: [],
      specificationListChecked: [],
      visible: false,
      visibleCon: "",
      type: 0,
    }
  }

  nextStepFour(active) {
    let {goods_type} = this.state;
    if (goods_type == 1) {
      this.allowPrintNum();
      let benchmark_price = this.state.benchmark_price;
      let benchmark_num = this.state.benchmark_num;
      let allow_print_num = this.state.allow_print_num;
      let benchmark_unit_price = this.state.benchmark_unit_price;
      // 对选中的排序
      let newSpecificationList = this.props.specificationList;
      let benchmark_attr = [];
      for (let i = 0; i < newSpecificationList.length; i++) {
        let attr_value = newSpecificationList[i].attr_value;
        let arr = [];
        for (let j = 0; j < attr_value.length; j++) {
          if (attr_value[j].is_default === 1) {
            arr.unshift(attr_value[j]);
            benchmark_attr.push(attr_value[j].attr_id)
          } else {
            arr.push(attr_value[j])
          }
        }
        newSpecificationList[i].attr_value = arr;
      }
      this.setState({
        benchmark_attr: benchmark_attr
      });
      if (newSpecificationList.length != benchmark_attr.length) {
        message.warning('请每一项选择一个商品属性');
        return false;
      }
      if (comUtil.isEmpty(benchmark_num)) {
        message.error("请输入最小印数");
        return false;
      }
      if (!comUtil.isEmpty(benchmark_num)) {
        if (parseFloat(benchmark_num) < 1) {
          message.warning('最小印数必须大于0的整数');
          return false;
        }
      }
      if (comUtil.isEmpty(benchmark_price)) {
        message.warning('请输入基准报价');
        return false;
      }
      if (parseFloat(benchmark_unit_price) < 0.01) {
        message.warning('基准单价不能小于0.01');
        return false;
      }
      if (!comUtil.isEmpty(allow_print_num)) {
        let allow_print_arr = allow_print_num.split(",");
        if (allow_print_arr.length > 18) {
          message.warning('允许印数最多填写18个数');
          return false;
        }
      }
      this.props.activeValue(active);
      this.props.saveSpecificationListFour(newSpecificationList);
      let quotation_info = {
        benchmark_attr: benchmark_attr,
        benchmark_num: this.state.benchmark_num,
        benchmark_price: this.state.benchmark_price,
        benchmark_unit_price: this.state.benchmark_unit_price,
        allow_print_num: this.state.allow_print_num,
        is_allow_int: this.state.is_allow_int
      };
      this.props.saveQuotationInfo(quotation_info);
    } else {
      let skuList = this.state.skuList;
      let quantity = this.state.quantity;
      let goods = this.props.goods;
      goods.goods_type = goods_type;
      let isNext = true;
      if (skuList && skuList.length > 0) {
        skuList.map((item, index) => {
          if (comUtil.isEmpty(item.price)) {
            isNext = false;
            message.warning("组合报价中价格不能为空！");
          } else if (item.price == "0") {
            isNext = false;
            message.warning("组合报价中价格不能为0！");
          } else if (item.sku_attrs_id_list.length == 0) {
            isNext = false;
            message.warning("没有勾选属性项！");
          } else if (item.price >= 10000000) {
            isNext = false;
            message.warning("您输入的金额过大，请重新输入金额！");
          }
        })
      } else {
        message.warning("没有属性组合报价！");
        isNext = false;
      }
      if (isNext) {
        this.props.saveSkuList(skuList);
        this.props.saveGoods(goods);
        this.props.saveQuantity(quantity);
        this.props.activeValue(5);
      }
    }
  }

  lastStepFour(active) {
    let {goods_type, skuList, quantity} = this.state;
    if (goods_type != 1) {
      let goods = this.props.goods;
      goods.goods_type = goods_type;
      this.props.saveSkuList(skuList);
      this.props.saveGoods(goods);
      this.props.saveQuantity(quantity);
    }
    this.props.activeValue(active);
  }

  //保存草稿
  saveDrafts() {
    let {goods_type} = this.state;
    let draft_id = window.sessionStorage.getItem("draft_id");
    if (goods_type == 1) {
      this.baseDrafts(draft_id);
    } else {
      this.skuDrafts(draft_id)
    }

  }

  //sku保存
  skuDrafts(draft_id) {
    let {quantity, skuList} = this.state;
    let unitId = this.props.unitId;
    let newSpecificationList = JSON.parse(JSON.stringify(this.props.specificationList));
    let goods_draft = {
      goods: this.props.goods,
      basicList: this.props.basicList,
      specificationList: newSpecificationList,
      quantity: quantity,
      sku_list: skuList,
      specification_hide: this.props.specification_hide,
      unit: unitId
    };
    if (draft_id > 0) {
      httpRequest.put({
        url: sellerApi.goods.draft,
        data: {
          draft_id: draft_id,
          page_index: 3,
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
          page_index: 3,
          goods_draft: goods_draft
        }
      }).then(res => {
        if (res.code == "200") {
          this.props.history.push(`/seller/goods/GoodsDraftList`);
        }
      })
    }
  }

  //基准保存
  baseDrafts(draft_id) {
    // let draft_id = window.sessionStorage.getItem("draft_id");
    this.allowPrintNum();
    // 对选中的排序
    let newSpecificationList = JSON.parse(JSON.stringify(this.props.specificationList));
    let benchmark_attr = [];
    for (let i = 0; i < newSpecificationList.length; i++) {
      let attr_value = newSpecificationList[i].attr_value;
      let arr = [];
      for (let j = 0; j < attr_value.length; j++) {
        if (attr_value[j].is_default === 1) {
          arr.unshift(attr_value[j]);
          benchmark_attr.push(attr_value[j].attr_id);
          newSpecificationList[i].attr["attr_value_id"] = attr_value[j].attr_value_id
        } else {
          arr.push(attr_value[j])
        }
      }
      newSpecificationList[i].attr_value = arr;
    }
    this.setState({
      benchmark_attr: benchmark_attr
    });
    this.props.saveSpecificationListFour(newSpecificationList);
    let quotation_info = {
      benchmark_attr: benchmark_attr,
      benchmark_num: this.state.benchmark_num,
      benchmark_price: this.state.benchmark_price,
      benchmark_unit_price: this.state.benchmark_unit_price,
      allow_print_num: this.state.allow_print_num,
      is_allow_int: this.state.is_allow_int
    };
    let unitId = this.props.unitId;
    let unit_name = this.props.unit_name;
    this.props.saveQuotationInfo(quotation_info);
    let goods_draft = {
      goods: this.props.goods,
      basicList: this.props.basicList,
      specificationList: newSpecificationList,
      specification_hide: this.props.specification_hide,
      quotation_info: quotation_info,
      unit: unitId,
      unit_name: unit_name,
    };
    if (draft_id > 0) {
      httpRequest.put({
        url: sellerApi.goods.draft,
        data: {
          draft_id: draft_id,
          page_index: 3,
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
          page_index: 3,
          goods_draft: goods_draft
        }
      }).then(res => {
        if (res.code == "200") {
          this.props.history.push(`/seller/goods/GoodsDraftList`);
        }
      })
    }
  }

  onChangeIntegralMultiple(e) {
    let val = e.target.value;
    this.setState({
      is_allow_int: val
    })
  }

  validate(rule, value, callback) {
    if (!(/^[0-9]*$/.test(value))) {
      callback("请输入数字");
    } else {
      callback();
    }
  }

  handleOnChangeMinNum(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    this.setState({
      benchmark_num: val
    })
  }

  handleOnChangeBasicPrice(e) {
    let reg = /[^(\.\d+)?$]/g;
    let val = e.target.value.replace(reg, "");
    this.setState({
      benchmark_price: val
    })
  }

  handleOnBlurBasicPrice(e) {
    let val = e.target.value;
    let reg = /^\d+(\.\d{0,3})?$/;
    let benchmark_num = this.state.benchmark_num;   //最小印数
    if (!comUtil.isEmpty(val)) {
      if (!reg.test(val)) {
        message.error("最多输入三位小数的数字");
        val = "";
        this.setState({
          benchmark_price: val
        });
      } else {
        if (comUtil.isEmpty(benchmark_num)) {
          message.warning("最小印数不能为空")
        } else {
          let benchmark_price = parseFloat(val);   //基准报价
          let benchmark_unit_price = (benchmark_price / benchmark_num).toFixed(4);
          let new_benchmark_unit_price = benchmark_unit_price.substring(0, benchmark_unit_price.length - 1);
          this.setState({
            benchmark_unit_price: new_benchmark_unit_price
          });
          this.allowPrintNum()
        }
      }
    } else {
      message.warning("基准报价不能为空")
    }
  }

  handleOnBlurMinNum(e) {
    let benchmark_num = e.target.value;
    let benchmark_price = this.state.benchmark_price;   //基准报价
    if (!comUtil.isEmpty(benchmark_num)) {
      if (parseFloat(benchmark_num) < 1) {
        message.warning('最小印数必须大于0的整数');
        return false;
      }
      if (!comUtil.isEmpty(benchmark_price)) {
        let benchmark_unit_price = (benchmark_price / benchmark_num).toFixed(4);
        let new_benchmark_unit_price = benchmark_unit_price.substring(0, benchmark_unit_price.length - 1);
        this.setState({
          benchmark_unit_price: new_benchmark_unit_price
        });
        this.allowPrintNum()
      }
    } else {
      message.warning("最小印数不能为空")
    }
  }

  handleOnChangeAllow(e) {
    // let val = e.target.value.replace(/[^\d\,\，]/g, '').replace(/，/g, ',');
    let val = e.target.value.replace(/[^\d\,\，]/g, '');
    this.setState({
      allow_print_num: val
    })
  }

  //允许印数排序
  allowPrintNum() {
    let old_allow_print_num = this.state.allow_print_num;
    let benchmark_num = this.state.benchmark_num;
    if (comUtil.isEmpty(benchmark_num)) {
      message.error("请输入最小印数");
      return false;
    }
    if (!comUtil.isEmpty(old_allow_print_num)) {
      let arr = old_allow_print_num.split(",");
      arr.map((item, index) => {
        if (parseFloat(item) != parseFloat(benchmark_num)) {
          arr.push(benchmark_num)
        }
      });
      let allowArr = arr.filter((item, index, arr) => {
        if (parseFloat(item) >= parseFloat(benchmark_num)) {
          return arr.indexOf(item, 0) === index;
        }
      });
      let allowSort = this.arrayRank(allowArr);
      let new_allow_print_num = allowSort.join(",");
      this.setState({
        allow_print_num: new_allow_print_num
      });
    }

  }

  arrayRank(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
      let flag = true;
      for (var j = 0; j < arr.length - 1 - i; j++) {
        if (parseFloat(arr[j]) > parseFloat(arr[j + 1])) {   //从小到大排序
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          flag = false;
        }
      }
      if (flag) {
        break;
      }
    }
    return arr;
  }

  handleOnBlurAllow() {
    this.allowPrintNum();
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
    let quotation_info = nextProps.quotation_info;
    let goods = nextProps.goods;
    let quantity = nextProps.quantity || [];
    if (quotation_info) {
      this.setState({
        benchmark_attr: quotation_info.benchmark_attr,
        benchmark_num: quotation_info.benchmark_num,
        benchmark_price: quotation_info.benchmark_price,
        benchmark_unit_price: quotation_info.benchmark_unit_price,
        allow_print_num: quotation_info.allow_print_num,
        is_allow_int: quotation_info.is_allow_int
      });
    }
    this.setState({
      specificationList: nextProps.specificationList,
      goods_type: goods.goods_type || 0,
      quantity: quantity,
      skuList: nextProps.sku_list,
    }, () => {
      let specificationList = this.state.specificationList;
      let quantity = this.state.quantity || [];
      let attrList = [];
      specificationList && specificationList.length > 0 && specificationList.map((item, index) => {
        if (item.attr.is_checked) {
          attrList.push(item.attr)
        }
      });
      if (quantity.length > 0) {
        attrList.push({attr_name: "数量"})
      }
      this.setState({
        attrList
      })
    })
  }

  handleOnChangeRadio(index, e) {
    let goods = this.props.goods;
    goods.goods_type = this.state.goods_type;
    this.props.saveGoods(goods);
    let id = e.target.value;
    let specificationList = this.props.specificationList;
    specificationList[index].attr_value.map((item, index) => {
      if (item.attr_value_id === id) {
        item.is_default = 1;
        item.price = 0
      } else {
        item.is_default = 0
      }
    });
    this.props.saveSpecificationListThree(specificationList)
  }

  //切换报价方式
  handleTab(type) {
    let visibleCon = "基准报价";
    if (type == 0) {
      visibleCon = "组合报价"
    } else {
      visibleCon = "基准报价";
    }
    this.setState({
      visible: true,
      visibleCon,
      type
    });
  }

  clearAttr() {
    let goods = this.props.goods;
    goods.goods_type = this.state.goods_type;
    this.props.saveGoods(goods);
    this.props.saveQuotationInfo({});
    let specificationList = this.props.specificationList;
    specificationList && specificationList.length > 0 && specificationList.map((item, index) => {
      item.attr.attr_value_id = 0;
    });
    this.props.saveSpecificationListThree(specificationList);
  }

  clearSkuAttr() {
    let goods = this.props.goods;
    let specificationList = this.state.specificationList;
    goods.goods_type = this.state.goods_type;
    specificationList && specificationList.length > 0 && specificationList.map((item, index) => {
      item.attr.is_checked = 0;
    });
    this.setState({
      attrList: []
    });
    this.props.saveGoods(goods);
    this.props.saveSkuList("");
    this.props.saveSpecificationListThree(specificationList);
    this.props.saveQuantity([]);
  }

  handleOk() {
    let {type} = this.state;
    this.setState({
      visible: false,
      goods_type: type
    }, () => {
      let goods_type = this.state.goods_type;
      if (goods_type == 1) {
        this.clearSkuAttr()
      } else {
        this.clearAttr()
      }
    })
  }

  handleCancel() {
    this.setState({
      visible: false
    })
  }

  //组合报价
  handlePlusNum() {
    let {quantity} = this.state;
    let flag = true;
    if (quantity.length >= 8) {
      message.warning("数量添加不能超过8个！");
      return
    }
    quantity && quantity.length > 0 && quantity.map((item, index) => {
      if (comUtil.isEmpty(item)) {
        message.warning("请先输入值在增加！");
        flag = false;
      } else {
        flag = true
      }
    });
    if (flag) {
      let num = "";
      quantity.push(num);
      this.setState({quantity})
    }
  }

  //可选数量輸入
  handleNum(i, e) {
    let quantity = this.state.quantity;
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    quantity[i] = val;
    this.setState({
      quantity
    })
  }

  handleBlurNum(i, e) {
    let quantity = JSON.parse(JSON.stringify(this.state.quantity));
    let new_quantity = [];
    let val = e.target.value;
    if (comUtil.isEmpty(val) || val == 0) {
      if (val == "" && val == undefined) {
        if (val == 0) {
          message.warning("数量不能为0！")
        }
      }
      let new_quantity = quantity.splice(i, 1)
      this.setState({
        quantity
      }, () => {
        this.dataAttrSku();
      })
    } else {
      quantity.sort(this.sortNumber);
      new_quantity = quantity.filter(function (element, index, array) {
        if (!(array.indexOf(element) === index)) {
          message.warning("数量不能重复,请重新添加！")
        }
        return array.indexOf(element) === index;
      });
      this.setState({
        quantity: new_quantity
      }, () => {
        this.dataAttrSku();
      })
    }
  }

  sortNumber(a, b) {
    return a - b
  }

  //删除数量项
  handleDelNum(i) {
    let {quantity} = this.state;
    quantity.splice(i, 1);
    this.setState({
      quantity
    }, () => {
      this.dataAttrSku();
    })
  }

  //选择属性项
  handleChecked(i, attr_id, e) {
    let {specificationList} = this.state;
    let num = 0;
    if (e.target.checked) {
      specificationList[i].attr.is_checked = 1;
    } else {
      specificationList[i].attr.is_checked = 0
    }
    specificationList && specificationList.length > 0 && specificationList.map((item, index) => {
      if (item.attr.is_checked == 1) {
        num += 1
      }
    });
    if (num > 5) {
      message.warning("请勿超过5个!");
      specificationList[i].attr.is_checked = 0;
      return false
    }
    this.setState({
      specificationList: specificationList,
    }, () => {
      this.dataAttrSku()
    })
  }

  //导入
  handleImportTable(e) {
    let _this = this;
    let file = this.refs.pathClear.files[0];
    let type = "";
    let form = new FormData();
    form.append('file', file);
    // console.log("form---", form.get('file'));
    if (file) {
      type = file.type;
    }
    if (type == "application/vnd.ms-excel" || type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      let {attrList, skuList} = this.state;
      $.ajax({
        url: sellerApi.goods.downloadCsv,
        type: 'post',
        cache: false,
        data: form,
        processData: false,
        contentType: false,
        success: function (res) {
          // console.log(res);
          if (res.code == 200) {
            let attr_name = res.data.attr_name;
            let sku_list = res.data.sku_list || [];
            let old_attr_name = [];
            let flagPrice = false;
            let flagAttrName = false;
            let flagSkuAttr = false;
            let reg = /^[0-9]+\.?[0-9]*$/;
            attrList && attrList.length > 0 && attrList.map((item, index) => {
              old_attr_name.push(item.attr_name)
            });
            old_attr_name.push("价格");
            if (attr_name && attr_name.length > 0) {
              if (JSON.stringify(attr_name) != JSON.stringify(old_attr_name)) {
                message.warning("表头属性不能更改");
                flagAttrName = true
              }
            }
            if (skuList.length != sku_list.length) {
              message.warning("属性不能更改!");
              return false
            }
            sku_list && sku_list.length > 0 && sku_list.map((item, index) => {
              if (comUtil.isEmpty(item.price)) {
                if (item.price == 0) {
                  message.warning("表格填写的价格不能为0！");
                } else {
                  message.warning("表格填写的价格不全！");
                }
                flagPrice = true
              } else {
                if (reg.test(item.price)) {
                  let len = item.price.toString().split(".")[1];
                  if (!comUtil.isEmpty(len)) {
                    if (len.length > 3) {
                      message.warning("表格填写的价格格式不正确！");
                      flagPrice = true
                    }
                  }
                } else {
                  message.warning("表格填写的价格格式不正确！");
                  flagPrice = true
                }
              }
            });
            if (flagPrice || flagAttrName) {
              document.getElementById('fileInput').value = null;
              return false;
            }
            skuList && skuList.length > 0 && skuList.map((item, index) => {
              if (JSON.stringify(item.sku_attrs_name) != JSON.stringify(sku_list[index].sku_attrs_name)) {
                message.warning("属性不能更改!");
                flagSkuAttr = true
              }
            });
            if (!flagSkuAttr) {
              skuList && skuList.length > 0 && skuList.map((item, index) => {
                item.price = sku_list[index].price
              });
            } else {
              return false
            }
            _this.setState({
              skuList
            });
            document.getElementById('fileInput').value = null;
          }
        }
      })
    } else {
      message.warning("只允许上传xlsx/xls的文件！");
    }
  }

  //导出
  handleExportTable() {
    let attrList = this.state.attrList;
    let newSkuList = JSON.parse(JSON.stringify(this.state.skuList))
    let skuListTable = [];
    let attr_name = [];
    newSkuList && newSkuList.length > 0 && newSkuList.map((item, index) => {
      item.sku_attrs_name.push(item.price);
      skuListTable.push(item.sku_attrs_name);
    });
    attrList && attrList.length > 0 && attrList.map((item, index) => {
      attr_name.push(item.attr_name)
    });
    attr_name.push("价格");
    this.attrCsv(attr_name, skuListTable);
  }

  attrCsv(attr_name, skuListTable) {
    httpRequest.post({
      url: sellerApi.goods.attrCsv,
      data: {
        attr_name: attr_name,
        attr_values_name: skuListTable,
      }
    }).then(res => {
      if (res.code == "200") {
        let url = sellerApi.goods.downloadCsv + '?uuid=' + res.data;
        window.open(url, "_blank");
      }
    })
  }

  //  库存类
  specificationListFun(specificationList) {
    let newList = [];
    let attrList = [];
    for (let i = 0; i < specificationList.length; i++) {
      attrList.push(specificationList[i].attr);
      newList.push(specificationList[i].attr_value);
    }
    this.setState({
      attrList
    });
    return newList
  }

  //SKU 组合
  attrSKU(specificationList) {
    var arr = this.specificationListFun(specificationList);
    if (arr.length <= 0) {
      return
    }
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
    // console.log("result...", result);
    if (1000 <= result.length) {
      message.warning("价格组合过多，建议拆分成多个商品");
      if (2000 <= result.length) {
        message.warning("价格组合过多，系统无法支持");
        this.setState({
          attrList: []
        });
        return
      }
    }
    result && result.map((item, index) => {
      let objSKU = {};
      let sku_attrs_name = [];
      let sku_attrs_id_list = [];
      item.map((param, i) => {
        sku_attrs_name.push(param.attr_value);
        if (param.attr_value_id) {
          sku_attrs_id_list.push(param.attr_value_id)
        }
        if (param.attr_number) {
          objSKU.sku_qty = param.attr_number;
        }
      });
      objSKU.sku_attrs_name = sku_attrs_name;
      objSKU.sku_attrs_id_list = sku_attrs_id_list;
      objSKU.price = "";
      arrSKU.push(objSKU)
    });
    return arrSKU;
  }

  //SKU价格输入
  handleAttrSku(i, e) {
    let skuList = this.state.skuList;
    let val = e.target.value.replace(/[^\d.]/g, "").replace(/\.{2,}/g, ".").replace(/^\./g, "").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3');
    skuList[i].price = val;
    this.setState({
      skuList
    })
  }

  //SKU数组重组
  dataAttrSku() {
    let {quantity, specificationList, specificationListChecked} = this.state;
    let newSpecificationList = JSON.parse(JSON.stringify(specificationList));
    let newSpecificationListChecked = JSON.parse(JSON.stringify(specificationListChecked));
    newSpecificationList && newSpecificationList.length > 0 && newSpecificationList.map((item, index) => {
      if (item.attr.is_checked == 1) {
        newSpecificationListChecked.push(item)
      }
    });
    if (quantity && quantity.length > 0) {
      let quantityObj = {};
      quantityObj.attr = {attr_name: "数量"};
      quantityObj.attr_value = [];
      quantity.map((item, index) => {
        let attr_val = {};
        attr_val.attr_value = item;
        attr_val.attr_number = item;
        quantityObj.attr_value.push(attr_val);
      });
      newSpecificationListChecked.push(quantityObj);
    }
    let skuList = this.attrSKU(newSpecificationListChecked);
    this.setState({
      skuList
    })
  }

  render() {
    const {isDraft, draft_id, goods_type, specificationList, quantity, attrList, skuList, visible, visibleCon} = this.state;
    return (
      <div className="attr-main">
        <div className="pt20 pb20">
          <Button className={`btn-tit ${goods_type == 0 ? "typeBtn" : null}`}
                  size={"large"}
                  onClick={this.handleTab.bind(this, 0)}>组合报价</Button>
          <Button className={`btn-tit ml5 ${goods_type == 1 ? "typeBtn" : null}`}
                  size={"large"}
                  onClick={this.handleTab.bind(this, 1)}>基准报价</Button>
        </div>
        {/*基准报价*/}
        {goods_type == 1 ?
          <Fragment>
            <div className="goods-tit">
              <span className="tit-icon activeColor">确定基准商品与报价</span>
              <span className="fs12">(作为其它商品属性定价的参考)</span>
            </div>
            <div className="pt20 pb20 form-item">
              <span className="tit-icon">基准商品属性</span>
              <span>(每种属性单选一个属性值, 作为基准属性)</span>
            </div>
            <div className="attr-radio">
              {this.props.specificationList &&
              this.props.specificationList.map((item, index) => {
                return (
                  <div className="pt10 pb10" key={index}>
                      <span className="tit-l"><span
                        className="asterisk">* </span>{item.attr.attr_name}：</span>
                    <Radio.Group name={item.attr.attr_value} defaultValue={item.attr.attr_value_id}
                                 onChange={this.handleOnChangeRadio.bind(this, index)}>
                      {item.attr_value && item.attr_value.map((params, i) => {
                        return (
                          <Radio value={params.attr_value_id} key={i}> {params.attr_value}</Radio>
                        )
                      })}
                    </Radio.Group>
                  </div>
                )
              })
              }
              <div className="pt10 pb20 form-item">
                <span className="tit-icon">基准商品报价</span>
              </div>
              <div className="form-item pt10 pb20">
                <span className="tit-l"><span className="asterisk">* </span>最小印数：</span>
                <Input className="form-item-icon" value={this.state.benchmark_num}
                       onChange={this.handleOnChangeMinNum.bind(this)}
                       onBlur={this.handleOnBlurMinNum.bind(this)}/>
                <span className="ml5">{this.props.unit_name}</span>

                <span className="tit-l ml60"><span className="asterisk">* </span>基准报价：</span>
                <Input className="form-item-icon" value={this.state.benchmark_price}
                       onChange={this.handleOnChangeBasicPrice.bind(this)}
                       onBlur={this.handleOnBlurBasicPrice.bind(this)}/>
                <span className="ml5">元</span>

                <span className="tit-l ml60"><span className="asterisk">* </span>基准单价：</span>
                <span>{this.state.benchmark_unit_price}</span> <span
                className="ml5">元/{this.props.unit_name}</span>
              </div>
              <div className="form-item pt10 pb20">
                <span className="tit-l">允许印数：</span>
                <Input type="text" className="form-item-icon " style={{width: 600}}
                       value={this.state.allow_print_num}
                       onChange={this.handleOnChangeAllow.bind(this)}
                       onBlur={this.handleOnBlurAllow.bind(this)}/>
                <div className="mt10">
                  <span className="tit-l"> </span>
                  可规定用户下单的数量, 请以整数并用”,”隔开, 最多填写18个数, 如无限制请勿填写
                </div>
              </div>
              <div className="form-item pt10 pb20">
                <span className="tit-l mr10">是否支持允许印数任意整数倍：</span>
                <Radio.Group onChange={this.onChangeIntegralMultiple.bind(this)}
                             value={this.state.is_allow_int}>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              </div>
            </div>
          </Fragment> :
          <div className="com-main">
            <div className="goods-tit">商品组合报价，引导商家选择价格参数</div>
            <div>
              <div className="spec-attr-main mt15">
                {specificationList && specificationList.length > 0 &&
                specificationList.map((item, index) => {
                  return (
                    <div className="spec-item" key={index}>
                      <div className="spec-tit bgc pt19 pb16 pl20">
                          <span>
                            <Checkbox checked={item.attr.is_checked == 1}
                                      onChange={this.handleChecked.bind(this, index, item.attr.attr_id)}/>
                            <span data-attr_id={item.attr.attr_id}>{item.attr.attr_name}</span>
                          </span>
                      </div>
                      <div className="spec-attr pb10">
                        <span className="tit attr-box borderNone">属性值：</span>
                        {item.attr_value && item.attr_value.map((params, i) => {
                          return (
                            <div className="mb10 spec-attr-item displayInlineBlock ml10"
                                 key={i}>
                              <span className="attr-box">{params.attr_value}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
                }
              </div>
            </div>
            <div className="goods-tit mt30">可选数量</div>
            <div className="mt10 mb10">
              {quantity && quantity.length > 0 && quantity.map((item, index) => {
                return (
                  <span className="num-box" key={index}>
                    <Input value={item}
                           style={{textAlign: "center"}}
                           className="num mr15"
                           autoFocus={true}
                           onChange={this.handleNum.bind(this, index)}
                           onBlur={this.handleBlurNum.bind(this, index)}
                           placeholder="" maxLength={10}/>
                    <Icon type="close-circle" className="close-icon" theme={"twoTone"}
                          onClick={this.handleDelNum.bind(this, index)}/>
                  </span>
                )
              })}
              <Button icon="plus" onClick={this.handlePlusNum.bind(this)}></Button>
            </div>
            <div className="mt10" style={{fontSize: "12px"}}>设置商品的常规数量，如任何数量都可，可以不用填写。</div>
            <div className="goods-tit mt15 tit-p">
              <span>请填充价格</span>
              <span>
                <a href="javascript:void (0);" className="uploadFile">
                  <input type="file" className="fileInput" id="fileInput" onChange={this.handleImportTable.bind(this)}
                         ref='pathClear' onClick={(e) => {
                    e.target.value = null
                  }}/>
                  <span>导入价格表</span>
                </a>
                <a href="javascript:void (0);" className="ml10 mr10"
                   onClick={this.handleExportTable.bind(this)}>导出价格表</a>
              </span>
            </div>
            <div className="table-list">
              <table>
                <thead>
                <tr>
                  <Fragment>
                    {attrList && attrList.length > 0 && attrList.map((item, index) => {
                      return (
                        <th className="table-item" key={index}>{item.attr_name}</th>
                      )
                    })
                    }
                  </Fragment>
                  <Fragment>
                    {attrList && attrList.length > 0 ?
                      <th className="table-item">价格</th> : null
                    }
                  </Fragment>
                </tr>
                </thead>
                <tbody>
                {skuList && skuList.length > 0 ? skuList.map((item, index) => {
                  return (
                    <tr key={index}>
                      <Fragment>
                        {item.sku_attrs_name && item.sku_attrs_name.length > 0 && item.sku_attrs_name.map((param, i) => {
                          return (
                            <td key={i}>{param}</td>
                          )
                        })
                        }
                      </Fragment>
                      <Fragment>
                        {item.sku_attrs_name && item.sku_attrs_name.length > 0 ?
                          <td>
                            <Input value={item.price} onChange={this.handleAttrSku.bind(this, index)}/>
                          </td> : null
                        }
                      </Fragment>
                    </tr>
                  )
                }) : <tr></tr>
                }
                </tbody>
              </table>
            </div>
          </div>
        }
        <div className="btn-box mt60">
          <Button className={`fl ml30 goods-btn ${isDraft ? "show" : " hide"}`}
                  onClick={this.saveDrafts.bind(this)}>保存草稿，返回列表</Button>
          <Button className={`btn ${draft_id > 0 ? "hide" : null}`}
                  onClick={this.lastStepFour.bind(this, this.state.lastActive)}>上一步</Button>
          <Button type="primary" className="btn ml30"
                  onClick={this.nextStepFour.bind(this, this.state.active)}>下一步</Button>
        </div>

        <Modal
          title="提示"
          visible={visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width={400}
          wrapClassName={'attr-modal'}>
          <div>
            您确认切换到【{visibleCon}】吗？切换后，您在当前
            页面输入的数据不会被保存。
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    specificationList: state.goods.specificationList,
    quotation_info: state.goods.quotation_info,
    goods: state.goods.goods,
    basicList: state.goods.basicList,
    specification_hide: state.goods.specification_hide,
    unitId: state.goods.unitId,
    sku_list: state.goods.sku_list,
    quantity: state.goods.quantity,
    goods_id: state.goods.goods_id,
    unit_name: state.goods.unit_name
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveGoods(goods) {
      dispatch(actionCreator.getGoods(goods))
    },
    saveSpecificationListFour(list) {
      dispatch(actionCreator.getQuotationAttrs(list))
    },
    saveQuotationInfo(quotation_info) {
      dispatch(actionCreator.getQuotationInfo(quotation_info))
    },
    saveSpecificationListThree(list) {
      dispatch(actionCreator.getSpecicationList(list))
    },
    saveSkuList(list) {
      dispatch(actionCreator.getSkuList(list))
    },
    saveQuantity(list) {
      dispatch(actionCreator.getQuantity(list))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProGoodsConfirmAttrPrice));

