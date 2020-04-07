import React, { Component } from 'react';
import { Tabs } from 'antd';
import Title from '../common/Title';
import BaseInfo from "./common/BaseInfo";
import ContactUs from "./common/ContactUs";
import CusServiceInfo from './common/CusServiceInfo';
import Credentials from './common/Credentials';
import { withRouter } from 'react-router';
import '../common/style/shopSet.scss'

const { TabPane } = Tabs;
 import '../common/style/orderList.scss';

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey:this.props.match.params.type?this.props.match.params.type:'1'
        }
    }
    render() {
         let { type } = this.props.match.params;
        let { activeKey } = this.state;

        return (
            <div className='shop-set-page'>
                <Title title={'店铺设置'} />
                <Tabs type="card" onChange={(e) => {
                    this.setState({
                        activeKey:e
                    })
                }} activeKey={activeKey}>
                    <TabPane tab="基本信息" key="1">
                        <BaseInfo activeKey={activeKey}/>
                    </TabPane>
                    <TabPane tab="联系我们" key="2">
                        <ContactUs activeKey={activeKey}/>
                    </TabPane>
                    <TabPane tab="客服信息" key="3">
                        <CusServiceInfo activeKey={activeKey}/>
                    </TabPane>
                    <TabPane tab="资质认证" key="4">
                        <Credentials activeKey={activeKey}/>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default withRouter(Help);
