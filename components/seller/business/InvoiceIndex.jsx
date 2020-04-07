import React, { Component } from 'react';
import { Tabs } from 'antd';
import Title from '../common/Title';
import NoInvoice from "./common/NoInvoice";
import InvoiceList from "./common/InvoiceList";
import { withRouter } from 'react-router';
import '../common/style/business.scss'

const { TabPane } = Tabs;
// import '../common/style/orderList.scss';

class Settlement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey:'1'
        }
    }
    render() {
        let {activeKey} = this.state;
        return (
            <div className='business-set-page'>
                <Title title={'发票'} />
                <Tabs type="card" onChange={(e) => {
                    this.setState({
                        activeKey:e
                    })
                }}>
                    <TabPane tab="待开票" key="1">
                        <NoInvoice activeKey={activeKey}/>
                    </TabPane>
                    <TabPane tab="发票列表" key="2">
                        <InvoiceList activeKey={activeKey}/>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default withRouter(Settlement);