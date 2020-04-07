import React, {Component} from 'react';

import ListDetail from './common/ListDetail';
import Title from '../common/Title';
import OrderQuery from './common/OrderQuery';
import '../common/style/orderList.scss';

import {Tabs} from 'antd';

const {TabPane} = Tabs;


class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '订单列表',
      SearchData: '',
      activeKey: '1'
    };
    this.getSearchData = this.getSearchData.bind(this);
  }

  getSearchData(data) {
    this.setState({
      titleContent: '订单 - - 订单列表',
      activeKey: '1'
    });
    this._child.sendMessgae(data);
  }// activeKey
  render() {
    return (
      <div className='order-list-box'>
        <Title title={this.state.titleContent}/>
        <ListDetail wrappedComponentRef={(_child) => this._child = _child} statusType={this.props.match.params.status}/>

        {/* <Tabs type="card" activeKey={this.state.activeKey} onChange={(e)=>{
            if(e == 1){ 
              this.setState({
                titleContent:'订单 - - 订单列表',
                activeKey:e
              })
            }else if(e == 2){
              this.setState({
                titleContent:'订单 - - 订单查询',
                activeKey:e
              })
            }
          }}>
            <TabPane tab="订单列表" key="1">
                <ListDetail wrappedComponentRef={(_child) => this._child = _child}/>
            </TabPane>
            <TabPane tab="订单查询" key="2">
                <OrderQuery getSearchData={this.getSearchData}/>
            </TabPane>
          </Tabs> */}
      </div>
    )
  }
}

export default OrderList