import React, { Component } from 'react';
import { Tabs } from 'antd';
import Title from '../common/Title';
import SettlementFinish from "./common/SettlementFinish";
import Abnormal from "./common/Abnormal";
import NoSettlement from './common/NoSettlement';
import { withRouter } from 'react-router';
import '../common/style/business.scss'

const { TabPane } = Tabs;
// import '../common/style/orderList.scss';

class Settlement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey:this.props.match.params.type?this.props.match.params.type:'0'
        }
    }
    render() {
        let { activeKey } = this.state;
        return (
            <div className='business-set-page'>
                <Title title={'结算'} />
                <Tabs type="card" onChange={(e) => {
                    this.setState({
                        activeKey:e
                    })
                }} activeKey={activeKey}>
                    <TabPane tab="已完成" key="0">
                        <SettlementFinish activeKey={activeKey}/>
                    </TabPane>
                    <TabPane tab="异常结算" key="1">
                        <Abnormal activeKey={activeKey}/>
                    </TabPane>
                    <TabPane tab="待结算" key="2">
                        <NoSettlement activeKey={activeKey}/>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default withRouter(Settlement);