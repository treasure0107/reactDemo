import React from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select,Cascader } from 'antd';
import { LocaleProvider } from 'antd';
import moment from 'moment';
import {CityData} from "assets/js/city";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const { RangePicker } = DatePicker;
const options = CityData;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class OrderQuery extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expand: false,
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

    toggle() {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };

    render() {
        const { getFieldDecorator,getFieldsValue } = this.props.form;
        return (
            <Form className="order-search-form" onSubmit={this.handleSearch} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label={'订单号'}>
                            {getFieldDecorator('orderNumber', {
                                rules: [
                                    {
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="" />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'电子邮件'}>
                            {getFieldDecorator('orderNumber', {
                                rules: [
                                    {
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="" />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label={'购货人'}>
                            {getFieldDecorator('orderNumber', {
                                rules: [
                                    {
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="" />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'收货人'}>
                            {getFieldDecorator('orderNumber', {
                                rules: [
                                    {
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="" />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label={'收货地址'}>
                            {getFieldDecorator('orderNumber', {
                                rules: [
                                    {
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="" />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'邮政编码'}>
                            {getFieldDecorator('orderNumber', {
                                rules: [
                                    {
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="" />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label={'电话号码'}>
                            {getFieldDecorator('orderNumber', {
                                rules: [
                                    {
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="" />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'手机号码'}>
                            {getFieldDecorator('orderNumber', {
                                rules: [
                                    {
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="" />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="下单时间">
                            <LocaleProvider locale={zh_CN}>
                                {getFieldDecorator('dealTime')(
                                    <RangePicker format={dateFormat} />
                                )}
                            </LocaleProvider>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="确认收货时间">
                            <LocaleProvider locale={zh_CN}>
                                {getFieldDecorator('ReceiveTime')(
                                    <RangePicker format={dateFormat} />
                                )}
                            </LocaleProvider>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="所在地区">
                            {getFieldDecorator('locDetail')(
                               <Cascader options={options}  placeholder={'请选择'}/>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="配送方式">
                            {getFieldDecorator('locDetail2',{
                                initialValue: '请选择'
                            })(
                                <Select size={'default'} style={{ width: 150 }}>
                                    <Option key={'请选择'}>{'请选择'}</Option>
                                    <Option key={'圆通速递'}>{'圆通速递'}</Option>
                                    <Option key={'顺风速递'}>{'顺风速递'}</Option>
                                    <Option key={'申通速递'}>{'申通速递'}</Option>
                                    <Option key={'运费到付'}>{'运费到付'}</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="支付方式">
                            {getFieldDecorator('locDetail3',{
                                initialValue: '请选择'
                            })(
                                <Select size={'default'} style={{ width: 150 }}>
                                    <Option key={'请选择'}>{'请选择'}</Option>
                                    <Option key={'支付宝'}>{'支付宝'}</Option>
                                    <Option key={'余额支付'}>{'余额支付'}</Option>
                                    <Option key={'在线支付'}>{'在线支付'}</Option>
                                    <Option key={'微信支付'}>{'微信支付'}</Option>
                                </Select>

                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="订单状态">
                            {getFieldDecorator('locDetai4l',{
                                initialValue: '请选择'
                            })(
                                <Select size={'default'} style={{ width: 150 }}>
                                    <Option key={'请选择'}>{'请选择'}</Option>
                                    <Option key={'未确认'}>{'未确认'}</Option>
                                    <Option key={'已确认'}>{'已确认'}</Option>
                                    <Option key={'取消'}>{'取消'}</Option>
                                    <Option key={'无效'}>{'无效'}</Option>
                                </Select>

                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="订单分类">
                            {getFieldDecorator('locDetail5',{
                                initialValue: '请选择'
                            })(
                                <Select size={'default'} style={{ width: 150 }}>
                                    <Option key={'请选择'}>{'请选择'}</Option>
                                    <Option key={'白条订单'}>{'白条订单'}</Option>
                                    <Option key={'众筹订单'}>{'众筹订单'}</Option>
                                    <Option key={'门店订单'}>{'门店订单'}</Option>
                                    <Option key={'夺宝订单'}>{'夺宝订单'}</Option>
                                </Select>

                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="付款方式">
                            {getFieldDecorator('locDetail6',{
                                initialValue: '请选择'
                            })(
                                <Select size={'default'} style={{ width: 150 }}>
                                    <Option key={'请选择'}>{'请选择'}</Option>
                                    <Option key={'未付款'}>{'未付款'}</Option>
                                    <Option key={'付款中'}>{'付款中'}</Option>
                                    <Option key={'已付款'}>{'已付款'}</Option>
                                    <Option key={'已退款'}>{'已退款'}</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="发货状态">
                            {getFieldDecorator('locDetail7',{
                                initialValue: '请选择'
                            })(
                                <Select size={'default'} style={{ width: 150 }}>
                                    <Option key={'请选择'}>{'请选择'}</Option>
                                    <Option key={'未发货'}>{'未发货'}</Option>
                                    <Option key={'配货中'}>{'配货中'}</Option>
                                    <Option key={'已发货'}>{'已发货'}</Option>
                                    <Option key={'收货确认'}>{'收货确认'}</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12} style={{display:'flex'}}>
                       <div style={{width:'20.83333333%'}}></div>
                       <div style={{width:200}}>
                            <Button type="primary" onClick={()=>{
                                let FieldsValue = getFieldsValue();
                                let {dealTime,ReceiveTime} = FieldsValue;
                                if(Array.isArray(dealTime)){
                                    for(let i =0;i<dealTime.length;i++){
                                        dealTime[i] = dealTime[i].format(dateFormat);
                                    }
                                }   
                                if(Array.isArray(ReceiveTime)){
                                    for(let i =0;i<ReceiveTime.length;i++){
                                        ReceiveTime[i] = ReceiveTime[i].format(dateFormat);
                                    }
                                }
                                for(let key in FieldsValue){
                                    if(FieldsValue[key] == '请选择'){
                                        FieldsValue[key] = '';
                                    }
                                }
                                // console.log('FieldsValue',FieldsValue);
                                this.props.getSearchData(FieldsValue);
                            }}>
                                搜索
                            </Button>
                            <Button style={{ marginLeft: 8 }}>
                                重置
                            </Button>
                       </div>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const OrderQueryForm = Form.create()(OrderQuery);
export default OrderQueryForm;

