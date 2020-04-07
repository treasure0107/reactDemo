import React, { Component, Fragment } from 'react';
import LazyLoad from 'react-lazyload';
import comUtil from 'utils/common.js';
import httpRequest from 'utils/ajax';
import api from 'utils/api';
import moment from 'moment';
import BuriedPoint from "components/common/BuriedPoint.jsx";
import "./style/recommendGoods.scss";
import lang from "assets/js/language/config";
import GoodsList from 'componentsgoods/goodsList';

const search = lang.search;





 推荐商品
class RecommendGoods extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
       goodsData: {
        data: [],
        msg: "ok",
        page_index: 1,
        page_total: 1,
        total: 0
      },
      pageindex:1,
    };

  }

  componentWillMount () {
    this.get_se_recommend();
  }
   checklogin () {
    let _this = this;
    comUtil.checkLogin1((res) => {
      if (res.code == 200) {
        this.goods_search();
      } else {
        _this.goods_search();
      }
    }, (res) => {
      if (res.code == 415 || res.code == 411) {
        _this.setState({
          isLogin: false,
          visible: true
        });
      }
    })
  }
   调用搜索商品的接口
  get_se_recommend (flag) {
    let data = {
      page: this.state.pageindex,
      size: 15,
      recomtype:'search',
    }
    httpRequest.get({
      url: api.search.get_se_recommend,
      data
    }).then(res => {
      if (res.code == 200) {
        this.setState({
          goodsData: res.data.data,
          isLoad: true,
        });
      }
    }).catch(err => {

    })
  }

  render () {
    const {goodsData}=this.state;
    return (
      <Fragment>
        <div className="recommendGoods">
          {
            goodsData.data.length > 0 ?
              <Fragment>
                <div className="title">
                  热销商品
                </div>
                <div className="searchmain mg">
                  <GoodsList list={goodsData.data} />
                </div>
              </Fragment>
              : null
          }
        </div>

      </Fragment>
    )
  }
}


export default RecommendGoods;
