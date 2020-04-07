import * as type from './actionType'

const initialState={
  count: ''
}

const Home = (state = initialState, action) =>{
  const newState = JSON.parse(JSON.stringify(state))
  switch (action.type) {
    case type.SET_NOTICE_COUNT:
      return Object.assign({}, newState, { count: action.payload })
    default:
      return newState
  }
}
export default Home
