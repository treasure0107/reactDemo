import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Title from '../common/Title';
import {Form, Input, Switch, Button, Select, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import '../common/style/goodsList.scss';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js';

const {Option} = Select;
const {TextArea} = Input;


class AddGoodsClassifyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - - 店内分类',
      tit: "添加分类",
      id: '',
      list: [],
      classifyData: {
        category_name: '',
        sort: 1,
        shop_id: "",
        parent_id: 0,
        nav_is_show: true,
        keyword: "",
      }
    }
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    if (this.props.match.params.id != 0) {
      this.setState({
        id: id,
        tit: "编辑分类"
      })
    }
    this.getStoreClassify();
    if (id != 0) {
      this.getEditData(id)
    }

  }

  getEditData(seller_category_id) {
    httpRequest.get({
      url: sellerApi.goods.storeClassify + seller_category_id,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        if (res.data.nav_is_show == 0) {
          res.data.nav_is_show = false;
        } else {
          res.data.nav_is_show = true;
        }
        this.setState({
          classifyData: res.data
        })
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.nav_is_show == false) {
          values.nav_is_show = 0;
        } else {
          values.nav_is_show = 1;
        }
        if (this.state.id == 0) {
          httpRequest.post({
            url: sellerApi.goods.storeClassify,
            data: values
          }).then(res => {
            if (res.code == "200") {
              this.props.history.push(`/seller/goods/goodsStoreClassify`);
            }
          })
        } else {
          httpRequest.put({
            url: sellerApi.goods.storeClassify + this.state.id + "/",
            data: values
          }).then(res => {
            if (res.code == "200") {
              message.success(res.msg);
              this.props.history.push(`/seller/goods/goodsStoreClassify`);
            }
          })
        }
      }
    });
  };

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

  render() {
    const {getFieldDecorator} = this.props.form;
    const {classifyData} = this.state;
    return (
      <div className="goods-classify goods-main">
        <Title title={this.state.titleContent}/>
        <div className="bgcf pt20 pl20 pr20 pb20">
          <div className="clearfix">
            <span>  {this.state.tit} </span>
            <Link to="/seller/goods/goodsStoreClassify" className="fr">
              <Button className="add-comment" icon="arrow-left">返回店内分类</Button>
            </Link>
          </div>
          <div className="mt30">
            <Form className="order-search-form" onSubmit={this.handleSubmit} labelCol={{span: 5}}
                  wrapperCol={{span: 6}}>
              <Form.Item label={' 分类名称：'}>
                {getFieldDecorator('category_name', {
                  initialValue: classifyData.category_name,
                  validateTrigger: ['onBlur'],
                  rules: [
                    {
                      required: true,
                      message: '请输入分类名称!',
                      validator: shopsNameValidate
                    },
                  ],
                })(<TextArea rows={1} maxLength={6} placeholder="请输入"/>)}
              </Form.Item>
              <Form.Item label="上级分类：">
                {getFieldDecorator('parent_id', {
                  initialValue: classifyData.parent_id,
                  value: classifyData.parent_id
                })(
                  <Select size={'default'} style={{width: 190}}>
                    <Option value={0} key={'请选择'}>请选择</Option>
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
                  initialValue: classifyData.sort,

                })(<Input placeholder="" type="number"/>)}
                <span>值越小，显示时排序越靠前</span>
              </Form.Item>
              <Form.Item label={'店铺导航显示：'}>
                {getFieldDecorator('nav_is_show', {
                  initialValue: classifyData.nav_is_show,
                  valuePropName: 'checked'
                })
                (<Switch className="switch-btn"
                         size="small"/>)}
              </Form.Item>
              <Form.Item label={'关键字：'}>
                {getFieldDecorator('keyword', {
                  initialValue: classifyData.keyword,
                  validateTrigger: ['onBlur'],
                  rules: [
                    {
                      validator: shopskeywordValidate
                    },
                  ],
                })(<Input placeholder=""/>)}
              </Form.Item>
              <Form.Item wrapperCol={{span: 12, offset: 6}}>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
                <Button style={{marginLeft: 8}} onClick={this.handleReset}>
                  重置
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const shopsNameValidate = (rule, value, callback) => {
  let tit = "分类名称";
  let content = value;
  httpRequest.get({
    url: sellerApi.goods.getStore,
    data: {}
  }).then(res => {
    if (res.code == "200") {
      let auto_reg_sensitive_words = res.data.auto_reg_sensitive_words;
      let auto_reg_pron = res.data.auto_reg_pron;
      if (auto_reg_sensitive_words == 1 && auto_reg_pron == 1) {
        comUtil.wordsVerify(content, (wordsVerify) => {
          if (wordsVerify == "block") {
            message.error("你输的" + tit + "内容不规范");
          } else {
            callback()
          }
        });
      } else {
        callback()
      }
    }
  });
};

const shopskeywordValidate = (rule, value, callback) => {
  let tit = "关键字";
  let content = value;
  if (!comUtil.isEmpty(content)) {
    httpRequest.get({
      url: sellerApi.goods.getStore,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        let auto_reg_sensitive_words = res.data.auto_reg_sensitive_words;
        let auto_reg_pron = res.data.auto_reg_pron;
        if (auto_reg_sensitive_words == 1 && auto_reg_pron == 1) {
          comUtil.wordsVerify(content, (wordsVerify) => {
            if (wordsVerify == "block") {
              message.error("你输的" + tit + "内容不规范");
            } else {
              callback()
            }
          });
        } else {
          callback()
        }
      }
    });
  } else {
    callback()
  }

};
const AddGoodsClassify = Form.create()(AddGoodsClassifyForm);
export default AddGoodsClassify;