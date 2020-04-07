import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Table, Input, Button, Modal, Select, message, Tooltip, Switch} from 'antd';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';

const {Option} = Select;
const Search = Input.Search;

class DistributeSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goods_id: "",
      goods_name: "",
      category_name: "",
      goods_status: "",
      shop_category_id: "",
      sale_sku_id: "",
      rowData: [],
      total: 0,
      size: 10,
      selectedRowKeys: [],
      goods_set: [],
      delVisible: false,
      visibleSetStoreCategory: false,
      visible: false,
      storeCategoryName: "",
      profit: "",
      visibleProfit: false,
      profitAll: "",
      skuList: [],
      storeCategoryList: [],
      unit: "",
      sale_goods_id: "",
      precent_pid: "",
    };
    this.handleGoodsId = this.handleGoodsId.bind(this);
    this.handleGoodsName = this.handleGoodsName.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleStatus = this.handleStatus.bind(this);
    this.handleStoreCategory = this.handleStoreCategory.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEmpty = this.handleEmpty.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.handleSetStoreCategory = this.handleSetStoreCategory.bind(this);
    this.handlePutAway = this.handlePutAway.bind(this);
    this.handleOnChangePagination = this.handleOnChangePagination.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.handleSetStoreCategoryName = this.handleSetStoreCategoryName.bind(this);
    this.handleOkSetStoreCategory = this.handleOkSetStoreCategory.bind(this);
    this.handleCancelSetStoreCategory = this.handleCancelSetStoreCategory.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleProfitAll = this.handleProfitAll.bind(this);
    this.handleSetProfit = this.handleSetProfit.bind(this);
    this.handleOkSetProfit = this.handleOkSetProfit.bind(this);
    this.handleSetProfitCancel = this.handleSetProfitCancel.bind(this);
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
      category_name: val
    })
  }

  handleStatus(value) {
    this.setState({
      goods_status: value
    });
    this.getData(1)
  }

  handleStoreCategory(value) {
    this.setState({
      shop_category_id: value
    });
    this.getData(1)
  }

  handleSearch() {
    this.getData(1)
  }

  handleEmpty() {
    this.setState({
      goods_id: "",
      goods_name: "",
      category_name: "",
      shop_category_id: "",
      goods_status: "",
    }, () => {
      this.getData(1)
    });

  }

  handlePutAway() {

  }

  handleDel() {
    let {goods_set} = this.state;
    if (goods_set.length > 0) {
      this.setState({
        delVisible: true
      })
    } else {
      message.warning("请选择要删除的分销商品!")
    }
  }

  handleSetStoreCategory() {
    let {goods_set} = this.state;
    if (goods_set.length > 0) {
      this.setState({
        visibleSetStoreCategory: true
      })
    } else {
      message.warning("请选择要设置店内分类的分销商品!")
    }
  }

  handleSetStoreCategoryName(value) {
    this.setState({
      storeCategoryName: value
    })
  }

  handleOnChangePagination(page) {
    this.getData(page)
  }

  getData(page) {
    let {size, goods_id, goods_name, goods_status, category_name, shop_category_id} = this.state;
    httpRequest.get({
      url: sellerApi.goods.saleGoods,
      data: {
        goods_id: goods_id,
        goods_name: goods_name,
        shop_category_id: shop_category_id,
        category_name: category_name,
        goods_status: goods_status,
        goods_type: 1,
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

  handleOkDel() {
    let goods_set = this.state.goods_set;
    httpRequest.put({
      url: sellerApi.goods.saleGoodsBatchUpdate,
      data: {
        sale_goods_id_list: goods_set,
        goods_type: 1,
        is_deleted: 1,
      }
    }).then(res => {
      if (res.code == "200") {
        this.getData(1);
        this.setState({
          delVisible: false
        })
      }
    });

  }

  handleCancelDel() {
    this.setState({
      delVisible: false
    })
  }

  //获取店内分类数据
  getStoreClassify() {
    httpRequest.get({
      url: sellerApi.goods.storeClassifyShopClass,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          storeCategoryList: res.data
        })
      }
    })
  }

  handleOkSetStoreCategory() {
    let {storeCategoryName, goods_set} = this.state;
    if (storeCategoryName) {
      httpRequest.put({
        url: sellerApi.goods.saleGoodsBatchUpdate,
        data: {
          sale_goods_id_list: goods_set,
          goods_type: 1,
          shop_category_id: parseFloat(storeCategoryName),
        }
      }).then(res => {
        if (res.code == "200") {
          this.getData(1);
          this.setState({
            visibleSetStoreCategory: false,
            selectedRowKeys: null,
            storeCategoryName: ""
          })
        }
      })
    } else {
      message.warning("请选择店内分类!")
    }
  }

  handleCancelSetStoreCategory() {
    this.setState({
      visibleSetStoreCategory: false
    })
  }

  handleOk() {
    let {precent_pid, goods_set} = this.state;
    if (precent_pid) {
      httpRequest.put({
        url: sellerApi.goods.saleGoodsBatchUpdate,
        data: {
          sale_goods_id_list: goods_set,
          goods_type: 1,
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
    } else {
      message.warning("加价内容不能为空!")
    }
  }

  handleCancel() {
    this.setState({
      visible: false
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

  handleSetProfit() {
    let {goods_set} = this.state;
    if (goods_set.length > 0) {
      this.setState({
        visible: true
      })
    } else {
      message.warning("请选择要设置利润的分销商品!")
    }
  }

  getSkuList(id, spu_id) {
    httpRequest.get({
      url: sellerApi.goods.getSkuList,
      data: {
        sale_goods_id: id,
        type_id: 1,
        spu_id: spu_id
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          skuList: res.data,
        })
      }
    })
  }

  handleSetProfitModal(id, unit, spu_id) {
    this.getSkuList(id, spu_id);
    this.setState({
      visibleProfit: true,
      sale_goods_id: id,
      unit,
    })
  }

  handleSetProfitCancel() {
    this.setState({
      visibleProfit: false
    })
  }

  handleOkSetProfit() {
    let sale_sku_list = [];
    let skuList = this.state.skuList;
    let sale_goods_id = this.state.sale_goods_id;
    let flag = false;
    skuList && skuList.length > 0 && skuList.map((item, index) => {
      let obj = {};
      obj.sale_sku_id = item.sale_sku_id;
      obj.precent_pid = parseFloat(item.precent_pid);
      sale_sku_list.push(obj);
      if (item.precent_pid === "" || item.precent_pid === "undefined") {
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

  handleProfitAll(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    if (val > 1000 || val == 0) {
      val = ""
    }
    this.setState({
      profitAll: val
    })
  }

  handleBlurProfitAll(e) {
    let skuList = this.state.skuList;
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    skuList && skuList.length > 0 && skuList.map((item, index) => {
      item.precent_pid = val
    });
    this.setState({
      skuList
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

  componentDidMount() {
    if (this.props.activeKey == '2') {
      this.getData(1);
      this.getStoreClassify();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.activeKey == '2' && nextProps.activeKey != this.props.activeKey) {
      this.getData(1);
      this.getStoreClassify();
    }
  }

  toFixedFn(supply_price, precent_pid) {
    let price = (parseFloat(supply_price) * parseFloat((1 + precent_pid / 100))).toFixed(4);
    return price.substring(0, price.length - 1);
  }

  render() {
    // const seller_shop_id = localStorage.getItem("seller_shop_id");
    const {goods_id, goods_name, category_name, goods_status, shop_category_id, delVisible, visibleSetStoreCategory, storeCategoryName, visible, profit, visibleProfit, profitAll, skuList, unit, storeCategoryList, precent_pid} = this.state;
    const columns = [
      {
        title: '商品/供货价',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <div className="goods-news clearfix">
            <div className="goods-img" style={{backgroundImage: "url(" + record.goods_thumb_image + ")"}}></div>
            <div className="goods-c">
              <p className="goods-n" title={record.spu_name}>{record.spu_name}</p>
              <p
                className="goods-n" title={record.category_tree}>类目:{record.category_tree}</p>
              <p className="goods-n">商品ID：{record.spu_id}</p>
              <p className="goods-n">店铺：{record.shop_name}</p>
              <p className="goods-n tc">{record.price}元 </p>
            </div>
          </div>
        ),
      },
      {
        title: '店内分类',
        dataIndex: 'shop_category_id',
        key: 'shop_category_id',
        render: (text, record) => (
          <div className="goods-news">
            {record.shop_category_name && record.shop_category_name.length > 0 && record.shop_category_name.map((item, index) => {
              return (
                <span key={index}>
                  {item}
                  {record.shop_category_name.length != (index + 1) ? <span>/</span> : null}
                </span>
              )
            })}
          </div>
        )
      },
      {
        title: '售价',
        dataIndex: 'floor_price',
        key: 'floor_price',
        render: (text, record) => (
          <div>{record.floor_price} 元</div>
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
        title: '状态',
        dataIndex: 'goods_status',
        key: 'goods_status',
        render: (text, record) => (
          <div className="fs12">
            <div
              className={record.goods_status == 0 && record.is_delete == 0 && record.audit_status == 1 ? "show" : "fcb hide"}>
              销售中
            </div>
            <div
              className={record.goods_status == 1 && record.is_delete == 0 && record.audit_status == 1 ? "fcb show" : "fcb hide"}>已下架
            </div>
            <div className={record.is_delete == 1 || record.audit_status != 1 ? "fcr show" : "fcb hide"}>已失效</div>
          </div>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
          <div>
            <a className="tc"
               onClick={this.handleSetProfitModal.bind(this, record.sale_goods_id, record.unit, record.spu_id)}>设置利润</a>
            <br/>
            <a className="tc" href={`${record.msDomain}/${record.short_url}`}
               target="_blank">商品详情</a>
          </div>
        ),
      },
    ];
    return (
      <div className="distribute-list distribute-main">
        <div className="search-btn">
          <span className="l-icon">商品ID</span>
          <Input className="search-input ml10" value={goods_id} onChange={this.handleGoodsId} placeholder=""/>
          <span className="ml30">商品名称</span>
          <Input className="search-input ml10" value={goods_name} onChange={this.handleGoodsName} placeholder=""/>
          <span className="ml30 l-icon">类目</span>
          <Input onChange={this.handleCategory} value={category_name} className="search-input ml10" placeholder=""/>
        </div>
        <div className="search-btn pt10">
          <span className="l-icon">状态</span>
          <Select
            value={goods_status}
            style={{width: 169}}
            className="ml10"
            onChange={this.handleStatus}>
            <Option value="">全部</Option>
            <Option value="0">销售中</Option>
            <Option value="1">已下架</Option>
            <Option value="2">已失效</Option>
          </Select>
          <span className="ml30">店内分类</span>
          {/*<Input onChange={this.handleStoreCategory} value={shop_category_id} className="search-input ml10"*/}
          {/*       placeholder=""/>*/}
          <Select
            value={shop_category_id}
            style={{width: 169}}
            className="ml10"
            onChange={this.handleStoreCategory}>
            <Option value="">全部</Option>
            {storeCategoryList && storeCategoryList.length > 0 &&
            storeCategoryList.map((item, index) => {
              return (
                <Option value={item.seller_category_id} key={index}>{item.category_name}</Option>
              )
            })
            }
          </Select>
          <Button type="primary" icon="search" className="btn" style={{marginLeft: "56px"}}
                  onClick={this.handleSearch}>筛选</Button>
          <Button type="default" className="btn-c ml10" onClick={this.handleEmpty}>清空筛选条件</Button>
        </div>
        <div className="dis-table-con pt10">
          <Table className="goods-table"
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
            <Button type="default" size={'small'} className="btn-c ml10" onClick={this.handleDel}>删除</Button>
            <Button type="default" size={'small'} className="btn-c ml10"
                    onClick={this.handleSetStoreCategory}>设置店内分类</Button>
            <Button type="default" size={'small'} className="btn-c ml10" onClick={this.handleSetProfit}>设置利润</Button>
          </div>
        </div>
        <Modal
          title="确认删除"
          visible={delVisible}
          width={360}
          onOk={this.handleOkDel.bind(this)}
          onCancel={this.handleCancelDel.bind(this)}
          wrapClassName="dis-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div className="c-t-a mc">确认删除分销商品？</div>
        </Modal>
        <Modal
          title="批量设置店内分类"
          visible={visibleSetStoreCategory}
          width={400}
          onOk={this.handleOkSetStoreCategory}
          onCancel={this.handleCancelSetStoreCategory}
          wrapClassName="dis-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div className="pt10 pb10">
            <span className="m-icon">*</span>
            <span className="mc">店内分类</span>
            <Select
              value={storeCategoryName}
              style={{width: 260}}
              className="ml15"
              onChange={this.handleSetStoreCategoryName}>
              <Option value="">全部</Option>
              {storeCategoryList && storeCategoryList.length > 0 &&
              storeCategoryList.map((item, index) => {
                return (
                  <Option value={item.seller_category_id} key={index}>{item.category_name}</Option>
                )
              })
              }
            </Select>
            <div className="store-t">
              <span className="mc">无合适分类，前往 </span>
              <Link className="link-icon" to="/seller/goods/goodsStoreClassify">店内分类</Link>
              <span className="mc"> 设置</span>
            </div>
          </div>
        </Modal>
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
            <Input className="m-input" value={precent_pid} onChange={this.handleAddPrice.bind(this)}
                   placeholder="1-1000"/>
            <span className="mc">%</span>
          </div>
        </Modal>
        <Modal
          title="设置利润"
          visible={visibleProfit}
          width={1000}
          onOk={this.handleOkSetProfit}
          onCancel={this.handleSetProfitCancel}
          wrapClassName="setProfitModal"
          cancelText={'取消'}
          okText={'确定'}>
          <div className="setProfit">
            <div className="s-p-t">
              <span className="p-t-l">批量设置利润</span>
              <Input className="m-input" value={profitAll} onChange={this.handleProfitAll}
                     onBlur={this.handleBlurProfitAll.bind(this)}
                     placeholder="批量设置" maxLength={4}/> <span className="mc">%</span>
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
                        <span>{this.toFixedFn(item.supply_price, item.precent_pid)}</span>
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

export default DistributeSale;