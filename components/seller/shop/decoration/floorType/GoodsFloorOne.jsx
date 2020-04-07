import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './common/Header'
import floorConfig from '../common/floorConfig'
import { handleDataList } from '../common/common'
import { actionCreator } from '../store'

class GoodsFloorOne extends Component {
  constructor() {
		super()
		this.sortChange = this.sortChange.bind(this)
		this.confirmEdit = this.confirmEdit.bind(this)
	}
  render() {
    const { floorNum, floorSort, floorData } = this.props
    return (
      <div className="goodsFloorOne floorWrapper">
        <Header
          floorNum={floorNum}
          floorSort={floorSort}
					isFloor={true}
					desc={floorConfig.goodsFloorOne.headerTitle}
          floorType={floorConfig.goodsFloorOne.type}
          confirmEdit={this.confirmEdit}
					sortChange={this.sortChange}
				>
					<div className="slideshow3 clearfix">
            {
              floorData.map((floor, index) => (
                <div className="floor3" key={index}>
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
          </div>
				</Header>
      </div>
    )
  }
  confirmEdit() {
		const { editFloorSort, asyncSetFloorList, imgList } = this.props
    const dataList = handleDataList(imgList, 'pic_url', 'floor_content', 'img_url_sort', 'goods_price', 'goods_name')
    console.log('imgList1212', imgList)
		const floorType = floorConfig.goodsFloorOne.type
		asyncSetFloorList({
			floorType,
			dataList,
			newSort: editFloorSort
		})
	}
	sortChange(oldSort, newSort) {
		const { asyncSetFloorList } = this.props
		const floorType = floorConfig.goodsFloorOne.type
		if (newSort) {
			// console.log('goodsOneAsync')
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

export default connect(mapState, mapDispatch)(GoodsFloorOne)
