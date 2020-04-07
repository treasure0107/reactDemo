import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Modal, Input, message } from 'antd'
import { actionCreator } from '../login/store'
import comUtils from 'utils/common'
import Uploadavatarpluscrop from 'components/common/Uploadavatarpluscrop'
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';

class ModifyInfoModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_picture: props.loginInfo.avatar
    }
  }
  render() {
    const { form: {getFieldDecorator}, loginInfo } = this.props
    const { user_picture } = this.state
    return (
      <Modal 
        title={'修改个人资料'} 
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        className='modifyInfoModal'
        okText='确定'
        cancelText='取消'
        destroyOnClose={true}
        centered
      >
        <Form hideRequiredMark labelAlign="right" labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
          <Form.Item label={'头像'} style={{marginBottom: '15px'}}>
            {/* {getFieldDecorator('user_pic', {
              valuePropName: 'fileList',
              getValueFromEvent: this.handleOnChange,
              initialValue: user_picture || '',
            })(<Uploadavatarpluscrop userPicture={user_picture} setImgUrl={this.setImgUrl} />)} */}
            <Uploadavatarpluscrop userPicture={user_picture} setImgUrl={this.setImgUrl} />
          </Form.Item>
          <Form.Item label={'用户名'} style={{marginBottom: '15px'}}>
            {getFieldDecorator('username', {
              initialValue: loginInfo.username,
            })(<Input autoComplete="off" disabled />)}
          </Form.Item>
          <Form.Item label={'旧密码'} style={{marginBottom: '15px'}}>
            {getFieldDecorator('old_password', {
              initialValue: '',
              rules: [{
                required: true,
                message: '请输入旧密码'
              }],
            })(<Input type="password" autoComplete="off" readOnly onFocus={this.onOldPwdFocus} />)}
          </Form.Item>
          <Form.Item label={'新密码'} style={{marginBottom: '15px'}}>
            {getFieldDecorator('new_password', {
              initialValue: '',
              rules: [{
                required: true,
                message: '请输入新密码'
              }, {
                validator: (rule, value, callback) => newPassword(rule, value, callback, this.props.form)
              }],
            })(<Input type="password" autoComplete="off" readOnly onFocus={this.onNewPwdFocus} />)}
          </Form.Item>
          <Form.Item label={'确认新密码'} style={{marginBottom: '15px'}}>
            {getFieldDecorator('password', {
              initialValue: '',
              rules: [{
                required: true,
                message: '请确认新密码'
              }, {
                validator: (rule, value, callback) => newPasswordConfirm(rule, value, callback, this.props.form)
              }],
            })(<Input type="password" autoComplete="off" readOnly onFocus={this.onConfirmNewPwdFocus} />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
  setImgUrl = () => {
    const user_picture = localStorage.getItem('imageOssUrl')
    httpRequest.put({
      url: sellerApi.modifyUserInfo,
      data: {
        user_picture
      }
    }).then(res => {
      this.setState({
        user_picture
      })
      const loginInfoCopy = {...this.props.loginInfo}
      loginInfoCopy.avatar = user_picture
      this.props.setLoginInfo(loginInfoCopy)
      message.success('修改头像成功')
    })
  }
  onOldPwdFocus = (e) => {
    this.removeReadOnlyAttr(e, 'readOnly')
  }
  onNewPwdFocus = (e) => {
    this.removeReadOnlyAttr(e, 'readOnly')
  }
  onConfirmNewPwdFocus = (e) => {
    this.removeReadOnlyAttr(e, 'readOnly')
  }
  removeReadOnlyAttr(event, attr) {
    event.target.removeAttribute(attr)
  }
  // handleOnChange = ({ fileList }, imgUrl) => {
  //   this.setState({
  //     imgUrl
  //   })
  //   return fileList.map(file => ({
  //     status: file.status,
  //     uid: file.uid,
  //     url: file.url || imgUrl  // 已上传的话，就取已上传的图片url
  //   }))
  // }
  handleOk = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      const { old_password, new_password, password } = fieldsValue
      if (!err) {
        httpRequest.put({
          url: sellerApi.modifyUserInfo,
          data: {
            old_password,
            new_password,
            password
          }
        }).then(res => {
          message.success('修改密码成功')
          this.props.handleOk()
        })
      }
    })
  }
  handleCancel = () => {
    this.props.handleCancel()
  }
}
const newPassword = (rule, value, callback, form) => {
  const { getFieldValue } = form
  const password = getFieldValue('password')
  if (value) {
    if (!comUtils.pwdReg.test(value)) {
      callback('请输入6-16位密码，任意字符（空格，中文除外）')
    } else {
      if (value !== password && password) {
        callback('两次密码输入不一致！')
      }
    }
  }
  callback()
}
const newPasswordConfirm = (rule, value, callback, form) => {
  const { getFieldValue } = form
  const newPassword = getFieldValue('new_password')
  if (value && value !== newPassword && newPassword) {
    callback('两次密码输入不一致！')
  }
  callback()
}
const mapState = (state) => {
  return {
    loginInfo: state.sellerLogin.loginInfo
  }
}
const mapDispatch = (dispatch) => ({
  setLoginInfo(loginInfo) {
    dispatch(actionCreator.setSellerLoginInfo(loginInfo))
  }
})
const WrapperModifyInfoModal = Form.create({ name: 'ModifyInfo' })(ModifyInfoModal)
export default connect(mapState, mapDispatch)(WrapperModifyInfoModal)
