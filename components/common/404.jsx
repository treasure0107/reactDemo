import React from "react";
import {Link, withRouter} from "react-router-dom";
import "./style/404.scss"




const Error404 = () =>{
  return(
    <div className="warp-404">
      <div className="box-404 w1200 clearfix">
        <div className="fl"></div>
        <div className="fr">
          <p className={"big-text"}>
            <span >404</span>抱歉，您访问的页面走丢了
          </p>
          <p>有可能是被外星人带走了或者我们的系统正在维护中...</p>
          <p>
            <Link to={"/"} className={"btn"}>返回首页</Link>
            {/*<span  className={"btn"} onClick={()=>{window.location.reload()}}>刷新</span>*/}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Error404;