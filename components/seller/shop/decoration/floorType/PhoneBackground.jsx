import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message } from 'antd'
import OssUpload from 'components/common/OssUpload'
import httpRequest from 'utils/ajax'
import { sellerApi } from 'utils/api'
import { actionCreator } from '../store'

class PhoneBackground extends React.Component {
  constructor(props) {
    super(props)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.showPhoneBg = this.showPhoneBg.bind(this)
    this.hidePhoneBg = this.hidePhoneBg.bind(this)
    this.state = {
      fileList: [],
      isShowBg: false
    }
  }

  render() {
    const { fileList, isShowBg } = this.state
    const { phoneBackground } = this.props
    return (
      <div className="phoneBackground clearfix">
        <span className="phoneBackground-title fl">手机端店铺主页背景图：</span>
        <span className="phoneBackground-requirement fl">( 图片要求JPG、PNG，宽 750px  高360px )</span>
        <span className="helpIcon">
          <i className="iconfont fl" onMouseEnter={this.showPhoneBg} onMouseOut={this.hidePhoneBg}>&#xe613;</i>
          <img className={isShowBg ? 'showBg backgroundImg' : 'hide backgroundImg'} src={require('assets/images/seller/shop/phone_bg.jpg')} alt="背景图"/>
        </span>
        <div className="phoneBackground-lf fl">
          <OssUpload 
            imgNumber={1}
            uploadIcon={false}
            text={'选择文件上传'}
            onChange={this.handleOnChange}
            fileList={fileList && fileList.length >= 0 && !phoneBackground ? fileList : [{uid: +new Date(), url: phoneBackground}]}
          />
        </div>
      </div>
    )
  }
  showPhoneBg() {
    this.setState({
      isShowBg: true
    })
  }
  hidePhoneBg() {
    this.setState({
      isShowBg: false
    })
  }
  handleOnChange({ fileList }, imgUrl, isIllegalImage) {
    const _fileList = fileList || []
    this.setState({
      fileList: _fileList.map(file => ({
        status: file.status,
        uid: file.uid,
        url: file.url || imgUrl, // 多图上传是，已上传的话，就取已上传的图片url
      }))
    })
    if (_fileList[0]) {
      if (_fileList[0].status == 'done') {
        this.savePhoneBackground(imgUrl)
      }
    } else {
      this.props.setPhoneBackground('')
      if (!isIllegalImage) {
        this.savePhoneBackground('')
      }
    }
  }
  savePhoneBackground(imgUrl) {
    httpRequest.put({
      url: sellerApi.shop.mobileBgTopAdv,
      data: {
        bg_img_app: imgUrl
      }
    }).then(res => {
      if (!res.data.bg_img_app) {
        message.success('删除成功')
      } else {
        message.success('上传成功')
      }
    })
  }
}

const mapState = (state) => {
  return {
    phoneBackground: state.shopDecoration.phoneBackground
  }
}

const mapDispatch = (dispatch) => {
  return {
    setPhoneBackground(phoneBackground) {
      dispatch(actionCreator.setPhoneBackground(phoneBackground))
    }
  }
}

export default connect(mapState, mapDispatch)(PhoneBackground)