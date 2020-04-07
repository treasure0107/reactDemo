import React, { Fragment } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import CommonUtil from "utils/common"
import Error404 from 'components/common/404'
function MainRouter(props) {
  return (
    <Switch>
      <Route exact path='/' component={Router.Index} />
      <Route path='//secne/:id' component={Router.Secne} />
      <Route path='//purchase' component={Router.Purchase} />
      <Route path='//activity/' component={Router.Activity} />
      <Route path='/seller' component={sellerRouter.SellerIndex}></Route>
      <Route path='/sellerLogin' component={sellerRouter.LoginIndex}></Route>

      <Route path='/third/tbz' component={third.TBZ} />
      <Route path='/404' component={Error404}></Route>
      <Route render={() => <Redirect to="/404" />} />
    </Switch >
  )
}

const PrivateRoute = ({ component: Component }) => (
  <Route render={props => (CommonUtil.checkLogin()) ? (
    <Component {...props} />
  ) : (
      <Redirect to={"//login?back=" + props.location.pathname} />

    )
  }
  />
);


export default MainRouter
