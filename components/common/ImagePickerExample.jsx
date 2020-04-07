import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom'
// import { NavBar, Icon } from 'antd-mobile'
// import { ImagePicker, WingBlank, SegmentedControl, Button } from 'antd-mobile';
import api from "utils/api.js"
import httpRequest from 'utils/ajax.js'
import $ from "jquery";
import './style/imagepickerexample.scss'
import { message } from 'antd';


let uploadUrl = "";

class ImagePickerExample extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      multiple: false,
      name: '',
      url: ''
    }
  }
  componentWillMount() {
    this.Personalinformation();
  }

  // 获取个人信息
  Personalinformation() {
    httpRequest.get({
      url: api.user.userinfo
    }).then(res => {
      this.setState({
        url: res.data.header
      })
    })
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

  getFileType(filename) {
    const pos = filename.lastIndexOf('.');
    let suffix = '';
    if (pos != -1) {
      suffix = filename.substring(pos);
    }
    return suffix;
  }

  uploadImage(item) {
    console.log(item)
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
        _this.setState({
          url: imageOssUrl
        })
        httpRequest.post({
          url: api.user.userinfo,
          data: {
            header: imageOssUrl
          }
        })
      }
    })
  }
  // files 值发生变化触发的回调函数
  onChange() {
    // var _name, _fileName, personsFile;
    // let files = document.getElementById("replacepicture").files[0];
    // _name = files.name;
    // _fileName = _name.substring(_name.lastIndexOf(".") + 1).toLowerCase();
    // if (_fileName !== "png" && _fileName !== "jpg" && _fileName !== "jpeg") {
    //   message.error("上传图片格式不正确，请重新上传");
    //   return
    // }
    let files = document.getElementById("replacepicture").files[0];
    console.log(files,'11111111111')
    this.uploadImage(files)
  }

  render() {
    const { files } = this.state;
    return (
      <div className="user_img">
        <div className="imagepick">
          <input type="file" className="se2" id="replacepicture" onChange={this.onChange.bind(this)} accept="image/png,image/gif,image/jpg,image/jpeg" />
          {/* <img className="sc_img" src={require('assets/images/sc.png')} /> */}
          <label><input className="se1" type="button" value="" /></label>
        </div>
        {
          this.state.url ? <img className="img_size" src={this.state.url} /> :
            <img className="give_img" src={require('assets/images/default_avatar.png')} />
        }
        {/* <div className="shade"></div> */}
      </div>
    );
  }
}

export default ImagePickerExample 