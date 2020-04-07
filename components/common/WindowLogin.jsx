import { Modal, Button, Tabs } from 'antd'
import React, { Component,Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Checkbox } from 'antd'
import AccountLogin from "..login/AccountLogin"
import MobileLogin from '..login/MobileLogin'
import PasswoldLogin from '..login/PasswoldLogin'
import MenuNav from "./RightToolbar/MenuNav"
import BuriedPoint from "components/common/BuriedPoint.jsx";
import './style/windowlogin.scss'
const { TabPane } = Tabs


调用方法,参考例子： compontents/common/MenuNav.jsx
<WindowLogin visible={visible} isFromRightSidebar={true} changeVisibleVal={changeVisibleVal}></WindowLogin>
 visible 必传，控制登录弹窗显示/隐藏
changeVisibleVal 必传，本组件内部点击 ‘关闭按钮’ 改变父组件的 visible
isFromRightSidebar 可选，表示是否来自 右边侧边栏的调用

let gWindowVisible = false;

class WindowLogin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      registere: '1',
      parentText: '',
      phone: '',
      negation: '',
      setpassword: ''
    }
  }

   确定按钮方法
  handleOk = e => {
    console.log(e);
    this.props.changeVisibleVal(false)
  };

   取消按钮方法
  handleCancel = e => {
    console.log(e);
    this.props.changeVisibleVal(false)
  };  

  callback(key) {
    this.setState({
        keytab: key
    }, () => {});

     For buried point.
    if (key == 1) {
       account
      BuriedPoint.track({name: "点击账号登录按钮"});
    } else if (key == 2) {
       phone
      BuriedPoint.track({name: "点击手机号登录按钮"});
    }
  }

  fn(data) {
      console.log('fnfn', data)
      this.setState({
          registere: data,
          setpassword: data
      }, () => {
           console.log('要跳转至设置密码页面',this.state.registere);
           父组件中的username替换为子组件传递的值
      })
  }

  getChildData(res) {
      this.setState({
          phone: res
      }, () => {})
  }

  negation(res) {
      this.setState({
          negation: res
      }, () => {})
  }

  render() {
     console.log(this.props,'111111111')

     For buried point.
    if (this.props.visible) {
      if (!gWindowVisible) {
        BuriedPoint.track({name: "显示登录弹窗"});
      }
      gWindowVisible = true;
    } else {
      gWindowVisible = false;
    }

    return (
      <Fragment>
        <Modal
          width={'380px'}
          title="您尚未登录"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          centered={true}  垂直居中展示弹出层
          wrapClassName="windowbox"
        >
          <div className="windowLogin">
          {
            this.state.registere == 1 ? (
                <div className="tit">
                    <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                        <TabPane tab="账号登录" key="1">
                            <div className="loginmethod">
                                <AccountLogin tbzCB={this.props.tbzCB} designEditCB={this.props.designEditCB} changeVisibleVal={this.props.changeVisibleVal} isFromRightSidebar={this.props.isFromRightSidebar} ></AccountLogin>
                            </div>
                        </TabPane>
                        <TabPane tab="手机号登录" key="2">
                            <div className="loginmethod">
                                <MobileLogin tbzCB={this.props.tbzCB} designEditCB={this.props.designEditCB} changeVisibleVal={this.props.changeVisibleVal} isFromRightSidebar={this.props.isFromRightSidebar} negation={this.negation.bind(this)} getChildData={this.getChildData.bind(this)} pfn={this.fn.bind(this)}></MobileLogin>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            ) : null
        }
        {
            this.state.setpassword == 201 ? (
                <div className="setuplogin"><PasswoldLogin changeVisibleVal={this.props.changeVisibleVal}  negation={this.state.negation} nameall={this.state.phone}></PasswoldLogin></div>
            ) : null
        }           
          </div>
        </Modal>
      </Fragment>
    )
  }
}

export default WindowLogin;




