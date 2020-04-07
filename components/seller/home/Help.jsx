import React, { Component } from 'react';
import { Tabs } from 'antd';
import Title from '../common/Title';
import { withRouter } from 'react-router';
import httpRequest from 'utils/ajax'

const { TabPane } = Tabs;
 import '../common/style/orderList.scss';

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
        httpRequest.get({
            url: '/api/server_doc/doc_center/category',
             data:{
                 shop_id:100,
             }
        }).then(res => {
            console.log(res);
            if(res.code=="200"){
                this.setState({
                    mseList:res.data
                })
            }
        })
    }
    render() {
        return (
            <div className='seller-help-page'>
                <Title title={'商家帮助中心'} />
                <Tabs type="card" onChange={(e) => {
                }}>
                    <TabPane tab="常见" key="1">
                    </TabPane>
                    <TabPane tab="商品" key="2">
                    </TabPane>
                    <TabPane tab="订单" key="3">
                    </TabPane>
                    <TabPane tab="售后" key="4">
                    </TabPane>
                    <TabPane tab="资质" key="5">
                    </TabPane>
                </Tabs>
                <div className='seller-help-content-box'>
                    {
                        ['拍拍打印平台规则话您知',
                            '如何申请商家资质认证标签',
                            '如何在接单时修改价格、备注服务',
                            '几种不同情况的售后问题及处理方式',
                            '关于商家提现'
                        ].map((item, index) => {
                            return <div className='list-box' key={new Date().getTime() + index} onClick={()=>{
                                this.props.history.push('/seller/home/helpDetail');
                            }}>
                                {/* {`${index + 1}、${item}`} */}
                                <div className='sign'></div>{`${item}`}
                            </div>
                        })
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(Help);
