import { Button, message } from 'antd';
import React, { Component,Fragment } from 'react';
import Title from '../common/Title';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api'
import _ from 'lodash'
class Prepare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }
  componentDidMount() {
    httpRequest.get({
      url: sellerApi.home.seller_ready,
      // data:{
      //     shop_id:100,
      // }
    }).then(res => {
      this.setState({
        data: res.data
      })
    })
  }
  submit=()=>{
    httpRequest.post({
      url: sellerApi.home.spebaseinfo,
      data:{
        shop_close:1,
      }
    }).then(res => {
      window.location.href = '/seller/home/welcome'
      // this.props.history.push('/seller/home/welcome')
    })
    
  }
  render() {
    let {data} = this.state;
    let shop_info = _.get(data,'shop_info',0);
    let shop_express = _.get(data,'shop_express',0);
    let shop_goods = _.get(data,'shop_goods',0);
    let shop_decoration = _.get(data,'shop_decoration',0);
    return (
      <div className='ecsc-layout-prepare'>
        <div className='wrap'>
          <div className='logo-box'>
            <div className='logo'>
              <span className='iconfont icondianpu'></span>
            </div>
            <section>店铺正在上线前准备，请完善以下信息</section>
          </div>
          <div>
            <div className='content-box'>
              <div>基本资料</div>
              <div className='opreat-box'>
                {/* <span className='active' onClick={()=>{
                  this.props.history.push('/seller/shop/ShopSet')
                }}>前往</span> */}
                {
                  shop_info == 1 ?<Fragment><span className='iconfont iconqueding active'></span>
                  <span className='is-over'>已完成</span></Fragment> :   <span className='active' onClick={()=>{
                  this.props.history.push('/seller/shop/ShopSet')
                }}>前往</span>
                }
              </div>
            </div>
            <div className='content-box'>
              <div>设置物流</div>
              <div className='opreat-box'>
                {/* <span className='active' onClick={()=>{
                  this.props.history.push('/seller/delivery/delivergoods')
                }}>前往</span> */}
                {
                  shop_express == 1 ? <Fragment><span className='iconfont iconqueding active'></span>
                  <span className='is-over'>已完成</span></Fragment> :  <span className='active' onClick={()=>{
                  this.props.history.push('/seller/delivery/delivergoods')
                }}>前往</span>
                }              </div>
            </div>
            <div className='content-box'>
              <div>发布商品</div>
              <div className='opreat-box'>
                {/* <span className='active' onClick={()=>{
                  this.props.history.push('/seller/goods/goodsList/0')
                }}>前往</span> */}
                {
                  shop_goods == 1 ? <Fragment><span className='iconfont iconqueding active'></span>
                  <span className='is-over'>已完成</span></Fragment> :   <span className='active' onClick={()=>{
                  this.props.history.push('/seller/goods/goodsList/0')
                }}>前往</span>
                }              </div>
            </div>
            <div className='content-box'>
              <div>店铺装修</div>
              <div className='opreat-box'>
                {/* <span className='active' onClick={()=>{
                  this.props.history.push('/seller/shop/shopDecoration')
                }}>前往</span> */}
                {
                  shop_decoration == 1 ? <Fragment><span className='iconfont iconqueding active'></span>
                  <span className='is-over'>已完成</span></Fragment> :   <span className='active' onClick={()=>{
                  this.props.history.push('/seller/shop/shopDecoration')
                }}>前往</span>
                }              </div>
            </div>
          </div>
          {/* <Button type="primary" onClick={this.submit}>申请上线</Button> */}
          {
            shop_express == 1&&shop_express == 1&&shop_goods == 1?<Button type="primary" onClick={this.submit}>申请上线</Button>:null
          }
          
        </div>
      </div>
    )
  }
}

export default Prepare