// 直接调用 引入GotoTop, 然后在需要回到顶部的位置放入<GotoTop></GotoTop>即可
//visibilityHeight   滚动高度达到此参数值才出现 BackTop 默认400

import React, { Component } from 'react'
import { BackTop } from 'antd';
import "./style/gototop.scss"
class GotoTop extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="gototop-box" title="回到顶部">
        <BackTop visibilityHeight="400" />
      </div>
    )
  }
}

export default GotoTop