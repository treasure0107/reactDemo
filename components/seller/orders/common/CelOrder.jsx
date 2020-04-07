import React from 'react';

import { Form, Input, Button,Row,Col } from 'antd';
const { TextArea } = Input;


class CelOrder extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.goListPage('list',values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
                <Form.Item label={'操作备注'}>
                    {getFieldDecorator('Remarks', {
                        initialValue: '',
                        rules: [{ required: true, message: '备注不能为空噢',whitespace:true }],
                    })(
                        <TextArea
                            autosize={{ minRows: 5, maxRows: 8 }}
                        />,
                    )}
                </Form.Item>
                <Form.Item label={'取消原因'}>
                    {getFieldDecorator('celReason', {
                        initialValue: '',
                        rules: [{ required: true, message: '原因不能为空',whitespace:true }],
                    })(
                        <TextArea
                            autosize={{ minRows: 5, maxRows: 8 }}
                        />,
                    )}
                </Form.Item>
                <Row>
                    <Col span={12} offset={5}>
                        (会记录在商家给客户的留言中)
                    </Col>
                </Row>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                    <Button type="primary" htmlType="submit">
                        确定
                    </Button>
                    <Button style={{marginLeft:20}} onClick={()=>{
                        this.props.goBack();
                    }}>
                        返回
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(CelOrder);


