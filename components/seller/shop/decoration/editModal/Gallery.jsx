import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message, Checkbox, Pagination } from 'antd'
import { sellerApi } from 'utils/api'
import httpRequest from 'utils/ajax'
import { getFloorContent } from '../common/common'
import { actionCreator } from '../store'

class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      size: 12,
      total: 0,
      galleryData: [],
      checkNum: getFloorContent(props.floorType, 'checkNum').match(/\d+/g)[1] || getFloorContent(props.floorType, 'checkNum').match(/\d+/g)[0], // 需要选择图片或者商品 的 个数
      isUpload: false
    }
  }
  componentDidMount() {
    if (!this.props.isGoodsFloor) {
      this.props.onRef(this)
    }
    this.getGalleryData()
  }
  getGalleryData(isUpload) {
    const { page, size } = this.state
    const { folderId, isGoodsFloor } = this.props
    // 头部点击进入编辑，获取数据
    // if (source == 'header') {
    //   // 轮播和顶部广告不用传sort
    //   if (editFloorSort) {
    //     params.floor_sort = editFloorSort
    //   }
    //   params.floor_type = floorType
    // }
    const params = {
      page,
      size
    }
    let url = ''
    if (isGoodsFloor) {
      url = sellerApi.shop.goodsList
    } else {
      url = sellerApi.shop.goodsPicture
      params.folder_id = folderId
    }
    httpRequest.get({
      url,
      data: params
    }).then(res => {
      this.setState({
        galleryData: res.data,
        total: res.total
      })
      if (isUpload) {
        message.success('上传成功')
      }
    })
  }
  render() {
    const { galleryData, total, size } = this.state
    const { isGoodsFloor, checkedCheckbox } = this.props
    this.setCheckedImg(galleryData, checkedCheckbox, isGoodsFloor)
    return (
      <div className={isGoodsFloor ? "body clearfix goodsList" : "body clearfix"}>
        {
          galleryData.length > 0 ? (
            galleryData.map(item => {
              return (
                !isGoodsFloor ? (
                  <div className="imgItem fl" key={item.goods_picture__id}>
                    <Checkbox
                      className="imgCheckbox"
                      checked={item.is_select ? true : false}
                      value={item.pic_url || item.banner_img || item.head_ad_img} // 广告楼层图库用pic_url作为唯一值关联，轮播为banner_img, 顶部广告为head_ad_img
                      onChange={(el) => this.checkImg(el)}
                    >
                      <img src={item.pic_url} alt="图片" />
                    </Checkbox>
                    {
                      item.width && item.height ? <p className="imgDesc">{item.width + '*' + item.height}</p> : null
                    }
                  </div>
                ) : (
                  <div className="imgItem fl" key={item.spu_id}>
                    <Checkbox
                      className="imgCheckbox"
                      checked={item.is_select ? true : false}
                      value={item.spu_id} // 商品图库用spu_id作为唯一值关联
                      onChange={(el) => this.checkImg(el)}
                    >
                      <img src={item.goods_thumb_image} alt="商品" />
                      <p className="descStyle center textover" title={item.goods_name}>{item.goods_name}</p>
                      <p className="descStyle center">￥{item.goods_price}</p>
                    </Checkbox>
                  </div>
                )
              )
            })
          ) : (
            <div className="galleryEmpty">图库暂无图片，请上传图片</div>
          )
        }
        <Pagination total={total} pageSize={size} onChange={this.handlePageChange} />
      </div>
    )
  }

  setCheckedImg(galleryData, checkedCheckbox, isGoodsFloor) {
    let id = null
    galleryData.forEach(gallery => {
      if (checkedCheckbox.length > 0) {
        for (let i = 0; i < checkedCheckbox.length; i++) {
          if (isGoodsFloor) {
            id = gallery.spu_id
          } else {
            id = gallery.pic_url
          }
          if (id == checkedCheckbox[i].id) {
            gallery.is_select = 1
            gallery.index = checkedCheckbox[i].index
            break
          } else {
            gallery.is_select = 0
            gallery.index = checkedCheckbox[i].index
          }
        }
      } else {
        gallery.is_select = 0
      }
    })
  }

  handlePageChange = (page) => {
    this.setState({
      page
    }, () => {
      this.getGalleryData()
    })
  }

  uploadImg = (imgArr) => {
    httpRequest.post({
      url: sellerApi.goods.goodsPicture,
      data: {
        pic_set: imgArr,
        folder_id: this.props.folderId
      }
    }).then(res => {
      this.getGalleryData(true)
    })
  }

  // 选择图片/商品
  checkImg(e) {
    const checkValue = e.target.value  // 广告图片id, 商品图片spu_id
    const { checkNum, galleryData } = this.state
    const { checkedNum, setCheckedNum, setImgList, isGoodsFloor, imgList, isBanner, isTopAdv } = this.props
    const newImgList = JSON.parse(JSON.stringify(imgList))
    const intCheckNum = parseInt(checkNum)

    // 组装图片列表数据,获取checked的图片或者商品的数据
    let imgObj = {}
    for (let i = 0; i < galleryData.length; i++) {
      if (isGoodsFloor) {
        if (galleryData[i].spu_id == checkValue) {
          imgObj.spu_id = galleryData[i].spu_id
          imgObj.goods_id = galleryData[i].goods_id
          imgObj.goods_thumb_image = galleryData[i].goods_thumb_image
          imgObj.goods_name = galleryData[i].goods_name
          imgObj.goods_price = galleryData[i].goods_price
          break
        }
      } else {
        if (galleryData[i].pic_url == checkValue) {
          const imgUrl = galleryData[i].pic_url || galleryData[i].banner_img || galleryData[i].head_ad_img
          // imgObj.id = imgUrl
          if (isTopAdv) {
            imgObj.head_ad_img = imgUrl
          } else if (isBanner) {
            imgObj.banner_img = imgUrl
          } else {
            imgObj.pic_url = imgUrl
          }
          break
        }
      }
    }
    // 根据是否checkbox选中，增删图片/商品列表
    if (e.target.checked) {
      if (checkedNum >= intCheckNum) {
        message.warn(`最多只能选择${intCheckNum}个`)
      } else {
        newImgList.push(imgObj)
        setCheckedNum(true)
        setImgList(newImgList)
      }
    } else {
      for (let i = 0; i < newImgList.length; i++) {
        if (newImgList[i].pic_url == checkValue || newImgList[i].banner_img == checkValue || newImgList[i].head_ad_img == checkValue || newImgList[i].spu_id == checkValue) {
          newImgList.splice(i, 1)
        }
      }
      setCheckedNum(false)
      setImgList(newImgList)
    }
  }
}

const mapState = (state) => {
  return {
    floorType: state.shopDecoration.floorType,
    imgList: state.shopDecoration.imgList,
    checkedNum: state.shopDecoration.checkedNum,
    checkedCheckbox: state.shopDecoration.checkedCheckbox,
    editFloorSort: state.shopDecoration.editFloorSort
  }
}

const mapDispatch = (dispatch) => {
  return {
    setImgList(newImgList) {
      dispatch(actionCreator.setImgList(newImgList))
    },
    setCheckedNum(isIncrease) {
      dispatch(actionCreator.setCheckedNum(isIncrease))
    }
  }
}

export default connect(mapState, mapDispatch)(Gallery)