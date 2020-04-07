import React, { Component } from 'react'
import { withRouter } from "react-router";
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api'
import comUtils from 'utils/common'


class shopClose extends Component {
  constructor(props){
    super(props);
    this.state={
      time:3
    }
  }
  componentDidMount(){
   this.timer = setInterval(()=>{
      this.setState({
        time:this.state.time - 1
      },()=>{
        if(this.state.time <= 0){
          this.logout()
        }
      })
    },1000)
  }
  componentWillUnmount(){
    this.timer&&clearInterval(this.timer);
  }
  logout=()=>{
    httpRequest.delete({
      url: sellerApi.login
    }).then(() => {
      comUtils.delCookie('sdktoken')
      comUtils.delCookie('uid')
      localStorage.setItem('token', '')
      this.props.history.push('/sellerLogin')
    })
  }
  render() {
    return (
      <div className='ecsc-layout-prepare'>
        <div className='wrap'>
          <div className='logo-box'>
            <div className='logo'>
              <span className='iconfont icondianpu'></span>
            </div>
            <section className='main-content'>店铺关闭中，请联系平台客服人员</section>
          </div>
           <section className='minor-content'>{`${this.state.time}秒后，自动退出 并跳转至`}<span className='go-to-login' onClick={()=>{
             this.logout()
           }}>登录页</span></section>
        </div>
      </div>
    )
  }
}

export default withRouter(shopClose)
