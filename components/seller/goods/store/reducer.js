import * as type from './actionType'

const initialState = {
  goods: {},
  specificationList: [],
  specification_hide_list: [],
  quotation_attrs: [],
  basicList: [],
  quotation_info: {},
  payment_info: {},
  step_price: [],
  sku_list: [],
  quantity: [],
  goodslinkgoods: [],
  classifyId: '',
  goods_id: 0,
  unitId: "",
  unit_name: "",
  valid_id: "",
  goodsLabelList: [],
  pid: ""
};

const goods = (state = initialState, action) => {
  let newState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case type.GET_GOODS:
      return Object.assign({}, newState, {goods: action.payload});
    case type.GET_SPECIFICATION_LIST:
      newState.specificationList = action.list;
      return newState;
    case type.GET_SPECIFICATION_HIDE_LIST:
      newState.specification_hide_list = action.list;
      return newState;
    case type.GET_QUOTATION_ATTRS:
      newState.quotation_attrs = action.list;
      return newState;
    case type.GET_BASIC_LIST:
      newState.basicList = action.list;
      return newState;
    case type.GET_STEP_PRICE:
      newState.step_price = action.list;
      return newState;
    case type.GET_SKU_LIST:
      newState.sku_list = action.list;
      return newState;
    case type.GET_QUANTITY:
      newState.quantity = action.list;
      return newState;
    case type.GET_GOODS_LINK_GOODS:
      newState.goodslinkgoods = action.list;
      return newState;
    case type.GET_CLASSIFY_ID:
      newState.classifyId = action.payload;
      return newState;
    case type.GET_GOODS_ID:
      newState.goods_id = action.payload;
      return newState;
    case type.GET_UNIT_ID:
      newState.unitId = action.payload;
      return newState;
    case type.GET_UNIT_NAME:
      newState.unit_name = action.payload;
      return newState;
    case type.GET_VALID_ID:
      newState.valid_id = action.payload;
      return newState;
    case type.GET_QUOTATION_INFO:
      return Object.assign({}, newState, {quotation_info: action.payload});
    case type.GET_PAYMENT_INFO:
      return Object.assign({}, newState, {payment_info: action.payload});
    case type.GET_GOODS_LABEL_LIST:
      newState.goodsLabelList = action.list;
      return newState;
    case type.GET_GOODS_PID:
      newState.pid = action.payload;
      return newState;
    default:
      return newState
  }
};
export default goods
