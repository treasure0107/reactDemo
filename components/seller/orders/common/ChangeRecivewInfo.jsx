import React, { Component, Fragment } from 'react';
import { Steps, Button, Table, Form, Input, Modal, Tooltip, Col, Row, Cascader,message } from 'antd';
import { CityData } from "assets/js/city";
import moment from 'moment';
import MoreImgList from 'components/common/MoreImgList';
import { BigNumber } from 'bignumber.js';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import comUtil from 'utils/common.js'
import _ from 'lodash'
import lang from "assets/js/language/config"

const dateFormat = 'YYYY-MM-DD HH:mm';
const options = CityData;

const { Step } = Steps;
const confirm = Modal.confirm;
const { TextArea } = Input;
let format = {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0
}
BigNumber.config({ FORMAT: format })
class ChangeRecivewInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleContent: '售后详情',
            visible: false,
            visibleRefuse: false,
            WriteCount: 0,
            refuseReason: '',
        }
    }
    componentDidMount() {
        // <MoreImgList imglist={list}></MoreImgList>
        // this.getData();
    }
    locObj={}
    onSub = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.order_sn = this.props.order_sn;
                values.province_id = this.locObj.province;
                values.city_id =  this.locObj.city;
                values.area_id = this.locObj.district;
                httpRequest.put({
                    url: sellerApi.order.editorConsigneeInfo,
                    data: {
                       // shop_id: parseInt(localStorage.getItem('shopId')),
                        ...values
                    }
                }).then(res => {
                    message.success('操作成功')
                    this.props.handleOk();
                })
            }
        });
    }
    render() {
        let { getFieldDecorator } = this.props.form;
        let consignee = _.get(this.props, 'orderData.shopping_info.consignee', '')
        let mobile =  _.get(this.props, 'orderData.shopping_info.mobile', '')
        let address = _.get(this.props, 'orderData.shopping_info.address', '')
        let province_id = _.get(this.props, 'orderData.shopping_info.province_id', '')
        let city_id =  _.get(this.props, 'orderData.shopping_info.city_id', '')
        let area_id = _.get(this.props, 'orderData.shopping_info.area_id', '')
        return (
            <div className='deliver-model-page'>
                <Form className="order-search-form" onSubmit={this.handleSearch} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Row gutter={24}>
                        <Col span={20}>
                            <Form.Item label="收货人">
                                {getFieldDecorator('consignee', {
                                    initialValue: consignee,
                                    rules: [
                                        {
                                            required: true, message: '收货人不能为空'
                                        }
                                    ]
                                })(<Input
                                    placeholder="收货人"
                                />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={20}>
                        <Form.Item label="手机号">
                                {getFieldDecorator('mobile', {
                                    initialValue:mobile,
                                    rules: [
                                        {
                                            required: true, message: '请输入正确的手机号', pattern: comUtil.phoneReg
                                        }
                                    ]
                                })(<Input
                                    placeholder="手机号"
                                />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={20}>
                            <Form.Item label="退货地址">
                                {getFieldDecorator('locDetail', {
                                    initialValue: comUtil.getLocaData([province_id,city_id,area_id])[0],
                                    rules: [
                                        {
                                            required: true, message: '该项不能为空',
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
                                    }} options={options} placeholder={'请选择'} style={{ width: 240 }} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={20}>
                            <Form.Item label={'详细地址'}>
                                {getFieldDecorator('address', {
                                    initialValue: address,
                                    rules: [
                                        {
                                            required: true, message: '该项不能为空且不超过30个字', max: 30
                                        }
                                    ],
                                })(<Input placeholder="" style={{ width: 240 }} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <div style={{textAlign:'right'}}>
                    <Button type='primary' onClick={this.onSub}>确认</Button>
                    <Button className='cancle-btn' onClick={this.props.handleCancel}>取消</Button>
                </div>
            </div>
        )
    }
}
export default Form.create()(ChangeRecivewInfo)

