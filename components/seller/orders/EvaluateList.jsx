import React, { Component } from 'react';

import Title from '../common/Title';
import '../common/style/evaluateList.scss';
import { Tabs, Table } from 'antd';
import { Link } from 'react-router-dom';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import ImIframe from  "components/common/ImIframe";
import SellerIm from "components/common/SellerImIcon";

import Content from './common/EvaluateContent'
import _ from 'lodash';
import Handling from 'components/common/Handling';
import lang from "assets/js/language/config"
import {BigNumber} from 'bignumber.js';

import moment from 'moment';
const dateFormat = 'YYYY-MM-DD HH:mm';
let pageSize = 10;




class EvaluateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '评价商品',
          dataIndex: 'order_goods',
          key: 'order_goods',
          render: (text, record, index) => {
            return <div className='goods-info-table-box'>
              <img src={record&&record.goods_thumb_image} className='pic-box' />

              <div>
                <div className='goods-name'>{record&&record.goods_name}</div>
                <div>{record&&record.sku_attrs_name}</div>
                {/* <div>{record.SKU}</div> */}
              </div>
            </div>
          }
        },
        {
          title: '评价人',
          dataIndex: 'comment_user',
          key: 'comment_user',
          render: (text, record, index) => {
            return <div className='goods-info-evaluater-box'>
              {text}
              <SellerIm uid={record.user_id} msg={record.user_id+",,,+++---你好"}  isSeller={true} iconClass={'iconfont iconmessage'}></SellerIm>

              {/* <span className='iconfont iconmessage'></span>
             */}
             </div>
          }
        },
        {
          title: '评价内容',
          dataIndex: 'evaluateContent',
          key: 'evaluateContent',
          render: (text, record, index) => {
            return <Content record={record} index={index}/>
          }
        },
        {
          title: '评价',
          dataIndex: 'comment_status',
          key: 'comment_status',
          render: (text, record, index) => {
            return <div className='goods-info-evaluate-box'>
              {text}星
                    </div>
          }
        },
        {
          title: '评价时间',
          dataIndex: 'comment_time',
          key: 'comment_time',
          render: (text, record, index) => {
            return <div className='goods-info-evaluateTime-box'>
                    {moment(text).format(dateFormat)}
                    </div>
          }
        },
        {
          title: '操作',
          dataIndex: 'opreat',
          key: 'opreat',
          render: (text, record, index) => {
            return <div className='goods-info-opreat-box' onClick={() => {
              this.props.history.push('/seller/orders/reply/'+record.id)
            }}>
              {
                record.reply_id == 0?'回复':'查看详情'
              }
            </div>
          }
        },
      ],
      data: [],
      total:0,
      page:1,
      express_comment:0,server_comment:0
    }
  }

  changeVisible = (value) =>{
    this.setState({
      visible:value
    })
  }
  componentDidMount(){
    this.getListData({size:pageSize,page:1})
  }
  getListData = (values) => {
    Handling.start();

    httpRequest.get({
      url: sellerApi.order.evaluateList,
      data: {
       // shop_id: parseInt(localStorage.getItem('shopId')),
        ...values
      }
    }).then(res => {
      Handling.stop();
      console.log("res...",res.data);
      this.setState({
        data:res.data?res.data:[],
        total:res.total,
        express_comment: res.express_comment,
        server_comment: res.server_comment
      })
    }).catch(()=>{
      Handling.stop();
  })
  }
  render() {
    const { data, columns,dataSource,total,page,express_comment,server_comment } = this.state;
    return (
      <div>
        <Title title={'评价列表'} />
        <div className='evaluate-list-page'>
          <div className='score-box'>
            <div>
              <section>物流服务：</section>
              <section className='content'><span>{
                isNaN(parseFloat(new BigNumber(parseFloat(express_comment)).decimalPlaces(1)))?'暂无评分':
                parseFloat(new BigNumber(parseFloat(express_comment)).decimalPlaces(1))+'分'
                }</span></section>
            </div>
            <div>
              <section>服务态度：</section>
              <section className='content'><span>{
                isNaN(parseFloat(new BigNumber(parseFloat(server_comment)).decimalPlaces(1)))?'暂无评分':
                parseFloat(new BigNumber(parseFloat(server_comment)).decimalPlaces(1))+'分'
                // parseFloat(new BigNumber(parseFloat(server_comment)).decimalPlaces(1))
                }</span></section>
            </div>
          </div>

          <Table rowKey={(data,index)=>{
            return index+new Date().getTime();
          }} dataSource={data} columns={columns}
          locale={{emptyText:lang.common.tableNoData}}
          pagination={{
            total: total,
            // current:page,
            showTotal: total => {
              if (total < pageSize) {
                return `共${Math.ceil(total / pageSize)}页，每页${total}条`
              } else {
                return `共${Math.ceil(total / pageSize)}页，每页${pageSize}条`
              }
            },
            pageSize: pageSize,
            onChange:(e)=>{
              this.getListData({size:pageSize,page:e})
            }
            //  size:'small'
          }} />
        </div>
        {/* <ImIframe visible={this.state.visible} changeVisible={()=>{
          this.changeVisible(false)
        }}></ImIframe> */}
      </div>
    )
  }
}

export default EvaluateList
