/*
* 添加商品分类弹窗
* */
import React, {Component} from 'react';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import {Modal, Button, Form, Input, Switch, Select} from 'antd';

const {Option} = Select;
const {TextArea} = Input;

class AddGoodsTypeModalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      id: '',
      list: []
    }
  }

  componentDidMount() {
    this.getStoreClassify();
  }

  getStoreClassify() {
    httpRequest.get({
      url: sellerApi.goods.storeClassifyClassificationQuery,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          list: res.data
        })

      }
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.classifyStatus("1");
      if (!err) {
        if (values.nav_is_show == false) {
          values.nav_is_show = 0;
        } else {
          values.nav_is_show = 1;
        }
        httpRequest.post({
          url: sellerApi.goods.storeClassify,
          data: values
        }).then(res => {
          if (res.code == "200") {
            this.setState({
              visible: false,
            });
          }
        })
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
        <div className="displayInlineBlock">
          <span className="ml16 add-goods-type" onClick={this.showModal}>添加 </span>
          <Modal
              title="添加分类"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width={600}
              footer={null}
              wrapClassName={'goods-type-modal'}
          >
            <div className="mt30">
              <Form className="order-search-form" onSubmit={this.handleSubmit} labelCol={{span: 5}}
                    wrapperCol={{span: 18}}>
                <Form.Item label={'分类名称：'}>
                  {getFieldDecorator('category_name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入分类名称!',
                      },
                    ],
                  })(<TextArea rows={4} placeholder=""/>)}
                </Form.Item>
                <Form.Item label="上级分类：">
                  {getFieldDecorator('parent_id', {})(
                      <Select size={'default'} style={{width: 150}}>
                        <Option value="0" key={'请选择'}>请选择</Option>
                        {
                          this.state.list.map((item, index) => {
                            return (
                                <Option value={item.value}
                                        key={item.value}>{item.title}</Option>
                            )
                          })
                        }

                      </Select>
                  )}
                </Form.Item>
                <Form.Item label={'排序：'}>
                  {getFieldDecorator('sort', {
                    rules: [
                      {
                        message: 'Input something!',
                      },
                    ],
                  })(<Input placeholder=""/>)}
                  <span>值越小，显示时排序越靠前</span>
                </Form.Item>
                <Form.Item label={'店铺导航显示：'}>
                  {getFieldDecorator('nav_is_show', {valuePropName: 'checked'})(<Switch/>)}
                </Form.Item>

                <Form.Item label={'关键字：'}>
                  {getFieldDecorator('keyword', {
                    rules: [
                      {
                        message: 'Input something!',
                      },
                    ],
                  })(<Input placeholder=""/>)}
                </Form.Item>
                <Form.Item wrapperCol={{span: 12, offset: 6}}>
                  <Button type="primary" htmlType="submit">
                    确定
                  </Button>

                  <Button style={{marginLeft: 8}}>
                    重置
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Modal>
        </div>
    );
  }
}

const AddGoodsTypeModal = Form.create()(AddGoodsTypeModalForm);
export default AddGoodsTypeModal;