import React, { Component,Fragment } from 'react';

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

class WaitOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '采购城市',
                    dataIndex: 'City',
                    key: 'City',
                    render: (text, record, index) => {
                        return <div>
                            {text}
                        </div>
                    }
                },
                {
                    title: '品/描述',
                    dataIndex: 'GoodsName',
                    key: 'GoodsName',
                    render: (text, record, index) => {
                        return <div>
                        {text}
                    </div>
                    }
                },
                {
                    title: '采购数量',
                    dataIndex: 'GoodsQty',
                    key: 'GoodsQty',
                    render: (text, record, index) => {
                        return <div>
                        {text}
                    </div>
                    }
                },
                {
                    title: '交期',
                    dataIndex: 'DeliveryEndTime',
                    key: 'DeliveryEndTime',
                    render: (text, record, index) => {
                        return <div>
                        {moment.unix(text).format(dateFormat)}
                    </div>
                    }
                },
                {
                    title: '我的报价',
                    dataIndex: 'SpSellerQuotedSet__TotalPrice',
                    key: 'SpSellerQuotedSet__TotalPrice',
                    render: (text, record, index) => {
                        return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'seller_status',
                    key: 'seller_status',
                    render: (text, record, index) => {
                        return <Fragment>
                            {
                                text == 0 ? <span className='apply-amount'>{
                                    '已报价'
                                }</span> : text == 1 ? <span className='offer-status-success'>{
                                    '抢单成功'
                                }</span> : <span className='offer-status-error'>{
                                    '抢单失败'
                                }</span>
                            }
                        </Fragment>
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'remark',
                    key: 'remark',
                    render: (text, record, index) => {
                        return <span style={{cursor:'pointer'}}  onClick={()=>{
                            this.props.history.push('/seller/home/getoffer/'+record.Id+'/2')
                        }}>查看详情</span>
                    }
                }
            ],
            data: [],
            idList: [],
            visible: false,
            total: 0
        }
    }
     componentDidMount() {
         this.getListData({
             size: pageSize,
             page: 1,
             pay_status: 0
         })
     }

    componentDidMount() {
        if(this.props.activeKey == '2'){
            this.getListData({
                size: pageSize,
                page: 1,
                type: 1
            })
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.activeKey == '2'&&nextProps.activeKey!=this.props.activeKey){
            this.getListData({
                size: pageSize,
                page: 1,
                type: 1
            })
        }
    }

    getListData = (values) => {
        Handling.start();
        httpRequest.get({
            url: sellerApi.home.purchase_cat,
            data: {
                ...values
            }
        }).then(res => {
            Handling.stop();
            this.setState({
                data: _.get(res, 'data', []),
                total: _.get(res, 'total', 0),
                page:values.page
            })
        }).catch(() => {
            Handling.stop();
        })
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
            disabled: record.name === 'Disabled User',  Column configuration not to be checked
            name: '',
        }),
    };
    render() {
        const { columns, data, total } = this.state;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        return (
            <div>
                <div className='offer-Info-box'>
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
                                    type: 1
                                })
                            },
                            current:this.state.page

                               size: 'small'
                        }} />
                </div>
            </div>
        )
    }
}

export default withRouter(Form.create()(WaitOffer))


