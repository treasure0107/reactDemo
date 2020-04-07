import React, {Component} from 'react';
import Title from '../common/Title';
import {Tabs, Input, Table, Button, Modal, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import '../common/style/goodsList.scss';
import {Link} from "react-router-dom";
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';

const Search = Input.Search;

const {TabPane} = Tabs;


class RecycleGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - - 回收站',
      rowData: [],
      is_deleted: 1,
      spu_list: [],
      selectedRowKeys: [],
      total: 0,
      size: 10,
      page: 1,
      visibleRecycle: false,
      modalIcon: "您确认要还原吗"
    };
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleOnChangePagination = this.handleOnChangePagination.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
  }

  componentDidMount() {
    this.getShopGoodsList(1)
  }

  getShopGoodsList(page) {
    let is_deleted = this.state.is_deleted;
    let goods_name = this.state.goods_name;
    httpRequest.get({
      url: sellerApi.goods.shopGoodsList,
      data: {
        goods_name: goods_name,
        is_deleted: is_deleted,
        page: page,
        size: this.state.size
      }
    }).then(res => {
      if (res.code == "200") {
        let total = res.total;
        this.setState({
          rowData: res.data,
          total
        })
      }
    })
  }

  handleSearchClick(value) {
    this.setState({
      goods_name: value
    }, () => {
      this.getShopGoodsList(1);
    })
  }

  handleRowSelection(selectedRowKeys, selectedRows) {
    let spu_list = [];
    selectedRows && selectedRows.map((item, index) => {
      spu_list.push(item.spu_id);
    });
    this.setState({
      selectedRowKeys: selectedRowKeys,
      spu_list: spu_list,
    })
  }

  handleOnChangePagination(page) {
    this.setState({
      page: page
    });
    this.getShopGoodsList(page)
  }

  restoreShopGoodsList(spu_list) {
    this.setState({
      visibleRecycle: false
    });
    httpRequest.put({
      url: sellerApi.goods.shopGoodsList,
      data: {
        spu_list: spu_list,
        is_deleted: 0,
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          selectedRowKeys: null,
          spu_list: []
        });
        this.getShopGoodsList(1);
      } else {
        message.error(res.msg)
      }
    })

  }

  restore(id) {
    let spu_list = [];
    spu_list.push(id);
    this.setState({
      visibleRecycle: true,
      modalIcon: "您确认要还原吗",
      spu_list
    });
  }

  restoreMore() {
    // setTimeout(() => {
    //   let spu_list = this.state.spu_list;
    //   let selectedRowKeys = this.state.selectedRowKeys;
    //   this.restoreShopGoodsList(spu_list, selectedRowKeys)
    // }, 600);
    let spu_list = this.state.spu_list;
    if (spu_list.length > 0) {
      this.setState({
        visibleRecycle: true,
        modalIcon: "您确认要还原您选中的商品吗",
        spu_list
      });
    } else {
      message.warning("请先选择商品！");
    }

  }

  handleOkRecycle() {
    setTimeout(() => {
      let spu_list = this.state.spu_list;
      this.restoreShopGoodsList(spu_list);
    })
  }

  handleCancel() {
    this.setState({
      visibleRecycle: false
    });
  }

  render() {
    const columns = [
      {
        title: '编号',
        dataIndex: 'goods_id',
        key: 'goods_id',
        render: text => <a href="javascript:void(0);">{text}</a>,
      },
      {
        title: '商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
        render: (text, record) => (
            <div className="goods-news">
              <div>{record.create_time}</div>
              <div className="mt5">
                <span className="goods-img">
                  <img src={record.goods_thumb_image} alt=""/>
                </span>
                <span className="goods-name">{record.goods_name}</span>
              </div>
            </div>
        ),
      },
      {
        title: '价佫',
        dataIndex: 'goods_price',
        key: 'goods_price',
        render: (text, record) => (
            <div className="goods-news">
              <div>{record.goods_price} 元</div>
            </div>
        )
      },
      {
        title: '类型',
        dataIndex: 'goods_type',
        key: 'goods_type',
        render: (text, record) => (
            <div className="fs12">
              <div className={record.audit_status == 0 ? "show" : "fcb hide"}>生产类</div>
              <div className={record.audit_status == 1 ? "show" : "fcb hide"}>库存类</div>
            </div>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
            <div>
              <a className="action-btn mb10" href="javascript:void (0);"
                 onClick={this.restore.bind(this, record.spu_id)}>
                <p><i className="iconfont iconhuanyuan"></i></p>
                <p>还原</p>
              </a>
              {/*   <Divider type="vertical"/>
              <a className="action-btn mb10" href="javascript:void (0);"
                 onClick={this.delRow.bind(this, record.spu_id, index)}>
                <p><Icon type="delete"/></p>
                <p>删除</p>
              </a>*/}
            </div>
        ),
      }
    ];
    return (
        <div className='goods-comment'>
          <Title title={this.state.titleContent}/>
          <div className="bgcf pl20 pr20 mh">
            <div className="classify-btn clearfix pt20">
              <Search placeholder="输入评论内容" onSearch={this.handleSearchClick}
                      enterButton style={{width: 300, marginBottom: 20}}/>
              <Link to="/seller/goods/goodsList">
                <Button className="add-comment" icon="arrow-left">商品列表</Button>
              </Link>
            </div>
            <div className="comment-btn">
              {/*<Button className="add" icon="delete" size="small">删除</Button>*/}
              <Button className="add" icon="eye" size="small" onClick={this.restoreMore.bind(this)}>还原</Button>
            </div>
            <Table className="goods-table"
                   rowSelection={{
                     selectedRowKeys: this.state.selectedRowKeys,
                     onChange: this.handleRowSelection
                   }}
                   columns={columns}
                   rowKey={(record, index) => index}
                   dataSource={this.state.rowData}
                   pagination={{
                     pageSize: this.state.size,
                     total: this.state.total,
                     onChange: this.handleOnChangePagination
                   }}
                   locale={{emptyText: '没有找到任何记录'}}
            />
          </div>
          <Modal
              title="确认还原"
              visible={this.state.visibleRecycle}
              width={360}
              onOk={this.handleOkRecycle.bind(this)}
              onCancel={this.handleCancel.bind(this)}
              wrapClassName="del-Modal"
              cancelText={'取消'}
              okText={'确定'}>
            <div>
              {this.state.modalIcon}？
            </div>
          </Modal>
        </div>
    )
  }
}

export default RecycleGoods;
