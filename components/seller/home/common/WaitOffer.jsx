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
const dateFormat = 'YYYY-MM-DD';
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
                        return text
                    }
                },
                {
                    title: '采购数量',
                    dataIndex: 'GoodsQty',
                    key: 'GoodsQty',
                    render: (text, record, index) => {
                        return text
                    }
                },
                {
                    title: '交期',
                    dataIndex: 'DeliveryEndTime',
                    key: 'DeliveryEndTime',
                    render: (text, record, index) => {
                        return moment.unix(text).format(dateFormat)
                    }
                },
                {
                    title: '截止',
                    dataIndex: 'QuotedEndTime',
                    key: 'QuotedEndTime',
                    render: (text, record, index) => {
                        return moment.unix(text).format(dateFormat)
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'create_time',
                    key: 'create_time',
                    render: (text, record, index) => {
                        return <Button type={'primary'} className='sub-btn-table' onClick={()=>{
                            this.props.history.push('/seller/home/getoffer/'+record.Id+'/1')
                        }}>
                            报价抢单
                        </Button>
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
        if(this.props.activeKey == '1'){
            this.getListData({
                size: pageSize,
                page: 1,
                type: 0
            })
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.activeKey == '1'&&nextProps.activeKey!=this.props.activeKey){
            this.getListData({
                size: pageSize,
                page: 1,
                type: 0
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
                  搜索接口
                 this.getListData(values);
             }
         });

          let Data = getFieldsValue();
          Data.orderState == '订单状态' ? '' : orderState;
          Data.orderType == '订单类型' ? '' : orderType;
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
                                    type: 0
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


