import React, { Component } from 'react';
import { connect } from 'react-redux'
import Header from './common/Header'
import floorConfig from '../common/floorConfig'
import { handleDataList } from '../common/common'
import { actionCreator } from '../store'

class AdvFloorFour extends Component {
	constructor() {
		super()
		this.sortChange = this.sortChange.bind(this)
		this.confirmEdit = this.confirmEdit.bind(this)
	}
	render() {
		const { floorNum, floorSort, floorData } = this.props
		return (
			<div className="advFloorFour floorWrapper">
				<Header
					floorNum={floorNum}
					floorSort={floorSort}
					isFloor={true}
					desc={floorConfig.advFloorFour.headerTitle}
					floorType={floorConfig.advFloorFour.type}
					confirmEdit={this.confirmEdit}
					sortChange={this.sortChange}
				>
					<div className="slideshow4">
						{
							floorData.map((floor, index) => (
								<div className={index == 0 ? "floor4 rt4 fl" : "floor4_rt fl"} key={index}>
									<a href={floor.floor_content}>
										<img src={floor.pic_url} alt="广告图片"/>
									</a>
								</div>
							))
						}
					</div>
				</Header>
			</div>
		)
	}
	confirmEdit() {
		const { editFloorSort, asyncSetFloorList } = this.props
		const dataList = handleDataList(this.props.imgList, 'pic_url', 'floor_content', 'img_url_sort')
		const floorType = floorConfig.advFloorFour.type
		asyncSetFloorList({
			floorType,
			dataList,
			newSort: editFloorSort
		})
	}
	sortChange(oldSort, newSort) {
		const { asyncSetFloorList } = this.props
		const floorType = floorConfig.advFloorFour.type
		if (newSort) {
			asyncSetFloorList({
				oldSort, 
				newSort,
				floorType
			})
		}
	}
	// updateFloorData(oldSort, newSort, aDataList) {
	// 	console.log('post请求更新楼层')
	// 	httpRequest.post({
	// 		url: sellerApi.shop.floor,
	// 		data: {
	// 			floor_type: floorConfig.advFloorFour.type,
	// 			floor_sort: newSort,
	// 			floor_old_sort: oldSort,
	// 			data_list: aDataList
	// 		}
	// 	}).then(res => {
	// 		httpRequest.get({
	// 			url: sellerApi.shop.floor
	// 		}).then(res => {
	// 			const data = res.data
	// 			if (data && data.length > 0) {
	// 				this.props.setFloorList(data, false)
	// 				message.success('楼层更新成功')
	// 			}
	// 		})
	// 	})
	// }
}

const mapState = state => {
	return {
		imgList: state.shopDecoration.imgList,
		editFloorSort: state.shopDecoration.editFloorSort
	}
}

const mapDispatch = dispatch => {
	return {
		asyncSetFloorList({newSort, oldSort, floorType, dataList}) {
			dispatch(actionCreator.asyncSetFloorList({newSort, oldSort, floorType, dataList}))
		}
	}
}

export default connect(mapState, mapDispatch)(AdvFloorFour)