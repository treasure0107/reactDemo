import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import lang from 'assets/js/language/config';
import comUtil from 'utils/common.js';

 import '.'
 使用例子
{/* <PriceFormat price={list.price || list.goods_price}></PriceFormat> */}

class PopUps extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    const price = this.props.price;
    return (
      <div className="priceformat">
        {lang.common.$}
        <span className='pri1'>{comUtil.formatprice(price, 1)}.</span>
        <span className='pri2'>{comUtil.formatprice(price, 2)}</span>
      </div>
    )
  }
}

export default PopUps
