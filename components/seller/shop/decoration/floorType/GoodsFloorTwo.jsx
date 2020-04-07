import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './common/Header'
import floorConfig from '../common/floorConfig'
import { handleDataList } from '../common/common'
import { actionCreator } from '../store'

class GoodsFloorTwo extends Component {
	constructor() {
		super()
		this.sortChange = this.sortChange.bind(this)
		this.confirmEdit = this.confirmEdit.bind(this)
	}
	render() {
		const { floorNum, floorSort, floorData } = this.props
		return (
			<div className="goodsFloorTwo floorWrapper">
				<Header
					floorNum={floorNum}
					floorSort={floorSort}
					isFloor={true}
					desc={floorConfig.goodsFloorTwo.headerTitle}
					floorType={floorConfig.goodsFloorTwo.type}
					confirmEdit={this.confirmEdit}
					sortChange={this.sortChange}
				>
					<div className="slideshow9">
						{
              floorData.map((floor, index) => (
                <div className={index == 3 || index == 7 ? "floor9 noMargin" : "floor9"} key={index}>
                  <div className="floorcontent">
                    <a href={`//shop/${floor.shop_id}/goods/${floor.floor_content}`}>
                      <img src={floor.pic_url} alt="商品图片"/>
                    </a>
                  </div>
                  <div className="floortitle">
                    <p className="textover" title={floor.goods_name}>{floor.goods_name}</p>
                    <p>￥{floor.goods_price}</p>
                  </div>
                </div>
              ))
						}
						{/* <div className="floor9">
							<div className="floorcontent">123213</div>
							<div className="floortitle">
								<p> 商品名称商品名称商品名称商品名称商品名称</p>
								<p>￥18.00</p>
							</div>
						</div> */}
					</div>
				</Header>
			</div>
		)
	}
	confirmEdit() {
		const { editFloorSort, asyncSetFloorList, imgList } = this.props
    const dataList = handleDataList(imgList, 'pic_url', 'floor_content', 'img_url_sort')
    console.log('imgList1212', imgList)
		const floorType = floorConfig.goodsFloorTwo.type
		asyncSetFloorList({
			floorType,
			dataList,
			newSort: editFloorSort
		})
	}
	sortChange(oldSort, newSort) {
		const { asyncSetFloorList } = this.props
		const floorType = floorConfig.goodsFloorTwo.type
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

export default connect(mapState, mapDispatch)(GoodsFloorTwo)
