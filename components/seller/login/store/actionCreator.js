import * as type from './actionType'

export const setSellerLoginInfo = (loginInfo) => ({
  type: type.SET_LOGIN_INFO,
  loginInfo
})