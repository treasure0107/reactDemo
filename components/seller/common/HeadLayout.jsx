import React, { Component, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Modal, Form } from 'antd'
import HeadMenu from './HeadMenu'
import ModifyInfoModal from '../modifyUserInfo/ModifyInfoModal'
import enName from 'seller/images/en.png';
import logo from 'seller/images/seller_logo.png';
import comUtils from 'utils/common'
import { sellerApi } from 'utils/api'
import httpRequest from 'utils/ajax'
import './style/headLayout.scss';
// import Im from 'components/common/ImIcon'
// import api from "utils/api";

class HeadLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  render() {
    return (
      <div style={{zIndex:5}}>
        <div className='ecsc-head-layout'>
          <div className='wrapper'>
            <div className="admin-logo">
              <a href="./">
                <div className="t">
                  <img src={logo} className="logo" />
                  <span className='line'></span>
                  <h1>商家中心</h1>
                </div>
                <div className="en"><img src={enName} /></div>
              </a>
            </div>
            <HeadMenu menuList={this.props.menuList} />
            <div className="ecsc-admin">
              <div className='user-info'>
                <div className="fl user-info-wrapper" onClick={this.modifyUserInfo.bind(this)}>
                  <div className='user-pic fl'>
                    <img src={this.props.loginInfo.avatar || require('assets/images/default_avatar.png')} alt=""/>
                  </div>
                  <div className='fl user-name'>{this.props.loginInfo.username}</div>
                </div>
              </div>
              <div className='head-line fl'>

              </div>
              <div className='fl opreat-icon'>
                <span className='iconfont iconbangzhucebianlandaohang' title="帮助中心" onClick={()=>{
                  window.open('//buyerhelp/list?type=1')
                }}></span>
                <span className='iconfont icondianpudaohang' title="首页" onClick={()=>{
                  window.open('/')
                }}></span>
                {/* <span className='iconfont iconqinglihuancundaohang'></span> */}
                <span title="退出" className='iconfont icontuichudaohang' onClick={this.logout.bind(this)}></span>
              </div>
            </div>
          </div>
        </div>
        <ModifyInfoModal handleOk={this.handleOk.bind(this)} handleCancel={this.handleCancel.bind(this)} visible={this.state.visible} />
      </div>
    )
  }
  handleOk() {
    this.setState({
      visible: false
    })
  }
  handleCancel() {
    this.setState({
      visible: false
    })
  }
  modifyUserInfo() {
    this.setState({
      visible: true
    })
  }
  logout() {
    httpRequest.delete({
      url: sellerApi.login
    }).then(() => {
      comUtils.delCookie('sdktoken')
      comUtils.delCookie('uid')
      localStorage.setItem('token', '')
      this.props.history.push('/sellerLogin')
    })
  }
}

const mapState = (state) => ({
  loginInfo: state.sellerLogin.loginInfo
})

export default connect(mapState, null)(withRouter(HeadLayout))
