import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Title from '../common/Title';
import {Form, Input, Rate, Button, Select, Row, Col, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import OssUpload from 'components/common/OssUpload';
import '../common/style/goodsList.scss';
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js';

const {Option} = Select;
const {TextArea} = Input;

class AddGoodsCommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - - 新增评论',
      desc: ['很差', '差', '一般', '好评', '非常好'],
      rowData: [],
      comment_pic: [],
      fileList: [],
      url: '',
      comment_status: 5
    };
    this.handleChangeRate = this.handleChangeRate.bind(this)
  }

  componentDidMount() {
    this.getShopGoodsList();
  }

  getShopGoodsList() {
    httpRequest.get({
      url: sellerApi.goods.shopGoodsList,
      data: {
        page: 1,
        size: 500
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          rowData: res.data
        })
      }
    })
  }

  uploadCallBack(url) {
    this.setState({
      list: [...this.state.list, url],
    })
  }

  deleteImg(name) {
    this.props.setFieldsValue({
      [name]: ''
    })
  }

  handleChangeRate(value) {
    this.setState({comment_status: value});
  }

  goodsComment(commentData) {
    httpRequest.post({
      url: sellerApi.goods.goodsComment + "/",
      data: commentData
    }).then(res => {
      if (res.code == "200") {
        this.props.history.push(`/seller/goods/goodsUserComment`);
      }
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.comment_status = this.state.comment_status;
        if (this.state.comment_status == 0) {
          message.warning("评论星级必选！")
          return false
        }
        let commentData = {};
        commentData.type_id = 1;
        commentData.comment_list = [];
        commentData.comment_list.push(values);
        let imglist = [];
        values.comment_pic && values.comment_pic.map((item, index) => {
          let obj = {};
          obj.pic_url = item.url;
          imglist.push(obj)
        });
        values.comment_pic = imglist;
        let content = values.comment_content;
        let tit = "评论内容";
        if (!comUtil.isEmpty(content)) {
          this.apiVerify(content, tit, commentData);
        } else {
          this.goodsComment(commentData)
        }

      }
    });
  };

  handlePreview(val) {
  }

  handleOnChangeUpload({fileList}, imgUrl) {
    return fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.url || imgUrl,  // 多图上传是，已上传的话，就取已上传的图片url
    }));
  };

  apiVerify(content, tit, commentData) {
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
              this.goodsComment(commentData)
            }
          });
        } else {
          this.goodsComment(commentData)
        }
      }
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {desc, value} = this.state;
    return (
      <div>
        <Title title={this.state.titleContent}/>
        <div className="bgcf pt20 pl20 pr20 pb20">
          <div className="mt30">
            <Form className="order-search-form" onSubmit={this.handleSubmit} labelCol={{span: 5}}
                  wrapperCol={{span: 18}}>
              <Form.Item label="选择商品：">
                {getFieldDecorator('goods_id', {
                  rules: [{required: true, message: '请选择商品!'}],
                  initialValue: ''
                })(
                  <Select size={'default'} style={{width: 230}}>
                    <Option value="" key={'请选择'}>请选择</Option>
                    {
                      this.state.rowData &&
                      this.state.rowData.map((item, index) => {
                        return (
                          <Option value={item.goods_id} key={index}>{item.goods_name}</Option>
                        )
                      })
                    }

                  </Select>
                )}
              </Form.Item>

              <Form.Item label="评论星级:">
                {getFieldDecorator('comment_status', {
                  rules: [{required: true, message: '请选择评论星级!'}],
                  initialValue: this.state.comment_status,
                })(<span><Rate tooltips={desc} onChange={this.handleChangeRate} value={this.state.comment_status}/>
                  {value ? <span className="ant-rate-text">{desc[value - 1]}</span> : ''}
                                </span>)}
              </Form.Item>
              <Form.Item label="上传图片:" extra="">
                {getFieldDecorator('comment_pic', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.handleOnChangeUpload
                })(<OssUpload imgNumber={5} text={"上传图片"}/>,
                )}
              </Form.Item>

              <Form.Item label={'评论内容:'}>
                {getFieldDecorator('comment_content', {
                  rules: [{required: true, message: '请输入评论内容!'}],
                })(<TextArea rows={4} style={{width: 300}} placeholder=""/>)}
              </Form.Item>
              <Form.Item wrapperCol={{span: 12, offset: 6}}>
                <Button type="primary" htmlType="submit">确定</Button>
                <Link to="/seller/goods/goodsUserComment" style={{marginLeft: 8}}>
                  <Button className="add-comment">取消</Button>
                </Link>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const AddGoodsComment = Form.create()(AddGoodsCommentForm);

export default AddGoodsComment;