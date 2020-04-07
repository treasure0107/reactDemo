import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Table, Input, Button, Modal, Select, message, Tooltip} from 'antd';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import '../common/style/distribute.scss';
import Title from "../common/Title";
import moment from 'moment';

const {Option} = Select;
const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD HH:mm';

class GoodsAuthorization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - - 商品授权',
      shop_name: "",
      seller_name: "",
      rowData: [],
      rowList: [],
      total: 0,
      totalBatch: 0,
      size: 10,
      sizeBatch: 10,
      selectedRowKeys: [],
      selectedRowKeysModal: [],
      spu_id_list: [],
      goods_set: [],
      visible: false,
      visibleCancel: false,
      merchant_name: "",
      status: "",
      profitMin: "",
      profitMax: "",
      profitAll: "",
      spu_id: "",
      spu_name: "",
    };
    this.handleStoreName = this.handleStoreName.bind(this);
    this.handleGoodsName = this.handleGoodsName.bind(this);
    this.handleMerchant = this.handleMerchant.bind(this);
    this.handleProfitMin = this.handleProfitMin.bind(this);
    this.handleProfitMax = this.handleProfitMax.bind(this);
    this.handleOkMerchantStore = this.handleOkMerchantStore.bind(this);
    this.handleCancelMerchantStore = this.handleCancelMerchantStore.bind(this);
    this.handleAuthorize = this.handleAuthorize.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEmpty = this.handleEmpty.bind(this);
    this.handlePutAway = this.handlePutAway.bind(this);
    this.handleOnChangePagination = this.handleOnChangePagination.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.handleRowSelectionModal = this.handleRowSelectionModal.bind(this);
    this.handleOnChangePaginationModal = this.handleOnChangePaginationModal.bind(this);
    this.handleProfitAll = this.handleProfitAll.bind(this);
  }

  handleStoreName(e) {
    let val = e.target.value;
    this.setState({
      shop_name: val
    })
  }

  handleProfitMin(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    this.setState({
      profitMin: val
    })
  }

  handleProfitMax(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    this.setState({
      profitMax: val
    })
  }

  handleGoodsName(e) {
    let val = e.target.value;
    this.setState({
      seller_name: val
    })
  }

  handleAuthorize(value) {
    this.setState({
      status: value
    }, () => {
      this.getData(1);
    })
  }

  handleSearch() {
    this.getData(1);
  }

  handleEmpty() {
    this.setState({
      shop_name: "",
      seller_name: "",
      status: "",
      profitMin: "",
      profitMax: "",
    }, () => {
      this.getData(1);
    });
  }

  handlePutAway() {

  }

  handleOnChangePagination(page) {
    this.getData(page)
  }

  getData(page) {
    let {size, shop_name, seller_name, status, profitMin, profitMax} = this.state;
    httpRequest.get({
      url: sellerApi.goods.saleGrantShop,
      data: {
        seller_name: seller_name,
        shop_name: shop_name,
        status: status,
        profit_start: profitMin,
        profit_end: profitMax,
        page: page,
        page_size: size,
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

  handleRowSelection(selectedRowKeys, selectedRows) {
    let goods_set = [];
    selectedRows && selectedRows.map((item, index) => {
      goods_set.push(item.shop)
    });
    this.setState({
      selectedRowKeys: selectedRowKeys,
      goods_set: goods_set,
    })
  }


  handleOkMerchantStore() {
    let {spu_id_list} = this.state;
    if (spu_id_list.length > 0) {
      this.shopBatchUpdate();
    } else {
      message.warning("请先选择需要设置的商品！")
    }
  }

  handleCancelMerchantStore() {
    this.setState({
      visible: false
    })
  }

  handleProfitAll(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    this.setState({
      profitAll: val
    })
  }

  handleBlurProfitAll(e) {
    let rowList = this.state.rowList;
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    rowList && rowList.length > 0 && rowList.map((item, index) => {
      item.precent_pid = val;
    });
    this.setState({
      rowList
    })
  }

  handleMerchant() {
    let {goods_set} = this.state;
    if (goods_set.length > 0) {
      this.getBatchGrantList(1);
      this.setState({
        visible: true
      })
    } else {
      message.warning("请选择授权店铺！")
    }
  }

  handleGoodsId(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    this.setState({
      spu_id: val
    })
  }

  handleSpuName(e) {
    this.setState({
      spu_name: e.target.value
    })
  }

  handleSearchModal() {
    this.getBatchGrantList(1);
  }

  handleEmptyModal() {
    this.setState({
      spu_id: "",
      spu_name: ""
    }, () => {
      this.getBatchGrantList(1);
    })
  }

  getBatchGrantList(page) {
    let {sizeBatch, spu_id, spu_name} = this.state;
    httpRequest.get({
      url: sellerApi.goods.batchGrantList,
      data: {
        page: page,
        page_size: sizeBatch,
        spu_id: spu_id,
        spu_name: spu_name
      }
    }).then(res => {
      if (res.code == "200") {
        let totalBatch = res.total;
        this.setState({
          rowList: res.data,
          totalBatch
        })
      }
    })
  }

  handleProfit(spu_id, e) {
    let rowList = this.state.rowList;
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    if (val > 1000) {
      val = ""
    }
    rowList && rowList.length > 0 && rowList.map((item, index) => {
      if (spu_id == item.spu_id) {
        item.precent_pid = val
      }
    });
    this.setState({
      rowList: rowList
    })
  }

  shopBatchUpdate() {
    let {goods_set, spu_id_list, profitAll} = this.state;
    let new_spu_id_list = [];
    spu_id_list && spu_id_list.length > 0 && spu_id_list.map((item, index) => {
      let obj = {};
      obj.spu_id = item.spu_id;
      obj.precent_pid = item.precent_pid;
      new_spu_id_list.push(obj);
    });
    httpRequest.put({
      url: sellerApi.goods.shopBatchUpdate,
      data: {
        shop_id_list: goods_set,
        spu_data: new_spu_id_list
      }
    }).then(res => {
      if (res.code == "200") {
        message.warning("设置成功！");
        this.getData();
        this.setState({
          visible: false,
          goods_set: [],
          spu_id_list: [],
          selectedRowKeys: null,
          selectedRowKeysModal: null
        })
      }
    })
  }

  handleRowSelectionModal(selectedRowKeys, selectedRows) {
    let spu_id_list = [];
    selectedRows && selectedRows.map((item, index) => {
      spu_id_list.push(item)
    });
    this.setState({
      selectedRowKeysModal: selectedRowKeys,
      spu_id_list: spu_id_list,
    })
  }

  handleOnChangePaginationModal(page) {
    this.getBatchGrantList(page)
  }

  componentDidMount() {
    this.getData();
  }

  handleLinkTo(id, record) {
    let merchantNew = JSON.stringify(record);
    window.sessionStorage.setItem("merchantNew", merchantNew);
    this.props.history.push(`/seller/goods/AuthorizeDetail/${id}`);
  }

  toFixedFn(supply_price, precent_pid) {
    let price = (parseFloat(supply_price) * parseFloat((1 + precent_pid / 100))).toFixed(4);
    return price.substring(0, price.length - 1);
  }

  render() {
    const {titleContent, shop_name, seller_name, profitMin, profitMax, visible, status, profitAll, spu_id, spu_name, goods_set} = this.state;
    const columns = [
      {
        title: '商家名称',
        dataIndex: 'seller_name',
        key: 'seller_name',
      },
      {
        title: '店铺名称',
        dataIndex: 'shop_name',
        key: 'shop_name',
      },
      {
        title: '授权商品',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          <div className="fs12">
            <div className={record.status == 0 ? "show" : "hide"}>未授权</div>
            <div className={record.status == 1 ? "show" : "hide"}>授权部分商品</div>
            <div className={record.status == 2 ? "show" : "hide"}>授权全部商品</div>
          </div>
        )
      },
      {
        title: '利润区间',
        key: 'profit_start',
        dataIndex: 'profit_start',
        render: (text, record) => (
          <div className="goods-sales-news" style={{width: 130}}>
            <span
              className={record.profit_start < 2 ? "tc" : null}>{record.profit_start}% ~ {record.profit_end}%</span>
          </div>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
          <a href="javascript:void(0);" onClick={this.handleLinkTo.bind(this, record.shop, record)} className="tc">
            授权明细
          </a>
        ),
      },
    ];
    const columnsModal = [
      {
        title: ' 商品',
        dataIndex: 'spu_name',
        key: 'spu_name',
        render: (text, record) => (
          <div className="goods-news clearfix">
            <a className="action-btn" href={`//shop/${record.shop_id}/goods/${record.spu_id}`} target="_blank">
              <div className="goods-img" style={{backgroundImage: "url(" + record.goods_thumb_image + ")"}}></div>
            </a>
            <div className="goods-c">
              <p className="goods-n" title={record.spu_name}>{record.spu_name}</p>
              <p className="goods-n" title={record.category_tree}>类目:{record.category_tree}</p>
              <p className="goods-n">商品ID：{record.spu_id}</p>
              <p className="goods-n tc">{record.price}元 </p>
            </div>
          </div>
        ),
      },
      {
        title: '上传时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (text, record) => (
          <div className="goods-news">
            <span>{moment.unix(record.create_time).format(dateFormat)}</span>
          </div>
        )
      },
      {
        title: '利润',
        dataIndex: 'precent_pid',
        key: 'precent_pid',
        render: (text, record) => (
          <div>
            <Input className="p-input" value={record.precent_pid} onChange={this.handleProfit.bind(this, record.spu_id)}
                   placeholder="" maxLength={4}/> %
          </div>
        ),
      },
      {
        title: '供货价',
        key: 'goods_price',
        dataIndex: 'goods_price',
        render: (text, record) => (
          <div className="goods-sales-news" style={{width: 130}}>
            <span>{this.toFixedFn(record.price, record.precent_pid)} 元</span>
          </div>
        ),
      },
    ];
    return (
      <div className="distribute-list">
        <Title title={titleContent}/>
        <div className="dis-con pt10">
          <div className="search-btn mt10 pt10 pb10">
            <span className="ml10 mr10">商家名称</span>
            <Input className="search-input ml16" value={seller_name} onChange={this.handleGoodsName} placeholder=""/>
            <span className="ml30">店铺名称</span>
            <Input className="search-input ml10" value={shop_name} onChange={this.handleStoreName} placeholder=""/>
            <span className="ml30 l-icon">授权商品</span>
            <Select
              value={status}
              style={{width: 169}}
              className="ml10"
              onChange={this.handleAuthorize}>
              <Option value="">全部</Option>
              <Option value="0">未授权</Option>
              <Option value="1">授权部分商品</Option>
              <Option value="2">已授权全部商品</Option>
            </Select>
          </div>
          <div className="search-btn mt10 pb10">
            <span className="ml10">利润区间</span>
            <Input className="search-input ml10" style={{width: "69px"}} value={profitMin}
                   onChange={this.handleProfitMin}/>
            <span className="ml10">~</span>
            <Input className="search-input ml10" style={{width: "69px"}} value={profitMax}
                   onChange={this.handleProfitMax}/>
            <Button type="primary" icon="search" className="btn ml30" onClick={this.handleSearch}>筛选</Button>
            <Button type="default" className="btn-c ml10" onClick={this.handleEmpty}>清空筛选条件</Button>
          </div>
          <div className="dis-table-con ">
            <Table className="dis-table"
                   rowSelection={{
                     selectedRowKeys: this.state.selectedRowKeys,
                     onChange: this.handleRowSelection
                   }}
                   columns={columns}
                   dataSource={this.state.rowData}
                   rowKey={(record, index) => record.grant_shop_id}
                   pagination={{
                     pageSize: this.state.size,
                     total: this.state.total,
                     onChange: this.handleOnChangePagination
                   }}/>
            <div className="batch-btn">
              <Button type="primary" className="btn" onClick={this.handleMerchant}>授权店铺</Button>
            </div>
          </div>
        </div>
        <Modal
          title="授权商家"
          visible={visible}
          width={1000}
          onOk={this.handleOkMerchantStore}
          onCancel={this.handleCancelMerchantStore}
          wrapClassName="store-Modal"
          cancelText={'取消'}
          okText={'确定'}
          footer={false}>
          <div>
            <div className="pb10">已选 <span>{goods_set.length}</span>家店铺</div>
            <div>
              <span>商品ID</span>
              <Input className="m-input" value={spu_id} onChange={this.handleGoodsId.bind(this)} placeholder=""/>
              <span className="ml15">商品名称</span>
              <Input className="m-input" value={spu_name} onChange={this.handleSpuName.bind(this)} placeholder=""/>
              <Button type="primary" icon="search" className="btn ml15"
                      onClick={this.handleSearchModal.bind(this)}>筛选</Button>
              <Button type="default" className="btn-c ml10" onClick={this.handleEmptyModal.bind(this)}>清空筛选条件</Button>
            </div>
            <div className="table-con">
              <Table className="dis-table-modal"
                     rowSelection={{
                       selectedRowKeys: this.state.selectedRowKeysModal,
                       onChange: this.handleRowSelectionModal
                     }}
                     columns={columnsModal}
                     dataSource={this.state.rowList}
                     rowKey={(record, index) => record.spu_id}
                     scroll={{y: 500}}
                     pagination={{
                       pageSize: this.state.sizeBatch,
                       total: this.state.totalBatch,
                       onChange: this.handleOnChangePaginationModal,
                       hideOnSinglePage: true
                     }}/>
              <div className="s-p-t">
                <Input className="m-input" value={profitAll} placeholder="批量设置" maxLength={4}
                       onChange={this.handleProfitAll} onBlur={this.handleBlurProfitAll.bind(this)}
                       autoFocus={true}/>
                <span className="mc m-i">%</span>
                <Button type="default" className="btn-c ml10" onClick={this.handleCancelMerchantStore}>取消</Button>
                <Button type="primary" className="btn ml15" onClick={this.handleOkMerchantStore}>确定</Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default GoodsAuthorization;
