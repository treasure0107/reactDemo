import React, { Component } from 'react';
import Title from '../common/Title';
import IvdOrder from './common/IvdOrder';
import CelOrder from './common/CelOrder';
import OperationList from './common/OperationList';
import { withRouter } from "react-router";
import { Tabs } from 'antd';
const { TabPane } = Tabs;

class OrderOperation extends Component {
    constructor(props){
      super(props);
      this.state={
        pageControl:'form',  //list||form
        data:''
      }
      this.goListPage = this.goListPage.bind(this);
      this.goBack = this.goBack.bind(this);
    }
    componentDidMount(){
    }
    ShowTitleContent(type){
        // eslint-disable-next-line default-case
        switch (type) {
            case 'sub':
                type = "确认";
                break;
            case 'ivd':
                type = "无效";
                 break;
            case 'cel':
                type = "取消";
                 break;
            case 'del':
                type = "移除";
                break;
        }
        return type ; 
    }
    formView(type){
        const {params} = this.props.match;
        if(type == 'sub'){
          return <OperationList type={this.ShowTitleContent(params.type)}/>
        }else if(type == 'ivd'){
          return <IvdOrder goBack={this.goBack} goListPage={this.goListPage}/>
        }else if(type == 'cel'){
          return <CelOrder goBack={this.goBack} goListPage={this.goListPage}/>
        }else if(type == 'del'){
          return <OperationList type={this.ShowTitleContent(params.type)}/>
        }
    }
    goBack(){
        this.props.history.goBack();
    }
    goListPage(type,data){
      this.setState({
        pageControl:type,
        // 表单页面填写的内容
        data:data
      })
    }
    render() {
      const {params} = this.props.match;
      return (
        <div className='order-list-box'>
            <Title title={`订单 - - 订单操作：${this.ShowTitleContent(params.type)}`}/>
              <Tabs type="card">
                  <TabPane tab={`订单操作：${this.ShowTitleContent(params.type)}`} key="1">
                  </TabPane>
              </Tabs>
              
              {
                this.state.pageControl == 'form'?this.formView(params.type):<OperationList type={this.ShowTitleContent(params.type)}/>
              }
        </div>
      )
    }
  }
//   OrderOperation.PropTypes = {
//       type:PropTypes.string
//   }
  export default withRouter(OrderOperation);