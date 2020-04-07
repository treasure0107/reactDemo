import React, { Component } from 'react';

import { Tabs, Table, Form, Row, Col, Input, Select, DatePicker, Button, Modal,Tooltip,Icon } from 'antd';
import moment from 'moment';
import lang from "assets/js/language/config"
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import { Link } from 'react-router-dom';
import { BigNumber } from 'bignumber.js';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { withRouter } from 'react-router';
import _ from 'lodash';
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
const Searchdate = 'YYYY-MM-DD';

let pageSize = 10;


class CouponIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '类型',
                    dataIndex: 'log_type',
                    key: 'log_type',
                    render: (text, record, index) => {
                        return <div>
                            {text ==1||text==4?'提现':text ==2?'结算':'充值'}
                        </div>
                    }
                },
                {
                    title: '金额',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (text, record, index) => {
                        return <span>{text}</span>
                    }
                },
                {
                    title: '变动前账户余额',
                    dataIndex: 'amount_money',
                    key: 'amount_money',
                    render: (text, record, index) => {
                        return <span>￥{text}</span>
                    }
                },
                {
                    title: '变动后可用账户余额',
                    dataIndex: 'settle_account_money',
                    key: 'settle_account_money',
                    render: (text, record, index) => {
                        return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'is_paid',
                    key: 'is_paid',
                    render: (text, record, index) => {
                        return <span>{this.getStatus(text)}</span>
                    }
                },
                {
                    title: '操作时间',
                    dataIndex: 'add_time',
                    key: 'add_time',
                    render: (text, record, index) => {
                        return <span>{moment.unix(text).format(dateFormat)}</span>
                    }
                },
                {
                    title: '备注',
                    dataIndex: 'admin_note',
                    key: 'admin_note',
                    render: (text, record, index) => {
                        return <span>{text}</span>
                    }
                }
            ],
            data: {},
            idList: [],
            visible: false,page:1
        }
    }

    componentDidMount() {
        if(this.props.activeKey == '1'){
            this.getListData({
                size: pageSize,
                page: 1,
            })
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.activeKey == '1'&&nextProps.activeKey!=this.props.activeKey){
            this.getListData({
                size: pageSize,
                page: 1,
            })
        }
    }
    getListData = (values) => {
        httpRequest.get({
            url: sellerApi.business.accountList,
            data: {
                ...values
            }
        }).then(res => {
            this.setState({
                data:res.data?res.data:{}
            })
        })
    }
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let array = [];
            for (let i = 0; i < selectedRows.length; i++) {
                array.push(selectedRows[i].id);
            }
            this.setState({
                idList: array
            })
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: '',
        }),
    };
    SubSearchData = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.dealTime&&values.dealTime.length > 0) {
                    values.start_time = moment(values.dealTime[0]).format(Searchdate);
                    values.end_time = moment(values.dealTime[1]).format(Searchdate);
                }
                for (let key in values) {
                    if (!values[key]) {
                        delete values[key];
                    }
                }
                values.size = pageSize;
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
    getStatus(text){
        switch(text) {
            case 0:
                text = '未支付'
                break;
            case 1:
                text = '已支付'
                break;
            case 2:
                text = '待处理'
                break;
            case 3:
                text = '处理中'
                break;
            case 4:
                text = '已处理'
                break;
            case 10:
                text = '已驳回'
                break;
            default:
                text = '未支付'
       } 
       return text
    }


    render() {
        const { columns, data } = this.state;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        let balance = _.get(data,'balance','');
        let frozen_money = _.get(data,'frozen_money','');
        let total = _.get(data,'count','');
        let result = _.get(data,'result',[]);
        return (
            <div>
                <div className='account-Info-box'>
                    <div className='money-detail-box'>
                        <div className='money-detail'>
                            <div>
                                <span className='shop-title'>可用店余额（￥）</span><Tooltip placement="top" title={'可用店铺余额=店铺余额-不可用店铺余额'}>
                                <Icon type="question-circle" />
                            </Tooltip>
                                <span>(不可用店铺余额{frozen_money}元)</span>
                            </div>
                            <div className='second-box'>
                                <span className='shop-price'>{balance}</span>
                                <Button type="primary" onClick={()=>{
                                    this.props.history.push('/seller/business/cashwithdrawal')
                                }}>提现</Button>
                            </div>
                        </div>
                        <div className='money-detail'>
                            <div>
                                <span className='shop-title'>待结算（￥）</span><Tooltip placement="top" title={'最终结算的资金会减去结算前的退款并在结算后扣除手续费'}>
                                <Icon type="question-circle" />
                            </Tooltip>
                                {/* <span className='link-content'>待结算明细</span> */}
                            </div>
                            <div className='second-box'>
                                {/* <span className='shop-price'>140.00</span> */}
                                <Button type="primary" onClick={()=>{
                                    this.props.history.push('/seller/business/settlement/2')
                                }}>详情</Button>
                            </div>
                        </div>
                    </div>
                    <div className='form-box'>
                        <Form layout="inline" onSubmit={this.handleSubmit} labelCol={{ span: 5 }} wrapperCol={{ span: 14 }}>
                            <Row gutter={24}>
                                <Col span={11}>
                                    <Form.Item label="查询时段">
                                        {getFieldDecorator('dealTime')(
                                            <RangePicker format={Searchdate} style={{ width: 350 }} placeholder={['开始时间', '结束时间']}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <Form.Item label={'类型'}>
                                        {getFieldDecorator('log_type', {
                                            initialValue:'',
                                        })(<Select style={{ width: 120 }}>
                                        <Option value="">全部</Option>
                                        <Option value="1">提现</Option>
                                        <Option value="2">结算</Option>
                                      </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <Button type="primary" onClick={this.SubSearchData} style={{marginTop:3}}>搜索</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>


                    <Table rowKey={(data, index) => index} dataSource={result} columns={columns} 
                        locale={{emptyText:lang.common.tableNoData}}

                        pagination={{
                            total: total,
                            showTotal: (total, page)=>{
                                if(total<pageSize){
                                    return `共${Math.ceil(total / pageSize)}页，每页${total}条`
                                }else{
                                    return `共${Math.ceil(total / pageSize)}页，每页${pageSize}条`
                                }
                            },
                            pageSize: pageSize,
                            onChange:(e)=>{
                                this.getListData({
                                    page:e,
                                    size:pageSize,
                                })
                            }
                            //   size: 'small'
                        }} />
                    </div>
            </div>
        )
    }
}

export default withRouter(Form.create()(CouponIndex))


