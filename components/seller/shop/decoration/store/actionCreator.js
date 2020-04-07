import * as type from './actionType'

export const setFloorList = (floorData, isAdd) => ({
  type: type.SET_FLOOR_LIST,
  floorData,
  isAdd
})

export const setEditFloorSort = (sort) => ({
  type: type.SET_EDIT_FLOOR_SORT,
  sort
})

export const deleteFloor = (index) => ({
  type: type.DELETE_FLOOR,
  index
})

export const chooseFloorType = (floorType) => ({
  type: type.CHOOSE_FLOOR_TYPE,
  floorType
})

export const setImgList = (imgList) => ({
  type: type.SET_IMG_LIST,
  imgList
})

// 设置编辑弹窗缺省文字描述
export const setNoContent = (floorType, content) => ({
  type: type.SET_NO_CONTENT,
  floorType,
  content
})

export const deleteImg = (index) => ({
  type: type.DELETE_IMG,
  index
})

// 选中图片累加/减计数
export const setCheckedNum = (isIncrease, imgListLen) => ({
  type: type.SET_CHECKED_NUM,
  isIncrease,
  imgListLen
})

// 手机背景图
export const setPhoneBackground = (phoneBackground) => ({
  type: type.SET_PHONE_BACKGROUND,
  phoneBackground
})

// 设置头部广告
export const setTopNav = (img, url) => ({
  type: type.SET_TOP_ADV,
  img,
  url
})

// 设置轮播
export const setBanner = (img, url) => ({
  type: type.SET_BANNER,
  img,
  url
})

// 轮播和头部广告是修改还是新增
export const checkIsModify = (imgList) => ({
  type: type.CHECK_IS_MODIFY,
  imgList
})

// saga异步请求楼层
export const asyncSetFloorList = ({oldSort, newSort, floorType, dataList}) => ({
  type: type.ASYNC_SET_FLOOR_LIST,
  oldSort,
  newSort,
  floorType,
  dataList
})
