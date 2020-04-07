import React, {Component} from 'react';
import {Input, Button, Select, Checkbox, Radio, message, TreeSelect, Icon, Tooltip} from 'antd';

import {connect} from 'react-redux'
import {actionCreator} from "../store";
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';

const {Option} = Select;

class ProGoodsRecommend extends Component {
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
      goodslinkgoods: [],
      checkedIdList: [],
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
          affirmRelList: goodslinkgoods,
        }, () => {

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
        let affirmRelList = this.state.affirmRelList;
        res.data && res.data.length > 0 && res.data.map((item, index) => {
          item["is_checked"] = false;
          affirmRelList && affirmRelList.length > 0 && affirmRelList.map((params, i) => {
            if (item.goods_id == params.link_goods_id) {
              item["is_checked"] = true;
            }

          })
        });
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

  handleAffirmCheckboxChange(name, goods_thumb_image, i, e) {
    let obj = {
      link_goods_id: "",
      spu_name: "",
      goods_thumb_image: "",
    };
    let affirmRelList = this.state.affirmRelList;
    let shopCategoryList = this.state.shopCategoryList;
    if (affirmRelList.length >= 8) {
      shopCategoryList[i]["is_checked"] = false;
      message.warning("关联商品不能超过8个！");
      return false
    } else {
      shopCategoryList[i]["is_checked"] = e.target.checked;
    }
    this.setState({
      shopCategoryList
    });
    obj.link_goods_id = e.target.value;
    obj.LinkGoods_name = name;
    obj.LinkGoods_image = goods_thumb_image;
    if (e.target.checked) {
      this.setState({affirmRelList: [...affirmRelList, obj]}, () => {
        let affirmRelList = this.state.affirmRelList;
        this.props.saveGoodsLinkGoods(affirmRelList)
      });
    } else {
      affirmRelList = affirmRelList.filter((item) => {
        return item.link_goods_id != obj.link_goods_id
      });
      this.setState({affirmRelList}, () => {
        let affirmRelList = this.state.affirmRelList;
        this.props.saveGoodsLinkGoods(affirmRelList)
      });
    }
  }

  handleDelete(link_goods_id) {
    let affirmRelList = this.state.affirmRelList;
    let shopCategoryList = this.state.shopCategoryList;
    let list = affirmRelList.filter((item) => {
      return item.link_goods_id != link_goods_id
    });
    shopCategoryList && shopCategoryList.length > 0 && shopCategoryList.map((item, index) => {
      if (item.goods_id == link_goods_id) {
        item["is_checked"] = false;
      }
    });
    this.setState({
      affirmRelList: list,
      shopCategoryList
    }, () => {
      let affirmRelList = this.state.affirmRelList;
      this.props.saveGoodsLinkGoods(affirmRelList)
    })
  }

  swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  }

  handleArrowUp(i) {
    let affirmRelList = this.state.affirmRelList;
    if (i != 0) {
      let list = this.swapArray(affirmRelList, i, i - 1);
      this.setState({
        affirmRelList: list
      })
    } else {
      message.warning("已经处于置顶，无法上移！");
    }
  }

  handleArrowDown(i) {
    let affirmRelList = this.state.affirmRelList;
    if (i + 1 != affirmRelList.length) {
      let list = this.swapArray(affirmRelList, i, i + 1);
      this.setState({
        affirmRelList: list
      })
    } else {
      message.warning("已经处于置底，无法下移！");
    }
  }

  render() {
    const {shopCategoryList, affirmRelList} = this.state;
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
            <div className="pb15 pt10">请勾选推荐商品</div>
            <div className="associated-box">
              <ul>
                {
                  shopCategoryList &&
                  shopCategoryList.map((item, index) => {
                    return (
                      <li key={index}>
                        <Checkbox value={item.goods_id}
                                  checked={item.is_checked}
                                  onChange={this.handleAffirmCheckboxChange.bind(this, item.spu_name, item.goods_thumb_image, index)}>
                          <img className="img-item" src={item.goods_thumb_image} alt=""/>
                          <span className="LinkGoods_name">{item.spu_name}</span>
                        </Checkbox>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            <div className="mt10 pb10"><span className="pl20">最多可选8个</span></div>
          </div>
          <div className="fl ml60">
            <div className="pb15 pt10">已推荐商品</div>
            <div className="associated-box">
              <ul>
                {
                  affirmRelList &&
                  affirmRelList.map((item, index) => {
                    return (
                      <li key={index}>
                        <img className="img-item" src={item.LinkGoods_image} alt=""/>
                        <span className="LinkGoods_name">{item.LinkGoods_name}</span>
                        {/*<a href="javascript:void(0);"><i className="iconfont iconshanchu"></i></a>*/}
                        <a className="icon-b" href="javascript:void(0);"
                           onClick={this.handleDelete.bind(this, item.link_goods_id)}><Icon
                          type="delete"/></a>
                        <a className="icon-b" href="javascript:void(0);"
                           onClick={this.handleArrowUp.bind(this, index)}><Icon
                          type="arrow-up"/></a>
                        <a className="icon-b" href="javascript:void(0);"
                           onClick={this.handleArrowDown.bind(this, index)}><Icon
                          type="arrow-down"/></a>
                      </li>
                    )
                  })
                }
              </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProGoodsRecommend);