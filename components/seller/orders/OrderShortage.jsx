import React, { Component } from 'react';
import Title from '../common/Title';
import { Tabs, Input, Table } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import lang from "assets/js/language/config"

const Search = Input.Search;

const { TabPane } = Tabs;
const columns = [
  {
    title: '编号',
    dataIndex: 'number',
    render: text => <a href="javascript:;">{text}</a>,
  },
  {
    title: '联系人',
    dataIndex: 'contacts',
  },
  {
    title: '缺货商品名',
    dataIndex: 'goodsName',
  },
  {
    title: '数量',
    dataIndex: 'count',
  },
  {
    title: '登记时间',
    dataIndex: 'registrationTime',
  },
  {
    title: '处理',
    dataIndex: 'Handle',
  },
  {
    title: '操作',
    dataIndex: 'opreation',
  },
];
const data = [
  {
    key: '1',
    number: '2019060317430967996',
    contacts: 32,
    goodsName: 'New York No. 1 Lake Park',
    count: '查看',
    registrationTime:'2019.04.15',
    Handle:'处理',
    opreation:'操作'
  },
  {
    key: '2',
    name: '2019060317430967997',
    age: 42,
    address: 'London No. 1 Lake Park',
    opreation: '查看'
  },
  {
    key: '3',
    name: '2019060317430967999',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    opreation: '查看'
  },
  {
    key: '4',
    name: '2019060317430967992',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
    opreation: '查看'
  },
];
class OrderShortage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '订单 - - 全部缺货登记信息'
    }
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className='order-list-box'>
        <Title title={this.state.titleContent} />
        <Tabs type="card">
          <TabPane tab={'全部缺货登记信息'} key="1">
          </TabPane>
        </Tabs>
        <Search placeholder="缺货商品名" onSearch={value => console.log('getFieldsValue', value)} enterButton style={{ width: 300,marginBottom:20 }} />
        <Table columns={columns} dataSource={[]} pagination={false} locale={{emptyText:lang.common.tableNoData}}/>
      </div>
    )
  }
}

export default OrderShortage;
