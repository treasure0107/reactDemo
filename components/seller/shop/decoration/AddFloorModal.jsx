import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Radio, Modal, message } from 'antd'
import { actionCreator } from './store'
import { getFloorContent, handleDataList } from './common/common'
import EditModal from './editModal/index.js'
import floorConfig from './common/floorConfig'
import './style/shopDecoration.scss'
import httpRequest from 'utils/ajax'
import { sellerApi } from 'utils/api'

class AddFloor extends Component {
	constructor(props) {
		super(props)
		this.handleEditCancel = this.handleEditCancel.bind(this)
		this.handleEditOk = this.handleEditOk.bind(this)
		this.handleSelectFloor = this.handleSelectFloor.bind(this)
		this.handleCancel = this.handleCancel.bind(this)
		this.handleSelectRadio = this.handleSelectRadio.bind(this)   // 单选框
		this.state = {
			editVisible: false,
			// type: 'advFloorOne'  // 单选框
		}
	}

	render() {
		const { visible, floorType } = this.props
		const { editVisible } = this.state
		return (
			<div>
				<Modal
					width={800}
					height={583}
					centered
					title="选择楼层样式"
					okText="确认"
					cancelText="取消"
					visible={visible}
					onOk={this.handleSelectFloor}
					onCancel={this.handleCancel}
					wrapClassName={'addFloor'}
				>
					<div className="floorstyle">
						<Radio.Group onChange={this.handleSelectRadio} value={floorType}>
							<Radio value={floorConfig.advFloorOne.type}>
								<div className="floorbox">
									<div className="floorbox_1">
										<div className="floor_bg"></div>
									</div>
								</div>
							</Radio>
							<Radio value={floorConfig.advFloorTwo.type}>
								<div className="floorbox">
									<div className="floorbox_1">
										<div className="floor_bg2"></div>
										<div className="floor_bg2"></div>
										<div className="floor_bg2"></div>
									</div>
								</div>
							</Radio>
							<Radio className="edge" value={floorConfig.goodsFloorOne.type}>
								<div className="floorbox">
									<div className="floorbox_1">
										<div className="floor_bg3"></div>
										<div className="floor_bg3"></div>
										<div className="floor_bg3"></div>
										<div className="floor_bg3"></div>
									</div>
									<div className="floorDesc">商品楼层</div>
								</div>
							</Radio>
							<Radio value={floorConfig.advFloorThree.type}>
								<div className="floorbox">
									<div className="floorbox_1">
										<div className="floor_bg4_lf"></div>
										<div className="floor_bg4_rt"></div>
									</div>
								</div>
							</Radio>
							<Radio value={floorConfig.advFloorFour.type}>
								<div className="floorbox">
									<div className="floorbox_1">
										<div className="floor_bg5_lf"></div>
										<div className="floor_bg5_rt"></div>
									</div>
								</div>
							</Radio>
							<Radio className="edge" value={floorConfig.advFloorFive.type}>
								<div className="floorbox">
									<div className="floorbox_1">
										<div className="floor_bg6"></div>
										<div className="floor_bg6"></div>
									</div>
								</div>
							</Radio>
							<Radio value={floorConfig.advFloorSix.type}>
								<div className="floorbox">
									<div className="floorbox_1">
										<div className="floor_bg7"></div>
										<div className="floor_bg7"></div>
										<div className="floor_bg7"></div>
										<div className="floor_bg7"></div>
										<div className="floor_bg7"></div>
										<div className="floor_bg7"></div>
									</div>
								</div>
							</Radio>
							<Radio value={floorConfig.advFloorSeven.type}>
								<div className="floorbox">
									<div className="floorbox_1">
										<div className="floor_bg8"></div>
										<div className="floor_bg8"></div>
										<div className="floor_bg8"></div>
										<div className="floor_bg8"></div>
									</div>
								</div>
							</Radio>
							<Radio className="edge" value={floorConfig.goodsFloorTwo.type}>
								<div className="floorbox">
									<div className="floorbox_1">
										<div className="floor_bg9"></div>
										<div className="floor_bg9"></div>
										<div className="floor_bg9"></div>
										<div className="floor_bg9"></div>
										<div className="floor_bg9"></div>
										<div className="floor_bg9"></div>
										<div className="floor_bg9"></div>
										<div className="floor_bg9"></div>
									</div>
									<div className="floorDesc">商品楼层</div>
								</div>
							</Radio>
						</Radio.Group>
					</div>
				</Modal>
				{/* 编辑弹窗 */}
				{
					editVisible ? <EditModal
													title={'头部广告( 限1张，图片要求 JPG、PNG、GIF 格式，宽为 1200px，高 100px ~150px )'}
													handleCancel={this.handleEditCancel}
													handleOk={this.handleEditOk}
													visible={editVisible}
													source={'addFloorModal'}
													// floor={radio}
													// TODO
													// floorType={type}
													title={getFloorContent(floorType, 'headerTitle')}
												/>
											: null
				}
			</div>
		)
	}
	// 单选框事件
	handleSelectRadio(e) {
		const type = e.target.value
		this.props.chooseFloorType(type)
	}
	// 打开编辑弹窗
	handleSelectFloor() {
		this.props.handleCancel()
		this.setState({
			editVisible: true
		})
		this.props.setNoContent(this.props.floorType, 'emptyText')
	}
	// 关闭楼层弹窗
	handleCancel() {
		this.props.handleCancel()
	}
	// 关闭编辑弹窗
	handleEditCancel() {
		this.setState({
			editVisible: false
		})
	}
	// 编辑弹窗确定
	handleEditOk() {
		// console.log('楼层添加弹窗', this.props.imgList)
		const { floorType } = this.props
		const aDataList = handleDataList(this.props.imgList, 'pic_url', 'floor_content', 'img_url_sort')
		console.log('addFloorModalFloorList', aDataList)
		setTimeout(() => {
			this.getLastSort((sort) => {
				this.requestSetFloorList(sort, floorType, aDataList)
			})
		}, 50)
	}
	// 获取现有楼层列表，获取最后floor_sort, 保证新增的楼层floor_sort唯一
	getLastSort(next) {
		httpRequest.get({
			url: sellerApi.shop.floor
		}).then(res => {
			const floorLen = res.data.length
			// 保证楼层排序唯一，先获取楼层信息，取到最后一个楼层的排序然后 +1，获得添加的下一个的排序，如果第一次添加楼层，楼层排序默认 1
			const lastSort = floorLen > 0 ? parseInt(res.data[floorLen - 1].floor_sort) + 1 : 1
			if (next && typeof next == 'function') {
				next(lastSort)
			}
		})
	}
	requestSetFloorList(sort, floorType, aDataList) {
		httpRequest.put({
			url: sellerApi.shop.floor,
			data: {
				floor_type: floorType,
				floor_sort: sort,
				data_list: aDataList
			}
		}).then(res => {
			if (res.data) {
				const data = res.data
				this.setState({
					editVisible: false
				})
				const floorData = [{
					floor_type: floorType,
					floor_sort: sort,
					id: floorType + sort,   // 循环使用的唯一key
					cur_floor_data: data
				}]
				// 更新redux楼层列表
				this.props.setFloorList(floorData, true)
				message.success('楼层添加成功')
			}
		})
	}
}

const mapState = (state) => {
	return {
		floorType: state.shopDecoration.floorType,
		imgList: state.shopDecoration.imgList,
		floorList: state.shopDecoration.floorList
	}
}

const mapDispatch = (dispatch) => {
  return {
    setFloorList(floorData, isAdd) {
      dispatch(actionCreator.setFloorList(floorData, isAdd))
		},
		chooseFloorType(floorType) {
			dispatch(actionCreator.chooseFloorType(floorType))
		},
		setNoContent(floorType, content) {
      dispatch(actionCreator.setNoContent(floorType, content))
    }
  }
}

export default connect(mapState, mapDispatch)(AddFloor)