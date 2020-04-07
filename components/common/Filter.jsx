

import React, { Fragment } from "react";
import { InputNumber, Button, Checkbox,message } from 'antd';

import "./style/filter.scss"

import lang from "assets/js/language/config";

let filter=lang.common.filter;

/**
 * 搜索页面的筛选条件
 * this.setfilter('comprehensive', 0) 筛选条件
 *  this.setfilter('sales', 0) 筛选条件
 *  this.setfilter('new', 0) 筛选条件
 *  this.setfilter('comment', 0) 筛选条件
 *  this.setfilter('price', 0) 筛选条件
 */
class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.filterdata,
      pagedata: props.pagedata,
      showPriceConfirm: false,
    };
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
  }
  componentWillReceiveProps (nextProps) {
    let data = nextProps.filterdata;
    console.log(data)
    let pagedata = nextProps.pagedata;
    this.setState({
      data,
      pagedata
    });
  }
  onChange (name, val) {
    console.log(name, val)
    if (name == 'freeshipping' || name == 'desige') {
      val = val.target.checked;
      this.props.onChange(name, this.state.data);

    }
    this.state.data[name] = val;
    this.setState({
      data: this.state.data
    })
  }
  filter (name) {
    // this.setfilter('comprehensive', 0)
    // this.setfilter('sales', 0)
    // this.setfilter('new', 0)
    // this.setfilter('comment', 0)
    // this.setfilter('price', 0)
    this.state.data['comprehensive'] = 0;
    this.state.data['sales'] = 0;
    this.state.data['new'] = 0;
    this.state.data['comment'] = 0;

    if (name == 'price') {
      console.log(this.state.data['price'])
      this.state.data['price'] = this.state.data['price'] == 1 ? 2 : 1;
    } else {
      this.state.data['price'] = 0;
      this.state.data[name] = this.state.data[name] == 0 ? 1 : 0;
    }

    this.setState({
      data: this.state.data
    })
    this.props.onChange(name, this.state.data);
  }
  setfilter (name, val) {
    this.setState({
      [name]: val
    })
  }
  search () {
    let data=this.state.data;
    if(data.minprice&&data.maxprice&&data.minprice>=data.maxprice){
       message.warning(filter.priceerror);
       return;
    }
    this.setState({
      showPriceConfirm: false
    });
    this.props.onChange('search', data);

  }
  clear () {
    this.state.data.minprice = '';
    this.state.data.maxprice = '';
    this.setState({
      data: this.state.data
    });
  }
  next () {
    const { pagedata } = this.state;
    if (pagedata.page_index < pagedata.page_total) {
      pagedata.page_index++;
      this.setState({
        data: this.state.data
      });
      this.props.onChangePage(pagedata.page_index);
    }
  }
  prev () {
    const { pagedata } = this.state;
    if (pagedata.page_index > 1) {
      pagedata.page_index--;
      this.setState({
        data: this.state.data
      });
      this.props.onChangePage(pagedata.page_index);
    }
  }
  focus () {
    this.setState({
      showPriceConfirm: true
    });
  }
  blur () {
    // this.setState({
    //   showPriceConfirm: false
    // });
  }

  render () {
    const { data, showPriceConfirm, pagedata } = this.state;
    const { isshopsearch, isshop } = this.props;
    return (
      <div className="filter">
        <div className="filter-sort">
          <span className={data.comprehensive == 0 ? 'comprehensive' : 'comprehensive on'} onClick={this.filter.bind(this, 'comprehensive')}>
            <u>{filter.comprehensive}</u>
          </span>
          <span className={data.sales == 0 ? 'sales' : 'sales on'} onClick={this.filter.bind(this, 'sales')}>
            <u>{filter.sales}</u>
            <i></i>
          </span>
          <span className={data.comment == 0 ? 'comment' : 'comment on'} onClick={this.filter.bind(this, 'comment')}>
            <u>好评</u>
            <i></i>
          </span>
          {!isshopsearch && <span className={data.price == 0 ? 'price' : data.price == 1 ? 'price on1 on' : 'price on2 on'} onClick={this.filter.bind(this, 'price')}>
            <u>{filter.price}</u>
            <i></i>
          </span>}
        </div>
        {
          isshopsearch || isshop ? null :
            <Fragment>
              <div className="price">
                <InputNumber size='small' min={1} max={999999} value={data.minprice} onChange={this.onChange.bind(this, 'minprice')} placeholder='￥' onFocus={this.focus} onBlur={this.blur} />
                <span>-</span>
                <InputNumber size='small' min={1} onChange max={999999} value={data.maxprice} onChange={this.onChange.bind(this, 'maxprice')} placeholder='￥' onFocus={this.focus} onBlur={this.blur} />
                {/* <Button size='small' type="primary" icon="search" onClick={this.search.bind(this)}>
            Search
           </Button> */}
                {showPriceConfirm ?
                  <div className="showPriceConfirm">
                    <Button size='small' type="primary" onClick={this.clear.bind(this)}>
                      {filter.clear}
                  </Button>
                    <Button size='small' type="primary" onClick={this.search.bind(this)}>
                      {filter.search}
                    </Button>
                  </div>
                  : null}
              </div>
              <div className="checklist">
                <Checkbox checked={data.freeshipping} onChange={this.onChange.bind(this, 'freeshipping')}>{filter.freeshipping}</Checkbox>
                <Checkbox checked={data.desige} onChange={this.onChange.bind(this, 'desige')}>{filter.desige}</Checkbox>
                {/* <Checkbox onChange={this.onChange.bind(this, 'selpsupport')}>自营商品</Checkbox> */}
                {/* <Checkbox onChange={this.onChange.bind(this, 'instock')}>仅显示有货</Checkbox> */}
                {/* <label >
                        <input className="checked" type="checkbox" onChange={this.onChange.bind(this,'freeshipping')}/>
                        <span></span>
                        包邮
                        </label>
                    <label >
                        <input className="checked" type="checkbox" onChange={this.onChange.bind(this,'selpsupport')}/>
                        <span></span>
                        自营商品
                        </label>
                    <label >
                        <input className="checked" type="checkbox" onChange={this.onChange.bind(this,'instock')}/>
                        <span></span>
                        仅显示有货
                        </label> */}
              </div>
            </Fragment>
        }
        <div className="rightpagebtn fr">
          <span>{filter.total}{pagedata && pagedata.total}{isshopsearch ? filter.home : filter.goods}</span>
          <span><u>{pagedata && pagedata.page_index}</u>/{pagedata && pagedata.page_total}</span>
          <div className="pagebtn">
            <div className="left" onClick={this.prev.bind(this)}>
              <span></span>
            </div>
            <div className="right" onClick={this.next.bind(this)}>
              <span></span>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

// const CityOrientation = (props) => {

// }

export default Filter;


