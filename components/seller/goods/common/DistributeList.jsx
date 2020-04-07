import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Table, Input, Button, Modal, Select, message, Tooltip} from 'antd';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';

const {Option} = Select;
const Search = Input.Search;

class DistributeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goods_id: "",
      goods_name: "",
      category: "",
      rowData: [],
      total: 0,
      size: 10,
      selectedRowKeys: [],
      goods_set: [],
      visible: false,
      visibleProfit: false,
      skuList: [],
      profit: "",
      profitAll: "",
      precent_pid: "",
      unit: "",
      sale_goods_id: ""
    };
    this.handleGoodsId = this.handleGoodsId.bind(this);
    this.handleGoodsName = this.handleGoodsName.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEmpty = this.handleEmpty.bind(this);
    this.handlePutAway = this.handlePutAway.bind(this);
    this.handleOnChangePagination = this.handleOnChangePagination.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleOkProfit = this.handleOkProfit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleProfitAll = this.handleProfitAll.bind(this);
    this.handleProfit = this.handleProfit.bind(this);
  }

  handleGoodsId(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    this.setState({
      goods_id: val
    })
  }

  handleGoodsName(e) {
    let val = e.target.value;
    this.setState({
      goods_name: val
    })
  }

  handleCategory(e) {
    let val = e.target.value;
    this.setState({
      category: val
    })
  }

  handleSearch() {
    this.getData(1)
  }

  handleEmpty() {
    this.setState({
      goods_id: "",
      goods_name: "",
      category: "",
    }, () => {
      this.getData(1)
    })
  }

  handlePutAway() {
    let {goods_set} = this.state;
    if (goods_set.length > 0) {
      this.setState({
        visible: true
      })
    } else {
      message.warning("请选择要上架到店铺的分销商品")
    }
  }

  getSkuList(id, spu_id) {
    httpRequest.get({
      url: sellerApi.goods.getSkuList,
      data: {
        sale_goods_id: id,
        type_id: 0,
        spu_id: spu_id
      }
    }).then(res => {
      if (res.code == "200") {
        let skuList = res.data;
        skuList && skuList.length > 0 && skuList.map((item, index) => {
          if (item.precent_pid == 0) {
            item.precent_pid = null;
          }
        });
        this.setState({
          skuList
        })
      }
    })
  }

  handleAuthorizeGoods(id, unit, spu_id) {
    this.getSkuList(id, spu_id);
    this.setState({
      visibleProfit: true,
      sale_goods_id: id,
      unit
    })
  }

  handleAddPrice(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    if (val > 1000 || val == 0) {
      val = ""
    }
    this.setState({
      precent_pid: val
    })
  }

  saleGoodsBatchUpdate() {
    let {precent_pid, goods_set} = this.state;
    if (precent_pid === "" || precent_pid === undefined) {
      message.warning("加价内容不能为空！");
      return
    }
    httpRequest.put({
      url: sellerApi.goods.saleGoodsBatchUpdate,
      data: {
        sale_goods_id_list: goods_set,
        goods_type: 0,
        precent_pid: parseFloat(precent_pid),
        is_set_precent_pid: 1
      }
    }).then(res => {
      if (res.code == "200") {
        this.getData(1);
        this.setState({
          visible: false,
          selectedRowKeys: null,
          precent_pid: ""
        })
      }
    })
  }

  handleOnChangePagination(page) {
    this.getData(page)
  }

  getData(page) {
    let {size, goods_id, goods_name, category} = this.state;
    httpRequest.get({
      url: sellerApi.goods.saleGoods,
      data: {
        goods_id: goods_id,
        goods_name: goods_name,
        shop_category_id: "",
        category_name: category,
        goods_type: 0,
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

  handleRowSelection(selectedRowKeys, selectedRows) {
    let goods_set = [];
    selectedRows && selectedRows.map((item, index) => {
      goods_set.push(item.sale_goods_id)
    });
    this.setState({
      selectedRowKeys: selectedRowKeys,
      goods_set: goods_set,
    })
  }

  handleOk() {
    this.saleGoodsBatchUpdate();
  }

  handleCancel() {
    this.setState({
      visible: false,
      visibleProfit: false,
    })
  }

  handleOkProfit() {
    let sale_sku_list = [];
    let skuList = this.state.skuList;
    let sale_goods_id = this.state.sale_goods_id;
    let flag = false;
    skuList && skuList.length > 0 && skuList.map((item, index) => {
      let obj = {};
      obj.sale_sku_id = item.sale_sku_id;
      obj.precent_pid = parseFloat(item.precent_pid);
      sale_sku_list.push(obj);
      if (item.precent_pid === "" || item.precent_pid === "undefined" || item.precent_pid === null) {
        flag = true;
      } else if (item.precent_pid == 0) {
        flag = false;
      }
    });
    if (flag) {
      message.warning("设置利润不能为空！");
      return false
    }
    httpRequest.put({
      url: sellerApi.goods.saleGoods + "update_sale_goods/" + "?sale_goods_id=" + sale_goods_id,
      data: {
        goods_sale_sku_list: sale_sku_list,
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
    if (val > 1000 || val == 0) {
      val = ""
    }
    let skuList = this.state.skuList;
    skuList[index].precent_pid = val;
    this.setState({
      skuList
    })
  }

  handleProfitAll(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    if (val > 1000 || val == 0) {
      val = ""
    }
    this.setState({
      profitAll: val,
    })
  }

  handleBlurProfitAll(e) {
    let skuList = this.state.skuList;
    skuList && skuList.length > 0 && skuList.map((item, index) => {
      item.precent_pid = e.target.value
    });
    this.setState({
      skuList
    })
  }

  componentDidMount() {
    if (this.props.activeKey == '1') {
      this.getData();
    }

  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.activeKey == '1' && nextProps.activeKey != this.props.activeKey) {
      this.getData();
    }
  }

  toFixedFn(supply_price, precent_pid) {
    let price = (parseFloat(supply_price) * parseFloat((1 + precent_pid / 100))).toFixed(4);
    return price.substring(0, price.length - 1);
  }

  render() {
    const {goods_id, goods_name, category, visible, visibleProfit, skuList, profitAll, profit, precent_pid, unit} = this.state;
    const columns = [
      {
        title: '商品',
        dataIndex: 'goods_name',
        key: 'goods_name',
        render: (text, record) => (
          <div className="goods-news clearfix">
            <div className="goods-img" style={{backgroundImage: "url(" + record.goods_thumb_image + ")"}}></div>
            <div className="goods-c">
              <p className="goods-n" title={record.spu_name}>{record.spu_name}</p>
              <p className="goods-n" title={record.category_tree}>类目: {record.category_tree}</p>
              <p className="goods-n">商品ID：{record.spu}</p>
              <p className="goods-n" title={record.shop_name}>店铺：{record.shop_name}</p>
            </div>
          </div>
        ),
      },
      {
        title: '供货价',
        dataIndex: 'price',
        key: 'price',
        render: (text, record) => (
          <div className="goods-news">
            <div>{record.price} 元</div>
          </div>
        )
      },
      {
        title: '发货地区',
        dataIndex: 'address',
        key: 'address',
        render: (text, record) => (
          <div className="fs12 delivery-area" title={record.address}>
            {record.address}
          </div>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
          <div>
            <a className="tc"
               onClick={this.handleAuthorizeGoods.bind(this, record.sale_goods_id, record.unit, record.spu_id)}>上架到店铺</a>
          </div>
        ),
      },
    ];
    return (
      <div className="distribute-list distribute-main">
        <div className="search-btn">
          <span className="ml10">商品ID</span>
          <Input className="search-input ml10" value={goods_id} onChange={this.handleGoodsId} placeholder=""/>
          <span className="ml30">商品名称</span>
          <Input className="search-input ml10" value={goods_name} onChange={this.handleGoodsName} placeholder=""/>
          <span className="ml30">类目</span>
          <Input onChange={this.handleCategory} value={category} className="search-input ml10" placeholder=""/>
          {/*<Search className="search-input mr10" placeholder=" " onSearch={this.handleSearch} enterButton/>*/}
          <Button type="primary" icon="search" className="btn ml30" onClick={this.handleSearch}>筛选</Button>
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
                 rowKey={(record, index) => record.sale_goods_id}
                 pagination={{
                   pageSize: this.state.size,
                   total: this.state.total,
                   onChange: this.handleOnChangePagination
                 }}/>
          <div className="batch-btn">
            <Button type="default" size={'small'} className="btn-c ml10" onClick={this.handlePutAway}>上架到店铺</Button>
          </div>
        </div>
        <Modal
          title="设置利润"
          visible={visible}
          width={400}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrapClassName="dis-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div className="pt10 pb10 c-t-a">
            <span className="m-icon">*</span>
            <span className="mc">加价</span>
            <Input className="m-input" value={precent_pid} onChange={this.handleAddPrice.bind(this)} autoFocus={true}
                   placeholder="1-1000"/>
            <span className="mc">%</span>
          </div>
        </Modal>
        <Modal
          title="设置利润"
          visible={visibleProfit}
          width={900}
          onOk={this.handleOkProfit}
          onCancel={this.handleCancel}
          wrapClassName="setProfitModal"
          cancelText={'取消'}
          okText={'确定'}>
          <div className="setProfit">
            <div className="s-p-t">
              <span className="p-t-l">批量设置利润</span>
              <Input className="m-input" value={profitAll} placeholder="批量设置" maxLength={4}
                     onChange={this.handleProfitAll}
                     onBlur={this.handleBlurProfitAll.bind(this)}/> <span className="mc">%</span>
            </div>
            <div className="p-h">
              <div>序号</div>
              <div className="sku">SKU</div>
              <div>单位数量</div>
              <div>供货价</div>
              <div>利润</div>
              <div>最终售价</div>
            </div>
            <div>
              {
                skuList && skuList.length > 0 && skuList.map((item, index) => {
                  return (
                    <div className="p-i mc" key={index}>
                      <div>{index + 1}</div>
                      <div className="sku">
                        {item.sku_name && item.sku_name.length > 0 && item.sku_name.map((param, i) => {
                          return (
                            <span key={i} title={param}>
                              <span>{param}</span>
                              {item.sku_name.length != (i + 1) ? <span>,</span> : null}
                            </span>
                          )
                        })}
                        <span>#{item.sale_sku_id}</span>
                      </div>
                      <div>{item.sku_qty}{unit}</div>
                      <div>￥{item.supply_price}</div>
                      <div>
                        <Input className="m-input" value={item.precent_pid}
                               onChange={this.handleProfit.bind(this, index)}
                               placeholder="1-1000" maxLength={4}/>%
                      </div>
                      <div className="price">
                        <span>￥</span>
                        <span>
                          {this.toFixedFn(item.supply_price, item.precent_pid)}
                        </span>
                      </div>
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

export default DistributeList;
