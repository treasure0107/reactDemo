import React from 'react'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import Title from '../../common/Title'
import * as sellerRouter from 'router/seller';
import { sellerApi } from 'utils/api'
import httpRequest from 'utils/ajax'
import './style/cloudStorage.scss'

class CloudStorage extends React.Component {
  componentDidMount() {
    this.checkAccountStatus()
  }
  componentWillUnmount() {
    localStorage.removeItem('cloudStatus')
  }
  checkAccountStatus() {
    httpRequest.get({
      url: sellerApi.shop.bindCloudAccount
    }).then(res => {
      if (res.code == 200) {
        if (res.data.account) {
          this.props.history.push('/seller/shop/cloudstorage/detail')
          localStorage.setItem('cloudStatus', 'detail')
        } else {
          this.props.history.push('/seller/shop/cloudstorage/apply')
          localStorage.setItem('cloudStatus', 'apply')
        }
      }
    })
  }
  render() {
    return (
      <div className="cloudStorage">
        <Title title='云存储账户' />
        <div className="right-content-page">
          <Switch>
            <Route path='/seller/shop/cloudstorage/apply' component={sellerRouter.ApplyAccount} />
            <Route path='/seller/shop/cloudstorage/detail' component={sellerRouter.AccountDetail} />
            {
              localStorage.cloudStatus == 'detail' ? (
                <Redirect path='/' to="/seller/shop/cloudstorage/detail" />
              ) : localStorage.cloudStatus == 'apply' ? (
                <Redirect path='/' to="/seller/shop/cloudstorage/apply" />
              ) : null
            }
          </Switch>
        </div>
      </div>
    )
  }
}

export default withRouter(CloudStorage)