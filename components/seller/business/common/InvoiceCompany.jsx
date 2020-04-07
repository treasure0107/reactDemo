import React from 'react';
import { Form, Row, Col, DatePicker, Select } from 'antd';
import { CityData } from "assets/js/city";

import _ from 'lodash'

import lang from "assets/js/language/config"

import '../../common/style/business.scss'

const { RangePicker } = DatePicker;
const options = CityData;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
let colSpan = 20
class InvoiceCompany extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {

        return (
            <Form className="invoice-company-form" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                <Row gutter={24}>
                    <Col span={colSpan}>
                        <Form.Item label={'单位名称'}>
                        科技（深圳）有限公司
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={colSpan}>
                        <Form.Item label={'税号'}>
                            91440300MA5EJ4YF2W
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={colSpan}>
                        <Form.Item label={'单位地址'}>
                        深圳市南山区粤海街道滨海大道3369号有线信息传输大厦13F
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={colSpan}>
                        <Form.Item label={'电话号码'}>
                            0755-26926935
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={colSpan}>
                        <Form.Item label={'开户银行'}>
                            江苏银行股份有限公司深圳车公庙支行
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={colSpan}>
                        <Form.Item label={'银行账户'}>
                            19260188000094788
                        </Form.Item>
                    </Col>
                </Row>
                <div className='invoice-title'>收票地址</div>
                <Row gutter={24}>
                    <Col span={colSpan}>
                        <Form.Item label={'收件地址'}>
                            深圳市南山区粤海街道滨海大道3369号有线信息传输大厦13F
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={colSpan}>
                        <Form.Item label={'收件人'}>
                            （深圳）
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={colSpan}>
                        <Form.Item label={'收件电话'}>
                            0755-26926935
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default InvoiceCompany;

