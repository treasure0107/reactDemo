import React, { Component } from 'react';
import { Tabs } from 'antd';
import Title from '../common/Title';
const { TabPane } = Tabs;
 import '../common/style/orderList.scss';

class HelpDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className='seller-help-page'>
                <Title title={'帮助>平台规范'} />
                <div className='seller-help-content-box' style={{padding:'35px 24px 24px 24px'}}>
                    <div className='detail-title'>平台规范</div>
                    <div className='detail-content'>
                        等待后台数据
                    </div>
                </div>
            </div>
        )
    }
}

export default HelpDetail;
