import React, { Component,Fragment } from 'react';
import { Tabs,Table } from 'antd';
import Title from '../common/Title';
import NoInvoice from "./common/NoInvoice";
import InvoiceList from "./common/InvoiceList";
import { withRouter } from 'react-router';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import lang from "assets/js/language/config"
import moment from 'moment';
import { BigNumber } from 'bignumber.js';

import '../common/style/business.scss'
const dateFormat = 'YYYY-MM-DD HH:mm';

let format = {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0
}
BigNumber.config({ FORMAT: format })

// import '../common/style/orderList.scss';

class InvoiceInfo extends Component {
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
            data: {
                result:[]
            },
        }
    }
    componentDidMount(){
        this.getData()
    }
    getData = () => {
        httpRequest.get({
            url: sellerApi.business.getInvoiceInfo,
            data:{
                invoice_id:this.props.match.params.invoiceId
            }
        }).then(res => {
            this.setState({
                data: res.data,
            })
        })
    }
    render() {
        const { columns, data } = this.state;
        let result = _.get(data,'result',[]);
        let invoice_sn = _.get(data,'invoice_sn',lang.common.isNull);
        let add_time = _.get(data,'add_time',lang.common.isNull);
        let invoice_nature = _.get(data,'invoice_nature',lang.common.isNull);
        let invoice_title = _.get(data,'invoice_title',lang.common.isNull);
        
        let download_url = _.get(data,'download_url',lang.common.isNull);
        let company_registered_telephone = _.get(data,'company_registered_telephone',lang.common.isNull);
        let addressee = _.get(data,'addressee',lang.common.isNull);
        let receiving_address = _.get(data,'receiving_address',lang.common.isNull);
        let phone = _.get(data,'phone',lang.common.isNull);
        let order_ids = _.get(data,'order_ids',[]);

        let tax_registration_certificate_sn = _.get(data,'tax_registration_certificate_sn','');
        let bank_name = _.get(data,'bank_name','');
        let bank_account = _.get(data,'bank_account','');
        let register_address = _.get(data,'register_address',[]);
        let status = _.get(data,'status',2);
        let money = order_ids.length > 1 ? order_ids.reduce((a, b) => {
            if(a.service_money){
                return parseFloat(a.service_money) + parseFloat(b.service_money)
            }else{
                return a + parseFloat(b.service_money)
            }
        }):order_ids.length>0?order_ids[0].service_money:0
        return (
            <div className='business-set-page'>
                <Title title={'商家-发票详情'} />
                <div className='account-Info-box'>
                    <div className='invoiceInfo-type'>
                        <div className='content-type-box'>
                            <span className='type-content'>发票状态：</span>
                            <span className='type-content-main'>{
                                status == 1?'已开票':'待开票'
                            }</span>
                        </div>
                        <div className='content-type-box'>
                            <span className='type-content'>发票编号：</span>
                            <span className='type-content'>{invoice_sn}</span>
                        </div>
                        <div className='content-type-box'>
                            <span className='type-content'>提交时间：</span>
                            <span className='type-content'>{moment(add_time).format(dateFormat)}</span>
                        </div>
                    </div>
                    <div className='Invoice-info Consignee-info'>
                        <section className='title'>
                            发票信息
                        </section>
                        <div className='invoice-detail'>
                            <section>发票类型：{
                             invoice_nature==2?'企业增值税专业发票':'企业增值税普通发票'
                            }</section>
                            <section>发票抬头：{invoice_title}</section>
                            <section>税务登记证号：{tax_registration_certificate_sn}</section>
                            {
                                invoice_nature == 2?
                                <Fragment>
                                    <section>基本开户银行名称：{bank_name}</section>
                                    {/* 上面是普通发票 下面是专用发票 */}
                                    <section>基本开户账号：{bank_account}</section>
                                    <section>注册场所地址：{register_address}</section>
                                    <section>公司注册电话：{company_registered_telephone}</section>
                                </Fragment>:''
                            }
                            <section>发票性质：{invoice_nature == 1?'电子发票':'纸质发票'}
                            {
                                status == 1?<a href={download_url}>下载</a>:''
                            }
                            </section>
                        </div>
                    </div>
                    
                    <div className='Invoice-info Consignee-info'>
                        <section className='title'>收货人信息</section>
                        <div className='info-content-box info-content-child'>
                            <div className='need-border'>
                                <section><p style={{ minWidth: 40 }}>收货人:</p><div>
                                    {addressee}
                                </div></section>
                                <section><p style={{ minWidth: 40 }}>手机号:</p><div>
                                    {phone}
                                </div></section>
                                <section style={{flex:1}}><p style={{ minWidth: 40 }}>收货地址:</p><div>
                                    {receiving_address}
                                </div></section>
                            </div>
                        </div>
                    </div>
                    <div className='Invoice-info Consignee-info'>
                        <section className='title'>开票商品信息</section>
                        <Table rowKey={(data, index) => index} dataSource={order_ids} columns={columns} pagination={false} locale={{emptyText:lang.common.tableNoData}}/>
                        <div className='price-box-invoiceInfo'>
                            <span className='count-box'>商品总数：{order_ids.length}件</span>
                            <span className='price-box'>发票总额：<span className='price-detail'>￥{money}</span></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(InvoiceInfo);