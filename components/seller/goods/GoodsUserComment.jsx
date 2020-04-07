import React, {Component} from 'react';
import Title from '../common/Title';
import {Input, Table, Switch, Button, message, Modal} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import '../common/style/goodsList.scss';
import {Link} from "react-router-dom";
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';

const Search = Input.Search;

class GoodsUserComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - - 用户评论',
      rowData: [],
      selectedRowKeys: [],
      comment_set: [],
      total: 0,
      size: 10,
      page: 1,
      kw: "",
      visible: false,
      comment_pic: [],
      comment_content: ""
    };
    this.handleOnChangePagination = this.handleOnChangePagination.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
  }

  componentDidMount() {
    this.getGoodsComment(1);
  }

  handleSearchClick(value) {
    this.setState({
      kw: value
    }, () => {
      this.getGoodsComment(1);
    })
  }

  handleOnChangeSwitch(id, checked) {
    let status = 0;
    let comment_set = [];
    comment_set.push(id);
    if (checked) {
      status = 0;
      this.isShow(status, comment_set);
    } else {
      status = 1;
      this.isShow(status, comment_set);

    }
  }

  getGoodsComment(page) {
    let kw = this.state.kw;
    httpRequest.get({
      url: sellerApi.goods.goodsComment,
      data: {
        page: page,
        size: this.state.size,
        kw: kw
      }
    }).then(res => {
      if (res.code == "200") {
        let total = res.total;
        let list = res.data;
        if (res.data.length == 0) {
          this.setState({
            rowData: list,
            total
          });
          // message.error(res.msg)
        }
        list && list.map((item, index) => {
          item.seeDetails = 0;
          if (item.comment_pic.length > 1) {
            item.seeDetails = 1
          }
          if (item.comment_content) {
            if (this.getBlength(item.comment_content) >= 36) {
              item.seeDetails = 1
            }
          }


          this.setState({
            rowData: list,
            total
          });
        })


      } else {
        message.error(res.msg)
      }
    })
  }

  getLenStr(str) {
    for (var i = str.length, n = 0; i--;) {
      n += str.charCodeAt(i) > 255 ? 2 : 1;
    }
    return n
  }

  getBlength(str) {
    if (str) {
      for (var i = str.length, n = 0; i--;) {
        n += str.charCodeAt(i) > 255 ? 2 : 1;
      }
      return n;
    }

  }

  cutByte(str, len, endstr) {
    var len = +len
      , endstr = typeof (endstr) == 'undefined' ? "..." : endstr.toString();

    function n2(a) {
      var n = a / 2 | 0;
      return (n > 0 ? n : 1)
    } //用于二分法查找
    if (!(str + "").length || !len || len <= 0) {
      return "";
    }
    if (this.getBlength(str) <= len) {
      return str;
    } //整个函数中最耗时的一个判断,欢迎优化
    var lenS = len - this.getBlength(endstr)
      , _lenS = 0
      , _strl = 0
    while (_strl <= lenS) {
      var _lenS1 = n2(lenS - _strl)
      _strl += this.getBlength(str.substr(_lenS, _lenS1))
      _lenS += _lenS1
    }
    return str.substr(0, _lenS - 1) + endstr
  }

  getLen(isImg, str) {
    if (isImg.length > 0) {
      if (this.getBlength(str) >= 36) {
        str = this.cutByte(str, 36, '...')
      }

      return str;
    } else {
      if (this.getBlength(str) >= 50) {
        str = this.cutByte(str, 50, '...')
      }
      return str;
    }
  }

  handleOnChangePagination(page) {
    this.setState({
      page: page,
      selectedRowKeys: null
    });
    this.getGoodsComment(page)
  }

  handleRowSelection(selectedRowKeys, selectedRows) {
    let comment_set = [];
    selectedRows && selectedRows.map((item, index) => {
      comment_set.push(item.id);
    });
    this.setState({
      selectedRowKeys: selectedRowKeys,
      comment_set
    })
  }

  delMore() {
    let comment_set = this.state.comment_set;
    let page = this.state.page;
    if (comment_set) {
      if (comment_set.length == 0) {
        message.error("没有选择数据！");
        return false
      }
    }

    httpRequest.delete({
      url: sellerApi.goods.goodsComment,
      data: {
        comment_set: comment_set
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          selectedRowKeys: null
        });
        this.getGoodsComment(page);
      }
    })
  }

  isShow(select, comment_set) {
    let page = this.state.page;
    httpRequest.put({
      url: sellerApi.goods.goodsCommentBatchOperation + "/",
      data: {
        select: select,
        comment_set: comment_set
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          selectedRowKeys: null
        });
        this.getGoodsComment(page);
      }
    })
  }

  showMore() {
    let comment_set = this.state.comment_set;
    this.isShow(0, comment_set);
  }

  hideMore() {
    let comment_set = this.state.comment_set;
    this.isShow(1, comment_set);
  }

  seeDetails(comment_pic, comment_content) {
    this.setState({
      visible: true,
      comment_pic: comment_pic,
      comment_content: comment_content
    });
  }

  handleOk(e) {
    this.setState({
      visible: false,
    });
  };

  handleCancel(e) {
    this.setState({
      visible: false,
    });
  };

  render() {
    const columns = [
      {
        title: '编号',
        dataIndex: 'goods_id',
        render: text => <a href="javascript:;">{text}</a>,
      },
      {
        title: '评论者',
        dataIndex: 'comment_user',
      },
      {
        title: '评论商品',
        dataIndex: 'goods_name',
        render: (text, record) => (
          <div style={{width: "130px"}}>
            {record.goods_name}
          </div>)
      },
      {
        title: '评论内容',
        dataIndex: 'comment_content',
        render: (text, record) => (
          <div className="comment-con">
            <div className="commentImg mr5">
              {
                record.comment_pic &&
                record.comment_pic.map((item, index) => {
                  if (index == 0) {
                    return (
                      <img src={item.pic_url} alt="" key={index}/>
                    )
                  }
                })
              }
            </div>
            <div className="comment-text">
              {this.getLen(record.comment_pic, record.comment_content)}
              {record.seeDetails == 1 ?
                <a href="javascript:void(0);"
                   onClick={this.seeDetails.bind(this, record.comment_pic, record.comment_content)}
                   style={{color: "#468BEA"}}>查看详情 </a>
                : null
              }
            </div>
          </div>
        ),
      },
      {
        title: 'IP',
        dataIndex: 'user_id',
      },
      {
        title: '评论时间',
        dataIndex: 'comment_time',
      },
      {
        title: '状态',
        dataIndex: 'comment_status',
        render: (tags, record) => (
          <div style={{maxWidth: "180px"}}>
            <span className={record.comment_status == 1 ? "show" : "hide"}>差评</span>
            <span className={record.comment_status == 2 ? "show" : "hide"}>差评</span>
            <span className={record.comment_status == 3 ? "show" : "hide"}>中评</span>
            <span className={record.comment_status == 4 ? "show" : "hide"}>好评</span>
            <span className={record.comment_status == 5 ? "show" : "hide"}>好评</span>
          </div>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (tags, record) => (
          <React.Fragment>
            <div style={{maxWidth: "180px"}}>
              <Switch className="switch-btn" size="small" checked={record.is_display == 0 ? true : false}
                      onChange={this.handleOnChangeSwitch.bind(this, record.id)}/>
            </div>
            <div className="mt5"><span>显示</span></div>
          </React.Fragment>
        ),
      },
    ];
    return (
      <div className='goods-comment'>
        <Title title={this.state.titleContent}/>
        <div className="bgcf pt20 pl20 pr20 goods-main">
          <div className="classify-btn clearfix">
            <Search placeholder="输入评论内容"
                    onSearch={this.handleSearchClick.bind(this)}
                    enterButton style={{width: 300, marginBottom: 20}}/>
            <Link to="/seller/goods/addGoodsComment">
              <Button className="add-comment"><i className="iconfont icontianjia pr t2 mr10"></i>添加评论</Button>
            </Link>
          </div>
          <div className="comment-btn">
            <Button className="add" size="small" onClick={this.delMore.bind(this)}>
              <i className="iconfont iconshanchu"></i>删除</Button>
            <Button className="add" icon="eye" size="small" onClick={this.showMore.bind(this)}>显示</Button>
            <Button className="add" icon="eye-invisible" size="small" onClick={this.hideMore.bind(this)}>不显示</Button>
          </div>
          <Table className="goods-comment-table" columns={columns}
                 rowSelection={{
                   selectedRowKeys: this.state.selectedRowKeys,
                   onChange: this.handleRowSelection
                 }}
                 rowKey={(record, index) => index}
                 dataSource={this.state.rowData}
                 pagination={{
                   pageSize: this.state.size,
                   total: this.state.total,
                   onChange: this.handleOnChangePagination
                 }}
                 locale={{emptyText: '没有找到任何记录'}}/>
        </div>

        <Modal
          title="评论内容"
          visible={this.state.visible}
          width={490}
          footer={null}
          destroyOnClose={true}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          wrapClassName="comment-Modal">
          <div>
            <div className="comment-pic">
              {this.state.comment_pic &&
              this.state.comment_pic.length > 0 &&
              this.state.comment_pic.map((item, index) => {
                return (
                  <div className="item-img" key={index}>
                    <img src={item.pic_url} alt=""/>
                  </div>
                )
              })
              }
            </div>
            <div className="comment-con">{this.state.comment_content}</div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default GoodsUserComment;
