
const initialState = {
  helpSearchListId: [],
  defaultSelectedKeys: '0',
  count: '',
  // current: 1,
  helpPageIndex: '1',
  Buyermerchant: '0'
}
const helpsearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'helpSearchListId':
      return Object.assign({}, state, { helpSearchListId: action.data, count: action.count, current: action.current });
    case 'articlecenterListId':
      return Object.assign({}, state, { defaultSelectedKeys: action.data });
    case 'helpPageIndexList':
      return Object.assign({}, state, { helpPageIndex: action.data });
    case 'articlecenterOpenKey':
      return Object.assign({}, state, { openKeys: action.data });
    case 'articlecenterSelected':
      return Object.assign({}, state, { Selected: action.data });
    case 'articlecenterBuyermerchant':
      return Object.assign({}, state, { Buyermerchant: action.data });
    case 'articlecenterListMuenId':
      return Object.assign({}, state, { ListMuenId: action.data });
    default:
      return state
  }
}
export default helpsearchReducer;