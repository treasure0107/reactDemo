/*
  使用示例
  httpRequest.get({
    url: '/v2/movie/top250',
    data: {}, 参数
    beforeSend() {}
  }).then(res => {
    console.log(res)
  })
*/

import { message } from 'antd'
import $ from 'jquery'
import API from './api.js'
import { menuList } from '../components/seller/common/sellerConfig'
import comUtil from './common.js';

let BASEURL = "" //基础域名/

const httpRequest = {
  get (params = {}) {
    //var params = {...params,method:'GET'}
    params = Object.assign({}, params, { method: 'GET', isMessage: this.isMessage })
    if(params.data){
      params.data._time = new Date().getTime(); //ie get请求去缓存
    }
    if(!this.isMessage){
      this.isMessage = true
    }
    return ajaxRequest(params)
  },
  post (params = {}) {
    params = Object.assign({}, params, { method: 'POST', isMessage: this.isMessage })
    if(!this.isMessage){
      this.isMessage = true
    }
    return ajaxRequest(params)
  },
  put (params = {}) {
    params = Object.assign({}, params, { method: 'PUT', isMessage: this.isMessage })
    if(!this.isMessage){
      this.isMessage = true
    }
    return ajaxRequest(params)
  },
  delete (params = {}) {
    params = Object.assign({}, params, { method: 'DELETE', isMessage: this.isMessage })
    if(!this.isMessage){
      this.isMessage = true
    }
    return ajaxRequest(params)
  },
  patch (params = {}) {
    params = Object.assign({}, params, { method: 'PATCH', isMessage: this.isMessage })
    if(!this.isMessage){
      this.isMessage = true
    }
    return ajaxRequest(params)
  },
  isMessage: true,
  noMessage () {
    this.isMessage = false;
    return this
  },
}
function ajaxRequest ({ url, method = 'POST', data = {}, token = true, dataType = 'json', isMessage = true, responseType = null, contentType = null, async = true }) {
  function defaultParams (resolve, reject) {
    return {
      url: `${BASEURL}${url}`,
      timeout: 30000,
      type: method,
      contentType: contentType ? contentType : method == 'GET' ? 'application/x-www-form-urlencoded' : 'application/json',
      data: method == 'GET' ? data : JSON.stringify(data),
      traditional: method == 'GET' ? true : false,
      dataType,
      responseType,
      async: async ? true : false,
      beforeSend: function (xhr) {
        if (token) {
          const session_id = localStorage.getItem("session_id"); // 买家端
          session_id && xhr.setRequestHeader('Authorization', session_id);
        }
        const sellerToken = localStorage.getItem('token'); // 卖家端
        sellerToken && xhr.setRequestHeader('tokenSeller', sellerToken);

        // 测试数据
        // xhr.setRequestHeader('Authorization',  {"user_id":"19", "shop_id":"99"});
      },
      success (res) {
        // console.log(responseType,"responseType");
        // console.log(typeof res);
        if (typeof res == 'string' && responseType == 'blob') {
          resolve(res)
          return;
        }
        // TODO 根据状态码判断是否展示给用户
        try {
          if (res.code == 200) {
            if (url === API.login.userlogin || url === API.register.enrollment) {
              localStorage.setItem("epUserId", res.data.user_info.user_id);
            } else if (url === API.login.isLogin) {
              localStorage.setItem("epUserId", res.data.user_id);
            }
            resolve(res)
          } else if (res.code.toString().indexOf(4) == 0) {
            if (res.code == 415 || res.code == 411) { //登录过期，不用提示msg,自动跳转至登录页，并清除session_id和loginInfo 07-05 by leite，如需修改，请告知
              //如需要用this.props.history.push 路由跳转，则整个ajax调用都需要带当前组件的this变量过来，暂时用window.location跳转
              localStorage.removeItem('loginInfo');
              localStorage.removeItem('persist:root');
              if(url.indexOf("browse/record")>-1 || url.indexOf("/is_receive_coupons")>-1){
                //session 过期，获取最近浏览记录,店铺优惠券，不跳登录页 by leite
                //nothing
                return ;
              }
              if (window.location.pathname.indexOf('seller') > -1) {
                localStorage.removeItem("token");
                if (!window.epDebug) {
                  window.location.href = '/sellerLogin';
                }
              } else {
                localStorage.removeItem("session_id");
                // Clear tbz login code.
                comUtil.clearTBZLoginCode();
                if (url !== API.login.isLogin) { // 校验是否登录接口不用跳转至登录页面
                  const name = window.location.pathname != '/login' ? window.location.pathname : '';
                  if (!window.epDebug) {
                    window.location.href = '//login?back=' + name;
                  }
                }
              }
            } else if (res.code == 456) {  // 用户未登录，清空token
              localStorage.removeItem("token")
            } else if (res.code == 403) {  // 商家端登录过期
              localStorage.removeItem('persist:root');
            }  else if (res.code == 414) {  // IM 注册已存在
              //nothing
            } else {
              if (isMessage) {
                message.error(res.msg);
              }
            }
            reject(res)
          } else {
            // console.log('网络错误,请检查您的网络');
            if(res.code=="517"){ //无地址
              resolve(res);
              return;
            }

            if (isMessage && window.location.href.indexOf("/pay/") <= -1) {
              message.error('网络错误,请稍后重试');
            }
            reject(res)
          }
        }
        catch (err) {
          message.error('网络错误,请检查您的网络');
        }

      },
      error (res) {
        message.error('网络异常，请稍后重试');
        // console.log('网络异常，稍后重试')
        reject(res);
      }
    }
  }

  return new Promise((resolve, reject) => {
    // console.log('BASEURL + url',BASEURL + url)
    $.ajax(defaultParams(resolve, reject));
  })
}

export default httpRequest
