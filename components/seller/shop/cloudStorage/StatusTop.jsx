import React from 'react'

const StatusTop = (props) => {
  const { wrapperCls, title, children, clickRight, action } = props
  return (
    <div className={wrapperCls ? `${wrapperCls} statusTop clearfix` : "statusTop clearfix"}>
      <span className="title fl">{title}</span>
      {
        children ? children : (
          <span className="apply fr" onClick={() => clickRight(title.indexOf('申请') > -1)}>{action}</span>
        )
      }
    </div>
  )
}

export default StatusTop