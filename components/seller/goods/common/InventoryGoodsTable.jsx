import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom'
import {
  Table,
  Input,
  Button,
  Checkbox,
  Tabs,
  Divider,
  Tag,
  Switch,
  Icon,
  Pagination,
  message, Select
} from 'antd';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';

const Search = Input.Search;


class InventoryGoodsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: [],
      total: 0,
      size: 10,
      spu_list: [],
      goods_set: [],
      selectedRowKeys: [],
      shipping_id: "",
      goods_name: ""
    };
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleOnChangePagination = this.handleOnChangePagination.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
  }

  componentDidMount() {
    this.getShopGoodsList(1)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.goodsType == 3) {
      this.getShopGoodsList(1);
    }
  }

  getShopGoodsList(page) {
    let goods_name = this.state.goods_name;
    let shipping_id = this.state.shipping_id;
    httpRequest.get({
      url: sellerApi.goods.shopGoodsList,
      data: {
        goods_name: goods_name,
        shipping_id: shipping_id,
        page: page,
        goods_type: 0
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


  handleOnChangePagination(page) {
    this.getShopGoodsList(page)
  }

  handleSearchClick(value) {
    this.setState({
      goods_name: value
    }, () => {
      this.getShopGoodsList(1);
    })
  }

//删除接口
  delShopGoodsList(spu_list, keys) {
    httpRequest.put({
      url: sellerApi.goods.shopGoodsList,
      data: {
        spu_list: spu_list,
        is_deleted: 1
      }
    }).then(res => {
      if (res.code == "200") {
        if (spu_list.length == 1) {
          let _data = this.state.rowData.splice(keys, 1);
          this.setState({
            rowData: this.state.rowData,
            selectedRowKeys: null
          })
        } else {
          /*     let list = this.state.rowData;
               spu_list && spu_list.map((params, i) => {
                 list.forEach(function (item, index, arr) {
                   if (item.spu_id == params) {
                     arr.splice(index, 1);
                   }
                 });
               });*/
          this.setState({
            selectedRowKeys: null,
            // rowData: list
          });
          this.getShopGoodsList(1)
        }
      }
    })

  }

  delRowMore() {
    setTimeout(() => {
      let spu_list = this.state.spu_list;
      let selectedRowKeys = this.state.selectedRowKeys;
      this.delShopGoodsList(spu_list, selectedRowKeys)
    }, 1000)

  }

  delRow(id, index) {
    let spu_list = [];
    spu_list.push(id);
    this.delShopGoodsList(spu_list, index);
  }

  copyRow(goods_id) {
    httpRequest.post({
      url: sellerApi.goods.shopGoodsList,
      data: {
        goods_id: goods_id
      }
    }).then(res => {
      if (res.code == "200") {
        let page = this.state.page;
        this.getShopGoodsList(page);
      } else {
        message.error(res.msg)
      }
    })
  }

  //上下架
  goodsBatchOperation(goods_set, select) {
    httpRequest.put({
      url: sellerApi.goods.goodsBatchOperation,
      data: {
        goods_set: goods_set,
        select: select
      }
    }).then(res => {
      if (res.code == "200") {
        // this.getShopGoodsList(1)
        let newRowData = this.state.rowData;
        goods_set && goods_set.map((item, index) => {
          newRowData && newRowData.map((param, i) => {
            if (item == param.goods_id) {
              param.goods_status = select
            }
          });
        });
        this.setState({
          selectedRowKeys: null,
          rowData: newRowData
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  handleOnChangeSwitch(id, checked) {
    let goods_set = [];
    let status = 0;
    goods_set.push(id);
    if (checked) {
      status = 0;
      this.goodsBatchOperation(goods_set, status);
    } else {
      status = 1;
      this.goodsBatchOperation(goods_set, status);
    }

  }

  putAwayMore() {
    let goods_set = this.state.goods_set;
    if (goods_set.length != 0) {
      this.goodsBatchOperation(goods_set, 0);
    } else {
      message.warning("请先选择商品！")
    }
  }

  soldOutMore() {
    let goods_set = this.state.goods_set;
    if (goods_set.length != 0) {
      this.goodsBatchOperation(goods_set, 1);
    } else {
      message.warning("请先选择商品！")
    }
  }

  handleRowSelection(selectedRowKeys, selectedRows) {
    let spu_list = [];
    let goods_set = [];
    selectedRows && selectedRows.map((item, index) => {
      spu_list.push(item.spu_id);
      goods_set.push(item.goods_id)
    });
    this.setState({
      selectedRowKeys: selectedRowKeys,
      spu_list: spu_list,
      goods_set: goods_set,
    })
  }

  linkToLook(spu_id) {
    let seller_shop_id = localStorage.getItem("seller_shop_id");
    this.props.history.push(`//shop/${seller_shop_id}/goods/${spu_id}`);
  }

  //编辑
  linkToEdit(goods_id) {
    this.props.history.push(`/seller/goods/AddInventoryGoods/${goods_id}`)
  }

  //日志
  logRecord(goods_id) {
    this.props.history.push(`/seller/goods/goodsLogList/${goods_id}`);
  }

  handleChangeTmp(value) {
    this.setState({
      shipping_id: value
    }, () => {
      this.getShopGoodsList(1);
    })
  }

  render() {
    const columns = [
      {
        title: '编号',
        dataIndex: 'goods_id',
        key: 'goods_id',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
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
        title: '商品属性',
        dataIndex: 'goods_price',
        key: 'goods_price',
        render: (text, record) => (
            <div className="goods-news">
              <div>{record.goods_price} 元/{record.unit}</div>
              <div className="mt5">运费模板：{record.shipping_name}</div>
            </div>
        )
      },
      {
        title: '优惠促销',
        key: 'sales',
        dataIndex: 'sales',
        render: (text, record) => (
            <div className="goods-sales-news" style={{width: 130}}>
              {record.coupons &&
              record.coupons.length > 0 &&
              record.coupons.map((item, index) => {
                return (
                    <div className="goods-sales mb5 fcr" key={index}>{item}</div>
                )
              })
              }
            </div>
        ),
      },
      {
        title: '库存',
        dataIndex: 'goods_qty',
        key: 'goods_qty',
      },
      {
        title: '审核状态',
        dataIndex: 'audit_status',
        key: 'audit_status',
        render: (text, record) => (
            <div className="fs12">
              <div className={record.audit_status == 0 ? "show" : "fcb hide"}>待审核</div>
              <div className={record.audit_status == 1 ? "fcb show" : "fcb hide"}>审核已通过</div>
              <div className={record.audit_status == 2 ? "fcr show" : "fcb hide"}>审核未通过</div>
            </div>
        ),
      },
      {
        title: '上架',
        dataIndex: 'goods_status',
        key: 'goods_status',
        render: (text, record) => (
            <div>
              <Switch className="switch-btn" size="small"
                      disabled={record.audit_status == 1 ? false : true}
                      checked={record.goods_status == 0 ? true : false}
                      onChange={this.handleOnChangeSwitch.bind(this, record.goods_id)}/>
            </div>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
            <div>
              <a className="action-btn mb10" href="javascript:void (0);"
                 onClick={this.copyRow.bind(this, record.goods_id)}>
                <p><i className="iconfont iconfuzhi"></i></p>
                <p>复制</p>
              </a>
              <Divider type="vertical"/>
              <a className="action-btn mb10" href="javascript:void (0);"
                 onClick={this.delRow.bind(this, record.spu_id, index)}>
                <p><i className="iconfont iconshanchu"></i></p>
                <p>删除</p>
              </a>
              <Divider type="vertical"/>
              <a className="action-btn mb10" href="javascript:void (0);"
                 onClick={this.logRecord.bind(this, record.goods_id)}>
                <p><i className="iconfont iconrizhi"></i></p>
                <p>日志</p>
              </a>
              <br/>
              <a className="action-btn" href="javascript:void (0);"
                 onClick={this.linkToEdit.bind(this, record.goods_id)}>
                <p><i className="iconfont iconbianji"></i></p>
                <p>编辑</p>
              </a>
              <Divider type="vertical"/>
              <a className="action-btn" href="javascript:void (0);"
                 onClick={this.linkToLook.bind(this, record.spu_id)}>
                <p><i className="iconfont iconxianshi fs20"></i></p>
                <p>查看</p>
              </a>
            </div>
        ),
      },
    ];
    return (
        <div className="bgcf pl20 pr20">
          <div className="pt20">
            <div className="search-btn clearfix">
              <Search className="search-input" placeholder=" 商品ID / 商品关键字"
                      onSearch={this.handleSearchClick} enterButton/>
              <Link to="/seller/goods/addInventoryGoods/0">
                <Button className="add btn-icon btn-inv" icon="plus" type="primary">添加库存类商品</Button>
              </Link>
            </div>
            <div className="comment-btn">
              <Button className="add" size="small" onClick={this.delRowMore.bind(this)}>
                <i className="iconfont iconshanchu"></i>删除
              </Button>
              <Button className="add" size="small" onClick={this.putAwayMore.bind(this)}>
                <i className="iconfont iconshangyi"></i>上架
              </Button>
              <Button className="add" size="small" onClick={this.soldOutMore.bind(this)}>
                <i className="iconfont iconxiayi"></i>下架
              </Button>
              <Select
                  value={this.state.shipping_id}
                  style={{width: 160, height: 28}}
                  className="goods-type"
                  onChange={this.handleChangeTmp.bind(this)}
              >
                <Option value="">运费模板</Option>
                {
                  this.props.goodsTemplateList &&
                  this.props.goodsTemplateList.map((item, index) => {
                    return (
                        <Option value={item.template_id} key={index}>{item.template_name}</Option>
                    )
                  })
                }
              </Select>
            </div>
          </div>

          <div>
            <Table className="goods-table"
                   rowSelection={{
                     selectedRowKeys: this.state.selectedRowKeys,
                     onChange: this.handleRowSelection
                   }}
                   columns={columns}
                   dataSource={this.state.rowData}
                   rowKey={(record, index) => record.goods_id}
                   pagination={{
                     pageSize: this.state.size,
                     total: this.state.total,
                     onChange: this.handleOnChangePagination
                   }}/>
          </div>
        </div>
    );
  }
}

export default withRouter(InventoryGoodsTable);
