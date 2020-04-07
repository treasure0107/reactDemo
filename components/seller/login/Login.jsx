import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Input, Icon, Button, Checkbox, Form } from 'antd'
import { sellerApi } from 'utils/api'
import httpRequest from 'utils/ajax'
import comUtils from 'utils/common'

class Login extends Component {
  constructor() {
    super()
    this.state = {
      username: ''
    }
  }
  componentDidMount() {
    // 检查登录状态
    const token = localStorage.getItem('token')
    const isRemember = localStorage.getItem('remember') === 'true'
    if (token) {
      httpRequest.noMessage().get({
        url: sellerApi.login,
      }).then((res) => {
        this._setCookie(res.data.shop_id)
        // 已登录,token未失效,跳至至首页
        this.props.history.push('/seller/home')
      }).catch((res) => {})
    }
    if (isRemember) {
      this.setState({
        username: this.props.loginInfo.username
      })
    }
  }
  render() {
    const { username } = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <div className="login">
          <div className="header clearfix">
            <img className="logo" src={require('assets/images//login/user_login_logo.png')} alt=""/>
            <i className="line"></i>
            <span className="title">商家管理中心</span>
          </div>
          <div className="middle">
            <Form.Item>
              {getFieldDecorator('username', {
                initialValue: username,
                rules: [{
                  required: true,
                  message: '请输入用户名'
                }]
              })(<Input
                  type="text"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  className="username"
                  placeholder="用户名"
                  autoComplete="off"
                />
              )}
            </Form.Item>
            <Form.Item className="passwordForm">
              {getFieldDecorator('password', {
                rules: [{
                  required: true,
                  message: '请输入密码'
                }]
              })(<Input
                  type="password"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  className="password"
                  placeholder="账户密码"
                  autoComplete="off"
                />
              )}
            </Form.Item>

            <Button className="loginBtn" type="primary" htmlType="submit">登录</Button>
          </div>
          <div className="bottom clearfix">
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox className="remember">保存信息</Checkbox>)}
            {/* <Link to="//retrievepassword" className="forgetPassword">忘记密码?</Link> */}
          </div>
        </div>
      </Form>
    )
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const username = values.username
        const password = values.password
        const remember = values.remember
        httpRequest.post({
          url: sellerApi.login,
          data: {
            username,
            password
          }
        }).then(res => {
          const data = res.data
          if (remember) {
            localStorage.setItem('remember', true)
          }
          // 单个店铺的情况
          if (data.menu_list && data.menu_list.length > 0) {
            const shopId = data.shop_id
            const shopList = [{shop_name: data.shop_name, shop_id: shopId}] // shopList给切换店铺使用
            localStorage.setItem('shop_list', JSON.stringify(shopList))
            localStorage.setItem('token', data.token)  // token包含shopId
            localStorage.setItem('seller_shop_id', shopId)
            this._setCookie(shopId)
            this.props.history.push('/seller/home')
          }

          // 多店列表管理
          if (data.shop_list && data.shop_list.length > 0) {
            localStorage.setItem('shop_list', JSON.stringify(data.shop_list)) // shopList给切换店铺使用
            localStorage.setItem('token', data.token)  // token包含用户名和密码信息
            // nick_name给 im使用用户名
            // comUtils.setCookie('nick_name', data.username, 'd1')
            this.props.history.push('/sellerLogin/shopsmanage')
          }
        })
        // .catch(res => {
        //   if (res.code == 400) {
        //     message.error(res.msg, 2)
        //   }
        // })
      }
    })
  }
  _setCookie(shopId) {
    // uid和sdktoken给 客服im 免登录使用
    comUtils.setCookie('uid', 's' + shopId, 'd1')
    comUtils.setCookie('sdktoken', 's' + shopId, 'd1')
    // nick_name给 im使用用户名
    comUtils.setCookie('nick_name', 'user_' + shopId, 'd1')
  }
}

const mapState = (state) => ({
  loginInfo: state.sellerLogin.loginInfo
})

const WrappedLogin = Form.create({ name: 'normal_login' })(Login)
export default connect(mapState, null)(withRouter(WrappedLogin))
