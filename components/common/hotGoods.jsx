import React, { Component, Fragment, useState,useEffect } from 'react';
import useHookSlide from "components/common/useHookSlide"
import LazyLoad from 'react-lazyload';
import httpRequest from 'utils/ajax'
import API from 'utils/api'
import { Link } from "react-router-dom";
import GoodsList from 'componentsgoods/goodsList';
import comUtil from 'utils/common'


import "./style/hotGoods.scss"

props可以传入url表示请求的url,args表示请求的参数,tit标题
function hotGoods(props){
    let ajaxUrl = props.url || API.search.get_se_recommend;
    const [url,setUrl]= useState(ajaxUrl);
    const [args,setArgs] = useState(props.args||{recomtype:'cart'});
    const [list,setList] = useState([]);

    获取列表数据
    const getList = async () => {
      let params = {
        url,
        data:args
      };
      const resData = await httpRequest.get(params);
      if(resData.code!=200){
        return;
      }
      setList(resData.data.data.data)
    }

    useEffect(() => {
      getList();
    },[url,args])



    const setHooks = useHookSlide(list.map((item,indx) => {
        return (
          <Link to={`shop/${item.shop_id}/goods/${item.spu_id}`} key={indx}>
                <div className="slide_items" key={indx}>
                    <div className="imgs_wrap">
                        <LazyLoad >
                          <img src={item.goods_thumb_image} alt="error" />
                        </LazyLoad>
                    </div>
                    <div className="desc">
                      <p className="price">￥{comUtil.getFormatPrice(item.price)} 
                      { item.is_new==1 && <span className="label">新品</span>}
                      {item.shipping_id==0 && <span className="label">包邮</span>}
                      </p>
  
                      <p className="name">{item.goods_name}</p>
                      <span className="sell_count">已售 {item.goods_sell_qty}</span>
                      <span className="evaluate_count">评价 {item.goods_comment}</span>
                    </div>
                  </div>
          </Link>
        )
      }))
    


    return (
      <div className="hot_goods">
            <h3 className="tit">{props.tit?props.tit:"热销商品"}</h3>
            {
              list===null ? "加载中..." :
              list.length==0 ? "加载中..." :
              setHooks
            }
        
      </div>
    )

}
export default hotGoods;
