import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Table, Input, Button, Modal, Select, message, DatePicker} from 'antd';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import '../common/style/business.scss'
import Title from "../common/Title";
import {BigNumber} from "bignumber.js";
import moment from "moment";

const {Option} = Select;
const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD';
// BigNumber.config({FORMAT: format});
const {RangePicker} = DatePicker;
const Searchdate = 'YYYY-MM-DD';

class DistributionEarning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商家 - - 分销收益',
      order_sn: "",
      goods_name: "",
      category: "",
      rowData: [],
      total: 0,
      size: 10,
      selectedRowKeys: [],
      goods_set: [],
      visible: false,
      profit: "",
      profitAll: "",
      precent_pid: "",
      sale_goods_id: "",
      dealTime: "",
    };
    this.handleOrderNum = this.handleOrderNum.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEmpty = this.handleEmpty.bind(this);
    this.handleOnChangePagination = this.handleOnChangePagination.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
  }

  handleOrderNum(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    this.setState({
      order_sn: val
    })
  }

  handleSearch() {
    this.getData(1)
  }

  handleEmpty() {
    this.setState({
      order_sn: "",
      dealTime: ""
    }, () => {
      this.getData(1)
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


  handleOnChangePagination(page) {
    this.getData(page)
  }

  getData(page) {
    let {size, order_sn, dealTime} = this.state;
    let params = {
      // order_sn: "",
      // start_time: "",
      // end_time: "",
      page: page,
      size: size
    };
    if (order_sn) {
      params.order_sn = order_sn
    }
    if (dealTime && dealTime.length > 0) {
      params.start_time = moment(dealTime[0]).format(Searchdate);
      params.end_time = moment(dealTime[1]).format(Searchdate);
    }
    httpRequest.post({
      url: sellerApi.business.shopDistribution,
      data: params
    }).then(res => {
      if (res.code == "200") {
        let total = res.data.count;
        this.setState({
          rowData: res.data.data,
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


  handleRangePicker(value, dateString) {
    this.setState({
      dealTime: value
    })
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const {titleContent, order_sn, dealTime} = this.state;
    const columns = [
      {
        title: '订单号',
        dataIndex: 'order_sn',
        key: 'order_sn',
        render: (text, record, index) => {
          return <div>
            {text}
          </div>
        }
      },
      {
        title: '订单总额',
        dataIndex: 'order_money',
        key: 'order_money',
        render: (text, record, index) => {
          return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
        }
      },
      {
        title: '优惠金额',
        dataIndex: 'coupons_total_money',
        key: 'coupons_total_money',
        render: (text, record, index) => {
          return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
        }
      },
      {
        title: '买家实付金额',
        dataIndex: 'actual_pay_money',
        key: 'actual_pay_money',
        render: (text, record, index) => {
          return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
        }
      },

      {
        title: '退款金额',
        dataIndex: 'return_money',
        key: 'return_money',
        render: (text, record, index) => {
          return <span className='apply-amount'>￥{new BigNumber(parseFloat(text)).toFormat(2)}</span>
        }
      },
      {
        title: '预计收益',
        dataIndex: 'shop_order_profile',
        key: 'shop_order_profile',
        render: (text, record, index) => {
          return <span
            className='apply-amount'>￥{new BigNumber(parseFloat(record.shop_order_profile)).toFormat(2)}</span>
        }
      }, {
        title: '实际收益',
        dataIndex: 'brokerage',
        key: 'brokerage',
        render: (text, record, index) => {
          return <span
            className='apply-amount'>￥{new BigNumber(parseFloat(record.brokerage)).toFormat(2)}</span>
        }
      },
      {
        title: '结算完成时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (text, record, index) => {
          return <span>{moment.unix(text).format(dateFormat)}</span>
        }
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: (text, record, index) => {
          return <span>{text}</span>
        }
      },
    ];
    return (
      <div>
        <Title title={titleContent}/>
        <div className="distribute-list distribute-main">
          <div className="search-btn">
            <span className="ml10">订单号</span>
            <Input className="search-input ml10" value={order_sn} onChange={this.handleOrderNum} placeholder=""/>
            <span className="ml30">结算日期</span>
            <RangePicker className="ml10" value={dealTime} onChange={this.handleRangePicker.bind(this)}
                         format={Searchdate}
                         placeholder={['开始时间', '结束时间']}/>
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
          </div>
        </div>
      </div>
    );
  }
}

export default DistributionEarning;
