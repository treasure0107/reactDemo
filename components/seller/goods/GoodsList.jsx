import React, {Component} from 'react';
import Title from '../common/Title';
import GoodsTable from './common/GoodsTable';
import ProduceGoodsTable from './common/ProduceGoodsTable';
import InventoryGoodsTable from './common/InventoryGoodsTable';
import '../common/style/goodsList.scss';

import {Tabs, Button} from 'antd';
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';

const {TabPane} = Tabs;

class GoodsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - - 商品列表',
      goodsPictureList: [],
      // activeKey: '1',
      // goodsType: "1",
      activeKey: '2',
      goodsType: "2"
    };
    this.callbackTabs = this.callbackTabs.bind(this);
  }

  callbackTabs(key) {
    if (key == 1) {
      this.setState({
        titleContent: '商品 - - 商品列表',
        activeKey: key,
        goodsType: key
      })
    } else if (key == 2) {
      this.setState({
        titleContent: '商品 - - 生产类商品',
        activeKey: key,
        goodsType: key
      })
    } else if (key == 3) {
      this.setState({
        titleContent: '商品 - - 库存类商品',
        activeKey: key,
        goodsType: key
      })
    }
  }

  componentDidMount() {
    this.getFreightTemplate();
  }

  //运费模板
  getFreightTemplate() {
    httpRequest.get({
      url: sellerApi.goods.shippingTemplate,
      data: {
        size:1000
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          goodsTemplateList: res.data
        })
      }
    })
  }

  render() {
    return (
        <div className='goods-list'>
          <Title title={this.state.titleContent}/>
          <div className="goods-list-main">
            <Link to="/seller/goods/recycleGoods" className="recycleGoodsBtn">
              <Button>回收站</Button>
            </Link>
            <Tabs type="card" activeKey={this.state.activeKey} onChange={this.callbackTabs}>
              {/*<TabPane tab="商品列表" key="1">*/}
              {/*  <GoodsTable goodsType={this.state.goodsType} goodsTemplateList={this.state.goodsTemplateList}/>*/}
              {/*</TabPane>*/}
              <TabPane tab="生产类商品" key="2">
                <ProduceGoodsTable goodsType={this.state.goodsType} goodsTemplateList={this.state.goodsTemplateList}/>
              </TabPane>
              {/*<TabPane tab="库存类商品" key="3">*/}
              {/*  <InventoryGoodsTable goodsType={this.state.goodsType} goodsTemplateList={this.state.goodsTemplateList}/>*/}
              {/*</TabPane>*/}
            </Tabs>
          </div>
        </div>
    );
  }
}

export default withRouter(GoodsList);