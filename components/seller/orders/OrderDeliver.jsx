import React, { Component } from 'react';
import { Tabs, Form, Icon, Input, Button, Select, Pagination, LocaleProvider } from 'antd';
import Title from '../common/Title';
import DeliverList from '../orders/common/DeliverList';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import '../common/style/orderList.scss'
const Search = Input.Search;
const { Option } = Select;


const { TabPane } = Tabs;
let data = [{
  serialNumber:'20190116124926677',
  orderNumber:'2019011687335',
  receiver:'唐中慧',
  subTime:'2019-05-30 14:45:12',
  deliverTime:'2019-05-30 15:19:37',
  supplier:'',
  status:'已发货',
  Operator:'epadmin'
},{
  serialNumber:'20190116124926678',
  orderNumber:'2019011687336',
  receiver:'姬无双',
  subTime:'2019-05-30 14:45:12',
  deliverTime:'2019-05-30 15:19:37',
  supplier:'',
  status:'已发货',
  Operator:'epadmin'
}]

class orderDeliver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //  titleContent: '订单 - - 全部缺货登记信息'
    }
  }
  handleSubmit(){

  }
  componentDidMount() {
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldsValue } = this.props.form;
    return (
      <div className='order-list-box'>
        <Title title={'订单 - - 发货单列表'} />
        <Tabs type="card">
          <TabPane tab={'发货单列表'} key="1">
          </TabPane>
        </Tabs>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('receiver', {
              // initialValue:111
              // rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                placeholder="发货单流水号"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('orderNumber', {
              // rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                placeholder="订单号"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('orderType', {
              initialValue: '订单类型'
              // rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Select size={'default'} style={{ width: 100 }}>
                <Option key={'请选择...'}>{'请选择...'}</Option>
                <Option key={'已发货'}>{'已发货'}</Option>
                <Option key={'退货'}>{'退货'}</Option>
                <Option key={'正常'}>{'正常'}</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('keyWord', {
              // rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              //  <Search
              //     placeholder="input search text"
              //     onSearch={value => console.log(value)}
              //     style={{ width: 200 }}
              //   />
              <Search placeholder="收货人" onSearch={value => console.log('getFieldsValue', getFieldsValue())} enterButton />
            )}
          </Form.Item>
        </Form>
        <DeliverList data={data}/>
        <div className='flex-center'>
          <LocaleProvider locale={zh_CN}>
            <Pagination
              // showSizeChanger
              // onShowSizeChange={this.onShowSizeChange}
              onChange={this.onPaginationChange}
              defaultCurrent={3}
              total={23}
            />
          </LocaleProvider>
        </div>
      </div>
    )
  }
}

const orderDeliverForm = Form.create()(orderDeliver);

export default orderDeliverForm;