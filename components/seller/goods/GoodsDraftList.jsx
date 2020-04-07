import React, { Component } from 'react';
import Title from '../common/Title';
import { Tabs, Input, Table, Button, Modal, message, Divider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import '../common/style/goodsList.scss';
import { Link } from "react-router-dom";
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import moment from 'moment';
const Search = Input.Search;

const { TabPane } = Tabs;


class GoodsDraftList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - - 草稿',
      rowData: [],
      is_deleted: 1,
      spu_list: [],
      selectedRowKeys: [],
      total: 0,
      size: 10,
      page: 1,
      visibleDel: false,
      visibleDelContent: "您确认要删除吗",
      visible: false
    };
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleOnChangePagination = this.handleOnChangePagination.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
  }

  componentDidMount() {
    this.getDraftList(1)
  }

  getDraftList(page) {
    let is_deleted = this.state.is_deleted;
    let goods_name = this.state.goods_name;
    let { size } = this.state;
    httpRequest.get({
      url: sellerApi.goods.draftList,
      data: {
        page: page,
        page_size: size
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
      this.getDraftList(1);
    })
  }

  handleRowSelection(selectedRowKeys, selectedRows) {
    let spu_list = [];
    selectedRows && selectedRows.map((item, index) => {
      spu_list.push(item.draft_id);
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
    this.getDraftList(page)
  }


  delRow(id, index) {
    let spu_list = [];
    spu_list.push(id);
    this.setState({
      visibleDelContent: "您确认要删除吗",
      visibleDel: true,
      spu_list,
      delIndex: index
    });
  }

  //删除接口
  deleteDraft(spu_list, keys) {
    this.setState({
      visibleDel: false,
    });
    httpRequest.delete({
      url: sellerApi.goods.draft,
      data: {
        draft_list: spu_list,
      }
    }).then(res => {
      if (res.code == "200") {
        if (spu_list.length == 1) {
          let _data = this.state.rowData.splice(keys, 1);
          this.setState({
            rowData: this.state.rowData
          })
        }
        this.setState({
          selectedRowKeys: null
        });
        this.getDraftList(1)
      }
    })

  }

  handleOkDel() {
    let { spu_list, delIndex } = this.state;
    this.deleteDraft(spu_list, delIndex);
  }

  handleCancel() {
    this.setState({
      visibleDel: false,
      visible: false
    });
  }

  delRowMore() {
    let selectedRowKeys = this.state.selectedRowKeys;
    if (selectedRowKeys.length > 0) {
      this.setState({
        visibleDelContent: "您确认要删除您选中的商品吗",
        visibleDel: true,
      });
    } else {
      message.warning("请先选择商品！");
    }
  }
  linkToAddProduceGoods(draft_id, create_time) {
    let o_time = moment("2019-12-24 23:59:00").valueOf() / 1000;
    let c_time = moment(create_time).valueOf() / 1000;
    let time = c_time - o_time
    if (time < 0) {
      this.setState({
        visible: true
      });
    } else {
      let url = `/seller/goods/AddProduceGoods/0/${draft_id}`;
      window.open(url, "_blank")
    }
  }
  handleOkLinkTo() {
    this.setState({
      visible: false
    });
  }
  render() {
    const { titleContent, visibleDel, visibleDelContent, visible } = this.state;
    const columns = [
      {
        title: '编号',
        dataIndex: 'draft_id',
        key: 'draft_id',
        render: text => <a href="javascript:void(0);">{text}</a>,
      },
      {
        title: '商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
        render: (text, record) => (
          <div className="goods-news">
            <div>{record.update_time}</div>
            <div className="mt5">
              <span className="goods-img" style={{ background: "#ddd" }}>
                <img src={record.goods_thumb_image} alt="" />
              </span>
              <span className="goods-name">{record.goods_name}</span>
            </div>
          </div>
        ),
      },
      {
        title: '价格',
        dataIndex: 'unit_price',
        key: 'unit_price',
        render: (text, record) => (
          <div className="goods-news">
            <div className={record.unit_price ? "show" : "hide"}>{record.unit_price} 元</div>
            <div className={!record.unit_price ? "show" : "hide"}>---</div>
          </div>
        )
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
          <div>
            <a className="action-btn" href="javascript:void(0);" onClick={this.linkToAddProduceGoods.bind(this, record.draft_id, record.create_time)}>
              {/* href={`/seller/goods/AddProduceGoods/0/${record.draft_id}`} target="_blank" */}
              <p><i className="iconfont iconbianji"></i></p>
              <p>编辑草稿</p>
            </a>
            <Divider type="vertical" />
            <a className="action-btn mb10" href="javascript:void (0);"
              onClick={this.delRow.bind(this, record.draft_id, index)}>
              <p><i className="iconfont iconshanchu"></i></p>
              <p>删除</p>
            </a>
          </div>
        ),
      }
    ];
    return (
      <div className='goods-comment'>
        <Title title={titleContent} />
        <div className="bgcf pl20 pr20 mh">
          <div className="classify-btn clearfix pt20">
            {/*      <Search placeholder="商品ID/商品关键字" onSearch={this.handleSearchClick}
                    enterButton style={{width: 300, marginBottom: 20}}/>*/}
            <Link to="/seller/goods/goodsList">
              <Button className="add-comment" icon="arrow-left">商品列表</Button>
            </Link>
          </div>
          <div className="comment-btn">
            <Button className="add" size="small" onClick={this.delRowMore.bind(this)}>
              <i className="iconfont iconshanchu"></i>删除
            </Button>
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
            locale={{ emptyText: '没有找到任何记录' }}
          />
        </div>
        <Modal
          title="确认删除"
          visible={visibleDel}
          width={360}
          onOk={this.handleOkDel.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          wrapClassName="del-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div>
            {visibleDelContent}？
          </div>
        </Modal>
        <Modal
          title="提示"
          visible={visible}
          width={360}
          onOk={this.handleOkLinkTo.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          footer={null}
          wrapClassName="del-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div style={{ paddingBottom: "10px" }}>由于商品系统规格属性已更新，本草稿已过期，请删除本草稿，重新创建商品</div>
        </Modal>
      </div>
    )
  }
}

export default GoodsDraftList;
