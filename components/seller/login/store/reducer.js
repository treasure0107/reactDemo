import * as type from './actionType'
import _ from 'lodash'

const initialState = {
  loginInfo: {
    username: '',
    avatar: '',
    lastLoginTime: '',
    shopName: '',
    shopType: '', // 店铺类型：0：企业公有店，1：企业私有店，2：个人公有店
    logo: '',
    shopId: '',
    shopLabel: '', // 店铺标签 0：拍拍快印，1：企业印
    isDirectShop: false
  }
}

const reducer = (state = initialState, action) => {
  const newState = JSON.parse(JSON.stringify(state))
  switch (action.type) {
    case type.SET_LOGIN_INFO:
      const {username, avatar, lastLoginTime, shopName, shopType, logo, shopId, shopLabel, isDirectShop} = action.loginInfo
      const {loginInfo} = newState
      loginInfo.username = username
      loginInfo.avatar = avatar
      loginInfo.logo = logo
      loginInfo.lastLoginTime = lastLoginTime
      loginInfo.shopName = shopName
      loginInfo.shopType = shopType
      loginInfo.shopId = shopId
      loginInfo.shopLabel = shopLabel
      loginInfo.isDirectShop = isDirectShop
      return newState
    default:
      return _.get(action, 'payload.sellerLogin', newState);
  }
}
export default reducer