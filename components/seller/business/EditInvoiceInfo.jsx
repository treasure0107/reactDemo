import React, { Component, Fragment } from 'react';
import { Tabs, Table, Form, Row, Col, Input, Cascader, Radio, Tooltip, Icon, Button, message } from 'antd';
import Title from '../common/Title';
import NoInvoice from "./common/NoInvoice";
import InvoiceList from "./common/InvoiceList";
import { withRouter } from 'react-router';
import comUtil from 'utils/common.js'
import { CityData } from "assets/js/city";
import lang from "assets/js/language/config"
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import { BigNumber } from 'bignumber.js';
import moment from 'moment';

import '../common/style/business.scss'
let format = {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0
}
const dateFormat = 'YYYY-MM-DD HH:mm';

BigNumber.config({ FORMAT: format })
const { TabPane } = Tabs;
// import '../common/style/orderList.scss';

class EditInvoiceInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCommon: 1,
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
                        return <span>信息技术服务费</span>
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
            data: {},
        }
    }
    componentDidMount() {
        this.getData()
    }
    locObj = {}
    sendData = (values) => {
        httpRequest.post({
            url: sellerApi.business.submitInvoice,
            data: {
                shop_invoice:{...values},
                invoice_list:this.props.match.params.invoice_list
            }
        }).then(res => {
            // message.success('操作成功')
            this.props.history.push('/seller/business/success/'+res.data);
        })
    }
    // 获取数据
    getData = (values) => {
        httpRequest.post({
            url: sellerApi.business.getEditinvoiceinfo,
            data: {
                invoice_list: this.props.match.params.invoice_list
            }
        }).then(res => {
            if (res.data && res.data && res.data.invoice_info) {
                let data = res.data.invoice_info
                data.locDetail = comUtil.getLocaData([data.province, data.city, data.district])[0];
            }
            this.setState({
                data: res.data,
                isCommon: _.get(res.data, 'invoice_info.invoice_type', '1')
            })
            // message.success('操作成功')
            // this.props.history.goBack();
        })
    }

    render() {
        const { dataSource, columns, data, isCommon } = this.state;
        const { getFieldDecorator } = this.props.form;
        let orders_info = _.get(data, 'orders_info', []);
        let consignee_name = _.get(data, 'invoice_info.consignee_name', '');
        let consignee_mobile_phone = _.get(data, 'invoice_info.consignee_mobile_phone', '');
        let company_telephone = _.get(data, 'invoice_info.company_telephone', '');
        let district = _.get(data, 'invoice_info.district', '');
        let province = _.get(data, 'invoice_info.province', '');
        let city = _.get(data, 'invoice_info.city', '');
        let consignee_address = _.get(data, 'invoice_info.consignee_address', '');
        // let orders_info = _.get(data,'orders_info',[]);
        let tax_id = _.get(data, 'invoice_info.tax_id', []);
        // let invoice_type = _.get(data, 'invoice_info.invoice_type', '1');
        let invoice_title = _.get(data, 'invoice_info.invoice_title', '');
        let company_registered_telephone = _.get(data, 'invoice_info.company_registered_telephone', '');
        let company_address = _.get(data, 'invoice_info.company_address', '');
        let bank_of_deposit = _.get(data, 'invoice_info.bank_of_deposit', '');

        let bank_account = _.get(data, 'invoice_info.bank_account', '');
        let locDetail = _.get(data, 'invoice_info.locDetail', '');

        
        let money = orders_info.length > 1 ? orders_info.reduce((a, b) => {
            if(a.service_money){
                return parseFloat(a.service_money) + parseFloat(b.service_money)
            }else{
                return a + parseFloat(b.service_money)
            }
        }):orders_info.length>0?orders_info[0].service_money:0;
        money = new BigNumber(parseFloat(money)).toFormat(2)
        return (
            <div className='business-set-page'>
                <Title title={'商家-发票详情'} />
                <div className='account-Info-box'>
                    <Form style={{ padding: 0 }} onSubmit={this.handleSearch} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                        <div className='Invoice-info Consignee-info'>
                            <section className='title'>
                                收票人信息
                            </section>
                            <div className='invoice-detail'>
                                <Row gutter={24} className='sort-input-lable'>
                                    <Col span={18}>
                                        <Form.Item label={'收货人'}>
                                            {getFieldDecorator('consignee_name', {
                                                initialValue: consignee_name,
                                                rules: [
                                                    {
                                                        message: '收货人不能为空', required: true, whitespace: true
                                                    },
                                                ],
                                            })(<Input placeholder="" style={{ width: 160 }} />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={18} className='line-input sort-input-lable'>
                                        <Form.Item label={'手机号码'}>
                                            {getFieldDecorator('consignee_mobile_phone', {
                                                initialValue: consignee_mobile_phone,
                                                rules: [
                                                    {
                                                        required: true, message: '请输入正确的手机号', pattern: comUtil.phoneReg, whitespace: true
                                                    },
                                                ],
                                            })(<Input placeholder="" style={{ width: 160 }} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={18} className='line-input sort-input-lable'>
                                        <Form.Item label={'固定电话'} >
                                            {getFieldDecorator('company_telephone', {
                                                initialValue: company_telephone,
                                                rules: [
                                                    {
                                                        message: '固定电话不能为空', required: true, whitespace: true
                                                    },
                                                ],
                                            })(<Input placeholder="" style={{ width: 160 }} />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={18} className='sort-input-lable'>
                                        <Form.Item label="所在地区">
                                            {getFieldDecorator('locDetail', {
                                                initialValue: locDetail,
                                                rules: [
                                                    {
                                                        required: true, message: '该项不能为空'
                                                    }
                                                ]
                                            })(
                                                <Cascader displayRender={(e, b) => {
                                                    if (b[1]) {
                                                        this.locObj.city = b[1].value + '_' + b[1].label
                                                    }
                                                    if (b[0]) {
                                                        this.locObj.province = b[0].value + '_' + b[0].label
                                                    }
                                                    if (b[2]) {
                                                        this.locObj.district = b[2].value + '_' + b[2].label
                                                    }
                                                    return e
                                                }} options={CityData} placeholder={'请选择'} style={{ width: 320 }} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={18} className='sort-input-lable'>
                                        <Form.Item label={'详细地址'}>
                                            {getFieldDecorator('consignee_address', {
                                                initialValue: consignee_address,
                                                rules: [
                                                    {
                                                        required: true, message: '该项不能为空且不超过30个字', max: 30, whitespace: true
                                                    }
                                                ],
                                            })(<Input placeholder="" style={{ width: 320 }} />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className='Invoice-info Consignee-info'>
                            <section className='title'>开票商品信息</section>
                            <Table rowKey={(data, index) => index}
                                locale={{ emptyText: lang.common.tableNoData }}
                                dataSource={orders_info} columns={columns} pagination={false} />
                        </div>
                        <div className='Invoice-info Consignee-info'>
                            <section className='title'>
                                发票信息
                            </section>
                            <div className='invoice-detail'>
                                <Row gutter={24}>
                                    <Col span={18}>
                                        <Form.Item label={'发票抬头'}>
                                            <div>{invoice_title}</div>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={18}>
                                        <Form.Item label={'发票类型'}>
                                            {getFieldDecorator('invoice_type', {
                                                initialValue: isCommon.toString(),
                                                rules: [
                                                    {
                                                        message: '发票类型不能为空', required: true
                                                    },
                                                ],
                                            })(<Radio.Group onChange={(e) => {
                                                this.setState({
                                                    isCommon: e.target.value
                                                })
                                            }}>
                                                <Radio value={'1'}><span>企业增值税普通发票</span><Tooltip placement="top" title={'增值税普通发票开给小规模纳税人，或者开票资料不齐全的购买人，购买人取得后不可以进行进项税额抵扣。若您还有疑问，建议联系贵司财务确认后再提交开票需求。'}>
                                                    <Icon type="question-circle" />
                                                </Tooltip></Radio>
                                                <Radio value={'2'}><span>企业增值税专业发票</span><Tooltip placement="top" title={'增值税专用发票开给一般纳税人，申请时需要提供公司名称、税号、地址电话、开户行名称及账号，购买人取得后可进行进项税额抵扣。若您还有疑问，建议联系贵司财务确认后再提交开票需求。'}>
                                                    <Icon type="question-circle" />
                                                </Tooltip></Radio>
                                            </Radio.Group>)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={18}>
                                        <Form.Item label={'税务登记证号'} style={{ marginBottom: 0 }}>
                                            <div>
                                                {getFieldDecorator('tax_id', {
                                                    initialValue: tax_id,
                                                    rules: [
                                                        {
                                                            message: '税务登记证号不能为空,且不超过20位', required: true ,max: 20
                                                        },
                                                    ],
                                                })(<Input placeholder="" style={{ width: 320 }} />)}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={18}>
                                        <Col span={18} offset={5} style={{ paddingLeft: 0 }}>
                                            <Form.Item>
                                                <div style={{ lineHeight: '20px', width: 320 }}>请与贵公司财务人员核实后，仔细填写准确的税务登记证号， 否则将影响后续发票的正常使用</div>
                                            </Form.Item>
                                        </Col>
                                    </Col>
                                </Row>
                                {
                                    isCommon == 1 ? <Fragment>
                                        <Row gutter={24}>
                                            <Col span={18}>
                                                <Form.Item label={'发票性质：'}>
                                                    <div>电子发票</div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Fragment> : 
                                        <Fragment>
                                        <Row gutter={24}>
                                            <Col span={18}>
                                                <Form.Item label={'基本开户银行名称：'}>
                                                    {getFieldDecorator('bank_of_deposit', {
                                                         initialValue: bank_of_deposit,
                                                        rules: [
                                                            {
                                                                required: true, message: '基本开户银行名称不能为空', whitespace: true
                                                            }
                                                        ],
                                                    })(<Input placeholder="" style={{ width: 320 }} placeholder='请填写您开户许可证上的开户银行' />)}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={24}>
                                            <Col span={18}>
                                                <Form.Item label={'基本开户账号：'}>
                                                    {getFieldDecorator('bank_account', {
                                                        initialValue: bank_account,
                                                        rules: [
                                                            {
                                                                required: true, message: '开户银行账号只能为数字', whitespace: true, pattern: comUtil.justNumber,
                                                            }
                                                        ],
                                                    })(<Input placeholder="" style={{ width: 320 }} placeholder='请填写您开户许可证上的银行账号' />)}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={24}>
                                            <Col span={18}>
                                                <Form.Item label={'注册场所地址：'}>
                                                    {getFieldDecorator('company_address', {
                                                        initialValue: company_address,
                                                        rules: [
                                                            {
                                                                required: true, message: '地址不能少于5个字', whitespace: true, min: 5
                                                            }
                                                        ],
                                                    })(<Input placeholder="" style={{ width: 320 }} placeholder='请填写您营业执照上的注册地址' />)}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={24}>
                                            <Col span={18}>
                                                <Form.Item label={'公司注册电话：'}>
                                                    {getFieldDecorator('company_registered_telephone', {
                                                        initialValue: company_registered_telephone,
                                                        rules: [
                                                            {
                                                                required: true, message: '该项不能为空', whitespace: true
                                                            }
                                                        ],
                                                    })(<Input placeholder="" style={{ width: 320 }} placeholder='请填写您公司的有效联系电话' />)}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={24}>
                                            <Col span={18}>
                                                <Form.Item label={'发票性质：'}>
                                                    <div>纸质发票</div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Fragment>
                                }

                            </div>
                        </div>
                    </Form>
                    <div className='bottom-sub-box-editInfo'>
                        <span>发票总额：<span className='default-color'>￥{money}{
                            money<500?<span>（金额需满￥500.00才可开票。）</span>:''
                        }
                        </span><Button type="primary" disabled={money<500} onClick={() => {
                                if(money<500){
                                    message.error('金额需满￥500.00才可开票')
                                    return
                                }
                            this.props.form.validateFields((err, values) => {
                                values.province = this.locObj.province;
                                values.city = this.locObj.city;
                                values.district = this.locObj.district;
                                delete values.locDetail;
                                // return
                                if (!err) {
                                    comUtil.confirmModal({
                                        okText: '确定',
                                        cancelText: '取消',
                                        className: 'seller-confirm-modal',
                                        content:'请仔细核实您所填写的信息，确认无误后点击确定按钮提交申请',
                                        title:'提示',
                                        onOk:()=> {
                                            this.sendData(values);
                                        }
                                    })
                                }
                            })
                        }}>提交发票订单</Button></span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Form.create()(EditInvoiceInfo));