import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, message } from 'antd'
import ImgList from './ImgList'
import GalleryList from './GalleryList'
import floorConfig from '../common/floorConfig'
import '../style/shopDecoration.scss'


class EditModal extends Component {
  constructor(props) {
    super(props)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.onRef = this.onRef.bind(this)
    this.state = {
      isGoodsFloor: props.floorType == floorConfig.goodsFloorOne.type || props.floorType == floorConfig.goodsFloorTwo.type,  // 是否是商品楼层
    }
  }

  render() {
    const { title, visible } = this.props
    const { isGoodsFloor } = this.state
    return (
      <div>
        <Modal
          width={800}
          okText="确认"
          cancelText="取消"
          title={title}
          centered
          visible={visible}
          // visible={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrapClassName={isGoodsFloor ? 'editFloor goodsFloor' : 'editFloor'}
        >   
          <div className="editContent">
            <ImgList onRef={this.onRef} source={this.props.source} />
          </div>
          <div className="imgLib" >
            <GalleryList source={this.props.source}/>
          </div>
        </Modal>
      </div>
    )
  }
  onRef(ref) {
    this.ImgList = ref
  }
  // 确定
  handleOk() {
    if (this.validateSelectNum()) {
      this.ImgList.validateInput(() => {
        this.props.handleOk()
      })
    }
  }

  // 验证选择图片或者商品的数量是否符合数量限制
  validateSelectNum() {
    const { floorType, imgList } = this.props
    const floorTypes = Object.keys(floorConfig)
    for(let i = 0; i < floorTypes.length; i++) {
      const floor = floorConfig[floorTypes[i]]
      if (floor.type == floorType && imgList.length < floor.limitPicNum) {
        if (floorType == 10 || floorType == 11) {  // 商品楼层
          message.error(`至少选择${floor.limitPicNum}个商品`)
        } else {
          message.error(`至少选择${floor.limitPicNum}张图片`)
        }
        return false
      }
    }
    return true
  }

  // 关闭
  handleCancel() {
    this.props.handleCancel()
  }
}

const mapState = (state) => {
  return {
    floorType: state.shopDecoration.floorType,
    imgList: state.shopDecoration.imgList
  }
}

export default connect(mapState, null)(EditModal)