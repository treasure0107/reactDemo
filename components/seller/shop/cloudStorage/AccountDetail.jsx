import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import StatusTop from './StatusTop'
import { Button } from 'antd'
import BottomIntro from './BottomIntro'
import { sellerApi } from 'utils/api'
import httpRequest from 'utils/ajax'

class AccountDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detail: null
    }
  }
  componentDidMount() {
    httpRequest.get({
      url: sellerApi.shop.cloudAccountDetail
    }).then(res => {
      if (res.code == 200) {
        this.setState({
          detail: res.data
        })
      }
    })
  }

  render() {
    const { detail } = this.state
    return (
      <Fragment>
      {
        detail ? (
          <Fragment>
            <div className="accountDetail">
              <StatusTop title="已绑定云存储账号" type="btn" wrapperCls="detailTop">
                <Button className="fr btnStyle" onClick={this.toCloudStorage}>进入云存储</Button>
              </StatusTop>
              <div className="acctountDetailContent">
                <div className="item clearfix">
                  <span className="label fl">店铺名称:</span>
                  <span className="fl">{detail.companyName}</span>
                </div>
                <div className="item clearfix">
                  <span className="label fl">邮箱:</span>
                  <span className="fl">{detail.account}</span>
                  <span className="fl line">|</span>
                  <span className="fl reBind" onClick={this.reBind}>重新绑定</span>
                </div>
                <div className="item clearfix">
                  <span className="label fl">有效期:</span>
                  <span className="fl blueStyle">{detail.startDate} ～ {detail.endDate}</span>
                </div>
                <div className="item clearfix">
                  <span className="label fl">已使用流量:</span>
                  <span className="fl"><span className="blueStyle">{this.convertUnit(detail.currentTransferVolume, true)}</span>（ 总流量{this.convertUnit(detail.transferVolume)}GB 总空间{this.convertUnit(detail.printSphereDiskSpace)}GB ）</span>
                </div>
              </div>
            </div>
            <BottomIntro from="detail" /> 
          </Fragment>    
        ) : null
      }
      </Fragment>
    )
  }
  // 1000B == 1KB
  convertUnit(volume, isDecimal) {
    if (volume) {
      if (isDecimal) {
        if (volume < 1000 * 1000) {
          return (volume / 1000).toFixed(3) + 'KB'
        } else if (volume < 1000 * 1000 * 1000) {
          return (volume / 1000 / 1000).toFixed(3) + 'MB'
        } else {
          return (volume / 1000 / 1000 / 1000).toFixed(3) + 'GB'
        }
      } else {
        return (volume / 1000 / 1000 / 1000)
      }
    } else {
      if (volume === 0) {
        return '0KB'
      }
    }
    return 0
  }
  toCloudStorage() {
    if (window.location.host.indexOf('ppytest') > -1) {
      window.open('https://test.upload2print.com/access')
    } else {
      window.open('https://ps1cn.ecoprint.tech/access')
    }
  }
  reBind = () => {
    this.props.history.push('/seller/shop/cloudstorage/apply?from=detail')
  }
}

export default withRouter(AccountDetail)