import React from 'react';
import { Form, Row, Col, Input, Button, Icon,message } from 'antd';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';


class CusServiceModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 培训
            visibleTrain: false,
            previewVisible: false,
            fileList: [
            ]
        }
    }

    handleCancel = () => this.setState({ previewVisible: false });
    onSubmit = ()=>{
        let { validateFields, getFieldsValue } = this.props.form;
        let isOk = true;
        validateFields((err, values) => {
            if(err){
                isOk = false;
            }else{
                httpRequest.post({
                    // url: 'http://192.168.50.214:8000' + sellerApi.shop.submitQualifications,
                    url: sellerApi.shop.submitQualifications,
                    data:{
                        // shop_id: localStorage.getItem('shopId'),
                        apply_type: 1,
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

        const { getFieldDecorator, getFieldsValue,setFieldsValue } = this.props.form;

        return (
            <div className='base-Info-box'>
                <div className='cus-service-title'>培训证书</div>
                <div className='cus-service-title-next'>
                    <div>1、成就次数大于20次;</div>
                    <div>2、成交总金额大于10万元;</div>
                    <div>3、最近10次已发货订单无差评,零退款</div>
                </div>
                <Form>
                    <Form.Item label="申请理由">
                        {getFieldDecorator('reason', {
                            rules: [{ required: true, message: '申请理由不能为空' }],
                        })(<Input.TextArea rows={4}/>)}
                    </Form.Item>
                </Form>
                <div>
                    <section className='train-explain'>说明:
                            <div style={{ marginLeft: 8 }}>
                            <div>将在2个工作日内审核您的申请</div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

export default Form.create()(CusServiceModal);

