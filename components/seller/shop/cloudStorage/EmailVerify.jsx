import React, {Component, Fragment} from 'react'
import {withRouter} from 'react-router-dom'
import {Form, Input, Button, Modal, message} from 'antd'
import comUtils from 'utils/common'
import api, {sellerApi} from 'utils/api'
import httpRequest from 'utils/ajax'
import SlideVerify from 'components/common/SlideVerify'
import Handling from 'components/common/Handling'

class EmailVerify extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      title: '',
      content: '',
      customsCls: null,       // 自定义弹窗title的类名
      isShowCloseBtn: true,   // 与否展示弹窗删除按钮
      geetest_challenge: '',  // 极验3个参数
      geetest_seccode: '',
      geetest_validate: '',
      slideSucc: false,
      isValidEmail: false,    // 是否邮箱验证通过
      sendCodeText: '发送验证码到邮箱',
      countDown: 60,          // 验证码倒计时
      isCountDownOver: true, // 倒计时结束
      toBindCountDown: 3,    // 跳转至手动绑定页面倒计时
      toBind: false,         // 账号申请时，如果自动绑定失败，需要用户手动绑定
      isApplySucc: false,    // 申请账号成功
      captchaObj: ''         // 验证滑块对象
    }
  }

  render() {
    const {form: {getFieldDecorator}, btnText, type, verifyId, customsClass} = this.props
    const {visible, title, content, customsCls, isShowCloseBtn, isValidEmail, slideSucc, sendCodeText, isCountDownOver, toBindCountDown, toBind} = this.state
    return (
      <div className={customsClass ? `${customsClass} accountContent` : 'accountContent'}>
        <Form layout="inline" onSubmit={this.bindOrApplyCloudAccount}>
          {this.props.children}
          {
            type == 'apply' ? (
              <Form.Item label="店铺名称">
                {getFieldDecorator('company_name', {
                  initialValue: localStorage.currentShop
                })(<Input disabled title={localStorage.currentShop}/>)}
              </Form.Item>
            ) : null
          }
          <Form.Item label="邮箱">
            {getFieldDecorator('email', {
              rules: [
                {required: true, message: '请输入邮箱'},
                {validator: this.emailValidate}
              ]
            })(<Input autoComplete="off"/>)}
            <span className="explain">(本邮箱为云存储服务的登录账号)</span>
          </Form.Item>
          <Form.Item label="验证" className="verifyBtn">
            {getFieldDecorator('verify_component', {
              rules: [
                {required: true, message: '请进行验证'}
              ]
            })(<Input className="hide"/>)}
            <SlideVerify slideSucc={this.slideSucc} wrapperId={verifyId}/>
          </Form.Item>
          <Form.Item label="验证码">
            {getFieldDecorator('verify_code', {
              rules: [
                {required: true, message: '请输入验证码'}
              ]
            })(<Input className="verifyCode" autoComplete="off"/>)}
            {
              slideSucc && isValidEmail && isCountDownOver ? (
                <Button className="active sendCodeBtn" onClick={this.sendVerifyCode}>{sendCodeText}</Button>
              ) : (
                <Button className="sendCodeBtn">{sendCodeText}</Button>
              )
            }
          </Form.Item>
          <Button type="primary" className="applyBtn" htmlType="submit">{btnText}</Button>
        </Form>
        <Modal
          onCancel={this.handleModalCancel}
          wrapClassName="cloudStorageModal"
          width={420}
          visible={visible}
          footer={null}
          closable={isShowCloseBtn ? true : false}
          maskClosable={isShowCloseBtn ? true : false}
          centered
        >
          <div className="modalMain center">
            <div className={customsCls ? `${customsCls} title` : "title"}>{title}</div>
            <div className="content">{content}</div>
            <Button onClick={this.handleModalOk}>好的{toBind ? `(${toBindCountDown})` : null}</Button>
          </div>
        </Modal>
      </div>
    )
  }

  // 滑块验证成功
  slideSucc = (values) => {
    this.setState({
      slideSucc: true,
      ...values
    })
    this.props.form.setFieldsValue({  // 表示滑块已验证成功
      verify_component: 1
    })
  }

  emailValidate = (rule, value, callback) => {
    // 防抖
    if (this.emailTimer) {
      clearTimeout(this.emailTimer)
    }

    this.emailTimer = setTimeout(() => {
      if (comUtils.emailReg.test(value)) {
        const {type} = this.props
        callback()
        this.validateEmail(true)
     /*   httpRequest.get({
          url: sellerApi.shop.checkCloudAccount,
          data: {
            email: value
          }
        }).then(res => {
          if (res.code == 200) {
            if (!res.data.exist) {
              if (type == 'bind') {
                callback('该邮箱未申请云存储账号')
                this.validateEmail(false)
              } else {
                callback()
                this.validateEmail(true)
              }
            } else {
              if (type == 'bind') {
                callback()
                this.validateEmail(true)
              } else {
                callback('该邮箱已创建云存储账号')
                this.validateEmail(false)
              }
            }
          }
        })*/
      } else {
        if (value) {
          callback('请输入正确的邮箱')
        } else {
          callback()
        }
        this.validateEmail(false)
      }
    }, 1000)
  }

  validateEmail(isValidEmail) {
    this.setState({isValidEmail})
  }

  bindOrApplyCloudAccount = (e) => {
    e.preventDefault();
    const {form, type} = this.props
    form.validateFields((err, values) => {
      if (!err) {
        if (type == 'bind') {
          const isRebind = comUtils.getQueryString('from') == 'detail' ? true : false
          this.bindCloudAccount(values, isRebind)
        } else {
          this.applyCloudAccount(values)
        }
      }
    });
  }

  bindCloudAccount(values, isRebind) {
    const params = {
      url: isRebind ? sellerApi.shop.reBindCloudAccount : sellerApi.shop.bindCloudAccount,
      data: {
        email: values.email,
        verify_code: values.verify_code
      }
    }
    if (isRebind) {
      httpRequest.put(params).then(res => {
        this.toCloudAccountDetail(res)
      })
    } else {
      httpRequest.post(params).then(res => {
        this.toCloudAccountDetail(res)
      })
    }
  }

  toCloudAccountDetail(res) {
    if (res.code == 200) {
      const {from, applyCloudSucc, history} = this.props
      if (from) {
        // 商品编辑页面 申请云账号成功
        if (from == 'goodsEdit') {
          this.props.applyCloudSucc(false)
        }
      } else {
        history.push('/seller/shop/cloudstorage/detail')
      }
    }
  }

  applyCloudAccount(values) {
    httpRequest.noMessage().post({
      url: sellerApi.shop.applyCloudAccount,
      data: {
        email: values.email,
        company_name: localStorage.currentShop,
        verify_code: values.verify_code
      }
    }).then(res => {
      if (res.code == 200) {
        // this.props.history.push('/seller/shop/cloudstorage/detail')
        this.setState({
          title: '云存储账号申请成功！',
          content: '您将会收到1封激活邮件，请点击邮件内部的链接设置密码。',
          visible: true,
          customsCls: null,
          isApplySucc: true
        })
      }
    }).catch(res => {
      // 申请账号成功，但是绑定失败，提示用户手动去绑定
      const {toBindCloudAccount, history} = this.props
      if (res.code == 403) {
        if (from) {
          if (from == 'goodsEdit') {
            toBindCloudAccount("0");
            message.warning("云存储账号申请成功,请为您的店铺绑定云存储账号!")
          }
        } else {
          this.setState({
            title: '云存储账号申请成功！',
            content: '请为您的店铺绑定云存储账号。',
            visible: true,
            customsCls: null,
            isShowCloseBtn: false,
            toBind: true
          })
          this.toBindTimer = setInterval(() => {
            this.setState((prevState) => ({
              toBindCountDown: prevState.toBindCountDown - 1
            }), () => {
              if (this.state.toBindCountDown === 0) {
                clearInterval(this.toBindTimer)
                this.setState({
                  toBindCountDown: 3,
                  visible: false
                }, () => {
                  history.push('/seller/shop/cloudstorage/bind?from=apply')
                })
              }
            })
          }, 1000)
        }
      } else if (res.code == 400) {
        message.warn(res.msg)
      }
    })
  }

  sendVerifyCode = () => {
    const {geetest_challenge, geetest_seccode, geetest_validate} = this.state
    Handling.start()
    httpRequest.post({
      url: api.login.verification,
      data: {
        username: this.props.form.getFieldValue('email'),
        geetest_challenge,
        geetest_seccode,
        geetest_validate
      }
    }).then(res => {
      if (res.code == 200) {
        Handling.stop()
        this.setState({
          title: '验证码已发送到邮箱！',
          content: '请进入邮箱打开邮件，将验证码复制填入输入框内。',
          visible: true,
          customsCls: 'blackTitle',
          isCountDownOver: false
        })
        this.timer = setInterval(() => {
          this.setState((prevState) => ({
            countDown: prevState.countDown - 1
          }), () => {
            if (this.state.countDown === 0) {
              // 重置验证滑块
              this.state.captchaObj.reset()
              clearInterval(this.timer)
              this.setState({
                countDown: 60,
                sendCodeText: '发送验证码到邮箱',
                isCountDownOver: true,
                slideSucc: false,
              })
            } else {
              this.setState({
                sendCodeText: <Fragment><span className="second">{this.state.countDown}s</span>重新获取验证码</Fragment>
              })
            }
          })
        }, 1000)
      }
      Handling.stop()
    }).catch(res => {
      Handling.stop()
    })
  }

  handleModalOk = () => {
    const {toBind, isApplySucc} = this.state
    const {history} = this.props
    if (toBind) {
      history.push('/seller/shop/cloudstorage/bind?from=apply')
    } else if (isApplySucc) {
      history.push('/seller/shop/cloudstorage/detail')
    }
    this.setState({
      visible: false
    })
  }

  handleModalCancel = () => {
    if (this.state.isApplySucc) {
      this.props.history.push('/seller/shop/cloudstorage/detail')
    }
    this.setState({
      visible: false
    })
  }
}

export default withRouter(Form.create({name: 'emailVerify'})(EmailVerify))
