import React from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select, message, Cascader, Upload, Modal, Checkbox } from 'antd';
import OssUpload from 'components/common/OssUpload'
import api, { sellerApi } from "utils/api";
import httpRequest from "utils/ajax";
import 'moment/locale/zh-cn';

// 申请培训
class TrainingModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      trainList: null
    }
  }

  componentDidMount() {
    httpRequest.get({
      url: sellerApi.train.default,
    }).then(res => {
      this.setState({
        trainList: res.data
      })
      // console.log(res)
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        let user_name = values.username;
        let mobile = values.phone;
        let company_name = values.unit;
        httpRequest.post({
          // url:'/api/application_seller/se_store/seller_train',
          url: sellerApi.train.sellertrain,
          data: {
            user_name: user_name,
            mobile: mobile,
            company_name: company_name
          }
        }).then(res => {
          message.success('申请成功');
          setTimeout(() => {
            this.props.handleCancel();
            // window.location.reload()
          }, 1000)
          // console.log(res, '培训123')
          // alert('申请成功')
        })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { trainList } = this.state
    // console.log(this.state.trainList)
    return (
      <div className="train-modal-box">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item label={'申请人'}>
            {getFieldDecorator('username', {
              initialValue: this.state.trainList && this.state.trainList.is_submit == 0 ? this.state.trainList.user_name : null,
              rules: [{ required: true, message: '请填写申请人' }],
            })(
              <Input
                // prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="申请人"
                type="text"
              />,
            )}
          </Form.Item>
          <Form.Item label={'手机号'}>
            {getFieldDecorator('phone', {
              // initialValue: trainList && trainList.is_submit == 1 ? trainList.mobile : null,
              initialValue: this.state.trainList && this.state.trainList.is_submit == 0 ? this.state.trainList.mobile : null,
              rules: [{ required: true, message: '请填写手机号码' }],
            })(
              <Input
                // prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="text"
                placeholder="手机号"
              />,
            )}
          </Form.Item>
          <Form.Item label={'申请单位'}>
            {getFieldDecorator('unit', {
              initialValue: this.state.trainList && this.state.trainList.is_submit == 0 ? this.state.trainList.company_name : null,
              // initialValue: trainList && trainList.is_submit == 1 ? trainList.company_name : null,
              rules: [{ required: true, message: '请填写申请单位!' }],
            })(
              <Input
                // prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="text"
                placeholder="申请单位"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              申请培训
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

}

export default Form.create()(TrainingModal);
