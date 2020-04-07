import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Input, Tooltip, Form } from 'antd'
import '../style/shopDecoration.scss'
import { actionCreator } from '../store';
import floorConfig from '../common/floorConfig'
import httpRequest from 'utils/ajax'
import { sellerApi } from 'utils/api'
import comUtils from 'utils/common'


class ImgList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isGoodsFloor: props.floorType == floorConfig.goodsFloorOne.type || props.floorType == floorConfig.goodsFloorTwo.type  // 是否是商品楼层
    }
  }
  componentDidMount(){
    // console.log('imgList参数', 'floorType:', this.props.floorType, 'floorSort:', this.props.editFloorSort)
    this.props.onRef(this)
    // 避免数据未请求回来的闪屏问题
    this.props.setImgList([])
    // Header组件点击编辑，才获取接口数据
    if (this.props.source == 'header') {
      this.requestImgList()
    }
  }
  requestImgList() {
    const { floorType, editFloorSort } = this.props
    const params = {}
    let url = null
    if (floorType == 1) {  // 1 为头部广告
      url = sellerApi.shop.mobileBgTopAdv
    } else if (floorType == 2) {  // 2 为轮播
      url = sellerApi.shop.banner
    } else {  // 楼层
      url = sellerApi.shop.floor
      params.floor_type = floorType
      if (editFloorSort) {
        params.floor_sort = editFloorSort
      }
    }
    httpRequest.get({
      url,
      data: params
    }).then(res => {
      const data = res.data
      if (floorType == 1) { // 顶部广告
        if (data.head_ad_img && data.head_ad_url) {
          this.props.setImgList([data]) 
        } else {
          this.props.setImgList([])           
        }
        this.props.checkIsModify(data)
      } else if (floorType == 2) {  // 轮播
        this.props.setImgList(data)
        this.props.checkIsModify(data)
      } else {  //楼层
        this.props.setImgList(data[0].cur_floor_data)
      }
    })
  }
  render() {
    const { noContent, imgList, floorType, form: {getFieldDecorator} } = this.props
    const { isGoodsFloor } = this.state
    // const { getFieldDecorator } = this.props.form
    // console.log('floorType', floorType)
    return (
      <Fragment>
        <div className="header">
          <span className="picture fl">图片</span>
          <span className="url fl">
            {
              isGoodsFloor
              ? 
              <Fragment>
                <span className="fl">商品名称与价格</span>
              </Fragment>
              :
              <Fragment>
                <span className="fl">链接地址(URL)</span>
                <Tooltip placement="bottom" title={'请去商品详情页获取链接'}>
                  <i className="iconfont fl">&#xe613;</i>
                </Tooltip>
              </Fragment>
            }
          </span>
          {
            // 1是顶部广告
            !(floorType == 1) ? <span className="sort fl">排序</span> : null
          }
          <span className="delete fl">操作</span>
        </div>
        <Form>
          <div ref={el => this.imgBody = el} className={imgList.length > 0 ? "body" : 'body center'}>
            {
              imgList.length > 0 ? this.getImgList(imgList, floorType, getFieldDecorator, isGoodsFloor) : noContent
            }
          </div>
        </Form>
      </Fragment>
    )
  }

  // 动态编辑列表
  getImgList(imgList, floorType, getFieldDecorator, isGoodsFloor) {
    return imgList.map((list, index) => {
      const sortInput = this.state['sortInput' + index]
      const urlInput = this.state['urlInput' + index]
      return (
        // id 是 galleryList组件选择图库时候的唯一值，spu_id为galleryList选择商品时候的唯一值，floor_id为楼层回显时的唯一值，banner_id为轮播回显时的唯一值, decoration_id为顶部广告回显时的唯一值
        <div className="item" key={list.id || list.spu_id || list.floor_id || list.banner_id || list.decoration_id}>  
          <span className="picture fl">
            <img src={list.pic_url || list.goods_thumb_image || list.banner_img || list.head_ad_img} alt="图片"/>
          </span>
          <span className="url fl">
            {
              isGoodsFloor
              ?
              <Fragment>
                <span className="goodsName goodsStyle textover fl">{list.goods_name}</span>
                <span className="goodsPrice goodsStyle fl">￥{list.goods_price}</span>
              </Fragment>
              :
              <Form.Item>
                {getFieldDecorator('url_' + index, {
                  initialValue: list.floor_content || list.banner_url || list.head_ad_url,
                  rules: [{
                    required: true,
                    message: '此项为必填项',
                  }],
                })(<Input autoComplete="off" placeholder="请输入商品链接" />)}
              </Form.Item>
            }
          </span>
          {
            !(floorType == 1)
            ?
            <span className="sort fl">
              <Form.Item>
                  {getFieldDecorator('sort_' + index, {
                    initialValue: list.img_url_sort || list.banner_sort,
                    rules: [{
                      required: true,
                      message: '此项为必填项',
                    }, {
                      pattern: comUtils.onlyNumber,
                      message: '请输入有效数字'
                    }],
                  })(<Input autoComplete="off" placeholder="序号" onChange={this.inputSortChange} />)}
                </Form.Item>
            </span>
            :
            null
          }
          <span className="delete fl" onClick={() => this.deleteImgList(list.id, index)}>删除</span>
        </div>
      )
    })
  }

  // 图片列表删除
  deleteImgList(id, index) {
    const { deleteImg, setCheckedNum } = this.props
    deleteImg(index)
    setCheckedNum(false)
  }

  validateInput(next) {
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const newImgList = JSON.parse(JSON.stringify(this.props.imgList))
        const fieldsValueKeys = Object.keys(fieldsValue)
        // 获取sort和商品链接， sort是商品和广告楼层共有，商品链接是广告楼层独有
        fieldsValueKeys.forEach(item => {
          const i = item.split('_')[1]
          const key = item.split('_')[0]
          newImgList[i][key] = fieldsValue[item]  // 图片排序sort和商品链接url
        })
        if (next && typeof next == 'function') {
          this.props.setImgList(newImgList)
          setTimeout(() => {
            next()
          }, 50)
        }
      }
    })
  }
}

const mapState = (state) => {
  return {
    imgList: state.shopDecoration.imgList,
    noContent: state.shopDecoration.noContent,
    floorType: state.shopDecoration.floorType,
    editFloorSort: state.shopDecoration.editFloorSort,
    page: state.shopDecoration.page
  }
}

const mapDispatch = (dispatch) => {
  return {
    deleteImg(index) {
      dispatch(actionCreator.deleteImg(index))
    },
    setCheckedNum(isIncrease) {
      dispatch(actionCreator.setCheckedNum(isIncrease))
    },
    setImgList(newImgList) {
      dispatch(actionCreator.setImgList(newImgList))
    },
    checkIsModify(imgList) {
      dispatch(actionCreator.checkIsModify(imgList))
    }
  }
}
const WrappedImgList = Form.create({ name: 'imgList' })(ImgList)
export default connect(mapState, mapDispatch)(WrappedImgList)