/*
* 自定义属性弹窗
* */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Modal, Input, Button, message} from 'antd';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js';

class UserDefinedAttrModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      titleAttr: false,
      definedAttrList: [],
      attrValue: "",
      attr_id: "",
      classifyId: "",
    };
  }

  componentDidMount() {
  }

  showModal = () => {
    let definedAttrValue = this.props.definedAttrValue || [];
    let attrValueArr = this.props.attrValueArr || [];
    let classifyId = this.props.classifyId;
    let attrId = this.props.attrId;
    let len = attrValueArr.length;
    let draft_id = this.props.match.params.draft_id;
    if (draft_id > 0) {
      classifyId = window.sessionStorage.getItem("category_id");
    }
    if (len >= 8) {
      message.warning("每一个属性的属性值不能超过8项");
      return false;
    }
    this.setState({
      definedAttrList: definedAttrValue,
      attr_id: attrId,
      classifyId,
      visible: true
    });
  };

  handleChangeAttrValue(e) {
    let attrValue = e.target.value;
    this.setState({
      attrValue
    })
  }

  handleOk = e => {
    let newDefinedAttrList = this.state.definedAttrList;
    let attr_value = this.state.attrValue;
    let list = [];
    let attrObj = {};
    let paramObj = {};
    let flag = false;
    if (comUtil.isEmpty(attr_value)) {
      message.error("属性值不能为空");
      return false
    }
    attrObj.attr_value = attr_value;
    attrObj.attr_id = this.state.attr_id;
    attrObj.cat_id = this.state.classifyId;
    newDefinedAttrList && newDefinedAttrList.map((item, index) => {
      paramObj[item.param_id] = item.value;
      if (comUtil.isEmpty(paramObj[item.param_id])) {
        flag = true;
      }
    });
    if (flag) {
      message.error("属性参数输入不全");
      return false
    }
    attrObj.param_key_value = paramObj;
    list.push(attrObj);
    httpRequest.post({
      url: sellerApi.goods.goodsShopAttr,
      data: {
        attr_value: list,
      }
    }).then(res => {
      if (res.code == "200") {
        let attrList = res.data.attr_value;
        this.props.attrValueList(attrList)
      }
    });
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleChangeInput(index, value_type_id, e) {
    let reg = /\D/g;
    let value = e.target.value;
    if (value_type_id == 1 || value_type_id == 2 || value_type_id == 3) {
      // value = e.target.value.replace(reg, "");
      value = e.target.value.replace(/[^\d.]/g, "").replace(/\.{2,}/g, ".").replace(/^\./g, "").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    }
    let newDefinedAttrList = this.state.definedAttrList;
    newDefinedAttrList[index].value = value;
    this.setState({
      definedAttrList: newDefinedAttrList
    })
  }

  render() {
    const {attrValue} = this.state;
    const attrValueLen = this.props.attrValueArr.length;
    return (
      <div className="attr-box borderNone displayInlineBlock">
        <a href="javascript:void (0);" className="ml16 add-attr attr-box borderNone displayInlineBlock"
           onClick={this.showModal}><span
          className={`${attrValueLen >= 8 ? "attr-d" : null}`}>自定义属性值</span></a>
        <Modal
          title="自定义属性"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={500}
          wrapClassName={'defined-attr-modal'}
          okText={'提交'}
          cancelText={'取消'}>
          <div>
            <span>属性值：</span>
            <Input value={attrValue} onChange={this.handleChangeAttrValue.bind(this)} className="w266 ml10"/>
          </div>
          <div className="mt30 pb16 defined-box clearfix">
            <div className="defined-tit">参数：</div>
            <div className="defined-con">
              {this.state.definedAttrList &&
              this.state.definedAttrList.map((item, index) => {
                return (
                  <div className="defined-item mb10" key={index}>
                    <span className="ml20">{item.param_name}</span>
                    <Input value={item.value} onChange={this.handleChangeInput.bind(this, index, item.value_type_id)}
                           placeholder="300" className="w88 ml10"/>
                  </div>
                )
              })
              }
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}


export default withRouter(UserDefinedAttrModal);