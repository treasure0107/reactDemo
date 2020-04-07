/**
 * Example(props):
 *   visible: a bool control show/hide of component
 *   title: a string control box title
 *   width: a number control box width
 *   content: a string control content for showing
 *   isBtnReverse: a bool control btn reverse => ok/cancel btn => default: {btn1: 'handleOk', btn2: 'handleCancel'} => reverse: {btn1: 'handleCancel', btn2: 'handleOk'}
 *   btn1Text: a string control the text of btn1
 *   btn2Text: a string control the text of btn2
 *   btn1HighLight: a bool control highlight btn1(reverse style of two buttons)
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'antd'
import './style/confirmModal.scss'
import lang from "assets/js/language/config"


class ConfirmModal extends Component {
  constructor() {
    super()
    this.handleCancel = this.handleCancel.bind(this)
    this.handleOk = this.handleOk.bind(this)
  }
  render() {
    const { title, width, footer, content, visible, isBtnReverse, btn1Text, btn2Text, btn1HighLight } = this.props
    return (
      <Modal
        visible={visible}
        title={title}
        centered
        width={width}
        wrapClassName="confirmModal"
        onCancel={this.handleCancel}
        footer={footer === null ? null : [
          <Button key="btn2" className={btn1HighLight ? "ep-btn-hl-1" : "ep-btn-hl-0"} onClick={isBtnReverse ? this.handleOk : this.handleCancel}>
            {btn1Text ? btn1Text : lang.common.cancel}
          </Button>
          ,
          <Button key="btn1"  className={btn1HighLight ? "ep-btn-hl-0" : "ep-btn-hl-1"} onClick={isBtnReverse ? this.handleCancel : this.handleOk}>
            {btn2Text ? btn2Text : lang.common.ok}
          </Button>
        ]}
      >
        {content}
      </Modal>
    )
  }
  handleCancel() {
    this.props.handleCancel()
  }
  handleOk() {
    this.props.handleOk()
  }
}

ConfirmModal.propTypes = {
  visible: PropTypes.bool,
  width: PropTypes.number,
  title: PropTypes.string,
  handleOk: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
}

ConfirmModal.defaultProps = {
  width: 420,
  content: '这是内容',
}

export default ConfirmModal