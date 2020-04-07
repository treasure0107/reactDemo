import React, { Fragment } from "react";

import "./style/tabsnav.scss";
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import TBZGoto from "components/third/tbz/TBZGoto.jsx";
import BuriedPoint from "components/common/BuriedPoint.jsx";

function gotoUrl(url, name)
{
   For buried point.
  BuriedPoint.track({
    name: "点击主导航",
    options: {
      "主导航": name
    }
  });

  setTimeout(doIt, 200);

  function doIt()
  {
    window.location.href = url;
  }
}

/**
 * 头部导航
 */
const TabsNav = (props) => {
   const {mallentrancedata} =props;
   const curIndex={props};
    return (
        <div className="tabsnav">
          {mallentrancedata.mainnavdata&&mallentrancedata.mainnavdata.length>0?mallentrancedata.mainnavdata.map((i,index)=>{
            return(
              i.entrance_url === "%WCY%" // For WCY(TBZ) 微创印（图帮主）
              ?
              <Fragment key={index}>
                <TBZGoto tag={"mainMenu"} urlTag={"tbzHome"} backTag={"goods_search"}>
                  <a className={curIndex==index?'act':''} href="javascript:void(0)">{i.entrance_name}</a>
                </TBZGoto>
              </Fragment>
              :
              <a key={index} onClick={() => gotoUrl(i.entrance_url, i.entrance_name)} className={curIndex==index?'act':''} href="javascript:void(0)">{i.entrance_name}
              {/* <span>
                NEW
              </span> */}
              </a>
            )
          }):null}
            {/* <Link className={props.curIndex==0||!props.curIndex?'act':''} to="">首页</Link>
            <Link className={props.curIndex==1?'act':''} to="">场景购</Link>
            <Link className={props.curIndex==2?'act':''} to="">定制购</Link> */}
        </div>
    )
}
// mapStateToProps可以不传，如果不传，组件不会监听store的变化，也就是说Store的更新不会引起UI的更新
function mapStateToProps (state) {
  return {
    mallentrancedata:state.mallentrancedata,
  }
}
// mapDispatchToProps
// mapDispatchToProps用于建立组件跟store.dispatch的映射关系,可以是一个object，也可以传入函数
// 如果mapDispatchToProps是一个函数，它可以传入dispatch,ownProps, 定义UI组件如何发出action，实际上就是要调用dispatch这个方法

function mapDispatchToProps (dispatch) {
  return {
    setMainNavData: (state) => dispatch(state),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabsNav)
