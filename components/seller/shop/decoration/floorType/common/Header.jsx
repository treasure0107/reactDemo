import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Input, Icon, message } from 'antd'
import { actionCreator } from '../../store'
import ConfirmModal from 'components/common/ConfirmModal'
import EditModal from '../../editModal/index.js'
import httpRequest from 'utils/ajax'
import { sellerApi } from 'utils/api'
import comUtils from 'utils/common'

class Header extends React.Component {
  constructor() {
    super()
    this.showDeleteModal = this.showDeleteModal.bind(this)
    this.closeConfirmModal = this.closeConfirmModal.bind(this)
    this.deleteFloor = this.deleteFloor.bind(this)
    this.toEdit = this.toEdit.bind(this)
    this.closeEditModal = this.closeEditModal.bind(this)
    this.confirmEditModal = this.confirmEditModal.bind(this)
    this.handleSortInput = this.handleSortInput.bind(this)
    this.getOldSort = this.getOldSort.bind(this)
    this.timer = null
    this.state = {
      deleteVisible: false,
      oldSort: '',
      editModalVisible: false,
      floorSortNum: null  // 楼层排序 
    }
  }
  render() {
    const { floorSortNum, editModalVisible } = this.state
    const { isFloor, title, desc, floorNum, floorSort } = this.props
    return (
      <Fragment>
        <div className="header clearfix">
          <span className="shop-decoration-sp">{!isFloor ? title : ('楼层' + floorNum)}：</span>
          <span className="floorDesc">( {desc} )</span>
          {
            isFloor ? <Fragment>
                        <span className="editsp" onClick={this.toEdit}>
                          <i className="iconfont edit">&#xe63d;</i>
                        </span>
                        <span className="sort">
                          楼层排序
                          <Input 
                            ref={el => this.sortInput = el}
                            value={(floorSortNum == '' || floorSortNum) ? floorSortNum : floorSort}
                            onFocus={this.getOldSort}
                            onChange={this.handleSortInput} 
                          />
                          <Icon type="close-circle" onClick={this.showDeleteModal} />
                        </span>
                      </Fragment>
                    : <span className="editsp" onClick={this.toEdit}>
                        <i className="iconfont edit">&#xe63d;</i>
                      </span>
          }
          <ConfirmModal 
            handleCancel={this.closeConfirmModal}
            handleOk={this.deleteFloor}
            visible={this.state.deleteVisible}
            content={'你确定要删除这个楼层吗？'}
          />
          {
            editModalVisible ? <EditModal
                                visible={editModalVisible}
                                title={desc}
                                source={'header'}
                                handleOk={this.confirmEditModal}
                                handleCancel={this.closeEditModal}
                              />
                            : null
          }
        </div>
        {/* 图片和商品内容 */}
        {this.props.children}
      </Fragment>
    )
  }
  getOldSort(e) {
    this.setState({
      oldSort: e.target.value
    })
  }
  handleSortInput(e) {
    const sort = e.target.value
    const { sortChange } = this.props
    if (sortChange && typeof sortChange == 'function' && comUtils.onlyNumber.test(sort)) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        sortChange(this.state.oldSort, sort)
      }, 500)
    }
    // this.props.sortChange(this.state.oldSort, sort)
    if (comUtils.onlyNumber.test(sort)) {
      this.setState({
        floorSortNum: sort
      })
    } else {
      message.warn('请输入有效数字')
      this.setState({
        floorSortNum: ''
      })
    }
  }
  // 去编辑弹窗
  toEdit() {
    // this.props.toEdit()
    this.setState({
      editModalVisible: true
    })
    if (this.sortInput) {  // 头部广告，轮播没有排序
      this.props.setEditFloorSort(this.sortInput.input.value)
    }
    this.props.chooseFloorType(this.props.floorType)
    this.props.setNoContent(this.props.floorType, 'emptyText')
  }
  // 关闭编辑弹窗
  closeEditModal() {
    // this.props.closeEditModal()
    this.setState({
      editModalVisible: false
    })
  }
  // 编辑弹窗确认
  confirmEditModal() {
    // this.props.confirmEditModal()
    console.log('header编辑确认')
    const { confirmEdit } = this.props
		if (confirmEdit && typeof confirmEdit == 'function') {
			confirmEdit()
		}
    this.setState({
      editModalVisible: false
    })
  }
  // 显示是否删除弹窗
  showDeleteModal() {
    this.setState({
      deleteVisible: true
    })
  }
  // 关闭是否删除弹窗
  closeConfirmModal() {
    this.setState({
      deleteVisible: false
    })
  }
  // 删除楼层
  deleteFloor() {
    const { floorType, floorSort, floorNum } = this.props
    this.setState({
      deleteVisible: false
    })
    // console.log('删除楼层参数', this.props.floorType, this.props.floorSort)
    // console.log('this.props.floorNum - 1', this.props.floorNum - 1)
    httpRequest.delete({
      url: sellerApi.shop.floor,
      data: {
        floor_type: floorType,
        floor_sort: floorSort
      }
    }).then(res => {
      message.success('删除成功')
      this.props.deleteFloor(this.props.floorNum - 1)
    })
  }
}

const mapDispatch = (dispatch) => {
  return {
    deleteFloor(index) {
      dispatch(actionCreator.deleteFloor(index))
    },
    setNoContent(floorType, content) {
      dispatch(actionCreator.setNoContent(floorType, content))
    },
    setEditFloorSort(sort) {
      dispatch(actionCreator.setEditFloorSort(sort))
    },
    chooseFloorType(floorType) {
			dispatch(actionCreator.chooseFloorType(floorType))
		}
  }
}

export default connect(null, mapDispatch)(Header)