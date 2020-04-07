import React, { Component } from 'react';
import { connect } from 'react-redux'
import Header from './common/Header'
import floorConfig from '../common/floorConfig'
import { handleDataList } from '../common/common'
import { actionCreator } from '../store'

class AdvFloorSeven extends Component {
	constructor() {
		super()
		this.sortChange = this.sortChange.bind(this)
		this.confirmEdit = this.confirmEdit.bind(this)
	}
	render() {
		const { floorNum, floorSort, floorData } = this.props
		return (
			<div className="advFloorSeven floorWrapper">
				<Header
					floorNum={floorNum}
					floorSort={floorSort}
					isFloor={true}
					desc={floorConfig.advFloorSeven.headerTitle}
					floorType={floorConfig.advFloorSeven.type}
					confirmEdit={this.confirmEdit}
					sortChange={this.sortChange}
				>
					<div className="slideshow8">
						{
							floorData.map((floor, index) => (
								<div className={index == 2 || index == 3 ? "floor8 negMargin" : "floor8"} key={index}>
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
		const floorType = floorConfig.advFloorSeven.type
		asyncSetFloorList({
			floorType,
			dataList,
			newSort: editFloorSort
		})
	}
	sortChange(oldSort, newSort) {
		const { asyncSetFloorList } = this.props
		const floorType = floorConfig.advFloorSeven.type
		if (newSort) {
			asyncSetFloorList({
				oldSort, 
				newSort,
				floorType
			})
		}
	}
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

export default connect(mapState, mapDispatch)(AdvFloorSeven)