import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Table, Input, Button, Divider, Modal, Switch, Select, message, Tooltip} from 'antd';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import {dimValueGetter} from "echarts/src/component/marker/markerHelper";

const {Option} = Select;
const Search = Input.Search;

class ProduceGoodsTable extends Component {
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
      goods_name: "",
      status: "",
      visibleDel: false,
      visibleDelAll: false,
      visibleCopy: false,
      delIndex: "",
      copyGoodsId: "",
      seller_category_id: "",
      storeCategoryList: []
    };
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleOnChangePagination = this.handleOnChangePagination.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
  }

  componentDidMount() {
    let status = this.props.match.params.status;
    this.setState({
      status
    }, () => {
      this.getShopGoodsList(1);
    });
    this.leveOneCategory()
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.goodsType == 2) {
      this.getShopGoodsList(1);
    }
  }

  getShopGoodsList(page) {
    let status = this.state.status;
    if (status == 0) {
      status = ""
    }
    this.setState({status});
    let goods_name = this.state.goods_name;
    let shipping_id = this.state.shipping_id;
    let seller_category_id = this.state.seller_category_id;
    httpRequest.get({
      url: sellerApi.goods.shopGoodsList,
      data: {
        goods_name: goods_name,
        shipping_id: shipping_id,
        seller_category_id: seller_category_id,
        page: page,
        size: this.state.size,
        status: status,
        // goods_type: 1,
        goods_type: ""
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

  //筛选
  handleChangeStatus(value) {
    this.setState({
      status: value
    }, () => {
      this.getShopGoodsList(1);
    })
  }

  //店内分类筛选
  handleStoreCategory(value) {
    this.setState({
      seller_category_id: value
    }, () => {
      this.getShopGoodsList(1);
    })
  }

//店内分类数据
  leveOneCategory() {
    httpRequest.get({
      url: sellerApi.goods.leveOneCategory,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          storeCategoryList: res.data
        })
      }
    })
  }

//删除接口
  delShopGoodsList(spu_list, keys) {
    this.setState({
      visibleDel: false,
      visibleDelAll: false
    });
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
        }
        // else {
        //   this.setState({
        //     selectedRowKeys: null
        //   });
        // }
        this.getShopGoodsList(1)
      }
    })

  }

  delRowMore() {
    let selectedRowKeys = this.state.selectedRowKeys;
    if (selectedRowKeys.length > 0) {
      this.setState({
        visibleDelAll: true,
      });
    } else {
      message.warning("请先选择商品！");
    }
  }

  handleOkDelAll() {
    setTimeout(() => {
      let spu_list = this.state.spu_list;
      let selectedRowKeys = this.state.selectedRowKeys;
      this.delShopGoodsList(spu_list, selectedRowKeys)
    }, 600)
  }

  delRow(id, index) {
    let spu_list = [];
    spu_list.push(id);
    this.setState({
      visibleDel: true,
      spu_list,
      delIndex: index
    });
  }

  handleOkDel() {
    let {spu_list, delIndex} = this.state;
    this.delShopGoodsList(spu_list, delIndex);
  }

  handleCancel() {
    this.setState({
      visibleDel: false,
      visibleDelAll: false,
      visibleCopy: false
    });
  }

  copyRow(goods_id) {
    this.setState({
      visibleCopy: true,
      copyGoodsId: goods_id
    });
  }

  handleOkCopy() {
    let goods_id = this.state.copyGoodsId;
    this.setState({
      visibleCopy: false
    });
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
          rowData: newRowData,
          goods_set: []
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
    this.props.history.push(`/seller/goods/AddProduceGoods/${goods_id}/0`)
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

  //查看
  handleLookShop(seller_shop_id, spu_id) {
    window.localStorage.removeItem('inviteCode');
    window.open(`//shop/${seller_shop_id}/goods/${spu_id}`);
  }

  render() {
    const seller_shop_id = localStorage.getItem("seller_shop_id");
    const columns = [
      {
        title: '编号',
        dataIndex: 'goods_id',
        key: 'goods_id',
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
        title: '商品属性',
        dataIndex: 'goods_price',
        key: 'goods_price',
        render: (text, record) => (
          <div className="goods-news">
            <div>{record.goods_price} 元/{record.unit}</div>
            <div className="mt5">
              <span className="goods-n-t">运费模板：</span>
              <Tooltip title={record.shipping_name}>
                <span className="goods-n">{record.shipping_name}</span>
              </Tooltip>
            </div>
          </div>
        )
      },
      {
        title: '店内分类',
        dataIndex: 'category_name',
        key: 'category_name',
        render: (text, record) => (
          <div className="category_name">
            <Tooltip title={record.category_name}>
              <span>{record.category_name}</span>
            </Tooltip>
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
                <Tooltip title={item} key={index}>
                  <div className="goods-sales mb5 fcr">{item}</div>
                </Tooltip>
              )
            })
            }
          </div>
        ),
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
            <a className="action-btn mb10" href={`/seller/goods/goodsLogList/${record.goods_id}`} target="_blank">
              <p><i className="iconfont iconrizhi"></i></p>
              <p>日志</p>
            </a>
            <br/>
            <a className="action-btn" href={`/seller/goods/AddProduceGoods/${record.goods_id}/0`} target="_blank">
              {
                record.update_msg != 0 ?
                  <Tooltip title="平台对本商品的规格属性项进行了调整，请您编辑本商品属性，以方便被筛选推荐、增加曝光。">
                    <p>
                      <i className="iconfont iconbianji"></i>
                      {record.update_msg != 0 ? <span className="flicker-edit"></span> : null}
                    </p>
                    <p>编辑 </p>
                  </Tooltip> :
                  <Fragment>
                    <p>
                      <i className="iconfont iconbianji"></i>
                    </p>
                    <p>编辑 </p>
                  </Fragment>
              }
            </a>
            <Divider type="vertical"/>
            {/*href={`//shop/${seller_shop_id}/goods/${record.spu_id}`}*/}
            <a className="action-btn" onClick={this.handleLookShop.bind(this, seller_shop_id, record.spu_id)}
               target="_blank">
              <p><i className="iconfont iconxianshi fs20"></i></p>
              <p>查看</p>
            </a>
          </div>
        ),
      },
    ];
    return (
      <div className="bgcf pl20 pr20">
        <div className="search-btn clearfix pt20">
          <Search className="search-input mr10" placeholder=" 商品ID / 商品关键字"
                  onSearch={this.handleSearchClick} enterButton/>
          <Select
            value={this.state.status}
            style={{width: 100}}
            className="goods-type"
            onChange={this.handleChangeStatus.bind(this)}>
            <Option value="">全部</Option>
            <Option value="1">出售中</Option>
            <Option value="2">已下架</Option>
            <Option value="3">待审核</Option>
          </Select>
          <Link to="/seller/goods/addProduceGoods/0/0">
            <Button className="add btn-icon btn-pro" icon="plus" type="primary">添加商品</Button>
          </Link>
          <Link to="/seller/goods/goodsDraftList">
            <Button className="add" icon="form">商品草稿</Button>
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
            className="goods-type mr10"
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

          <Select
            value={this.state.seller_category_id}
            style={{width: 160}}
            className="goods-type"
            onChange={this.handleStoreCategory.bind(this)}>
            <Option value="">店内分类</Option>
            {this.state.storeCategoryList && this.state.storeCategoryList.length > 0 &&
            this.state.storeCategoryList.map((item, index) => {
              return (
                <Option value={item.seller_category_id} key={index}>{item.category_name}</Option>
              )
            })
            }

          </Select>
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
        <Modal
          title="确认删除"
          visible={this.state.visibleDel}
          width={360}
          onOk={this.handleOkDel.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          wrapClassName="del-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div>
            您确认要删除吗？
          </div>
        </Modal>
        <Modal
          title="确认删除"
          visible={this.state.visibleDelAll}
          width={360}
          onOk={this.handleOkDelAll.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          wrapClassName="del-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div>
            您确认要删除您选中的商品吗？
          </div>
        </Modal>

        <Modal
          title="确认复制"
          visible={this.state.visibleCopy}
          width={360}
          onOk={this.handleOkCopy.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          wrapClassName="del-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div>
            您确认要复制吗？
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(ProduceGoodsTable);
