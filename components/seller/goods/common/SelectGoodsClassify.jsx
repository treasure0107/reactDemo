import React, {Component} from 'react';
import {Button, message} from 'antd';
import {connect} from 'react-redux'
import {actionCreator} from "../store";
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';

class SelectGoodsClassify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classifyOne: '',
      classifyTwo: '',
      classifyThree: '',
      list: [],
      listTwo: [],
      listThree: [],
      active: 1,
      ClassifyOneIndex: 0,
      ClassifyTwoIndex: 0,
      ClassifyThreeIndex: 0,
      ClassifyId: "",
      jdf_temp_name: "",
      is_end: 0
    }
  }

  componentDidMount() {
    this.getGoodsClassify();
  }

  getGoodsClassify() {
    httpRequest.get({
      url: sellerApi.goods.goodsClassify,
      data: {
        category_device: 0,
        category_type: 2
      }
    }).then(res => {
      if (res.code == "200") {
        let list = res.data;
        this.setState({
          list
        })
      }
    })
  }

  classifyHandleOne(id, name, is_end) {
    this.setState({
      ClassifyOneIndex: id,
      classifyOne: name,
      is_end: is_end,
      ClassifyId: id,
      classifyTwo: "",
      classifyThree: ""
    });
    let list = this.state.list;
    list.map((item, index) => {
      if (id == item.category_id) {
        this.setState({
          listTwo: item.son_category,
          listThree: []
        });
      }
    });
  }

  classifyHandleTwo(id, name, is_end) {
    this.setState({
      ClassifyTwoIndex: id,
      classifyTwo: name,
      is_end: is_end,
      ClassifyId: id,
      classifyThree: ""
    });
    let listTwo = this.state.listTwo;
    listTwo.map((item, index) => {
      if (id == item.category_id) {
        this.setState({
          listThree: item.son_category,
        });
      }
    });
  }

  classifyHandleThree(id, name, is_end) {
    this.setState({
      ClassifyThreeIndex: id,
      classifyThree: name,
      is_end: is_end,
      ClassifyId: id
    });
  }

  randomFn(lower, upper) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }

  getNewTbzList(pid, page) {
    httpRequest.get({
      url: sellerApi.goods.tbzList,
      data: {
        pid: pid,
        keywords: "",
        page: page,
        limit: 30,
      }
    }).then(res => {
      if (res.code == "200") {
        // console.log(res.data.data);
        let oldLen = res.data.data.length;
        let newLen = this.randomFn(1, oldLen);
        let imgItem = "";
        if (res.data.data) {
          if (res.data.data[newLen]) {
            imgItem = res.data.data[newLen]["thumbnail"];
          }
        }
        let goods = {};
        let obj = {};
        goods["image_list"] = [];
        obj["pic_url"] = imgItem;
        obj["is_main"] = 1;
        goods["image_list"].push(obj);
        this.props.saveGoods(goods);
      }
    })
  }

  //  微创印图片库
  getTbzList(pid, page) {
    httpRequest.get({
      url: sellerApi.goods.tbzList,
      data: {
        pid: pid,
        keywords: "",
        page: page,
        limit: 30,
      }
    }).then(res => {
      if (res.code == "200") {
        let oldPages = res.data.pages;
        let oldTotal = res.data.total;
        if (oldPages > 1) {
          let newPages = this.randomFn(1, oldPages);
          this.getNewTbzList(pid, newPages);
        } else {
          let oldLen = res.data.data.length;
          let newLen = this.randomFn(1, oldLen);
          let imgItem = res.data.data[newLen]["thumbnail"];
          let goods = {};
          let obj = {};
          goods["image_list"] = [];
          obj["pic_url"] = imgItem;
          obj["is_main"] = 1;
          goods["image_list"].push(obj);
          this.props.saveGoods(goods);
        }
      }
    })
  }

  getAttrData(cat_id, active) {
    httpRequest.get({
      url: sellerApi.goods.goodsShopAttr,
      data: {
        cat_id: cat_id,
      }
    }).then(res => {
      if (res.code == "200") {
        let valid_id = res.data.valid_id
        if (valid_id == 4) {
          this.props.saveGoods({template_type: 6});
        }
        let specificationList = res.data.specification;
        let basicList = res.data.basic;
        let specification_hide = res.data.specification_hide;
        this.props.saveSpecificationList(specificationList);
        this.props.saveSpecificationHideList(specification_hide);
        this.props.saveBasicList(basicList);
        this.props.saveUnitId(res.data.unit);
        this.props.saveUnitName(res.data.unit_name || "无");
        this.props.saveValidId(valid_id);
        this.props.saveGoodsLabelList(res.data.goods_label_list);
        let jdf_temp_name = res.data.jdf_temp_name || "";
        window.sessionStorage.setItem("jdf_temp_name", jdf_temp_name);
        if (res.data.jdf_temp_name) {
          window.sessionStorage.setItem("isJdfName", "1");
        } else {
          window.sessionStorage.setItem("isJdfName", "0");
        }
        this.props.saveGoods({goods_type: 0});
        if (res.data.pid) {
          this.props.savePid(res.data.pid);
          this.getTbzList(res.data.pid, 1);
        } else {
          this.props.savePid("");
        }
        this.props.activeValue(active);
      } else {
        message.error(res.msg || "该分类没有属性模板请先添加");
      }
    })
  }

  nextStepOne(active) {
    if (this.state.ClassifyId) {
      let is_end = this.state.is_end;
      if (is_end == 0) {
        message.error('请选择最后一级分类', 2);
        return false;
      }
      let ClassifyId = this.state.ClassifyId;
      this.props.saveClassifyId(ClassifyId);
      this.getAttrData(ClassifyId, active);
      if (this.state.classifyThree) {
        this.props.classifyName(this.state.classifyThree);
      } else if (this.state.classifyTwo) {
        this.props.classifyName(this.state.classifyTwo);
      } else {
        this.props.classifyName(this.state.classifyOne);
      }
    } else {
      message.error('请选择分类', 2);
    }
  }

  render() {
    return (
      <div className="classify-select">
        <div className="goods-tit">
          您当前选择的商品分类是：
          <span className="activeColor">{this.state.classifyOne}</span>
          <span className={this.state.classifyTwo ? "" : "hide"}>></span>
          <span className="activeColor">{this.state.classifyTwo}</span>
          <span className={this.state.classifyThree ? "" : "hide"}>></span>
          <span className="activeColor">{this.state.classifyThree}</span>
        </div>
        <div className="mt20 clearfix">
          <div className="classify-list fl">
            <div className="list-tit"><span>请选择分类</span></div>
            <div className="list">
              <ul>
                {this.state.list &&
                this.state.list.map((item, index) => {
                  return (
                    <li key={index}
                        className={this.state.ClassifyOneIndex == item.category_id ? "activeClassify" : ""}
                        onClick={this.classifyHandleOne.bind(this, item.category_id, item.category_name, item.is_end)}>
                      {item.category_name}
                    </li>
                  )
                })
                }
              </ul>
            </div>
          </div>
          <div className="classify-list fl ml30">
            <div className="list-tit"><span>请选择分类</span></div>
            <div className="list">
              <ul>
                {this.state.listTwo &&
                this.state.listTwo.map((item, index) => {
                  return (
                    <li key={index}
                        className={this.state.ClassifyTwoIndex == item.category_id ? "activeClassify" : ""}
                        onClick={this.classifyHandleTwo.bind(this, item.category_id, item.category_name, item.is_end)}>
                      {item.category_name}
                    </li>
                  )
                })
                }
              </ul>
            </div>
          </div>
          <div className="classify-list fl ml30">
            <div className="list-tit"><span>请选择分类</span></div>
            <div className="list">
              <ul>
                {this.state.listThree &&
                this.state.listThree.map((item, index) => {
                  return (
                    <li key={index}
                        className={this.state.ClassifyThreeIndex == item.category_id ? "activeClassify" : ""}
                        onClick={this.classifyHandleThree.bind(this, item.category_id, item.category_name, item.is_end)}>
                      {item.category_name}
                    </li>
                  )
                })
                }
              </ul>
            </div>
          </div>
        </div>
        <div className="btn-box mt60">
          <Button type="primary" className="btn"
                  onClick={this.nextStepOne.bind(this, this.state.active)}>下一步</Button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveGoods(goods) {
      dispatch(actionCreator.getGoods(goods))
    },
    saveSpecificationList(list) {
      dispatch(actionCreator.getSpecicationList(list))
    },
    saveBasicList(list) {
      dispatch(actionCreator.getBasicList(list))
    },
    saveSpecificationHideList(list) {
      dispatch(actionCreator.getSpecicationHideList(list))
    },
    saveClassifyId(classifyId) {
      dispatch(actionCreator.getClassifyId(classifyId))
    },
    saveUnitId(unitId) {
      dispatch(actionCreator.getUnitId(unitId))
    },
    saveUnitName(unitName) {
      dispatch(actionCreator.getUnitName(unitName))
    },
    saveValidId(unitName) {
      dispatch(actionCreator.getValidId(unitName))
    },
    saveGoodsLabelList(list) {
      dispatch(actionCreator.getGoodsLabelList(list))
    },
    savePid(pid) {
      dispatch(actionCreator.getPid(pid))
    }
  }
};
export default connect(null, mapDispatchToProps)(SelectGoodsClassify);