
const initialState = {
    defaultSelectedKeys: '',
    openKeys: []
}
const helpCenterReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'helpcenterListId':
            return Object.assign({}, state, { defaultSelectedKeys: action.data });
        case 'helpcenterOpenKey':
            return Object.assign({}, state, { openKeys: action.data });
        default:
            return state
    }
}
export default helpCenterReducer;