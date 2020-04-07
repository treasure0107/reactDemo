
import BuriedPoint from "components/common/BuriedPoint.jsx";

const initialState={
    loginInfo:{
      infoData:{
        nick_name:''
      }
    },
    forbidVisitPrivateShop: false // 是否有权限访问私有店
}

const loginInfoReducer = (state = initialState, action) =>{
    const newState = JSON.parse(JSON.stringify(state))
    switch (action.type) {
        case 'setLoginInfo':
          localStorage.loginInfo=JSON.stringify(action.payload);

          // for buried point only
          if (action.payload && action.payload.isLogin && action.payload.infoData) {
            let userSex = "";
            let dataSex = (typeof action.payload.infoData.sex !== "undefined") ? action.payload.infoData.sex : "";
            switch (dataSex) {
              case 0:
                userSex = "保密";
                break;
              case 1:
                userSex = "男";
                break;
              case 2:
                userSex = "女";
                break;
            }
            // console.log("==== zgio identify", localStorage.getItem("epUserId"));
            if (localStorage.getItem("epUserId") && localStorage.getItem("epUserId").length > 0 && !isNaN(localStorage.getItem("epUserId"))) {
              BuriedPoint.track({
                type: "identify",
                name: localStorage.getItem("epUserId"),
                options: {
                  "昵称": action.payload.infoData.nick_name,
                  "手机号": action.payload.infoData.mobile,
                  "邮箱": action.payload.infoData.email,
                  "性别": userSex,
                  "省份": action.payload.infoData.live_province,
                  "城市": action.payload.infoData.live_city
                }
              });
            }
          }

          newState.loginInfo = action.payload
          return newState
        case 'validate_authority':
          newState.forbidVisitPrivateShop = action.payload
          return newState
        default:
          return localStorage.loginInfo?{loginInfo:JSON.parse(localStorage.loginInfo)}:state
    }
}
export default loginInfoReducer;