import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import Title from '../common/Title';
import AccountList from "./common/AccountList";
import RealNameAuthentication from "./common/RealNameAuthentication";
import BindCard from './common/BindCard';
import { withRouter } from 'react-router';
import '../common/style/business.scss';

const { TabPane } = Tabs;

class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeKey: props.match.params.activeKey || '1'
		}
	}
	render() {
		const { activeKey } = this.state;
		const { loginInfo } = this.props;
		return (
			<div className='business-set-page'>
				<Title title={'账户'} />
				<Tabs 
					type="card" 
					activeKey={activeKey}
					onChange={(e) => {
						this.setState({
							activeKey: e
						})
					}}
				>
					<TabPane tab="账户资产" key="1">
						<AccountList activeKey={activeKey} />
					</TabPane>
					{
						// 2 个人公有店，4 个人私域店，5 个人私有店
						loginInfo.shopType === 2 || loginInfo.shopType === 4 || loginInfo.shopType === 5 ? (
							<TabPane tab="实名认证" key="2">
								<RealNameAuthentication activeKey={activeKey}/>
							</TabPane>
						) : null
					}
					<TabPane tab="绑定银行卡" key="4">
						<BindCard activeKey={activeKey} screenProps={this.props.screenProps} />
					</TabPane>
				</Tabs>
			</div>
		)
	}
}

const mapState = state => {
	return {
		loginInfo: state.sellerLogin.loginInfo
	}
}

export default connect(mapState, null)(withRouter(Account));