import React, { Component } from 'react';

import { Tabs, Table, Form, Row, Col, Input, Select, DatePicker, Button, Modal,Tooltip,Icon,message } from 'antd';
import moment from 'moment';

import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import { Link } from 'react-router-dom';
import { BigNumber } from 'bignumber.js';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { withRouter } from 'react-router';
import lang from "assets/js/language/config"
import Handling from 'components/common/Handling';

import '../../common/style/business.scss'

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
const SearchFormat = 'YYYY-MM-DD'
let pageSize = 10;

class NoInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '订单编号',
                    dataIndex: 'order_sn',
                    key: 'order_sn',
                    render: (text, record, index) => {
                        return <div>
                            {text}
                        </div>
                    }
                },
                // {
                //     title: '产品名称',
                //     dataIndex: 'after_sn',
                //     key: 'after_sn',
                //     render: (text, record, index) => {
                //         return <span>{text}</span>
                //     }
                // },
                {
                    title: '费用类型',
                    dataIndex: 'after_type',
                    key: 'after_type',
                    render: (text, record, index) => {
                        return <span>{'信息技术服务费'}</span>
                    }
                },
                {
                    title: '订单完成时间',
                    dataIndex: 'create_time',
                    key: 'create_time',
                    render: (text, record, index) => {
                        return <span className='apply-amount'>{moment.unix(text).format(dateFormat)}</span>
                    }
                },
                {
                    title: '可开票金额',
                    dataIndex: 'service_money',
                    key: 'service_money',
                    render: (text, record, index) => {
                        return <span>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
                    }
                }
            ],
            data: [],
            idList: [],
            visible: false,
            choosePrice:0,
            total:0,
            trueMoney:0,
            selectedRowKeys:[]
        }
    }
    componentDidMount() {
        if(this.props.activeKey == '1'){
            this.getListData({
                pagesize: pageSize,
                page: 1,
            },true)
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.activeKey == '1'&&nextProps.activeKey!=this.props.activeKey){
            this.getListData({
                pagesize: pageSize,
                page: 1,
            },true)
        }
    }
    getListData = (values,isFirst) => {
        Handling.start();
        httpRequest.get({
            url: sellerApi.business.noInvoiceList,
            data: {
                ...values
            }
        }).then(res => {
            Handling.stop();
            this.setState({
                data: _.get(res, 'data.prder_list', []),
                total: _.get(res, 'data.total', 0),
                trueMoney:_.get(res, 'data.total_invoice_money', 0),
                page:values.page
                // idList:[],
                // choosePrice:0,
                // selectedRowKeys:[]
            })
            if(isFirst){
                this.setState({
                    idList:[],
                    choosePrice:0,
                    selectedRowKeys:[]
                })
            }
        }).catch(()=>{
            Handling.stop();
        })
    }
  
    SubSearchData = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.dealTime&&values.dealTime.length > 0) {
                    values.date_from = moment(values.dealTime[0]).format(SearchFormat);
                    values.date_to = moment(values.dealTime[1]).format(SearchFormat);
                }
                for (let key in values) {
                    if (!values[key]) {
                        delete values[key];
                    }
                }
                values.pagesize = pageSize;
                values.page = 1;
                delete values.dealTime;
                // 搜索接口
                this.getListData(values);
            }
        });

        // let Data = getFieldsValue();
        // Data.orderState == '订单状态' ? '' : orderState;
        // Data.orderType == '订单类型' ? '' : orderType;
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    onSelectChange = (selectedRowKeys,selectedRows) => {
        let array = [];
        for (let i = 0; i < selectedRowKeys.length; i++) {
            array.push(JSON.parse(selectedRowKeys[i]).order_id);
        }
        let { choosePrice } = this.state;
            if (Array.isArray(selectedRowKeys)) {
                if (selectedRowKeys.length == 1) {
                    choosePrice = JSON.parse(selectedRowKeys[0]).service_money;
                } else if (selectedRowKeys.length < 1) {
                    choosePrice = 0;
                } else {
                    choosePrice = selectedRowKeys.reduce((a, b) => {
                        if(JSON.parse(a).service_money){
                            return parseFloat(JSON.parse(a).service_money) + parseFloat(JSON.parse(b).service_money)
                        }else{
                            return a + parseFloat(JSON.parse(b).service_money)
                        }
                    })
                }
            }
            this.setState({
                choosePrice: choosePrice
            })
        this.setState({
            idList: array,
            selectedRowKeys,
            choosePrice: choosePrice
        })
        //  this.setState({ selectedRowKeys });
      };

    render() {
        const { dataSource, columns, data,choosePrice,total,trueMoney,selectedRowKeys,idList } = this.state;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <div className='account-Info-box'>
                    <div className='form-box'>
                        <Form layout="inline" onSubmit={this.handleSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Row gutter={24}>
                                {/* <Col span={6}>
                                    <Form.Item label={'商品名称'}>
                                        {getFieldDecorator('order_sn', {

                                        })(<Input
                                            placeholder="商品名称"
                                            style={{ width: 160 }}
                                        />)}
                                    </Form.Item>
                                </Col> */}
                                <Col span={16} className='timer-row' style={{ marginTop: 0 }}>
                                    <Form.Item label="查询时段">
                                        {getFieldDecorator('dealTime')(
                                            <RangePicker format={SearchFormat} style={{ width: 350 }} placeholder={['开始时间', '结束时间']}/>
                                        )}
                                    </Form.Item>
                                    <div style={{ lineHeight: '40px', display: 'inline-block' }}>
                                        <Button type="primary" onClick={this.SubSearchData}>搜索</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>


                    <Table rowKey={(data, index) => JSON.stringify({
                        id:data.id,order_id:data.order_id,service_money:data.service_money
                    })}
                        locale={{emptyText:lang.common.tableNoData}}
                        rowSelection={rowSelection} dataSource={data} columns={columns} pagination={{
                        total: total,
                        showTotal: (total, page)=>{
                            if(total<pageSize){
                                return `共${Math.ceil(total / pageSize)}页，每页${total}条`
                            }else{
                                return `共${Math.ceil(total / pageSize)}页，每页${pageSize}条`
                            }
                        },
                        onChange:(e)=>{
                            this.getListData({
                                page:e,
                                pagesize:pageSize,
                            })
                        },
                        pageSize: pageSize,
                        current:this.state.page
                        //   size: 'small'
                    }} />
                    <div className='price-box-invoice'>
                        <div className='price-box-left price-box'>
                            <span className='price-name'>可开票总金额：</span>
                            <span className='price-detail'>￥{new BigNumber(parseFloat(trueMoney)).toFormat(2)}</span>
                        </div>
                        <div className='price-box-right price-box'>
                            <span className='price-name'>已选金额：</span>
                            <span className='price-detail-chooseDetail'>￥{new BigNumber(parseFloat(choosePrice)).toFormat(2)}</span>
                            <Button type="primary" 
                                disabled={choosePrice<500} 
                                style={{marginTop:3}} onClick={()=>{
                                    if(idList.length<=0){
                                        message.info('请选择要开票的订单')
                                    }else if(choosePrice<500){
                                        message.info('金额需满￥500.00才可开票')
                                    }else{
                                        this.props.history.push('/seller/business/editinvoiceinfo/'+idList.toString());
                                    }
                                }}>索要发票
                            </Button>
                        </div>
                    </div>
                    <div className='price-tips-invoice'>
                        <span className='tips-name'>温馨提示：</span>
                        <span className='tips-content'>金额需满￥500.00才可开票。</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Form.create()(NoInvoice))


