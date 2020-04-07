import React, {Component} from 'react';
import Title from '../common/Title';
// import {Input, Table, Button, Icon, Divider, message} from 'antd';
import {Tabs, Form, Input, Select, Pagination, LocaleProvider, DatePicker, Row, Col, Table, Button} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import '../common/style/goodsList.scss';
import {Link} from "react-router-dom";
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';

const Search = Input.Search;
const {Option} = Select;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm';

class GoodsLogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - - 日志列表',
      rowData: [],
      is_deleted: 1,
      spu_list: [],
      selectedRowKeys: [],
      total: 0,
      size: 10,
      page: 1,
      goods_id: "",
    };
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleOnChangePagination = this.handleOnChangePagination.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
  }

  componentDidMount() {

    this.setState({
      goods_id: this.props.match.params.id
    }, () => {
      this.getGoodsLogList(1)
    })
  }

  getGoodsLogList(page) {
    let goods_id = this.state.goods_id;
    httpRequest.get({
      url: sellerApi.goods.goodsLogs,
      data: {
        goods_id: goods_id,
        operator_id: "",
        operate_platform: "",
        operate_module: "",
        page_index: page,
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
      this.getGoodsLogList(1);
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
    this.getGoodsLogList(page)
  }

  delRow(id, index) {
    let spu_list = [];
    spu_list.push(id);
    this.delShopGoodsList(spu_list, index);
  }

  render() {
    const columns = [
      {
        title: '日志编号',
        dataIndex: 'log_id',
        key: 'log_id',
        render: text => <a href="javascript:void(0);">{text}</a>,
      },
      {
        title: '时间',
        dataIndex: 'operate_time',
        key: 'operate_time',
        render: (text, record) => (
            <div className="goods-news">
              <div>{record.operate_time}</div>
            </div>
        ),
      },
      {
        title: '操作者',
        dataIndex: 'operator_name',
        key: 'operator_name'
      },
      {
        title: '日志内容',
        dataIndex: 'operate_content',
        key: 'operate_content',
        render: (text, record) => (
            <div className="fs12" style={{width:"500px"}}>
              {record.operate_content}
            </div>
        ),
      }
    ];
    return (
        <div className='goods-comment'>
          <Title title={this.state.titleContent}/>
          <div className="bgcf pl20 pr20 mh">
            <div className="classify-btn clearfix pt20">
              {/*<Search placeholder="输入评论内容" onSearch={this.handleSearchClick}*/}
              {/*        enterButton style={{width: 300, marginBottom: 20}}/>*/}
              <Link to="/seller/goods/goodsList">
                <Button className="add-comment" icon="arrow-left">商品列表</Button>
              </Link>
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
                   locale={{emptyText: '没有找到任何记录'}}/>
          </div>

        </div>
    )
  }
}

export default GoodsLogList;
