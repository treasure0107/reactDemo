import React, { Component } from 'react';

import { Tabs, Table, Form, Row, Col, Input, Select, DatePicker, Button, Modal, Tooltip, Icon } from 'antd';
import moment from 'moment';
import Handling from 'components/common/Handling';
import lang from "assets/js/language/config"
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import { Link } from 'react-router-dom';
import { BigNumber } from 'bignumber.js';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { withRouter } from 'react-router';

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

let data = {
    "page_total": '总页数',
    "total": '总条数',
    "page_index": '当前页数',
    "data": [
        {
            id: 'ID',
            after_sn: "售后单号",
            order_id: "售后订单",
            order_goods_name: "售后订单商品名称(order_goods_id 查询订单商品表)",
            after_type: "售后类型",
            status: "售后状态",
            money: "售后金额",
            reason: "售后原因",
            create_time: "申请时间",
            goodsName: '好优惠券'
        },
        {
            id: 'ID',
            after_sn: "售后单号",
            order_id: "售后订单",
            order_goods_name: "售后订单商品名称(order_goods_id 查询订单商品表)",
            after_type: "售后类型",
            status: "售后状态",
            money: "售后金额",
            reason: "售后原因",
            create_time: "申请时间",
            goodsName: '坏优惠券'
        }
    ]
}
class Abnormal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '订单号',
                    dataIndex: 'order_sn',
                    key: 'order_sn',
                    render: (text, record, index) => {
                        return <div>
                            {text}
                        </div>
                    }
                },
                {
                    title: '订单总额',
                    dataIndex: 'order_money',
                    key: 'order_money',
                    render: (text, record, index) => {
                        return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
                    }
                },
                {
                    title: '优惠金额',
                    dataIndex: 'coupons_total_money',
                    key: 'coupons_total_money',
                    render: (text, record, index) => {
                        return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
                    }
                },
                {
                    title: '买家实付金额',
                    dataIndex: 'actual_pay_money',
                    key: 'actual_pay_money',
                    render: (text, record, index) => {
                        return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
                    }
                },
                {
                    title: '退款金额',
                    dataIndex: 'return_money',
                    key: 'return_money',
                    render: (text, record, index) => {
                        return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
                    }
                },
                {
                    title: '订单结转时间',
                    dataIndex: 'create_time',
                    key: 'create_time',
                    render: (text, record, index) => {
                        return <span className='apply-amount'>{moment.unix(text).format(dateFormat)}</span>
                    }
                },
                {
                    title: '结算状态',
                    dataIndex: 'remark',
                    key: 'remark',
                    render: (text, record, index) => {
                        return <span>{text == 0 ? '待结算' : text == 1 ? '异常结算' : '已结算'}</span>
                    }
                }
            ],
            data: [],
            idList: [],
            visible: false,
            total: 0
        }
    }
    // componentDidMount() {
    //     this.getListData({
    //         size: pageSize,
    //         page: 1,
    //         pay_status: 0
    //     })
    // }

    componentDidMount() {
        if(this.props.activeKey == '2'){
            this.getListData({
                size: pageSize,
                page: 1,
                pay_status: 0
            })
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.activeKey == '2'&&nextProps.activeKey!=this.props.activeKey){
            this.getListData({
                size: pageSize,
                page: 1,
                pay_status: 0
            })
        }
    }

    getListData = (values) => {
        Handling.start();
        httpRequest.get({
            url: sellerApi.business.settlementList,
            data: {
                ...values
            }
        }).then(res => {
            Handling.stop();
            this.setState({
                data: _.get(res, 'data.result', []),
                total: _.get(res, 'data.count', 0),
                page:values.page
            })
        }).catch(() => {
            Handling.stop();
        })
    }

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
                values.pay_status = 0;
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
    render() {
        const { columns, data, total } = this.state;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        return (
            <div>
                <div className='account-Info-box'>
                    <div className='form-box'>
                        <Form layout="inline" onSubmit={this.handleSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Row gutter={24}>
                                <Col span={6} style={{ paddingRight: 0 }}>
                                    <Form.Item label={'订单号'}>
                                        {getFieldDecorator('order_sn', {

                                        })(<Input
                                            placeholder="订单号"
                                            style={{ width: 160 }}
                                        />)}
                                    </Form.Item>
                                </Col>
                                <Col span={16} style={{ paddingLeft: 0 }}>
                                    <Form.Item label="查询时段">
                                        {getFieldDecorator('dealTime')(
                                            <RangePicker format={Searchdate} placeholder={['开始时间', '结束时间']} />
                                        )}
                                    </Form.Item>
                                    <div style={{ lineHeight: '40px', display: 'inline-block' }}>
                                        <Button type="primary" onClick={this.SubSearchData}>搜索</Button>
                                    </div>
                                </Col>
                                {/* <Col span={6}>
                                <Form.Item label={'结算状态'}>
                                    {getFieldDecorator('order_type', {
                                        initialValue:''
                                        // rules: [{ required: true, message: 'Please input your username!' }],
                                    })(
                                        <Select size={'default'} style={{ width: 160 }}>
                                            <Option key={'全部订单'} value={''}>{'全部订单'}</Option>
                                            <Option key={'库存商品订单'} value={0}>{'库存商品订单'}</Option>
                                            <Option key={'生成商品订单'} value={2}>{'生成商品订单'}</Option>
                                            <Option key={'定制商品订单'} value={1}>{'定制商品订单'}</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col> */}
                            </Row>
                        </Form>
                    </div>


                    <Table rowKey={(data, index) => index} dataSource={data} columns={columns}
                        locale={{ emptyText: lang.common.tableNoData }}
                        pagination={{
                            total: total,
                            showTotal: (total, page) => {
                                if (total < pageSize) {
                                    return `共${Math.ceil(total / pageSize)}页，每页${total}条`
                                } else {
                                    return `共${Math.ceil(total / pageSize)}页，每页${pageSize}条`
                                }
                            },
                            pageSize: pageSize,
                            onChange: (e) => {
                                this.getListData({
                                    page: e,
                                    size: pageSize,
                                    pay_status: 0
                                })
                            },
                            current:this.state.page

                            //   size: 'small'
                        }} />
                </div>
                <Modal
                    className='admin-modal-confirm shop-sales-activity'
                    title="创建优惠券"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div className='coupon-content-box'>
                        <div className='coupon-content-detail small'>
                            <div className='coupon-style grey-coupon'>
                                <div className='price-box'>
                                    <div className='main-price'>满减券</div>
                                    <div className='tips-price'>例：满100-20</div>
                                </div>
                                <div className='no-content'>
                                    <div className='line-box'>
                                        <Button type='primary' onClick={() => {
                                            this.props.history.push('/seller/shop/couponeditor')
                                        }}>创建</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='coupon-content-detail small'>
                            <div className='coupon-style pink-coupon'>
                                <div className='price-box'>
                                    <div className='main-price'>满折券</div>
                                    <div className='tips-price'>例：满100-9折</div>
                                </div>
                                <div className='no-content'>
                                    <div className='line-box'>
                                        <Button type='primary' onClick={() => {
                                            this.props.history.push('/seller/shop/couponeditor')
                                        }}>创建</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <Button type="primary" onClick={()=>{
                        this.props.history.push('/seller/shop/couponeditor')
                    }}>创建满减券</Button> */}
                        {/* <Button type="primary" style={{ marginLeft: 12 }}>创建满折券</Button> */}
                        {/* <img src={require('./aa1.png')}/> */}
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Form.create()(Abnormal))


