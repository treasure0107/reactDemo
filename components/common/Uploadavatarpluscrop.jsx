

// 调用方法<Uploadavatarpluscrop></Uploadavatarpluscrop>
// 传getUserPick 代表是否展示默认头像
// 传userPicture 头像
// setImgUrl oss上传改变头像方法


import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import api from "utils/api.js"
import httpRequest from 'utils/ajax.js'
import { cropper } from '../../assets/js/cropper.js';
import { Upload, Button, Modal, Icon, message } from 'antd';
import $ from 'jquery';
window.jQuery = $;
import './style/cropper.css'
import './style/ImgCropping.css'
import './style/uploadavtarpluscrop.scss'
let uploadUrl = "";

class Uploadavatarpluscrop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgUrl: null,
      files: null
    }
  }


  componentDidMount() {
    $LAB
      .script("/js/cropper.js").wait(function () {

      })
    var win_height = $(window).height();
    var win_width = $(window).width();
    if (win_width <= 768) {
      $(".tailoring-content").css({
        "top": (win_height - $(".tailoring-content").outerHeight()) / 2,
        "left": 0
      });
    } else {
      $(".tailoring-content").css({
        "top": (win_height - $(".tailoring-content").outerHeight()) / 2,
        "left": (win_width - $(".tailoring-content").outerWidth()) / 2
      });
    }

    $('#tailoringImg').cropper({
      aspectRatio: 1 / 1,//默认比例
      preview: '.previewImg',//预览视图
      guides: false,  //裁剪框的虚线(九宫格)
      autoCropArea: 0.5,  //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
      movable: false, //是否允许移动图片
      dragCrop: true,  //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
      movable: true,  //是否允许移动剪裁框
      resizable: true,  //是否允许改变裁剪框的大小
      zoomable: false,  //是否允许缩放图片大小
      mouseWheelZoom: false,  //是否允许通过鼠标滚轮来缩放图片
      touchDragZoom: true,  //是否允许通过触摸移动来缩放图片
      rotatable: true,  //是否允许旋转图片
      crop: function (e) {
        // 输出结果数据裁剪图像。
      }
    });
  }

  replceImg() {
    $(".tailoring-container").toggle();
  }

  getFileType(filename) {
    const pos = filename.lastIndexOf('.');
    let suffix = '';
    if (pos != -1) {
      suffix = filename.substring(pos);
    }
    return suffix;
  }

  randomString(len) {
    len = len || 32;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  selectImg(file) {
    // console.log(file.target)
    // console.log(file.target.files[0])
    // console.log(file.target.files[0].name)
    let files = file.target.files[0];
    this.setState({
      files: files
    })
    this.setState({
      imgUrl: file.target.files[0].name
    })
    if (!file.target.files || !file.target.files[0]) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (evt) {
      var replaceSrc = evt.target.result;
      //更换cropper的图片
      $('#tailoringImg').cropper('replace', replaceSrc, false);//默认false，适应高度，不失真
    }
    reader.readAsDataURL(file.target.files[0]);
  }

  closeTailor() {
    $(".tailoring-container").toggle();
  }

  sureCut() {
    if ($("#tailoringImg").attr("src") == null) {
      return false;
    } else {
      var cas = $('#tailoringImg').cropper('getCroppedCanvas');//获取被裁剪后的canvas
      var base64url = cas.toDataURL('image/png'); //转换为base64地址形式
      $("#finalImg").prop("src", base64url);//显示为图片的形式
      // console.log(base64url)
      let imgUrl = this.state.files;

      //关闭裁剪框
      // console.log(this.dataURLtoFile(base64url, 'filname.png'))
      let caijian = this.dataURLtoFile(base64url, 'filname.png')
      this.uploadImage(caijian)
      this.closeTailor();
    }
  }



  uploadImage(item) {
    // console.log(item)
    let _this = this;
    httpRequest.get({
      url: api.ossUpload,
      data: { upload_dir: "web/" }
    }).then(res => {
      let data = res.data;
      uploadUrl = data.host;
      let formdata = new FormData();
      let _key = data.dir + this.randomString(10) + new Date().getTime() + _this.getFileType(item.name);
      formdata.append("key", _key);
      formdata.append("signature", data.signature);
      formdata.append("OSSAccessKeyId", data.accessid);
      formdata.append("policy", data.policy);
      formdata.append("success_action_status", "200");
      formdata.append("file", item);
      return this.upload(formdata, _key);
    })
  }

  upload = (formdata, key, name) => {
    const { formName } = this.props
    let _this = this;
    $.ajax({
      url: uploadUrl,
      type: 'post',
      cache: false,
      data: formdata,
      processData: false,
      contentType: false,
      success: function (res) {
        let imageOssUrl = uploadUrl + "/" + key;
        // console.log(imageOssUrl)
        localStorage.setItem("imageOssUrl", imageOssUrl);
        //回调函数，返回图片oss 绝对路径
        if (_this.props.backFunc) {
          _this.props.backFunc(imageOssUrl, formName)
        }
        _this.props.setImgUrl(imageOssUrl)
        // httpRequest.post({
        //   url: api.user.userinfo,
        //   data: {
        //     header: imageOssUrl
        //   }
        // })
      }
    })
  }

  dataURLtoBlob(dataurl) { //将base64格式图片转换为文件形式
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
      type: mime
    });
  }

  render() {
    return (
      <div className="Uploadavatarpluscrop">
        <a id="replaceImg" onClick={this.replceImg.bind(this)} className="l-btn replace-btn">更换头像</a>
        <div className="hade-size">
          {
            this.props.userPicture ? <img id="finalImg" className="upload-img" src={this.props.userPicture} /> :
              <img className="upload-img" src={require('assets/images/default_avatar.png')} />
          }
        </div>
        <div style={{ display: 'none' }} className="tailoring-container">
          <div className="black-cloth" onClick={this.closeTailor.bind(this)}></div>
          <div className="tailoring-content">
            <div className="tailoring-content-one">
              <label title="上传图片" htmlFor="chooseImg" className="l-btn choose-btn upload-label">
                <input type="file" accept="image/jpg,image/jpeg,image/png" name="file" id="chooseImg" className="hidden" onChange={this.selectImg.bind(this)} />
                选择图片
              </label>
              <div className="close-tailoring" onClick={this.closeTailor.bind(this)}>×</div>
            </div>
            <div className="tailoring-content-two">
              <div className="tailoring-box-parcel">
                <img id="tailoringImg" />
              </div>
              <div className="preview-box-parcel">
                <p>图片预览：</p>
                <div className="square previewImg preview-div"></div>
                <div className="circular previewImg"></div>
              </div>
            </div>
            <div className="tailoring-content-three">
              {/* <button className="l-btn cropper-reset-btn">复位</button> */}
              {/* <button className="l-btn cropper-rotate-btn">旋转</button> */}
              {/* <button className="l-btn cropper-scaleX-btn">换向</button> */}
              <span className="l-btn sureCut" id="sureCut" onClick={this.sureCut.bind(this)}>确定</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Uploadavatarpluscrop;

