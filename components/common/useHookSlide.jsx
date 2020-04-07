import React, { useState, useEffect } from "react";
import './style/useHookSlide.scss'

function useHookSlide(eles,clds=""){

    const [showNum,setShowNum] = useState(0);
    const [w, setW] = useState(0);
    const [wrapW,setWrapW] = useState(0);
    let lens = eles.length;
    const [tag,setTag] = useState(0)

    const move = (step) =>{
      let _tag = tag + step;
      if(_tag<0 || _tag > (lens - showNum)){
        return;
      }
      setTag(_tag) 
    }
    useEffect(() => {

      try {
        
     
      let ele =document.getElementsByClassName(clds?clds:"slide_scroll")[0];
      
      let eles =ele.getElementsByClassName("slide_items");
      
      let lens = eles.length;
      let styles = window.getComputedStyle(eles[0],null);
      let w = parseInt(styles.marginLeft) + parseInt(styles.marginRight) + parseInt(styles.width);
      setW(w);
      setWrapW(lens * w)

      
      let stylesParent = window.getComputedStyle(ele,null);
      let _w = parseInt(stylesParent.marginLeft) + parseInt(stylesParent.marginRight) + parseInt(stylesParent.width) || parseInt(stylesParent.maxWidth);
      setShowNum(Math.ceil(_w/w));
    } catch (error) {
        
    }

    },[eles])

  
    return (
        <div className={`slide_scroll ${clds?clds:""}`}>
          {
            lens-showNum>0 && 
            <>
            <span onClick={() => move(-1)} className={`iconfont2 arr_lft ${tag==0?"disabled":""}`}><em>&#xe60c;</em></span>
            <span onClick={() => move(1)} className={`iconfont2 arr_rt ${tag==(lens - showNum)?"disabled":""}`}><em>&#xe60c;</em></span>
            </>
          }
          
          <div className="move_wrap"
          style={{"width":wrapW +"px",transition:"transform 0.4s linear",transform:"translateX("+ tag * -w +"px)"}}
          >
              {eles}
          </div>
        </div>

      
  
    )
  }
  export default useHookSlide;