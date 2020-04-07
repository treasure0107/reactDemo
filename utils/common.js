import $ from "jquery";
import Base64 from "../assets/js/base64";
import Sha1 from "../assets/js/sha1.js";
import { Modal, Icon } from 'antd';
import React from 'react';
import _ from 'lodash';

const { confirm } = Modal;
import httpRequest from './ajax';
import api, { sellerApi } from './api';
import BuriedPoint from "components/common/BuriedPoint.jsx";
import Handling from 'components/common/Handling';

let comUtil = {
  phoneReg: /^(\d{11})$/,    //手机
  hkPhoneReg: /^([2|3|4|5|6|8|7|9])\d{7}$/,
  emailReg: /^([A-Za-z0-9_\+\-\.])+\@([A-Za-z0-9_\-])+\.([A-Za-z]{2,8})$/,   //邮箱
  pwdReg: /^[^\s\u4e00-\u9fa5]{6,16}$/, // 除空格和中文外的所有字符
  onlyNumOrLetter: /^[0-9a-zA-Z]{4,16}$/, // 4-16位英文和数字
  onlyNumber: /^\d+$/,
  justNumber: /^[0-9]\d*$/, // 0开通数字
  positiveInteger: /^[1-9]\d*$/, // 正整数
  decimalNumber: /^\d+(\.\d{0,2})?$/, // 2位小数
  fileTypeCanPreview: /.*\.(png|jpg|jpeg|bmp)$/,
  fileTypeZIPRAR: /.*\.(zip|rar)$/,
  fileTypeMustDownload: /.*\.(png|jpg|jpeg|bmp|pdf)$/,
  fileTypeAI: /.*\.(ai)$/,
  fileTypeCDR: /.*\.(cdr)$/,
  fileTypePDF: /.*\.(pdf)$/,
  fileTypePSD: /.*\.(psd)$/,
  checkLogin: function () {
    let sessionId = localStorage.getItem("session_id");
    if (sessionId) { //sessionId存在，但是可能过期
      return true;
    } else {
      return false;
    }
  },
  // Use API to check if user logged in.
  checkLogin1: function (okCB, errorCB) {
    Handling.start();
    httpRequest.noMessage().get({
      url: api.login.isLogin,
      async: false
    }).then(res => {
      Handling.stop();
      okCB(res);
    }).catch(res => {
      Handling.stop();
      errorCB(res);
    });
  },
  setCookie: function (name, value, time) { //d10  表示10天
    console.log(name, value, time, '1')
    var strsec = this.getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },
  getCookie: function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return (arr[2]);
    } else {
      return null;
    }
  },
  delCookie: function (name) {
    this.setCookie(name, "", "0s");
  },
  //注册自动登录，设置IMcookie
  setIMCookie(res) {
    console.log(res, '这是什么res')
    if (this.getCookie("uid") && this.getCookie("uid").indexOf("s") > -1) {
      //nothing
    } else {
      this.setCookie('nickName', res.nick_name, 'd1');
      this.setCookie('sdktoken', res.user_id, 'd1');
      this.setCookie('uid', res.user_id, 'd1');
    }
  },
  getsec: function (str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
      return str1 * 1000;
    } else if (str2 == "h") {
      return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
      return str1 * 24 * 60 * 60 * 1000;
    }
  },
  updataExpTime: function (time, token) {
    localStorage.setItem("expTime", time);
    localStorage.setItem("token", token);
  },
  getExpTime: function () {
    return (localStorage.getItem("expTime") || 0);
  },
  captchaKey: function () { //生产唯一标示
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  getQuery: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);//从?之后开始匹配如getQuery(courseid)返回一个数组["courseid=8","","8","&",index:0,input:"courseid=8"]
    if (r != null) return unescape(r[2]);
    return null;
  },
  formatDate(date, fmt) {
    var currentDate = new Date(date);
    var o = {
      "M+": currentDate.getMonth() + 1, //月份
      "d+": currentDate.getDate(), //日
      "h+": currentDate.getHours(), //小时
      "m+": currentDate.getMinutes(), //分
      "s+": currentDate.getSeconds(), //秒
      "q+": Math.floor((currentDate.getMonth() + 3) / 3), //季度
      "S": currentDate.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  },
  /**
   * parseQueryString
   * Return {Object}: {foo: "bar", foo1: "bar1"}
   * @param {String} str "?foo=bar&foo1=bar1"
   */
  parseQueryString(str) {
    str = str.replace("?", "");
    var arr = str.split("&");
    var obj = {};
    for (var i = 0, len = arr.length; i < len; i++) {
      var kvArr = arr[i].split("=");
      obj[kvArr[0]] = kvArr[1];
    }
    return obj;
  },
  // 获取地址参数
  getLocaData(data) {
    if (Array.isArray(data)) {
      let idList = [];
      let cityList = '';
      for (let i = 0; i < data.length; i++) {
        try {
          let NewData = data[i].split('_');
          if (NewData[1]) {
            cityList = cityList + NewData[1]
            // if (i == data.length - 1) {
            //     cityList = cityList + NewData[1]
            // } else {
            //     cityList = cityList + NewData[1] + ','
            // }
          }
          if (NewData[0]) {
            idList.push(NewData[0].toString())
          }
        } catch (error) {
          continue;
        }
      }
      return [idList, cityList]
    } else {
      return data.split('_')
    }
  },
  //判断字符是否为空的方法
  isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  },

  //敏感字验证
  wordsVerify: function (content, callback) {
    if (this.isEmpty(content)) {
      return false
    }
    httpRequest.post({
      url: sellerApi.goods.goodsVerify,
      data: {
        content: content
      }
    }).then(res => {
      if (res.code == "200") {
        let results = res.data[0].results[0].suggestion;
        callback(results)
      }
    })
  },
  // 商家后台样式确认操作
  confirmModal(data) {
    // 复制调用
    // comUtil.confirmModal({
    //     okText:'确定',
    //     cancelText:'取消',
    //     className:'seller-confirm-modal',
    //     content:'',
    //     title:'',
    //     onOk() {
    //       console.log('OK');
    //     },
    //     onCancel() {
    //       console.log('Cancel');
    //     }
    //   })

    let Content = (props) => {
      return <div>
        <div className="confirm-body">{_.get(props, 'data.content', '')}</div>
      </div>
    }
    let Title = (props) => {
      return <div>
        <div className="confirm-title">{_.get(props, 'data.title', '提示')}
          <div aria-label="Close" className="confirm-modal-close" onClick={() => {
            $('.seller-confirm-modal').eq($('.seller-confirm-modal').length - 1).find('.ant-modal-confirm-btns').eq(0).children().eq(0).trigger('click');
          }}>
            <span className='ant-modal-close-x'><Icon type="close" /></span></div>
        </div>
      </div>
    }
    confirm({
      ...data,
      title: <Title data={data} />,
      content: <Content data={data} />,
      cancelButtonProps: _.get(data, 'cancelButtonProps', {})
    })
  },
  // 金钱限制 2位小数 from表单使用
  moneyLimit(rule, value, callback, data) {
    var reg = this.decimalNumber;
    data = { max: null, min: null, content: '只能输入数字或小数保留2位，请重新输入', firstContent: '该项必填', ...data }
    let { content, min, max, firstContent } = data;
    if (min == null && max == null) {
      if (reg.test(value)) {
        callback();
      } else if (!value) {
        callback(firstContent);
      } else {
        callback(content);
      }
    } else {
      if (typeof min == 'string') {
        min = parseFloat(min)
      }
      if (typeof max == 'string') {
        max = parseFloat(max)
      }
      if (reg.test(value) && value >= min && value <= max) {
        callback();
      } else if (!value) {
        callback(firstContent);
      } else {
        callback(content);
      }
    }

  },
  // 整数限制
  integerLimit(rule, value, callback, data) {
    var reg = this.positiveInteger;

    data = { max: null, min: null, content: '只能输入正整数', firstContent: '该项必填', ...data }
    let { content, min, max, firstContent } = data;
    if (min == null && max == null) {
      if (reg.test(value)) {
        callback();
      } else if (!value) {
        callback(firstContent);
      } else {
        callback(content);
      }
    } else {
      if (typeof min == 'string') {
        min = parseInt(min)
      }
      if (typeof max == 'string') {
        max = parseInt(max)
      }
      if (reg.test(value) && value >= min && value <= max) {
        callback();
      } else if (!value) {
        callback(firstContent);
      } else {
        callback(content);
      }
    }
  },
  createUdesk: function () {
    let fakeName;
    if (localStorage.getItem("fakewebtoken")) { //唯一标识存在
      fakeName = localStorage.getItem("fakewebtoken")
    } else {
      fakeName = this.captchaKey();
      localStorage.setItem("fakewebtoken", fakeName)
    }
    let c_name = localStorage.getItem("nick_name") || "";
    let c_email = localStorage.getItem("userEmail") || "";
    let c_phone = localStorage.getItem("userPhone") || "";
    let nonce = "dcy" + (+new Date());
    let timestamp = +new Date();
    c_name = c_phone || c_email || c_name;
    let web_token = c_name ? c_name : fakeName;
    let signatureStr = "nonce=" + nonce + "&timestamp=" + timestamp + "&web_token=" + web_token + "&3d07cd097c1e0bf3db9f9a55d67d17b7";
    let signature = Sha1(signatureStr);
    (function (a, h, c, b, f, g) {
      a["UdeskApiObject"] = f;
      a[f] = a[f] || function () {
        (a[f].d = a[f].d || []).push(arguments)
      };
      g = h.createElement(c);
      g.async = 1;
      g.charset = "utf-8";
      g.src = b;
      c = h.getElementsByTagName(c)[0];
      c.parentNode.insertBefore(g, c)
    })(window, document, "script", "https://assets-cli.udesk.cn/im_client/js/udeskApi.js", "ud");

    // For buried point.
    setTimeout(function () {
      $("#udesk_container #udesk_btn a").on("click", function () {
        BuriedPoint.track({ name: "点击平台客服按钮" });
      });
    }, 1500);

    ud({
      "code": "30h6h58k",
      "link": "https://.udesk.cn/im_client/?web_plugin_id=63816",
      "": {
        "c_name": c_name,
        "c_email": c_email,
        "c_phone": c_phone,
        "nonce": nonce,
        "signature": signature,
        "timestamp": timestamp,
        "web_token": web_token
      }
    });
  },
  clearTBZLoginCode: function () {
    localStorage.setItem("tbzLoginCode", "");
  },

  //优惠券标题创建
  formatCouponsTit(item) {
    let t1 = item.use_requirement == 0;// "满" : 1"阶梯满减";
    let t4 = item.start_price == 0; //无门槛
    let t2 = item.coupon_type == 0 // "满减" : "折扣";
    let t3 = item.most_offer == 0 //最多减的金额或折扣
    let maxPric = parseFloat(item.most_offer)

    if (t4) {
      return `无门槛${parseFloat(item.discount_price)}${t2 ? "元" : "折"}`
    }

    return `${t1 ? "满" : "每满"}${parseFloat(item.start_price)} ${t2 ? "减" : "打"} ${parseFloat(item.discount_price)} ${t2 ? "" : "折"} ${t3 ? "" : t2 ? "最多减￥" + maxPric : "最多可抵扣" + maxPric}`


  },
  getFormatPrice(val) {
    let _price = this.formatprice(val, 1) + "." + this.formatprice(val);
    return _price
  },
  formatprice(val, flag) {

    let intVal = String(val).includes(".");
    intVal = !intVal ? (val + ".000") : val;
    intVal += "";

    let left = intVal.split('.')[0];
    let right = intVal.split('.')[1];
    if (flag == 1) {
      return left;
    } else {
      if(right.length >= 3){
        right = right.substr(0, 3);
      }
      if (right.charAt(right.length - 1) == 0) {
        right = right.substr(0, right.length - 1);
      }
      return right;
    }
  },
  // Make sure config file loaded.
  configFileReady(cb) {
    var timer = setInterval(function () {
      if (window.epConfigJs) {
        clearInterval(timer);
        cb();
      }
    }, 1000);
  },
  IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  },

  /**
   * Get account type for login name.
   * @param {String} name
   */
  getAccountType(name) {
    let accountType = "";
    if (this.emailReg.test(name)) {
      accountType = "邮箱";
    } else if (this.phoneReg.test(name)) {
      accountType = "手机号";
    } else {
      accountType = "用户名";
    }
    return accountType;
  },

  /**
   * Download online file through back-end.
   * @param {String} fileUrl
   * @param {String} fileName
   */
  dlFile(fileUrl, fileName) {
    let finalUrl = sellerApi.home.home_Download + "?url=" + fileUrl + "&file_name=" + fileName + "&type=1";
    window.open(finalUrl, "_blank");
  },
  dlFileEncode(fileUrl, fileName) {
    let finalUrl = sellerApi.home.home_Download + "?url=" + fileUrl + "&file_name=" + encodeURIComponent(fileName) + "&type=1";
    window.open(finalUrl, "_blank");
  },

  getImageUrl(name, url, printStatus) {
    let result = {
      url: url,
      showFileSuffix: false,
      showPreviewIcon: false,
      suffixName: "",
    };

    let target = printStatus === 1 ? name : url;

    if (this.fileTypeCanPreview.test(target)) {
      result.url = url;
      result.showPreviewIcon = true;
    } else if (this.fileTypeZIPRAR.test(target)) {
      result.url = require("assets/images//user/file-icon-zip-rar.png");
    } else if (this.fileTypePDF.test(target)) {
      result.url = require("assets/images//user/file_icon_pdf.png");
    } else if (this.fileTypeCDR.test(target)) {
      result.url = require("assets/images//user/file_icon_cdr.png");
    } else if (this.fileTypePSD.test(target)) {
      result.url = require("assets/images//user/file_icon_psd.png");
    } else if (this.fileTypeAI.test(target)) {
      result.url = require("assets/images//user/file_icon_ai.png");
    } else {
      result.url = require("assets/images//user/file-icon.png");
      result.showFileSuffix = true;
      result.suffixName = name.split(".").pop().toUpperCase();
    }

    return result;
  },
  encodeSearchKey(key) {
    const encodeArr = [{
      code: '%',
      encode: '%25'
    }, {
      code: '?',
      encode: '%3F'
    }, {
      code: '#',
      encode: '%23'
    }, {
      code: '&',
      encode: '%26'
    }, {
      code: '=',
      encode: '%3D'
    }];
    return key.replace(/[%?#&=]/g, ($, index, str) => {
      for (const k of encodeArr) {
        if (k.code === $) {
          return k.encode;
        }
      }
    });
  },

};

export default comUtil;

