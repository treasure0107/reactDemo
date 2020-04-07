import React from 'react'
import './style/emptypage.scss'

/**
 * 内容为空的时候作展示用
 * imgurl 图片
 * text 展示的文本
 */
const Empty = (props) => {
  return (<div className='emptypage'>
    <img src={props.imgurl} alt="" />
    <p>{props.text}</p>
    {
      props.children
    }
  </div>
  )
};
export default Empty;