import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Table, Input, Button, Modal, Select, message, Checkbox} from 'antd';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import '../common/style/distribute.scss';
import Title from "../common/Title";
import moment from "moment";

const {Option} = Select;
const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD HH:mm';

class AuthorizeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - - 商品授权 - - 授权明细',
      spu_id: "",
      spu_name: "",
      category: "",
      status: "",
      rowData: [],
      total: 0,
      size: 10,
      selectedRowKeys: [],
      spu_list: [],
      goods_set: [],
      goodsAuthorize: "",
      visible: false,
      visibleProfit: false,
      skuList: [],
      profit: "",
      profitAll: "",
      precent_pid: "",
      merchantNew: {},
      sku_spu_id: ""
    };
    this.handleGoodsId = this.handleGoodsId.bind(this);
    this.handleGoodsName = this.handleGoodsName.bind(this);
    this.handleAuthorize = this.handleAuthorize.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEmpty = this.handleEmpty.bind(this);
    this.handlePutAway = this.handlePutAway.bind(this);
    this.handleOnChangePagination = this.handleOnChangePagination.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.handleProfitMin = this.handleProfitMin.bind(this);
    this.handleProfitMax = this.handleProfitMax.bind(this);
    this.handleMerchandise = this.handleMerchandise.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleOkProfit = this.handleOkProfit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleProfitAll = this.handleProfitAll.bind(this);
    this.handleSku = this.handleSku.bind(this);
  }

  handleGoodsId(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    this.setState({
      spu_id: val
    })
  }

  handleGoodsName(e) {
    let val = e.target.value;
    this.setState({
      spu_name: val
    })
  }

  handleAuthorize(value) {
    this.setState({
      status: value
    }, () => {
      this.getData(1);
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

  handleSearch() {
    this.getData(1);
  }

  handleEmpty() {
    this.setState({
      spu_id: "",
      spu_name: "",
      category: "",
      store_category: "",
      profitMin: "",
      profitMax: "",
      status: "",
    }, () => {
      this.getData(1);
    })
  }

  handlePutAway() {

  }

  handleOnChangePagination(page) {
    this.getData(page)
  }

  getData(page) {
    let {size, status, spu_id, spu_name, profitMin, profitMax} = this.state;
    let grant_shop_id = this.props.match.params.id;
    httpRequest.get({
      url: sellerApi.goods.batchGrantList,
      data: {
        spu_id: spu_id,
        spu_name: spu_name,
        page: page,
        page_size: size,
        status: status,
        profit_start: profitMin,
        profit_end: profitMax,
        grant_shop_id: grant_shop_id
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
      goods_set.push(item)
    });
    this.setState({
      selectedRowKeys: selectedRowKeys,
      goods_set: goods_set,
    })
  }

  handleMerchandise() {
    let {goods_set} = this.state;
    if (goods_set.length > 0) {
      this.setState({
        visible: true
      })
    } else {
      message.warning("请选择要授权的商品!")
    }
  }

  handleAuthorizeGoods(spu_id) {
    this.setState({
      visibleProfit: true,
      sku_spu_id: spu_id,
    }, () => {
      this.getSkuList();
    })
  }

  getSkuList() {
    let {sku_spu_id} = this.state;
    let grant_shop_id = this.props.match.params.id;
    httpRequest.get({
      url: sellerApi.goods.grantGoodsDetail,
      data: {
        grant_shop_id: grant_shop_id,
        spu_id: sku_spu_id
      }
    }).then(res => {
      if (res.code == "200") {
        let skuList = res.data;
         skuList && skuList.length > 0 && skuList.map((item, index) => {
           if (item.auth_precent == 0) {
             item.auth_precent = null;
           }
         });
        this.setState({
          skuList
        })
      }
    })
  }

  handleOk() {
    let {goods_set, precent_pid} = this.state;
    if (precent_pid === "" || precent_pid === undefined) {
      message.warning("利润不能为空!");
      return
    }
    let new_spu_id_list = [];
    let grant_shop_id = this.props.match.params.id;
    let shop_id_list = [];
    shop_id_list.push(grant_shop_id);
    goods_set && goods_set.length > 0 && goods_set.map((item, index) => {
      let obj = {};
      obj.spu_id = item.spu_id;
      obj.precent_pid = precent_pid;
      new_spu_id_list.push(obj);
    });
    httpRequest.put({
      url: sellerApi.goods.shopBatchUpdate,
      data: {
        shop_id_list: shop_id_list,
        spu_data: new_spu_id_list
      }
    }).then(res => {
      if (res.code == "200") {
        message.warning("设置成功！");
        this.getData();
        this.setState({
          visible: false,
          precent_pid: "",
          goods_set: [],
          selectedRowKeys: null
        })
      }
    })
  }

  handleCancel() {
    this.setState({
      visible: false,
      visibleProfit: false,
      profitAll: ""
    })
  }

  handleOkProfit() {
    let {skuList, sku_spu_id} = this.state;
    let sale_sku_list = [];
    let grant_shop_id = this.props.match.params.id;
    skuList && skuList.length > 0 && skuList.map((item, index) => {
      let obj = {};
      if (item.auth_precent != "" || item.auth_precent != "undefined" || item.auth_precent != null) {
        obj.spu = item.spu;
        obj.identity = item.identity;
        obj.auth_precent = parseFloat(item.auth_precent);
        sale_sku_list.push(obj);
      }
    });
    httpRequest.put({
      url: sellerApi.goods.grantGoodsSkuPrecentAuthor,
      data: {
        sku_list: sale_sku_list,
        grant_shop_id: grant_shop_id,
        spu: sku_spu_id
      }
    }).then(res => {
      if (res.code == "200") {
        this.getData(1);
        skuList && skuList.length > 0 && skuList.map((item, index) => {
          let obj = {};
          obj.sale_sku_id = item.sale_sku_id;
          obj.precent_pid = "";
          sale_sku_list.push(obj)
        });
        this.setState({
          visibleProfit: false,
          profitAll: "",
          skuList: skuList
        }, () => {
          message.warning("设置成功！")
        });
      }
    })
  }

  handleProfit(index, e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    || val == 0
    if (val > 1000) {
      val = ""
    }
    let skuList = this.state.skuList;
    skuList[index].auth_precent = val;
    this.setState({
      skuList
    })
  }

  handleProfitAll(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    || val == 0
    if (val > 1000) {
      val = ""
    }
    this.setState({
      profitAll: val
    })
  }

  handleBlurProfitAll(e) {
    let skuList = this.state.skuList;
    skuList && skuList.length > 0 && skuList.map((item, index) => {
      item.auth_precent = e.target.value
    });
    this.setState({
      skuList
    })
  }

  handleSku(e) {
    let skuList = this.state.skuList;
    let newSkuList = [];
    if (e.target.checked) {
      skuList && skuList.length > 0 && skuList.map((item, index) => {
        if (item.sale_sku_id == 0) {
          newSkuList.push(item)
        }
      });
      this.setState({
        skuList: newSkuList
      })
    } else {
      this.getSkuList();
    }
  }

  componentDidMount() {
    this.getData();
    let merchantNew = JSON.parse(window.sessionStorage.getItem("merchantNew"));
    this.setState({
      merchantNew
    })
  }

  handleSpuId(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    if (val > 1000) {
      val = ""
    }
    this.setState({
      precent_pid: val
    })
  }

  toFixedFn(supply_price, precent_pid) {
    let price = (parseFloat(supply_price) * parseFloat((1 + precent_pid / 100))).toFixed(4);
    return price.substring(0, price.length - 1);
  }

  render() {
    const {titleContent, spu_id, spu_name, profitMin, profitMax, goods_set, merchantNew, visible, visibleProfit, profitAll, skuList, precent_pid, status} = this.state;
    const columns = [
      {
        title: '商品',
        dataIndex: 'spu_name',
        key: 'spu_name',
        render: (text, record) => (
          <div className="goods-news clearfix">
            <a className="action-btn" href={`shop/${record.shop_id}/goods/${record.spu_id}`} target="_blank">
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
        title: '利润区间',
        dataIndex: 'profit_start',
        key: 'profit_start',
        render: (text, record) => (
          <div>
            <div className="goods-sales-news" style={{width: 130}}>
            <span className={record.profit_start < 2 ? "tc" : null}>{record.profit_start}% ~ {record.profit_end}
              %</span>
            </div>
            <div>
              {record.sku_sale_status == 0 ? <span>未授权</span> : null}
              {record.sku_sale_status == 1 ? <span>部分SKU未授权</span> : null}
              {record.sku_sale_status == 2 ? <span>已全部授权</span> : null}
            </div>
          </div>
        )
      },
      {
        title: '供货价',
        key: 'sales',
        dataIndex: 'sales',
        render: (text, record) => (
          <div className="goods-sales-news" style={{width: 130}}>
            <span> {this.toFixedFn(record.price, record.profit_start)}元</span>
            {record.unit ? <span>/{record.unit}</span> : null}
          </div>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
          <a href="javascript:void (0);"
             onClick={this.handleAuthorizeGoods.bind(this, record.spu_id)}
             className="tc">授权商品</a>
        ),
      },
    ];
    return (
      <div className="distribute-list distribute-main">
        <Title title={titleContent}/>
        <div className="dis-con pt10">
          <div className="dis-tit">
            <div>商家名称：<span>{merchantNew ? merchantNew.seller_name : null}</span></div>
            <div>店铺名称：<span>{merchantNew ? merchantNew.shop_name : null}</span></div>
            <div>授权商品：
              <span>
                {merchantNew && merchantNew.status == 0 ? "未授权" : null}
                {merchantNew && merchantNew.status == 1 ? "授权部分商品" : null}
                {merchantNew && merchantNew.status == 2 ? "授权全部商品" : null}
              </span>
            </div>
            <div>利润区间：
              <span>
              {merchantNew ? merchantNew.profit_start : null} ~ {merchantNew ? merchantNew.profit_end : null}
              </span>
            </div>
          </div>
          <div className="search-btn">
            <span className="l-icon">商品ID</span>
            <Input className="search-input ml10" value={spu_id} onChange={this.handleGoodsId} placeholder=""/>
            <span className="ml30">商品名称</span>
            <Input className="search-input ml10" value={spu_name} onChange={this.handleGoodsName} placeholder=""/>
            <span className="ml30 l-icon">授权商品</span>
            <Select
              value={status}
              style={{width: 169}}
              className="ml10"
              onChange={this.handleAuthorize}>
              <Option value="">全部</Option>
              <Option value="0">未授权</Option>
              <Option value="1">部分SKU未授权</Option>
              <Option value="2">已全部授权</Option>
            </Select>
          </div>
          <div className="search-btn pt10">
            <span className="l-icon">利润区间</span>
            <Input className="search-input ml10" style={{width: "69px"}} value={profitMin}
                   onChange={this.handleProfitMin}/>
            <span className="ml10">~</span>
            <Input className="search-input ml10" style={{width: "69px"}} value={profitMax}
                   onChange={this.handleProfitMax}/>
            <Button type="primary" className="btn ml30" onClick={this.handleSearch}>筛选</Button>
            <Button type="default" className="btn-c ml10" onClick={this.handleEmpty}>清空筛选条件</Button>
          </div>
          <div className="dis-table-con pt10">
            <Table className="dis-table"
                   rowSelection={{
                     selectedRowKeys: this.state.selectedRowKeys,
                     onChange: this.handleRowSelection
                   }}
                   columns={columns}
                   dataSource={this.state.rowData}
                   rowKey={(record, index) => record.spu_id}
                   pagination={{
                     pageSize: this.state.size,
                     total: this.state.total,
                     onChange: this.handleOnChangePagination
                   }}/>
            <div className="batch-btn">
              <Button type="primary" className="btn" onClick={this.handleMerchandise}>授权商品</Button>
            </div>
          </div>
        </div>
        <Modal
          title="批量授权商品"
          visible={visible}
          width={400}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrapClassName="dis-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div className="mc pb10">已选 <span>{goods_set.length}</span> 个商品</div>
          <div className="pt10 pb10 c-t-a">
            <span className="m-icon">*</span>
            <span className="mc">利润</span>
            <Input className="m-input" value={precent_pid} onChange={this.handleSpuId.bind(this)} autoFocus={true}
                   placeholder="0-1000"/>
            <span className="mc">%</span>
          </div>
        </Modal>
        <Modal
          title="设置利润"
          visible={visibleProfit}
          width={800}
          onOk={this.handleOkProfit}
          onCancel={this.handleCancel}
          wrapClassName="setProfitModal"
          cancelText={'取消'}
          okText={'确定'}>
          <div className="setProfit">
            <div className="s-p-t">
              <span className="p-t-l">批量设置利润</span>
              <Input className="m-input" value={profitAll}
                     onChange={this.handleProfitAll}
                     onBlur={this.handleBlurProfitAll.bind(this)}
                     autoFocus={false} placeholder="0-1000"/> <span className="mc">%</span>
              <Checkbox onChange={this.handleSku} className="mc ml30">只看未授权的SKU</Checkbox>
            </div>
            <div className="p-h">
              <div>序号</div>
              <div className="sku">SKU</div>
              <div>售价</div>
              <div>利润</div>
              <div>供货价</div>
            </div>
            <div>
              {
                skuList && skuList.length > 0 && skuList.map((item, index) => {
                  return (
                    <div className="p-i mc" key={index}>
                      <div>{index + 1}</div>
                      <div className="sku">
                        {item.sku_attrs_name && item.sku_attrs_name.length > 0 && item.sku_attrs_name.map((param, i) => {
                          return (
                            <span key={i} title={param}>
                              <span>{param}</span>
                              {item.sku_attrs_name.length != (i + 1) ? <span>,</span> : null}
                            </span>
                          )
                        })}
                        <span
                          title={item.sku_attrs_id_list}>{item.sku_attrs_id_list ? "#" : null}{item.sku_attrs_id_list}</span>
                      </div>
                      <div>￥{item.unit_price}</div>
                      <div>
                        <Input className="m-input" value={item.auth_precent}
                               onChange={this.handleProfit.bind(this, index)} placeholder="0-1000"/> %
                      </div>
                      <div>￥{this.toFixedFn(item.unit_price, item.auth_precent)}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AuthorizeDetail;
