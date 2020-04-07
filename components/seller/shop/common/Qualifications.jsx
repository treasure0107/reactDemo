import React from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select, message, Cascader, Upload, Modal } from 'antd';
import moment from 'moment';
import { CityData } from "assets/js/city";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import OssUpload from 'components/common/OssUpload'
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
 import UploadShop from './UploadShop';
const { RangePicker } = DatePicker;
const options = CityData;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

 function getBase64(file) {
     return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => resolve(reader.result);
         reader.onerror = error => reject(error);
     });
 }
class Qualifications extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
             培训
            visibleTrain: false,
            previewVisible: false,
            previewImage: '',
            fileList: [
            ],
            reception: '1', environment: '2', equipment: '3', honor: '4'
        }
    }



    onSubmit() {
        let { validateFields, getFieldsValue } = this.props.form;
        let isOk = true;
        validateFields((err, values) => {
            if (err) {
                isOk = false;
            } else {
                values.url = `${values.reception[0].url},${values.environment[0].url},${values.equipment[0].url},${values.honor[0].url}`
                if(values.ortherPic){
                    for(let i=0;i<values.ortherPic.length;i++){
                        values.url = values.url + ',' + values.ortherPic[i].url
                    }
                }
                httpRequest.post({
                    url: sellerApi.shop.submitQualifications,
                    data:{
                         shop_id: localStorage.getItem('shopId'),
                         应后端要求该字段为 所有图片地址组合字符串逗号隔开，前4个数据依次对应页面 大门/前台 办公环境 设备 资质荣誉 ，后面为其他照片
                        pic_url:values.url,
                        apply_type: 4
                    }
                }).then(res => {
                    isOk = true;
                    this.props.getData();
                    message.success('提交成功')
                }).catch(() => {
                    isOk = false
                })
            }
        });
        return isOk;
         let FieldsValue = getFieldsValue();
    }

    handleOnChange = ({ fileList }, imgUrl) => {
        return fileList.map(file => ({
            status: file.status,
            uid: file.uid,
            url: file.url || imgUrl,   多图上传是，已上传的话，就取已上传的图片url
        }));
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div style={{ color: '#A5A5A6' }}>
                <Icon type="plus" />
                <div className="ant-upload-text" style={{ fontSize: 13 }}>添加图片</div>
            </div>
        );
        const { getFieldDecorator, getFieldsValue, setFieldsValue } = this.props.form;
        let { reception, environment, equipment, honor } = this.state;
        return (
            <div className='base-Info-box '>
                <Form className="Qualifications-form">
                    <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: 10 }}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label={'大门/前台'}>
                                        {/* {getFieldDecorator('reception', {
                                            initialValue: reception,
                                            rules: [
                                                {
                                                    required: true, message: '该图片为必传项'
                                                }
                                            ],
                                        })(<Input placeholder="" style={{ display: 'none' }} />)}
                                        <OssUpload className='shop-set-modal' /> */}
                                        {getFieldDecorator('reception',
                                            {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.handleOnChange,
                                                rules: [
                                                    {
                                                        required: true, message: '该图片为必传项',
                                                    }
                                                ],
                                            })(<OssUpload imgNumber={1} text={'上传图片'} className='shop-set-modal' />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                        <div style={{ marginRight: 10 }}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label={'办公环境'}>
                                        {/* {getFieldDecorator('environment', {
                                            initialValue: environment,
                                            rules: [
                                                {
                                                    required: true, message: '该图片为必传项'
                                                }
                                            ],
                                        })(<Input placeholder="" style={{ display: 'none' }} />)}
                                        <OssUpload className='shop-set-modal' /> */}
                                        {getFieldDecorator('environment',
                                            {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.handleOnChange,
                                                rules: [
                                                    {
                                                        required: true, message: '该图片为必传项',
                                                    }
                                                ],
                                            })(<OssUpload imgNumber={1} text={'上传图片'} className='shop-set-modal' />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        <div style={{ marginRight: 10 }}>
                            {/* <Row gutter={24}>
                            <Col span={15}>
                                <Form.Item label={'设备'}>
                                    {getFieldDecorator('address', {
                                        rules: [
                                            {
                                                required: true,
                                            }
                                        ],
                                    })(<Input placeholder="" style={{ display: 'none' }} />)}
                                     <UploadShop />
                                </Form.Item>
                            </Col>
                        </Row> */}
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label={'设备'}>
                                        {/* {getFieldDecorator('equipment', {
                                            initialValue: equipment,
                                            rules: [
                                                {
                                                    required: true, message: '该图片为必传项'
                                                }
                                            ],
                                        })(<Input placeholder="" style={{ display: 'none' }} />)}
                                        <OssUpload className='shop-set-modal' /> */}
                                        {getFieldDecorator('equipment',
                                            {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.handleOnChange,
                                                rules: [
                                                    {
                                                        required: true, message: '该图片为必传项',
                                                    }
                                                ],
                                            })(<OssUpload imgNumber={1} text={'上传图片'} className='shop-set-modal' />)}
                                    </Form.Item>
                                </Col>
                            </Row>

                        </div>

                        <div style={{ marginRight: 10 }}>
                            {/* <Row gutter={24}>
                                <Col span={15}>
                                    <Form.Item label={'资质荣誉'}>
                                        {getFieldDecorator('address', {
                                            rules: [
                                                {
                                                    required: true,
                                                }
                                            ],
                                        })(<Input placeholder="" style={{ display: 'none' }} />)}
                                    </Form.Item>
                                </Col>
                            </Row> */}
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label={'资质荣誉'}>
                                        {/* {getFieldDecorator('honor', {
                                            initialValue: honor,
                                            rules: [
                                                {
                                                    required: true, message: '该图片为必传项'
                                                }
                                            ],
                                        })(<Input placeholder="" style={{ display: 'none' }} />)}
                                        <OssUpload className='shop-set-modal' /> */}
                                        {getFieldDecorator('honor',
                                            {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.handleOnChange,
                                                rules: [
                                                    {
                                                        required: true, message: '该图片为必传项',
                                                    }
                                                ],
                                            })(<OssUpload imgNumber={1} text={'上传图片'} className='shop-set-modal' />)}
                                    </Form.Item>
                                </Col>
                            </Row>

                        </div>
                    </div>
                </Form>

                <Form className="Qualifications-form">
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item label={'其他照片'}>
                                {getFieldDecorator('ortherPic',
                                    {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.handleOnChange,
                                    })(<OssUpload imgNumber={4} text={'上传图片'} className='shop-set-modal' />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* <Row gutter={24}>
                        <Col span={24}>
                            <Col span={24}>
                                <OssUpload count={4} className='shop-set-modal' />
                            </Col>
                        </Col>
                    </Row> */}
                </Form>
                <div>
                    <section className='train-explain'>说明:
                            <div style={{ marginLeft: 8 }}>
                            <div>
                                点击方框上传相应照片; 其他照片可不上传
                                </div>
                            <div>将在2个工作日内审核您的照片</div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

export default Form.create()(Qualifications);

