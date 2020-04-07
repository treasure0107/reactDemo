import React, { Component } from 'react';
import { Tabs,Button } from 'antd';
import Title from '../common/Title';
import NoInvoice from "./common/NoInvoice";
import InvoiceList from "./common/InvoiceList";
import { withRouter } from 'react-router';
import '../common/style/business.scss'

const { TabPane } = Tabs;
// import '../common/style/orderList.scss';

class InvoiceSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className='business-set-page'>
                <Title title={'成功'} />
                <div className='invoice-success-box'>
                    <div className='invoice-content-box'>
                        <div className='left-icon-box'>
                            <span className='iconqueding iconfont'></span>
                        </div>
                        <div className='right-content-box'>
                            <div className='invoice-number'>发票申请编号：<span className='number-detail'>{this.props.match.params.number}</span></div>
                            <div className='invoice-content'>
                                恭喜您，您的发票已经申请成功，我们将在3~5个工作日开出发票，请耐心等待。 您可在发票列表内查看您的发票处理状态。
                            </div>
                            <div>
                                <Button type="primary" onClick={()=>{
                                    this.props.history.push('/seller/business/invoice')
                                }}>返回</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(InvoiceSuccess);