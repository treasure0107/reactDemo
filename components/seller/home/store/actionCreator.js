import * as type from './actionType'

 saga异步请求
export const asyncGetNoticeCount = () => ({
  type: type.ASYNC_GET_NOTICE_COUNT
})

export const setNoticeCount = (count) => ({
  type: type.SET_NOTICE_COUNT,
  payload: count
})
