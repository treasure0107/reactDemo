import React, { Component,Fragment } from 'react';

import { Tabs, Table, Form, Row, Col, Input, Select, DatePicker, Button, Modal, Tooltip, Icon, message } from 'antd';
import moment from 'moment';

import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import { Link } from 'react-router-dom';
import { BigNumber } from 'bignumber.js';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { withRouter } from 'react-router';
import Handling from 'components/common/Handling';
import lang from "assets/js/language/config"

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
                        return <span>{text}</span>
                    }
                },
                {
                    title: '买家实付金额',
                    dataIndex: 'actual_pay_money',
                    key: 'actual_pay_money',
                    render: (text, record, index) => {
                        return <span>{text}</span>
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
                        return <span>{moment.unix(text).format(dateFormat)}</span>
                    }
                },
                // {
                //     title: '订单结算金额',
                //     dataIndex: 'settlement_money',
                //     key: 'settlement_money',
                //     render: (text, record, index) => {
                //         return <span>{text}</span>
                //     }
                // },
                {
                    title: '结算状态',
                    dataIndex: 'pay_status',
                    key: 'pay_status',
                    render: (text, record, index) => {
                        return <span>{'未结算'}</span>
                    }
                },
                {
                    title: '异常反馈',
                    dataIndex: '111',
                    key: '222',
                    render: (text, record, index) => {
                        return <span>{'交易订单与正常订单不相符'}</span>
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'non_settlement',
                    key: 'non_settlement',
                    render: (text, record, index) => {

                        return <Fragment>
                            {
                                text == 2 || text == 1 && record.pay_status == 3 ? <span>{
                                    '已申请'
                                }</span>:<span className='opreat-btn' onClick={()=>{
                                    this.applyReview(record.order_sn)
                                }}>{
                                    '申请复核'
                                }</span>
                            }
                        </Fragment>
                    }
                }
            ],
            data: [],
            idList: [],
            visible: false,
            page:1
        }
    }
    // componentDidMount() {
    //     this.getListData({
    //         size: pageSize,
    //         page: 1,
    //         pay_status: 1
    //     })
    // }
    componentDidMount() {
        if(this.props.activeKey == '1'){
            this.getListData({
                size: pageSize,
                page: 1,
                pay_status: 1
            })
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.activeKey == '1'&&nextProps.activeKey!=this.props.activeKey){
            this.getListData({
                size: pageSize,
                page: 1,
                pay_status: 1
            })
        }
    }


    getListData = (values,type) => {
        Handling.start();
        let {total} = this.state;
        if (total % pageSize == 1 && type == 'put' && values.page > 1) {
            values.page = values.page - 1;
        }
        this.state.page = values.page;
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
                page:this.state.page
            })
        }).catch(() => {
            Handling.stop();
        })
    }

    // 申请复核
    applyReview = (order_sn) => {
        httpRequest.put({
            url: sellerApi.business.applyReview,
            data: {
                order_sn:order_sn
            }
        }).then(res => {
            message.success('操作成功')
            this.getListData({
                size: pageSize,
                page: this.state.page,
                pay_status: 1
            }, 'put')
        }).catch(() => {
        })
    }

    SubSearchData = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.dealTime && values.dealTime.length > 0) {
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
                values.pay_status = 1;
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
        const { columns, data, total,page } = this.state;
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
                                            <RangePicker format={Searchdate} placeholder={['开始时间', '结束时间']}/>
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


                    <Table rowKey={(data, index) => index} dataSource={data} columns={columns} locale={{ emptyText: lang.common.tableNoData }}
                        pagination={{
                            total: total,
                            current:page,
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
                                    pay_status: 1
                                })
                            }
                            //   size: 'small'
                        }} />
                </div>
            </div>
        )
    }
}

export default withRouter(Form.create()(Abnormal))


