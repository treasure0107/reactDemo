import React from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select, Radio, Cascader, Upload, Modal,message } from 'antd';

import 'moment/locale/zh-cn';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import OssUpload from 'components/common/OssUpload'


class ISOpicModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [
            ]
        }
    }
    handleOnChange = ({ fileList }, imgUrl) => {
        return fileList.map(file => ({
            status: file.status,
            uid: file.uid,
            url: file.url || imgUrl,   多图上传是，已上传的话，就取已上传的图片url
        }));
    };

    onSubmit = () => {
        let { validateFields, getFieldsValue } = this.props.form;
        let isOk = true;
        validateFields((err, values) => {
            if (err) {
                isOk = false;
            } else {
                values.pic_url = values.pic_url[0].url
                httpRequest.post({
                    url: sellerApi.shop.submitQualifications,
                    data:{
                         shop_id: localStorage.getItem('shopId'),
                        apply_type: 2,
                        ...values
                    }
                }).then(res => {
                    isOk = true
                    message.success('提交成功')
                    this.props.getData();

                }).catch(() => {
                    isOk = false
                })
            }
        });
        return isOk;
    }


    render() {
        const { previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div style={{color:'#A5A5A6'}}>
                <Icon type="plus" />
                <div className="ant-upload-text" style={{fontSize:13}}>添加图片</div>
            </div>
        );
        const { getFieldDecorator, getFieldsValue,setFieldsValue } = this.props.form;

        return (
            <div className='base-Info-box'>

                <Form className="order-search-form" onSubmit={this.handleSearch} labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
                    <Row gutter={24}>
                        <Col span={15}>
                            <Form.Item label={'ISO证书'}>
                            {getFieldDecorator('pic_url',
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
                </Form>
                <div style={{marginTop:4}}>
                    <section className='train-explain'>说明:
                            <div style={{ marginLeft: 8 }}>
                            <div>
                                点击方框上ISO照片;
                                </div>
                            <div>将在2个工作日内审核您的照片</div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

export default Form.create()(ISOpicModal);

