import React, {Component, Fragment} from 'react'
import LeftMenu from 'components/seller/common/LeftMenu';
import {goodsChildrenList, StatementList} from '../common/sellerConfig';
import {Route, Redirect, Switch} from 'react-router-dom'
import * as sellerRouter from '../../../router/seller';
import {connect} from "react-redux";

class Goods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goodsChildrenList: []
    }
  }

  componentDidMount() {
     我要分销 ,商品授权
    if (this.props.loginInfo.shopType == 3 || this.props.loginInfo.shopType == 4) {
      let arr = [{name: '商品列表', url: '/seller/goods/goodsList/0', id: 1}, {
        name: '我要分销', url: '/seller/goods/distribute', id: 2
      }];
      this.setState({
        goodsChildrenList: arr.concat(goodsChildrenList)
      })
    } else if (this.props.loginInfo.isDirectShop) {
      let arr = [{name: '商品列表', url: '/seller/goods/goodsList/0', id: 1}, {
        name: '商品授权', url: '/seller/goods/goodsAuthorization', id: 3
      }];
      this.setState({
        goodsChildrenList: arr.concat(goodsChildrenList)
      })
    } else {
      let arr = [{name: '商品列表', url: '/seller/goods/goodsList/0', id: 1}];
      this.setState({
        goodsChildrenList: arr.concat(goodsChildrenList)
      })
    }
  }

  render() {
    const {goodsChildrenList} = this.state;
    return (
      <div className='wrapper'>
        {
          goodsChildrenList.length > 0 ? <Fragment>
            <LeftMenu menuList={goodsChildrenList}/>
            <div className='ecsc-layout-right'>
              <Switch>
                <Route path='/seller/goods/goodsList/:status' component={sellerRouter.GoodsList}/>
                <Route path='/seller/goods/goodsStoreClassify' component={sellerRouter.GoodsStoreClassify}/>
                <Route path='/seller/goods/goodsStoreTwoClassify/:id' component={sellerRouter.GoodsStoreTwoClassify}/>
                <Route path='/seller/goods/goodsPhotoGallery/:id' component={sellerRouter.GoodsPhotoGallery}/>
                <Route path='/seller/goods/goodsPhotoGalleryFolder' component={sellerRouter.GoodsPhotoGalleryFolder}/>
                <Route path='/seller/goods/goodsUserComment' component={sellerRouter.GoodsUserComment}/>
                <Route path='/seller/goods/addGoodsComment' component={sellerRouter.AddGoodsComment}/>
                <Route path='/seller/goods/addProduceGoods/:goods_id/:draft_id'
                       component={sellerRouter.AddProduceGoods}/>
                <Route path='/seller/goods/addInventoryGoods/:goods_id' component={sellerRouter.AddInventoryGoods}/>
                <Route path='/seller/goods/addGoodsClassify/:id' component={sellerRouter.AddGoodsClassify}/>
                <Route path='/seller/goods/goodsLogList/:id' component={sellerRouter.GoodsLogList}/>
                <Route path='/seller/goods/recycleGoods' component={sellerRouter.RecycleGoods}/>
                <Route path='/seller/goods/goodsDraftList' component={sellerRouter.GoodsDraftList}/>
                <Route path='/seller/goods/distribute' component={sellerRouter.Distribute}/>
                <Route path='/seller/goods/goodsAuthorization' component={sellerRouter.GoodsAuthorization}/>
                <Route path='/seller/goods/authorizeDetail/:id' component={sellerRouter.AuthorizeDetail}/>
                <Redirect path="/" to={'/seller/goods/goodsList/0'}/>
              </Switch>
            </div>
          </Fragment> : null
        }
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    loginInfo: state.sellerLogin.loginInfo
  }
};

export default connect(mapState, null)(Goods)
