/**
 * ConfirmModal1.jsx
 * 
 * This component is a pop box which used for letting user decide something.
 * Only two buttons are available: btn1 and btn2.
 * Only title and simple content are available.
 * 
 * props:
 *   visible => {Boolean} => Control if the pop box visible.
 *   handleBtn1 => {Function} => The callback function when user click btn1.
 *   handleBtn2 => {Function} => The callback function when user click btn2.
 *   handleClose => {Function} => The callback function when user click close.
 *   title (optional) => {String} => The title of the pop box.
 *   content (optional) => {String} => The content of the pop box.
 *   btn1Text => {String} => The text shown on btn1.
 *   btn2Text => {String} => The text shown on btn2.
 */

import React from "react";
import {Modal} from "antd";
import "./style/confirmmodal1.scss";

class ConfirmModal1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleBtn1 = this.handleBtn1.bind(this);
    this.handleBtn2 = this.handleBtn2.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleBtn1() {
    this.props.handleBtn1();
  }

  handleBtn2() {
    this.props.handleBtn2();
  }

  handleClose() {
    this.props.handleClose();
  }

  render() {
    return (
      <Modal
        destroyOnClose
        centered
        closable={false}
        maskClosable={false}
        width={420}
        height={160}
        wrapClassName={"ep-pop-box-confirm-box1"}
        footer={null}
        visible={this.props.visible}
      >
        <div className="ml-relative ep-inner">
          <div className="ml-text-center ep-title"><span className="ml-block">{this.props.title}</span></div>

          <div className="ml-text-center ep-content"><span className="ml-block">{this.props.content}</span></div>

          <div className="ep-btns">
            <div className="ml-center-out">
              <div className="ml-center-middle">
                <div className="ml-pointer ml-no-user-select ml-left ml-table ep-btn1" onClick={() => this.handleBtn1()}>
                  <div className="ml-table-cell ml-text-center ep-btn1-inner">
                    <span className="ml-block">{this.props.btn1Text}</span>
                  </div>
                </div>
                
                <div className="ml-pointer ml-no-user-select ml-left ml-table ep-btn2" onClick={() => this.handleBtn2()}>
                  <div className="ml-table-cell ml-text-center ep-btn2-inner">
                    <span className="ml-block">{this.props.btn2Text}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-abs ml-pointer ep-close" onClick={() => this.handleClose()}></div>
        </div>
      </Modal>
    )
  }
}

export default ConfirmModal1;