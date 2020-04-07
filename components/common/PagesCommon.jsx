import React, { useState } from 'react'
import {Pagination,InputNumber} from 'antd'
import './style/pages_common.scss'

 function PagesCommon(props){
  const {query} = props;
  const [jumpPage,setJumpPage] = useState("");

  

  const itemRender =(current, type, originalElement) => {
    if (type === 'prev') {
      return <a className="pageprev">上一页</a>;
    }
    if (type === 'next') {
      return <a className="pagenext">下一页</a>;
    }
    return originalElement;
  }
    return(
        <div className="pages_common">
            <Pagination
                onChange={(val) => props.queryCall(val)}
                itemRender = {itemRender}
                current={query.page}
                total={query.total}
                pageSize={query.size}
            />
            <div className="speedy">
            <span>共 {query.page_total} 页</span>
            <span>到第<InputNumber min={1} onChange={(val) => setJumpPage(val)}></InputNumber>页</span>
            <span className="page_btns" onClick={() => props.queryCall(jumpPage)}>确定</span>
            </div>
        </div>

    )
}


export default PagesCommon;