import React, { Component } from 'react';

import { Table, Form, Row, Col, Input, Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import lang from "assets/js/language/config"
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import { Link } from 'react-router-dom';
import { BigNumber } from 'bignumber.js';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { withRouter } from 'react-router';
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
const Searchdate = 'YYYY-MM-DD';

let pageSize = 10;

class InvoiceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                // {
                //     title: '订单编号',
                //     dataIndex: 'goodsName',
                //     key: 'goodsName',
                //     render: (text, record, index) => {
                //         return <div>
                //             {text}
                //         </div>
                //     }
                // },
                {
                    title: '发票申请编号',
                    dataIndex: 'invoice_sn',
                    key: 'invoice_sn',
                    render: (text, record, index) => {
                        return <span>{text}</span>
                    }
                },
                {
                    title: '发票总额',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (text, record, index) => {
                        return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
                    }
                },
                {
                    title: '发票性质',
                    dataIndex: 'invoice_nature',
                    key: 'invoice_nature',
                    render: (text, record, index) => {
                        return <span className='apply-amount'>{
                            text == 2 ? '纸质发票' : '电子发票'
                        }</span>
                    }
                },
                {
                    title: '发票状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (text, record, index) => {
                        return <span>{text == 1 ? '已开票' : '待开票'}</span>
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'opreat',
                    key: 'opreat',
                    render: (text, record, index) => {
                        return <div className='opreat-table-invoiceList'>
                            <span onClick={() => {
                                this.props.history.push('/seller/business/invoiceinfo/' + record.invoice_id)
                            }}>发票详情</span>
                            {
                                record.status == 1 ? <span onClick={() => {
                                    window.location.href = record.download_url
                                }}>下载</span> : ''
                            }
                        </div>
                    }
                }
            ],
            data: [],
            idList: [],
            visible: false,
            choosePrice: 0,
            total: 0
        }
    }
    componentDidMount() {
        if(this.props.activeKey == '2'){
            this.getListData({
                pagesize: pageSize,
                page: 1,
            })
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.activeKey == '2'&&nextProps.activeKey!=this.props.activeKey){
            this.getListData({
                pagesize: pageSize,
                page: 1,
            })
        }
    }
    getListData = (values) => {
        Handling.start();
        httpRequest.get({
            url: sellerApi.business.invoiceList,
            data: {
                ...values
            }
        }).then(res => {
            Handling.stop();
            this.setState({
                data: _.get(res, 'data.invoiceinfo', []),
                total: _.get(res, 'data.total_invoice', 0),
                page:values.page
            })
        }).catch(()=>{
            Handling.stop();
        })
    }
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let { choosePrice } = this.state;
            if (Array.isArray(selectedRows)) {
                if (selectedRows.length == 1) {
                    choosePrice = selectedRows[0].price;
                } else if (selectedRows.length < 1) {
                    choosePrice = 0;
                } else {
                    choosePrice = selectedRows.reduce((a, b) => {
                        return a.price + b.price
                    })
                }
            }
            this.setState({
                choosePrice: choosePrice
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
                if (values.dealTime && values.dealTime.length > 0) {
                    values.date_from = moment(values.dealTime[0]).format(Searchdate);
                    values.date_to = moment(values.dealTime[1]).format(Searchdate);
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
    render() {
        const { columns, data, choosePrice, total } = this.state;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        return (
            <div>
                <div className='account-Info-box'>
                    <div className='form-box'>
                        <Form layout="inline" onSubmit={this.handleSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Row gutter={24}>
                                <Col span={16} className='timer-row' style={{ marginTop: 0 }}>
                                    <Form.Item label="查询时段">
                                        {getFieldDecorator('dealTime')(
                                            <RangePicker format={Searchdate} style={{ width: 350 }} placeholder={['开始时间', '结束时间']} />
                                        )}
                                    </Form.Item>
                                    <div style={{ lineHeight: '40px', display: 'inline-block' }}>
                                        <Button type="primary" onClick={this.SubSearchData}>搜索</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>


                    <Table rowKey={(data, index) => index}
                        locale={{ emptyText: lang.common.tableNoData }}
                        // rowSelection={this.rowSelection} 
                        dataSource={data} columns={columns} pagination={{
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
                                    pagesize: pageSize,
                                })
                            },
                            current:this.state.page
                            //   size: 'small'
                        }} />
                </div>
            </div>
        )
    }
}

export default withRouter(Form.create()(InvoiceList))


