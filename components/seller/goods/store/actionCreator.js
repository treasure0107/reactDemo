import * as type from './actionType'

export const getSpecicationList = (list) => ({
  type: type.GET_SPECIFICATION_LIST,
  list
});
export const getSpecicationHideList = (list) => ({
  type: type.GET_SPECIFICATION_HIDE_LIST,
  list
});
export const getQuotationAttrs = (list) => ({
  type: type.GET_QUOTATION_ATTRS,
  list
});
export const getBasicList = (list) => ({
  type: type.GET_BASIC_LIST,
  list
});
export const getQuotationInfo = (payload) => ({
  type: type.GET_QUOTATION_INFO,
  payload
});
export const getGoods = (payload) => ({
  type: type.GET_GOODS,
  payload
});
export const getStepPrice = (list) => ({
  type: type.GET_STEP_PRICE,
  list
});
export const getSkuList = (list) => ({
  type: type.GET_SKU_LIST,
  list
});
export const getQuantity = (list) => ({
  type: type.GET_QUANTITY,
  list
});
export const getClassifyId = (payload) => ({
  type: type.GET_CLASSIFY_ID,
  payload
});
export const getGoodsId = (payload) => ({
  type: type.GET_GOODS_ID,
  payload
});
export const getUnitId = (payload) => ({
  type: type.GET_UNIT_ID,
  payload
});
export const getUnitName = (payload) => ({
  type: type.GET_UNIT_NAME,
  payload
});
export const getGoodsLinkGoods = (list) => ({
  type: type.GET_GOODS_LINK_GOODS,
  list
});
export const getPaymentInfo = (payload) => ({
  type: type.GET_PAYMENT_INFO,
  payload
});
export const getValidId = (payload) => ({
  type: type.GET_VALID_ID,
  payload
});
export const getGoodsLabelList = (list) => ({
  type: type.GET_GOODS_LABEL_LIST,
  list
});
export const getPid = (payload) => ({
  type: type.GET_GOODS_PID,
  payload
});