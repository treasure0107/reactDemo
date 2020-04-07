import React, { Component, Fragment } from 'react'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import * as sellerRouter from 'router/seller'
import { sellerTitle } from 'assets/js/title'
import Header from 'components/common/SubpageHeader'
import Footer from 'components/common/Footer'
import './style/login.scss'

document.title = sellerTitle.login

class LoginIndex extends Component {
  render() {
    return (
      <div className="loginWrapper">
        <Header headerText={"登录"}>
          <div className="fr noAccount">还没有店铺账号? <Link to="//merchantsjoin">商家入驻</Link></div>
        </Header>
        <div className="mainBody">
          <Switch>
            <Route path="/sellerLogin/Home" component={sellerRouter.Login} />
            <Route path="/sellerLogin/shopsmanage" component={sellerRouter.ShopsManage} />
            <Redirect path="/" to={"/sellerLogin/home"} />
          </Switch>
        </div>
        <Footer isSellerLogin={true} />
      </div>
    )
  }
}

export default LoginIndex
