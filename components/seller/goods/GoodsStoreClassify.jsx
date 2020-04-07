import React, {Component} from 'react';
import Title from '../common/Title';
import {Table, Tabs, Input, Divider, Modal, Switch, Icon, Pagination, LocaleProvider, Button} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import '../common/style/goodsList.scss';
import {Link} from "react-router-dom";
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';

const Search = Input.Search;
const {TabPane} = Tabs;

class GoodsStoreClassify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - - 店内分类',
      rowData: [],
      visible: false,
      category_name: "",
      seller_category_id: "",
      id: ''
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleOk() {
     let _data = this.state.rowData.splice(this.state.id, 1);
     this.setState({
       rowData: this.state.rowData
     });
    let seller_category_id = this.state.seller_category_id;
    this.storeClassifyPk(seller_category_id);
    this.setState({
      visible: false,
    });
  };

  handleCancel() {
    this.setState({
      visible: false,
    });
  };

  delRow(seller_category_id, category_name) {
    this.setState({
      visible: true,
      seller_category_id: seller_category_id,
      category_name: category_name,
    });

  }

  linkTo(id) {
    this.props.history.push(`/seller/goods/addGoodsClassify/${id}`)
  }

  linkToTwoClassify(parent_id) {
    this.props.history.push(`/seller/goods/goodsStoreTwoClassify/${parent_id}`)
  }

  handleonChangeSwitch(id, seller_category_id, checked) {
    let status = 1;
    if (checked) {
      status = 1;
    } else {
      status = 0;
    }
    httpRequest.put({
      url: sellerApi.goods.storeClassifyShow + seller_category_id + "/",
      data: {
        select: status
      }
    }).then(res => {
      if (res.code == "200") {
        this.getStoreClassify();
      }
    })
  }

  componentDidMount() {
    this.getStoreClassify()
  }

  getStoreClassify() {
    httpRequest.get({
      url: sellerApi.goods.storeClassifyClassificationQuery,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          rowData: res.data
        })

      }
    })
  }

  storeClassifyPk(seller_category_id) {
    httpRequest.delete({
      url: sellerApi.goods.storeClassify + seller_category_id,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        this.getStoreClassify();
      }
    })
  }

  render() {
    const {visible} = this.state;
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'title',
        key: 'category_name',
         render: text => <a href="javascript:void (0);">{text}</a>,
      },
      {
        title: '级别',
        dataIndex: 'tier',
        key: 'tier',
      },
      {
        title: '商品数量',
        dataIndex: 'p_quantity',
        key: 'p_quantity',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: '店铺导航显示',
        key: 'tags',
        dataIndex: 'tags',
        render: (tags, record) => (
            <span key={record.nav_is_show}>
                    <Switch className="switch-btn" size="small"
                            defaultChecked={record.nav_is_show == 1 ? true : false}
                            onChange={this.handleonChangeSwitch.bind(this, record.nav_is_show, record.value)}/>
                </span>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => (
            <span>
                    {/*<Link to="/seller/goods/addGoodsClassify/id=1">*/}
              {/*<Icon type="edit"/>编辑*/}
              {/*</Link>*/}
              <a className="action-btn" href="javascript:void (0);"
                 onClick={this.linkTo.bind(this, record.value)}>
                    <p><i className="iconfont iconbianji"></i></p>
                    <p>编辑</p>
                    </a>
                    <Divider type="vertical"/>
                    <a className="action-btn" href="javascript:void (0);"
                       onClick={this.delRow.bind(this, record.value, record.category_name)}>
                    <p><i className="iconfont iconshanchu"></i></p>
                    <p>删除</p>
                      {/*{record.key}*/}
                    </a>
                    <Divider type="vertical"/>
                    <a className="action-btn" href="javascript:void (0);"
                       onClick={this.linkToTwoClassify.bind(this, record.value)}>
                    <p><i className="iconfont iconxianshi fs20"></i></p>
                    <p>查看下级</p>
                    </a>
                </span>
        ),
      },
    ];
    return (
        <div className='goods-classify'>
          <Title title={this.state.titleContent}/>
          <div className="goods-store-classify goods-main">
            <div className="classify-btn">
              <Link to="/seller/goods/addGoodsClassify/0">
                <Button className="add">
                  <i className="iconfont icontianjia pr t2 mr10"></i><span>添加分类</span>
                </Button>
              </Link>
            </div>

            <Table className="classify-table" columns={columns} dataSource={this.state.rowData}
                   rowKey={record => record.value}
                   pagination={{pageSize: 10}}/>
          </div>

          <div>
            <Modal
                title="确认删除"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                centered={true}
                okText={"确定"}
                cancelText={"取消"}
            >
                        <span>
                            你确定要删除
                            <span> {this.state.category_name} </span> 吗？
                        </span>
            </Modal>
          </div>
        </div>
    )
  }
}

export default GoodsStoreClassify;
