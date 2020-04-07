import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message } from 'antd'
import Header from './common/Header'
import floorConfig from '../common/floorConfig'
import httpRequest from 'utils/ajax'
import { sellerApi } from 'utils/api'
import { actionCreator } from '../store'

class TopAdv extends Component {
	constructor() {
		super()
		this.confirmEdit = this.confirmEdit.bind(this)
	}
	render() {
		const { topAdv } = this.props
		return (
			<div className="topAdv floorWrapper">
				<Header
					isFloor={false}
					title={'头部广告'}
					desc={floorConfig.topAdv.headerTitle}
					floorType={floorConfig.topAdv.type}
					confirmEdit={this.confirmEdit}
				>
					<div className="headadvertising">
						{
							topAdv.img && topAdv.url
							?
							<a href={topAdv.url} target="blank">
								<img src={topAdv.img} alt="图片"/>
							</a>
							:
							<p>1920px*110px</p>
						}
					</div>
				</Header>
				
			</div>
		)
	}
	confirmEdit() {
		const { isModify, decorationId, imgList } = this.props
 		const params =  {
			url: isModify ? sellerApi.shop.mobileBgTopAdv + decorationId + '/' : sellerApi.shop.mobileBgTopAdv,
			data: {
				head_ad_url: imgList[0].url,
				head_ad_img: imgList[0].head_ad_img,
			}
		}
		// console.log('isModify', isModify)
		// console.log('decorationId', decorationId)
		if (isModify) {
			httpRequest.post(params).then((res) => this.requestSucc(res))
		} else {
			httpRequest.put(params).then((res) => this.requestSucc(res))
		}
	}
	requestSucc(res) {
		const data = res.data
		this.props.setTopNav(data.head_ad_img, data.head_ad_url)
		message.success('头部广告设置成功')
	}
}

const mapState = state => {
  return {
		imgList: state.shopDecoration.imgList,
		topAdv: state.shopDecoration.topAdv,
		isModify: state.shopDecoration.isModify,
		decorationId: state.shopDecoration.decorationId
  }
}

const mapDispatch = dispatch => {
	return {
		setTopNav(img, url) {
			dispatch(actionCreator.setTopNav(img, url))
		}
	}
}

export default connect(mapState, mapDispatch)(TopAdv)