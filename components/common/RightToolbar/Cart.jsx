import React from 'react';
import {withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {getCartNum,serialGoods,getCartMoney} from 'store/shoppingCart/reducer.js'
import {string,number, func, bool} from 'prop-types'
import {bigNumber} from 'bignumber.js';
import httpRequest from 'utils/ajax'
import API from 'utils/api'
import {Button,InputNumber} from 'antd'



const CartItem = ({goods_img,goods_name,goods_status,goods_type,price,goods_number=0,goods_attr_id,attrType,setCount,shop_id,sku_id,spu_id,del,base_number}) => {
    return (
        <li className="cart_item">
            <img src={goods_img} alt=""/>
            <div className="pric_desc">
            <Link to={`//shop/${shop_id}/goods/${spu_id}`} className="desc">{goods_name}</Link>
            {
              attrType=="top" && <InputNumber
              size="small"
              min={1}
              max={100000}
              value={goods_number}
              disabled={goods_status==1 || goods_type==1}
              defaultValue={goods_number}
              onChange={(val) => {setCount(val) }}
              ></InputNumber>
            }
            <p className="price_wrap">
                <span className="count"><em className="price">¥ {price}</em>
                {
                  attrType=="slide" && `* ${goods_number}`
                }
                  </span>
                <span className="del" onClick={ () => {del()} }>删除</span>
            </p>
            </div>
        </li>
    )
}

// CartItem.propTypes = {
//     url: string.isRequired,
//     desc: string.isRequired,
//     price: number.isRequired,
//     del:func.isRequired
// }



class Cart extends React.Component{
    constructor(props) {
        super(props);
    }
    static propTypes ={
      attrType: string
    }
    static defaultProps = {
      attrType:"slide"
    }


    componentDidMount() {
      this.props.getUserCart();
      //this.props.cartData.length==0 && this.props.getUserCart();
    }

    //去购物车
    goShopCart(){
      this.props.history.push("//user/myshoppingcart");
    }

    //去结算
    goOrderConfirm(){
      this.props.history.push("//user/myshoppingcart");
    }

    setCountCart(item,count){
      console.log("item",item);
      let tag = {
        sku_id:typeof item.sku_id =='undefined'? item.sku.sku_id:item.sku_id,
        goods_attr_id:item.goods_attr_id,
        goods_number:count,
        shop_id:item.shop_id,
        base_number:item.base_number || 1,
        goods_type:item.goods_type
      }
      console.log("tagtagtagtagtag",tag)
      this.props.setCountCart(tag);
    }

    //删除
    delShopCart(item) {
      var goods_list = [
        item.cart_id
      ];
      this.props.delShopCart(goods_list);
    }

    render(){

      let countNum = this.props.countNum;

      let allPrice = this.props.allPrice;
      let cls = this.props.cartData.length==0? "flexHor":"";

        return (
          <>
          <div className={`fix_cont ${cls}`}>
          {
            (() => {
              if(this.props.cartData.length==0){
                return (<div className="no_tip_txt">
                  <p><em className="iconfont2 icon_cart">&#xe618;</em></p>
                  <p>购物车空空的,赶快去挑选心仪的商品吧</p>
                  <Link to="/">去首页看看&gt;&gt;</Link>
                </div>)
              };

              return (
                <ul className="cart_wrap">
                  {
                    this.props.cartData.map((item,index)=>{
                      return(
                          <CartItem {...item}
                          attrType={this.props.attrType}
                          key={index}
                          setCount = { (count) => {this.setCountCart(item,count)}}
                          del={() => {this.delShopCart(item)}} />
                      )
                  })
                  }
                </ul>
              )

            })()
          }


        </div>
        {
          this.props.cartData.length>0 &&
            <div className="cart_handler">
              <div className="flex">
                <p className="shop_num">共<span>{countNum}</span>件商品</p>
                <span className="shop_price">¥{allPrice}</span>
              </div>
              {
                this.props.attrType=="slide"?
                <Button type="primary" block onClick ={() => {this.goOrderConfirm()}}>去购物车结算</Button> :
                <Button onClick ={() => {this.goOrderConfirm()}}>去结算</Button>
              }

            </div>
        }
        </>
        )
    }
}

function mapStateToProps(state) {
    return {
        countNum: getCartNum(state),
        cartData: serialGoods(state),
        allPrice:getCartMoney(state)
    }
}

function mapDispatchToProps(dispatch) {
    return {

       delShopCart: (tag) => {
        dispatch({type:'ASYNC_REMOVE_SHOP',tag:tag})
        },
       getUserCart:() => {
         dispatch({type:"ASYNC_GET_USER_CART"})
       },
       setCountCart:(tag) => {
        dispatch({type:"ASYNC_SET_COUNT_SHOP",tag:tag})
      }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Cart))
