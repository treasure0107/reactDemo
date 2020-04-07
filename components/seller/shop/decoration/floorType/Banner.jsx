import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message } from 'antd'
import Header from './common/Header'
import { handleDataList } from '../common/common'
import floorConfig from '../common/floorConfig'
import httpRequest from 'utils/ajax'
import { sellerApi } from 'utils/api'
import { actionCreator } from '../store'

// 轮播图
class Banner extends React.Component {
	constructor() {
		super()
		this.confirmEdit = this.confirmEdit.bind(this)
	}
	render() {
		const { banner } = this.props
		return (
			<div className="banner floorWrapper">
				<Header
					isFloor={false}
					title={'轮播图'}
					desc={floorConfig.banner.headerTitle}
					floorType={floorConfig.banner.type}
					confirmEdit={this.confirmEdit}
				>
					<div className="slideshow">
						{
							banner.img && banner.url 
							?
							<a className="bannerLink" href={banner.url} target="blank">
								<img className="bannerImg" src={banner.img} alt="图片"/>
							</a>
							:
							<p>1920px*550px</p>
						}
					</div>
				</Header>
			</div>
		)
	}
	confirmEdit() {
		console.log('imgList', this.props.imgList)
		const aDataList = handleDataList(this.props.imgList, 'banner_img', 'banner_url', 'banner_sort')
		const params = {
			url: sellerApi.shop.banner,
			data: {
				data_list: aDataList
			}
		}
		console.log('isModify', this.props.isModify)
		if (this.props.isModify) {
			httpRequest.post(params).then((res) => this.requestSucc(res))
		} else {
			httpRequest.put(params).then((res) => this.requestSucc(res))
		}
	}
	requestSucc(res) {
		const data = res.data
		this.props.setBanner(data[0].banner_img, data[0].banner_url)
		message.success('轮播图片设置成功')
	}
}

const mapState = state => {
  return {
		imgList: state.shopDecoration.imgList,
		banner: state.shopDecoration.banner,
		isModify: state.shopDecoration.isModify
  }
}

const mapDispatch = dispatch => {
	return {
		setBanner(img, url) {
			dispatch(actionCreator.setBanner(img, url))
		}
	}
}

export default connect(mapState, mapDispatch)(Banner)