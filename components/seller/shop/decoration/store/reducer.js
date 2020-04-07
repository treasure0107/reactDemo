import * as type from './actionType'
import floorConfig from '../common/floorConfig'
import { getFloorContent } from '../common/common'

const initialState={
  floorType: floorConfig.advFloorOne.type,  // 默认第一个楼层类型
  editFloorSort: null,
  floorList: [],
  imgList: [],
  checkedCheckbox: [],
  decorationId: null,  // 头部广告和手机背景
  noContent: '',
  checkedNum: 0,
  phoneBackground: '',
  topAdv: {
    img: '',
    url: ''
  },
  banner: {
    img: '',
    url: ''
  },
  isModify: false,  // 是新增数据还是修改数据  - 轮播和头部广告使用 决定使用post还是put请求
}

const reducer = (state = initialState, action) => {
  const newState = JSON.parse(JSON.stringify(state))
  switch (action.type) {
    case type.SET_FLOOR_LIST:    // 添加楼层
      // newState.floorType = action.floorData.floor_type
      // console.log('reducerFloorData', action.floorData)
      // 新增楼层和整个更新楼层数据
      if (action.isAdd) {
        action.floorData.forEach(floor => {
          newState.floorList.push(floor)
        })
      } else {
        newState.floorList = action.floorData
      }
      return newState

    case type.SET_EDIT_FLOOR_SORT:    // 获取头部点击编辑更新楼层时的排序  
      newState.editFloorSort = action.sort
      return newState

    case type.DELETE_FLOOR:          // 删除楼层
      newState.floorList.splice(action.index, 1)
      return newState

    case type.CHOOSE_FLOOR_TYPE:     // 楼层类型
      newState.floorType = action.floorType
      return newState

    case type.SET_IMG_LIST:          // 图片列表
      newState.imgList = action.imgList
      // console.log('imgListreducer', action.imgList)
      newState.checkedNum = action.imgList.length     // 本地回显选中的checkbox的个数
      if (action.imgList.length > 0) {
        newState.checkedCheckbox = []                 // 选中的checkbox置空
        action.imgList.forEach((item, index) => {     // 本地回显选中的checkbox
          newState.checkedCheckbox.push({
            id: item.spu_id || item.pic_url || item.banner_img || item.head_ad_img,
            index
          })
          // post修改头部广告使用
          if (item.decoration_id) {
            newState.decorationId = item.decoration_id
          }
        })
      } else {
        newState.checkedCheckbox = []
      }
      return newState

    case type.DELETE_IMG:           // 删除一条图片
      newState.imgList.splice(action.index, 1)
      newState.checkedCheckbox.splice(action.index, 1)
      return newState

    case type.SET_NO_CONTENT:      // 缺省文字描述
      newState.noContent = getFloorContent(action.floorType, action.content)
      return newState

    case type.SET_CHECKED_NUM:      // 累加减计数
      if (action.isIncrease) {
        newState.checkedNum = newState.checkedNum + 1
      } else {
        if (newState.checkedNum > 0) {
          newState.checkedNum = newState.checkedNum - 1
        }
      }
      return newState

    case type.SET_PHONE_BACKGROUND: // 手机背景图设值
      newState.phoneBackground = action.phoneBackground
      return newState

    case type.SET_TOP_ADV:          // 头部广告设值
      newState.topAdv.img = action.img
      newState.topAdv.url = action.url
      return newState

    case type.SET_BANNER:           // 轮播图设值
      newState.banner.img = action.img
      newState.banner.url = action.url
      return newState

    case type.CHECK_IS_MODIFY:      // 判断是否修改或者新建头部广告和轮播图, 从而区分使用post还是put请求 
      if (action.imgList.length > 0) {
        newState.isModify = true
      } else {
        newState.isModify = false
      }
      return newState
    default:
      return newState
  }
}
export default reducer