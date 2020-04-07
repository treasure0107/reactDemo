import React, { Component } from 'react';
import { Tabs } from 'antd';
import Title from '../common/Title';
import WaitOffer from "./common/WaitOffer";
import HasOffer from "./common/HasOffer";
import { withRouter } from 'react-router';
import '../common/style/home.scss'

const { TabPane } = Tabs;
 import '../common/style/orderList.scss';

class SendOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey:this.props.match.params.status?this.props.match.params.status:'1'
        }
    }
    render() {
        let {activeKey} = this.state;
        return (
            <div className='home-set-page'>
                <Title title={'报价抢单'} />
                <Tabs type="card" activeKey={activeKey} onChange={(e) => {
                    this.setState({
                        activeKey:e
                    })
                }}>
                    <TabPane tab="待报价" key="1">
                        <WaitOffer activeKey={activeKey}/>
                    </TabPane>
                    <TabPane tab="已报价" key="2">
                        <HasOffer activeKey={activeKey}/>
                        {/* <InvoiceList activeKey={activeKey}/> */}
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default withRouter(SendOffer);
