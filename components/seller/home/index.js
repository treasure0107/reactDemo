import React, {Component} from 'react'
import {connect} from 'react-redux'
import LeftMenu from '../common/LeftMenu';
import {IndexChildrenList} from '../common/sellerConfig';
import {Route, Redirect, Switch} from 'react-router-dom'
import * as sellerRouter from '../../../router/seller';
import {actionCreator} from './store'
import httpRequest from 'utils/ajax'

import '../common/style/index.scss';

class Index extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    this.props.getNoticeCount()  // 获取通知未读数
  }

  render() {
    return (
      <div className='wrapper'>
        {/* <div className="left-menu-welcome">欢迎页<div className="arrow"></div></div>
                    <div className="left-add-quickmenu">
                        <a href="javascript:void(0);">添加快捷功能</a>
                    </div> */}
        <LeftMenu menuList={IndexChildrenList}/>
        <div className='ecsc-layout-right'>
          {/* {this.props.children} */}
          <Switch>
            <Route path='/seller/home/welcome' component={sellerRouter.WelcomePage}/>
            <Route path='/seller/home/helpDetail' component={sellerRouter.HelpDetail}/>
            <Route path='/seller/home/notice' component={sellerRouter.Notice}/>
            {/* <Route path='/seller/home/help' component={sellerRouter.Help} /> */}
            {/*<Route path='/seller/home/offer/:status?' component={sellerRouter.OfferPage} />*/}
            {/*<Route path='/seller/home/getoffer/:id/:type' component={sellerRouter.GetOffer} />*/}
            <Redirect path="/" to={'/seller/home/welcome'}/>
          </Switch>
        </div>
      </div>
    )
  }
}

const mapDispatch = (dispatch) => {
  return {
    getNoticeCount() {
      dispatch(actionCreator.asyncGetNoticeCount())
    }
  }
}
export default connect(null, mapDispatch)(Index)