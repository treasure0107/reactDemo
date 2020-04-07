import React from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select,message,Tooltip,Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class CusServiceInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expand: false,
            data:{}
        }
    }


    handleSearch(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    };

    handleReset() {
        this.props.form.resetFields();
    };

    // QQ校验 支持五位数QQ
    validator_qq(rule, value, callback) {
        let reg = /[^\d]/;
        if(reg.test(value) || value.length <= 3){
            callback('qq格式不对')
        }else{
            callback()
        }
        // let array = value.split('|');
        // let errorIndexList = [];
        // for (let i = 0; i < array.length; i++) {
        //     if (reg.test(array[i]) || array[i].length <= 3) {

        //         errorIndexList.push(i)
        //     }
        // }
        // if (errorIndexList.length > 0) {
        //     let errorList = ''
        //     for (let i = 0; i < errorIndexList.length; i++) {
        //         if (errorList == '') {
        //             errorList = errorIndexList[i] + 1
        //         } else {
        //             errorList = errorList + ',' + (errorIndexList[i] + 1)
        //         }
        //     }
        //     callback('第' + errorList + '个qq格式不对')
        // } else {
        //     callback()
        // }
    }
    validator_phone(rule, value, callback) {
        let reg = /[^\d]/;
        if (reg.test(value) || value.length <= 13) {
            callback('请输入正确的客服电话')
        } else {
            callback()
        }
    }

    toggle() {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };

    componentDidMount() {
        if(this.props.activeKey == 3){
            httpRequest.get({
                // url: sellerApi.shop.baseInfo + localStorage.getItem('shopId') + '/',
                url: sellerApi.shop.baseInfo,
            }).then(res => {
                let { data } = res;
                this.setState({
                    data: data
                });
                // this.props.handleOk();
            })
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.activeKey == 3&&nextProps.activeKey!=this.props.activeKey){
            httpRequest.get({
                // url: sellerApi.shop.baseInfo + localStorage.getItem('shopId') + '/',
                url: sellerApi.shop.baseInfo,
            }).then(res => {
                let { data } = res;
                this.setState({
                    data: data
                });
                // this.props.handleOk();
            })
        }
    }

    render() {
        const { getFieldDecorator, getFieldsValue, setFieldsValue } = this.props.form;
        let { data } = this.state;
        return (
            <div className='base-Info-box'>
                <Form className="order-search-form" onSubmit={this.handleSearch} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                    <Row gutter={24}>
                        <Col span={15}>
                            <div>
                                <Form.Item label={'客服QQ'}>
                                    {getFieldDecorator('_service_qq', {
                                        initialValue:data._service_qq,
                                        rules: [
                                            {
                                                required: true, validator: this.validator_qq
                                            }
                                        ],
                                    })(<Input placeholder="" style={{ width: 240 }} />)}
                                    <span className='tips-info' style={{ marginLeft: 10 }}><Tooltip placement="top" title={'提供专属的IM作为日常的客服工具，登记客服QQ仅作备用。'}>
                                    <Icon type="question-circle" />
                                </Tooltip></span>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={15}>
                            <Form.Item label={'客服电话'}>
                                {getFieldDecorator('_service_mobile', {
                                    initialValue:data._service_mobile,
                                    rules: [
                                        {
                                            required: true, message: '客服电话不能为空',
                                            // validator: this.validator_phone
                                        }
                                    ],
                                })(<Input placeholder="" style={{ width: 240 }} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    {/*<Row gutter={24}>*/}
                        {/*<Col span={15}>*/}
                            {/*<Form.Item label={'审核状态'}>*/}
                                {/*<section>  {*/}
                                    {/*data.audit_status == 0?'未审核': data.audit_status == 1?'审核中':'审核通过'*/}
                                {/*}</section>*/}
                            {/*</Form.Item>*/}
                        {/*</Col>*/}
                    {/*</Row>*/}
                    <Row gutter={24}>
                        <Col span={15} style={{ display: 'flex' }}>
                            <div style={{ width: '20.83333333%' }}></div>
                            <div style={{ width: 200 }}>
                                <Button type="primary" onClick={() => {
                                    this.props.form.validateFields((err, values) => {
                                        if (!err) {
                                            httpRequest.post({
                                                // url: sellerApi.shop.baseInfo + localStorage.getItem('shopId') + '/',
                                                url: sellerApi.shop.baseInfo,
                                                data: {
                                                    ...values
                                                }
                                            }).then(res => {
                                                message.success('操作成功');
                                                // this.props.handleOk();
                                            })
                                        }
                                    });
                                }}>
                                    提交
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

const CusServiceInfoForm = Form.create()(CusServiceInfo);
export default CusServiceInfoForm;

