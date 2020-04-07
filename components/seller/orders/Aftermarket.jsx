import React, { Component } from 'react';

import Title from '../common/Title';
import '../common/style/evaluateList.scss';
import { Tabs, Table, Form, Row, Col, Input, Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import comUtil from 'utils/common.js'

import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import { Link } from 'react-router-dom';
import {BigNumber} from 'bignumber.js';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import Handling from 'components/common/Handling';
import lang from "assets/js/language/config"

let format = {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0
}
BigNumber.config({ FORMAT: format })

const { RangePicker } = DatePicker;

const { Option } = Select;
const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD HH:mm';
const Searchdate = 'YYYY-MM-DD';

let pageSize=10;

class Aftermarket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '商品名称',
                    dataIndex: 'order_goods',
                    key: 'order_goods',
                    render: (text, record, index) => {
                        return <div className='goods-info-table-box'>
                            <img className='pic-box' src={text.goods_img}/>

                            <div>
                                <div className='goods-name'>{text.goods_name}</div>
                                <div>{text.goods_classify}</div>
                            </div>
                        </div>
                    }
                },
                {
                    title: '订单号',
                    dataIndex: 'order_sn',
                    key: 'order_sn',
                    render: (text, record, index) => {
                        return <span>{text}</span>
                    }
                },
                {
                    title: '申请类型',
                    dataIndex: 'after_type',
                    key: 'after_type',
                    render: (text, record, index) => {
                        return <span>{this.applyType(text)}</span>
                    }
                },
                {
                    title: '申请金额',
                    dataIndex: 'money',
                    key: 'money',
                    render: (text, record, index) => {
                        return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
                    }
                },
                {
                    title: '申请状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (text, record, index) => {
                        return <span>{this.status_type(record.after_type,text)}</span>
                    }
                },
                {
                    title: '申请时间',
                    dataIndex: 'create_time',
                    key: 'create_time',
                    render: (text, record, index) => {
                        return <span>{text}</span>
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'opreat',
                    key: 'opreat',
                    render: (text, record, index) => {
                        return <Link to={`/seller/orders/aftermarketDetail/${record.id}/${record.buyer_id}`} className='apply-looking-detail'>查看详情</Link>
                    }
                },
            ],
            data:[],
            idList:[],
            total:0,
            page:1,
            values:{
                order_sn: '',
                buyer_id: '',
                after_type: '',
                start_time: '',
                end_time: '',
            },
            selectedRowKeys:[]
        }
    }
    componentDidMount(){
        this.getListData({
            size:pageSize,
            page:1
        })
    }

    // 申请类型
    applyType=(type)=>{
           // 0：库存类，1: 定制类，2：生产类
           let text = '';
           switch (type) {
             case 0:
               text = '仅退款'
               break;
             case 1:
               text = '退货退款'
               break;
           }
           return text
    }
    status_type=(type,status)=>{
        // 0：库存类，1: 定制类，2：生产类
        let text = '';
        if(type == 0){
            switch (status) {
                case 0:
                  text = '售后失败'
                  break;
                case 1:
                  text = '处理中'
                  break;
                case 4:
                  text = '售后成功'
                  break;
                // case 3:
                //     text = '售后失败'
                //     break;
              }
        }else{
            switch (status) {
                case 0:
                    text = '售后失败'
                    break;
                case 1:
                    text = '处理中'
                    break;
                case 2:
                    text = '待退货'
                    break;
                case 3:
                    text = '待卖家收货'
                    break;
                case 4:
                    text = '售后成功'
                    break;
                // case 5:
                //     text = '售后失败'
                //     break;
            }
        }
      
        return text
      }
    getListData=(data)=>{
        let { values,page,selectedRowKeys,idList } = this.state;
        for(let key in values){
            if(!values[key]){
                delete values[key]
            }
        }
        this.setState({
            page:data.page,
            // idList:page == data.page?idList:[],
            idList:[],
            // selectedRowKeys:page == data.page?selectedRowKeys:[],
            selectedRowKeys:[],
        })
        Handling.start();
        httpRequest.get({
            url:sellerApi.order.afterSalesList,
            data:{
                // user_id:parseInt(this.deleteId),
            //    shop_id:parseInt(localStorage.getItem('shopId')),
            //    user_id:parseInt(localStorage.getItem('user_id')),
               ...values,
               ...data
            }
          }).then(res =>{
            Handling.stop();
               this.setState({
                   data: res.data?res.data.data:[],
                   total:res.data.total
               })
          }).catch(()=>{
            Handling.stop();
        })
    }
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let array = [];
            for(let i=0;i<selectedRows.length;i++){
                array.push(selectedRows[i].id);
            }
            this.setState({
                idList:array
            })
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: '',
        }),
    };
    SubSearchData=()=> {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.dealTime&&values.dealTime.length > 0){
                    let use_start_time = moment(values.dealTime[0]).format(Searchdate)+' 00:00';
                    let use_end_time = moment(values.dealTime[1]).format(Searchdate)+' 23:59';
                    values.create_start_time = moment(use_start_time).unix();
                    values.create_end_time = moment(use_end_time).unix();
                    // values.start_time=moment(values.dealTime[0]).format(dateFormat);
                    // values.end_time=moment(values.dealTime[1]).format(dateFormat);
                }
                for(let key in values){
                    if(!values[key]){
                        delete values[key];
                    }
                }
                // values.size=pageSize;
                // values.page=1;
                // delete values.dealTime;
                // // 搜索接口
                // this.getListData(values);
                delete values.dealTime;
                this.setState({
                    values:values
                },()=>{
                    values.size=pageSize;
                    values.page=1;
                    // 搜索接口
                    this.getListData(values);
                })

                
                // this.setState({
                //     page:1,
                //     size:
                // })
            }
        });

        // let Data = getFieldsValue();
        // Data.orderState == '订单状态' ? '' : orderState;
        // Data.orderType == '订单类型' ? '' : orderType;
    }
    onSelectChange = (selectedRowKeys,selectedRows) => {
        let array = [];
        for (let i = 0; i < selectedRows.length; i++) {
            array.push(selectedRows[i].id);
        }
        this.setState({
            idList: array,
            selectedRowKeys
        })
        //  this.setState({ selectedRowKeys });
      };
    render() {
        const { dataSource, columns,data,total,page,selectedRowKeys,idList } = this.state;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <Title title={'售后订单'} />
                <div className='evaluate-list-page'>
                    <div className='form-box'>
                        <Form layout="inline" onSubmit={this.handleSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Row gutter={24}>
                                <Col span={6}>
                                    <Form.Item label={'订单编号'}>
                                        {getFieldDecorator('order_sn', {

                                        })(<Input
                                            placeholder="订单编号"
                                            style={{ width: 160 }}
                                        />)}
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label={'用户名'}>
                                        {getFieldDecorator('username', {

                                        })(<Input
                                            placeholder="用户名"
                                            style={{ width: 160 }}
                                        />)}
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label={'售后类型'}>
                                        {getFieldDecorator('after_type', {
                                            initialValue:''
                                            // rules: [{ required: true, message: 'Please input your username!' }],
                                        })(
                                            <Select size={'default'} style={{ width: 160 }}>
                                                <Option key={'全部'} value=''>{'全部'}</Option>
                                                <Option key={'仅退款'} value={'0'}>{'仅退款'}</Option>
                                                <Option key={'退货退款'} value={'1'}>{'退货退款'}</Option>
                                                {/* <Option key={'待发货'} value={'补印重印'}>{'待发货'}</Option> */}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24} className='timer-row'>
                                <Col span={16}>
                                    <Form.Item label="查询时段">
                                            {getFieldDecorator('dealTime')(
                                                <RangePicker format={Searchdate} style={{ width: 350 }} placeholder={['开始时间', '结束时间']}/>
                                            )}
                                    </Form.Item>
                                    <div style={{ lineHeight: '40px', display: 'inline-block' }}>
                                        <Button type="primary" onClick={this.SubSearchData}>搜索</Button>
                                        <Button type="primary" className='no-bg-btn' style={{ marginLeft: 12 }} onClick={()=>{
                                              const { idList } = this.state;
                                              if(idList.length == 0){
                                                  comUtil.confirmModal({
                                                      okText: '确定',
                                                      cancelText: '取消',
                                                      className: 'seller-confirm-modal',
                                                      content:'请选择要导出的订单',
                                                      cancelButtonProps:{style:{display:'none'}},
                                                      // title:'',
                                                      onOk:()=> {
                                                          // window.location.href = loc;
                                                      }
                                                  })
                                                  return
                                              }
                                              Handling.start();

                                            httpRequest.get({
                                                url: sellerApi.order.afterSellerOrder + '?' + `after_id_list=[${idList.toString()}]`,
                                                // data: {
                                                //     order_list:
                                                // }
                                            }).then(res => {
                                                Handling.stop();
                                                window.location.href = sellerApi.order.afterSellerDownload + `?file_name=${res.data}`
                                            }).catch(() => {
                                                Handling.stop();
                                            })
                                            //   window.location.href = sellerApi.order.afterSellerOrder+'?'+`after_id_list=[${idList.toString()}]`
      
                                        }}>导出订单</Button>
                                    </div>
                                </Col>
                                {/* <Col span={11} style={{lineHeight:'40px'}}>
                                <Button type="primary">搜索</Button>
                                <Button type="primary" className='no-bg-btn' style={{marginLeft:12}}>导出订单</Button>
                            </Col> */}
                            </Row>
                        </Form>
                    </div>


                    <Table rowKey={(data,index)=>index} dataSource={data}  columns={columns} rowSelection={rowSelection} 
                    locale={{emptyText:lang.common.tableNoData}}
                    pagination={{
                        total: total,
                        pageSize : pageSize,
                        current:page,
                        showTotal: total => {
                            if(total<pageSize){
                                return `共${Math.ceil(total / pageSize)}页，每页${total}条`
                            }else{
                                return `共${Math.ceil(total / pageSize)}页，每页${pageSize}条`
                            }
                        },
                        pageSize: pageSize,
                        onChange:(e)=>{
                            this.getListData({size:pageSize,page:e})
                        }
                     //   size: 'small'
                    }} />
                </div>
            </div>
        )
    }
}

export default Form.create()(Aftermarket)


