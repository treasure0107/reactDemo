import React, { Component } from 'react';
import { connect } from 'react-redux'
import Header from './common/Header'
import floorConfig from '../common/floorConfig'
import { handleDataList } from '../common/common'
import { actionCreator } from '../store'

class AdvFloorSix extends Component {
	constructor() {
		super()
		this.sortChange = this.sortChange.bind(this)
		this.confirmEdit = this.confirmEdit.bind(this)
	}
	render() {
		const { floorNum, floorSort, floorData } = this.props
		return (
			<div className="advFloorSix floorWrapper">
				<Header
					floorNum={floorNum}
					floorSort={floorSort}
					isFloor={true}
					desc={floorConfig.advFloorSix.headerTitle}
					floorType={floorConfig.advFloorSix.type}
					confirmEdit={this.confirmEdit}
					sortChange={this.sortChange}
				>
					<div className="slideshow7">
						{
							floorData.map((floor, index) => (
								<div className={index == 2 || index == 5 ? "floor7 noMargin" : "floor7"} key={index}>
									<a href={`//goods/${floor.floor_content}`}>
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
		const floorType = floorConfig.advFloorSix.type
		asyncSetFloorList({
			floorType,
			dataList,
			newSort: editFloorSort
		})
	}
	sortChange(oldSort, newSort) {
		const { asyncSetFloorList } = this.props
		const floorType = floorConfig.advFloorSix.type
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

export default connect(mapState, mapDispatch)(AdvFloorSix)
