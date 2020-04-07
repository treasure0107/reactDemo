import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Form } from 'antd'
import StatusTop from './StatusTop'
import EmailVerify from './EmailVerify'
import BottomIntro from './BottomIntro'
import comUtils from 'utils/common'

const applyTitle = '申请云存储账号'
const applyAction = '已有账号, 现在绑定'
const bindTitle = '绑定云存储账号'
const bindAction = '没有账号? 现在申请'

class ApplyAccount extends Component {
  constructor(props) {
    super(props)
    const isFromDetailRebind = comUtils.getQueryString('from') == 'detail'
    this.state = {
      title: isFromDetailRebind ? bindTitle : applyTitle,
      action: isFromDetailRebind ? '' : applyAction    // 从detail点击重新绑定跳转过来，隐藏跳转至申请按钮
    }
  }
  render() {
    const { title, action } = this.state
    return (
      <Fragment>
        <div className="cloudAccount">
          <StatusTop title={title} action={action} clickRight={this.toBindOrApplyAccount}/>
          <EmailVerify customsClass={title.indexOf('申请') > -1 ? '' : 'hide'}  btnText={'申请云存储账号'}  type="apply" verifyId="applyVerify"></EmailVerify>
          <EmailVerify customsClass={title.indexOf('绑定') > -1 ? '' : 'hide'} btnText={'绑定云存储账号'}  type="bind" verifyId="bindVerify"></EmailVerify>
        </div>
        <BottomIntro from="apply" />
      </Fragment>
    )
  }
  toBindOrApplyAccount = (isApply) => {
    this.setState({
      title: isApply ? bindTitle : applyTitle,
      action: isApply ? bindAction : applyAction
    })
  }
}


export default withRouter(Form.create({name: 'applyAccount'})(ApplyAccount))
