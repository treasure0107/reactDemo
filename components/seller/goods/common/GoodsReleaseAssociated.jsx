import React, {Component} from 'react';
import {Input, Button, Select, Checkbox, Radio, message, TreeSelect} from 'antd';

import {connect} from 'react-redux'
import {actionCreator} from "../store";
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';

const {Option} = Select;

class GoodsReleaseAssociated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastActive: 4,
      active: 6,
      dataSource: 0,
      storeClassifyList: [],
      shopCategoryList: [],
      shop_category_id: "",
      keyword: "",
      affirmRelList: [],
      cancelRelList: [],
      delCancelRelList: [],
      goodslinkgoods: [],
      is_double: 0,
    }
  }

  componentDidMount() {
    this.getShopCategoryGoods();
    this.getStoreClassifyClassificationQuery();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let goods_id = nextProps.goods_id;
    if (goods_id > 0) {
      let goodslinkgoods = nextProps.goodslinkgoods;
      if (goodslinkgoods.length > 0) {
        this.setState({
          cancelRelList: goodslinkgoods,
          is_double: goodslinkgoods[0].is_double
        })
      }

    }

  }

  getStoreClassifyClassificationQuery() {
    httpRequest.get({
      url: sellerApi.goods.storeClassifyClassificationQuery,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        let storeClassifyList = res.data;
        let obj = {title: '全部', value: '', key: '1',};
        storeClassifyList.unshift(obj);
        this.setState({
          storeClassifyList
        })
      }
    })
  }

  getShopCategoryGoods() {
    let shop_category_id = this.state.shop_category_id;
    let keyword = this.state.keyword;
    httpRequest.get({
      url: sellerApi.goods.shopCategoryGoods,
      data: {
        shop_category_id: shop_category_id,
        search: keyword
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          shopCategoryList: res.data
        })
      }
    })
  }

  handleChangeGoodsType(value) {
    this.setState({
      shop_category_id: value
    }, () => {
      this.getShopCategoryGoods();
    });
  }

  handleChangeWord(e) {
    this.setState({
      keyword: e.target.value
    });
  }

  handleSearchClick() {
    this.getShopCategoryGoods();
  }

  handleAffirmCheckboxChange(name, e) {
    let obj = {
      link_goods_id: "",
      spu_name: "",
    };
    obj.link_goods_id = e.target.value;
    obj.LinkGoods_name = name;
    let affirmRelList = this.state.affirmRelList;
    if (e.target.checked) {
      this.setState({affirmRelList: [...affirmRelList, obj]});
    } else {
      affirmRelList = affirmRelList.filter((item) => {
        return item.link_goods_id != obj.link_goods_id
      });
      this.setState({affirmRelList});
    }
  }

  arrayRepeat(arr, id) {
    let hash = {};
    return arr.reduce(function (item, next) {
      hash[next[id]] ? '' : hash[next[id]] = true && item.push(next);
      return item;
    }, []);
  }


  removeAttrItem() {
    let delCancelRelList = this.state.delCancelRelList;
    let cancelRelList = this.state.cancelRelList;
    let newcancelRelList = cancelRelList.filter((item) => {
      return delCancelRelList.indexOf(item.link_goods_id) < 0;
    });
    this.setState({
      cancelRelList: newcancelRelList
    }, () => {
      let cancelRelList = this.state.cancelRelList;
      this.props.saveGoodsLinkGoods(cancelRelList)
    })
  }

  handleCancelCheckboxChange(e) {
    let delCancelRelList = this.state.delCancelRelList;
    let cancelRelList = this.state.cancelRelList;
    let link_goods_id = e.target.value;
    if (e.target.checked) {
      cancelRelList && cancelRelList.map((item, index) => {
        if (link_goods_id == item.link_goods_id) {
          delCancelRelList.push(item.link_goods_id)
        }
      });
    } else {
      delCancelRelList = cancelRelList.filter((item) => {
        if (item.link_goods_id != link_goods_id) {
          return item.link_goods_id;
        }
      });
      this.setState({delCancelRelList});
    }

  }

  handleChangeAssociatedRadio(e) {
    this.setState({
      is_double: e.target.value,
    }, () => {
      let arr = JSON.parse(JSON.stringify(this.props.goodslinkgoods));
      arr && arr.map((item, index) => {
        item.is_double = this.state.is_double
      });
      this.props.saveGoodsLinkGoods(arr)
    });
  }

  reassembleData() {
    let affirmRelList = this.state.affirmRelList;
    let is_double = this.state.is_double;
    affirmRelList && affirmRelList.map((item, index) => {
      item.is_double = is_double
    });
    if (this.props.goods_id > 0) {
      let cancelRelList = this.state.cancelRelList;
      let newAffirmRelList = affirmRelList.concat(cancelRelList);
      affirmRelList = this.arrayRepeat(newAffirmRelList, "link_goods_id")
    }
    this.setState({
      cancelRelList: affirmRelList
    }, () => {
      let cancelRelList = this.state.cancelRelList;
      this.props.saveGoodsLinkGoods(cancelRelList)
    })
  }

  addAttrItem() {
    this.reassembleData();
  }


  render() {
    return (
      <div>
        <div className="mt20 pb20">
          <TreeSelect
            style={{width: 180}}
            value={this.state.shop_category_id}
            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
            treeData={this.state.storeClassifyList}
            placeholder="请选择商品类型"
            treeDefaultExpandAll
            onChange={this.handleChangeGoodsType.bind(this)}
          />
          <Input placeholder="请输入关键字" className="w160 ml20" value={this.state.keyword}
                 onChange={this.handleChangeWord.bind(this)}/>
          <Button type="primary" className="btn ml30 h28" onClick={this.handleSearchClick.bind(this)}>搜索</Button>
        </div>
        <div className="clearfix">
          <div className="fl">
            <div className="pb15 pt10">可选商品</div>
            <div className="associated-box">
              <ul>
                {
                  this.state.shopCategoryList &&
                  this.state.shopCategoryList.map((item, index) => {
                    return (
                      <li key={item.goods_id}>
                        <Checkbox value={item.goods_id}
                                  onChange={this.handleAffirmCheckboxChange.bind(this, item.spu_name)}>{item.spu_name}</Checkbox>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            <div className="mt30 pb10">
              <Button type="primary" className="btn ml16"
                      onClick={this.addAttrItem.bind(this)}>确认关联</Button>
            </div>
          </div>
          <div className="ml15 mr15 fl ass-radio">
            <Radio.Group onChange={this.handleChangeAssociatedRadio.bind(this)}
                         value={this.state.is_double}>
              <Radio className="displayBlock" value={0}>
                单向关联
              </Radio>
              <Radio className="mt20 displayBlock" value={1}>
                双向关联
              </Radio>
            </Radio.Group>
          </div>
          <div className="fl">
            <div className="pb15 pt10">跟本商品关联的产品</div>
            <div className="associated-box">
              <ul>
                {
                  this.state.cancelRelList &&
                  this.state.cancelRelList.map((item, index) => {
                    return (
                      <li key={item.link_goods_id}>
                        <Checkbox value={item.link_goods_id}
                                  onChange={this.handleCancelCheckboxChange.bind(this)}>{item.LinkGoods_name}</Checkbox>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            <div className="mt30 pb10">
              <Button className="btn goods-btn ml16" onClick={this.removeAttrItem.bind(this)}>移除关联</Button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    goods_id: state.goods.goods_id,
    goodslinkgoods: state.goods.goodslinkgoods
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveGoodsLinkGoods(list) {
      dispatch(actionCreator.getGoodsLinkGoods(list))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GoodsReleaseAssociated);