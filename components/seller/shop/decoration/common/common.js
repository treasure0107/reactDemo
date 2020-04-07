import floorConfig from './floorConfig'

/**
 * 
 * @param {*} type 楼层类型
 * @param {*} key 需要获取的内容，floorConfig中对应内容
 */
export const getFloorContent = (type, key) => {
  const types = Object.keys(floorConfig)
  for (let i = 0; i < types.length; i++) {
    if (floorConfig[types[i]].type == type) {
      return floorConfig[types[i]][key]
    }
  }
}

/**
 * 
 * @param {*} imgList 图片列表
 * @param {*} picUrl 图片链接
 * @param {*} goodsUrl 商品链接
 * @param {*} sort 排序
 */
export const handleDataList = (imgList, picUrl, goodsUrl, sort) => {
  console.log('imgList11111111Common', imgList)
  const aDataList = []
  imgList.forEach(list => {
    aDataList.push({
      [picUrl]: list.pic_url || list.goods_thumb_image || list.banner_img,
      [goodsUrl]: list.url || list.spu_id,  // 广告楼层对应产品url, 商品楼层对应商品spu_id
      [sort]: list.sort
    })
  })
  return aDataList
}



