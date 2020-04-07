import React, { Component,Fragment } from 'react';
import Title from '../common/Title';
import '../common/style/evaluateList.scss';
import { Table, Rate, Input, Button, message } from 'antd';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import lang from "assets/js/language/config"
import _ from 'lodash'
const { TextArea } = Input;




class ReplyEvaluate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '评价商品',
          dataIndex: 'order_goods',
          key: 'order_goods',
          render: (text, record, index) => {
            return <div className='goods-info-table-box'>
              <img src={record && record.goods_thumb_image} className='pic-box' />

              <div>
                <div className='goods-name'>{record && record.goods_name}</div>
                <div>{record && record.sku_attrs_name}</div>
              </div>
            </div>
          }
        },

        {
          title: '评价内容',
          dataIndex: 'evaluateContent',
          key: 'evaluateContent',
          render: (text, record, index) => {
            return <div className='goods-info-evaluate-detail-box'>
              <Rate value={record.comment_status} disabled={true} />
              <div className='evaluateContent-Info margin'>{record.comment_content}</div>
              <div className='pic-list-box'>
                {
                  record.comment_pic && record.comment_pic.map((item, index) => {
                    return <img src={item.pic_url} className='pic-box' key={index}/>
                  })
                }
              </div>
            </div>
          }
        }
      ],
      dataSource: [
        {
          key: '1',
          name: '高档材质名片',
          address: 'https://www.baidu.com',
          price: 'x3,000',
          relPrice: '￥204,000',
          amount: 'x3,000',
          goodsName: '预售绽媄娅醒肤安护喷雾50ml保湿舒缓修护敏感随行装5月16日发货',
          attribute: '颜色分类：菲尔思海藻靓肤贴体验装（1片）',
          SKU: 'SKU:141561056'
        },
        {
          key: '2',
          name: '高档材质名片',
          address: 'https://www.baidu.com',
          price: 'x3,000',
          relPrice: '￥204,000',
          amount: 'x3,000',
          goodsName: '预售绽媄娅醒肤安护喷雾50ml保湿舒缓修护敏感随行装5月16日发货',
          attribute: '颜色分类：菲尔思海藻靓肤贴体验装（1片）',
          SKU: 'SKU:141561056'
        },
      ],
      data: {},
      comment_content: ''
    }
  }
  componentDidMount() {
    this.getData();
  }
  getData = (values) => {
    httpRequest.get({
      url: sellerApi.order.evaluateDetail + this.props.match.params.replyId,
      // data:{
      //     pk: this.props.match.params.replyId
      //     // user_id:parseInt(this.deleteId),
      // //    after_id:parseInt(localStorage.getItem('shopId')),
      // //    user_id:parseInt(localStorage.getItem('user_id')),
      // }
    }).then(res => {
      this.setState({
        data: res.data ? res.data : []
      })
    })
  }

  sendData = () => {
    let { data, comment_content } = this.state;
    httpRequest.post({
      url: sellerApi.order.anwserEvaluate,
      data: {
        pid: data.id,
        comment_user: data.comment_user,
        comment_content: comment_content,
        comment_id: data.comment_id,
        goods_id: data.goods_id
        // user_id:parseInt(this.deleteId),
        //    after_id:parseInt(localStorage.getItem('shopId')),
        //    user_id:parseInt(localStorage.getItem('user_id')),
      }
    }).then(res => {
      message.success('评论成功');
      this.props.history.goBack();
      // console.log('res',res)
    })
  }




  render() {
    const { dataSource, columns, data } = this.state;
    let reply_id = _.get(data,'reply_id',0);
    return (
      <div>
        <Title title={'回复买家评论'} />
        <div className='evaluate-list-page'>
          <Table rowKey={(data, index) => index} dataSource={[data]} columns={columns} pagination={false} locale={{emptyText:lang.common.tableNoData}}/>
          {
            reply_id == 0 ? <Fragment><div className='evaluate-reply-box'>回复:{_.get(data, 'comment_user', '')}</div>
              <TextArea autosize={{ minRows: 5, maxRows: 8 }} placeholder='输入回复内容' onChange={(e) => {
                this.setState({
                  comment_content: e.target.value
                })
              }} />
              <div style={{ textAlign: 'left', marginTop: 10 }}>
                <Button type="primary" onClick={this.sendData}>
                  确定回复
              </Button>
              </div></Fragment>:
              <Fragment>
                  <div className='evaluate-reply-box'>您的回复:{_.get(data, 'son_comment[0].comment_content', '')}</div>
              </Fragment>
          }
        </div>
      </div>
    )
  }
}

export default ReplyEvaluate