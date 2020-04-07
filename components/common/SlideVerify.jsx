 调用示例
 <SliderVerify slideSucc={this.slideSucc}/>
 参数解释:
 slideSucc: 滑块验证成功回调
   回调成功的4个参数
     geetest_challenge,  三个验证码参数
     geetest_seccode,
     geetest_validate,
     captchaObj          滑块对象，可调用一些滑块组件的API  https:docs.geetest.com/install/apirefer/api/web
 customsWidth: 滑块宽度，默认270px
 wrapperId: 放极验dom父元素id

import React, { Component } from 'react'
import httpRequest from 'utils/ajax'
import api from 'utils/api'
import comUtils from 'utils/common'

class SlideVerify extends Component {
  componentDidMount() {
    $LAB.script("/js/gt.js").wait(() => {
      window.initGeetest = initGeetest;
      this.initGeetestFunc();
    });
  }

   第三方点击滑动验证方法
  initGeetestFunc() {
    const _username = localStorage.getItem("jyToken")
    const jyToken = comUtils.captchaKey()
    if (!_username) {
      localStorage.setItem("jyToken", jyToken)
      _username = jyToken
    }
    httpRequest.post({
      url: api.geetest.init,
      data: { username: _username }
    }).then(res => {
      res.data = typeof res.data == 'string' ? JSON.parse(res.data) : res.data
      const { customsWidth, slideSucc, wrapperId } = this.props
      initGeetest({
         以下配置参数来自服务端 SDK
        gt: res.data.gt,
        challenge: res.data.challenge,
        offline: !res.data.success,
        new_captcha: true,
        width: customsWidth ? customsWidth + 'px' : '270px'
      }, (captchaObj) => {
         这里可以调用验证实例 captchaObj 的实例方法
        captchaObj.appendTo(`#${wrapperId}`) 将验证按钮插入到宿主页面中 wrapperId 元素内
        captchaObj.onReady(() => {
        }).onSuccess(res => {
          captchaObj.getValidate()
          const { geetest_challenge, geetest_seccode, geetest_validate } = captchaObj.getValidate()
          if (slideSucc && typeof slideSucc == 'function') {
            slideSucc({
              geetest_challenge, 
              geetest_seccode,
              geetest_validate,
              captchaObj
            })  调用滑动完成后可以点击发送验证码方法
          }
        })
      })
    });
  }

  render() {
    const { wrapperId } = this.props
    return (
      <div id={wrapperId}></div>
    )
  }

}

export default SlideVerify
