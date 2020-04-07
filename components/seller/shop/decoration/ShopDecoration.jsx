import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, message } from 'antd'
import AddFloorModal from './AddFloorModal'
import Title from '../../common/Title'
import floorConfig from './common/floorConfig';
import httpRequest from 'utils/ajax'
import { sellerApi } from 'utils/api'
import ConfirmModal from 'components/common/ConfirmModal'
import {
  PhoneBackground,
  TopAdv,
  Banner,
  AdvFloorOne,
  AdvFloorTwo,
  AdvFloorThree,
  AdvFloorFour,
  AdvFloorFive,
  AdvFloorSix,
  AdvFloorSeven,
  GoodsFloorOne,
  GoodsFloorTwo
} from './floorType'
import { actionCreator } from './store';

class ShopDecoration extends Component {
  constructor(props) {
    super(props)
    this.addFloor = this.addFloor.bind(this)
    this.closeModal = this.closeModal.bind(this)
    // this.publishDecoration = this.publishDecoration.bind(this)
    this.readyToPublish = this.readyToPublish.bind(this)
    this.closeConfirmModal = this.closeConfirmModal.bind(this)
    this.confirmToPublish = this.confirmToPublish.bind(this)
    this.decorationPreview = this.decorationPreview.bind(this)
    this.state = {
      visible: false,
      decorationId: null,  // 装修id
      shopDecoration: 1,    // 发布状态，0装修未发布，1装修已发布, 控制发布按钮显示隐藏
      confirmVisible: false
    }
  }

  componentDidMount() {
    this.requestPublishStatus()
    this.requestPhoneBgTopAdv()
    this.requestBanner()
    this.requestFloorList()
  }

  // 获取装修发布状态
  requestPublishStatus(isPublish) {
    const params = {
      url: sellerApi.shop.publishStatus,
      data: {}
    }
    if (isPublish) {
      params.url = sellerApi.shop.publishStatus + this.state.decorationId + '/'
      params.data.shop_decoration = 1
    }

    if (isPublish) {
      httpRequest.post(params).then((res) => {this.getPublishStatusSucc(res, isPublish)})
    } else {
      httpRequest.get(params).then((res) => {this.getPublishStatusSucc(res, isPublish)})
    }
  }

  getPublishStatusSucc(res, isPublish) {
    if (isPublish) {
      message.success('发布成功')
      this.setState({
        shopDecoration: res.data.id
      })
    } else {
      this.setState({
        decorationId: res.data.id,
        shopDecoration: res.data.shop_decoration
      })
    }
  }

  // 手机背景和头部广告
  requestPhoneBgTopAdv() {
    httpRequest.get({
      url: sellerApi.shop.mobileBgTopAdv
    }).then(res => {
      const data = res.data
      this.props.setPhoneBackground(data.bg_img_app)
      this.props.setTopNav(data.head_ad_img, data.head_ad_url)
    })
  }

  // 轮播
  requestBanner() {
    httpRequest.get({
      url: sellerApi.shop.banner
    }).then(res => {
      if (res.data && res.data.length > 0) {
        const data = res.data[0]  // 轮播默认显示第一张即可
        this.props.setBanner(data.banner_img, data.banner_url)
      } else {
        this.props.setBanner()
      }
    })
  }

  // 楼层
  requestFloorList() {
    httpRequest.get({
      url: sellerApi.shop.floor
    }).then(res => {
      this.props.setFloorList(res.data)
    })
  }

  render() {
    const { visible, shopDecoration, confirmVisible } = this.state
    const { phoneBackground } = this.props
    return (
      <div>
        <Title title={'店铺装修'} />
        <div className="shopdecorationbox" style={{ background: "#fff" }}>
          {
            !shopDecoration ? <Button className="publish btn" onClick={this.readyToPublish}>装修发布</Button> : null
          }
          <Button className="preview btn" onClick={this.decorationPreview}>装修预览</Button>
          <PhoneBackground phoneBg={phoneBackground}/>
          <TopAdv></TopAdv>
          <Banner></Banner>
          { this.getFloorList() }
          <div className="addfloor"><Button onClick={this.addFloor} type="primary">添加楼层</Button></div>
          <AddFloorModal visible={visible} handleCancel={this.closeModal} />
        </div>
        {
          confirmVisible ? <ConfirmModal visible={confirmVisible} content={'确认装修发布吗？'} handleCancel={this.closeConfirmModal} handleOk={this.confirmToPublish} /> : null
        }
      </div>
    )
  }
  addFloor() {
    this.setState({
      visible: true
    })
  }
  closeModal() {
    this.setState({
      visible: false
    })
  }
  getFloorList() {
    // console.log('楼层组件添加', this.props.floorList)
    const floorComponent = {
      advFloorOne: AdvFloorOne,
      advFloorTwo: AdvFloorTwo,
      advFloorThree: AdvFloorThree,
      advFloorFour: AdvFloorFour,
      advFloorFive: AdvFloorFive,
      advFloorSix: AdvFloorSix,
      advFloorSeven: AdvFloorSeven,
      goodsFloorOne: GoodsFloorOne,
      goodsFloorTwo: GoodsFloorTwo
    }
    // 遍历所有楼层类型, 取得对应的楼层组件
    const floors = this.props.floorList.map((list, index) => {
      const floorTypes = Object.keys(floorConfig)
      for (let i = 0; i < floorTypes.length; i++) {
        const floorType = floorTypes[i]
        if (list.floor_type == floorConfig[floorType].type) {
          const Floor = floorComponent[floorType]
          if (Floor) {
            return <Floor key={list.id} floorNum={index + 1} floorSort={list.floor_sort} floorData={list.cur_floor_data} />
          }
        }
      }
    })
    return floors
  }
  // 确认发布弹窗
  readyToPublish() {
    this.setState({
      confirmVisible: true
    })
  }
  closeConfirmModal() {
    this.setState({
      confirmVisible: false
    })
  }
  // 确定发布
  confirmToPublish() {
    this.requestPublishStatus(true)
    this.setState({
      confirmVisible: false
    })
  }
  // 装修预览
  decorationPreview() {
    window.open(`//shop/${localStorage.getItem('seller_shop_id')}?pr=1`)
    // this.props.history.push(`//shop/${localStorage.getItem('seller_shop_id')}?pr=1`)
  }
}

const mapState = state => {
  return {
    floorList: state.shopDecoration.floorList,
    imgList: state.shopDecoration.imgList,
    phoneBackground: state.shopDecoration.phoneBackground,
    floorType: state.shopDecoration.floorType,
    // publishId: state.shopDecoration.publishId
  }
}

const mapDispatch = dispatch => {
  return {
    setPhoneBackground(imgUrl) {
      dispatch(actionCreator.setPhoneBackground(imgUrl))
    },
    setTopNav(img, url) {
      dispatch(actionCreator.setTopNav(img, url))
    },
    setBanner(img, url) {
      dispatch(actionCreator.setBanner(img, url))
    },
    setFloorList(floorData) {
      dispatch(actionCreator.setFloorList(floorData))
    }
  }
}

export default connect(mapState, mapDispatch)(withRouter(ShopDecoration))
