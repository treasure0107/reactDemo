import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { Icon, Tabs } from 'antd';

const { TabPane } = Tabs;



class Collect extends React.Component {
    constructor(props) {
        super(props);
    }
    tabChange = (val) => {
      console.log(val);
    }
    render() {
      const collectGoods = this.props.collectGoods;
      const collectShop = this.props.collectShop;
        return (
          <Tabs defaultActiveKey="1" onChange={this.tabChange}>
            <TabPane tab="商品" key="1">
              <ul className="collect_goods clearfix">
                {
                  collectGoods.map( (item,idx) => {
                   return (
                    <li key={idx}>
                      <Link to="/">
                        <div className="img_show">
                          <img src={item.url} />
                          <p onClick={(event) => {event.preventDefault();this.props.delGoodsCollect(item.shop_id)}} className="del">取消收藏</p>
                        </div>
                        <p className="price">{item.price}</p>
                        </Link>
                    </li>
                   )
                  })
                }
             </ul>
            </TabPane>
            <TabPane tab="店铺" key="2">
             <ul className="collect_shops clearfix">
                  <li>
                        <Link to="/">
                        <img src="/data/store_street/brand_thumb/1554483834085677417.png" />
                        <p className="name">汇印通</p>
                        <span className="shop_link">进入店铺</span>
                        </Link>
                      </li>
                {/* {
                  collectShop.map( (item,idx) => {
                    return(
                      <li key={idx}>
                        <Link to="/">
                        <img src={item.logo} />
                        <p className="name">{item.name}</p>
                        <span className="shop_link">进入店铺</span>
                        </Link>
                      </li>
                    )
                  })
                } */}
             </ul>
            </TabPane>
          </Tabs>
        )
    }
}

function mapStateToProps(state) {
    return {
      collectGoods: state.collectData.collectGoods,
      collectShop: state.collectData.collectShop
    }
}

function mapDispatchToProps(dispatch) {
    return {
      delGoodsCollect: (tag) => {
        console.log("tag",tag);
        dispatch({type:'ASYNC_DEL_COLLECT_DATA',shop_id:tag})
    },
       delShopCollect: (tag) => {
           dispatch({type:'ASYNC_DEL_COLLECT_SHOP_DATA',shop_id:tag})
       }
    }
}

export default connect(
  mapStateToProps,mapDispatchToProps
)(Collect)
