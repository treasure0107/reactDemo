import React from "react";

import { Link, withRouter } from "react-router-dom";


import "./style/subpage-header.scss";
import HeaderSearch from "./HeaderSearch"


// 调用方法
// <SubpageHeader headerText={"支付"} isShowSearch={false}></SubpageHeader>
// headerText 必传
// isShowSearch 可不传； true 表示在当前二级页面头部显示搜索框




class SubpageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const { show, value } = this.state;
    return (
      <div className="sub-header">
        <div className="w1200 sub-header-main clearfix">
          <div className="subpage-left fl">
            <Link to="/" className="logo"></Link>
            <div className="txt">
              {this.props.headerText}
            </div>
          </div>
          {this.props.isShowSearch ?
            <div className="subpage-rgt fr">
              <HeaderSearch></HeaderSearch>
            </div> : null}
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default withRouter(SubpageHeader)