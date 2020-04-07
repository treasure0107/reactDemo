import React from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, Radio, message, Modal } from 'antd';
import { bankList } from "assets/js/city";
import 'moment/locale/zh-cn';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import _ from 'lodash'
import RepeatButton from 'components/common/RepeatButton'
import CountdownPhone from 'components/common/CountdownPhone';

const { Option } = Select;
let span = 17
let offset = 5;
let Countdown = 60;
class BindCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			expand: false,
			data: {},
			isShowCard: true,
			time: 0
		}
	}

	componentDidMount() {
		this.getBank_Card()
	}
	componentWillReceiveProps(nextProps) {
		// console.log('didMount2222')
		if (nextProps.activeKey == '4' && nextProps.activeKey != this.props.activeKey) {
			this.getBank_Card()
		}
	}
	getBank_Card = () => {
		httpRequest.get({
			url: sellerApi.business.getBank_Card,
		}).then(res => {
			this.setState({
				data: res.data ? res.data : {}
			})
			if (res.data.id) {
				this.setState({
					isShowCard: true
				})
			}
		})
	}

	// getPerson_Bank_Card = () => {
	// 	httpRequest.get({
	// 		url: sellerApi.business.personal_bank,
	// 	}).then(res => {
	// 		this.setState({
	// 			data: res.data ? res.data : {}
	// 		})
	// 	})
	// }

	handleOnChange({ fileList }, imgUrl) {
		return fileList.map(file => ({
			status: file.status,
			uid: file.uid,
			url: file.url || imgUrl,  // 多图上传是，已上传的话，就取已上传的图片url
		}));
	};

	handleReset() {
		this.props.form.resetFields();
	};

	toggle() {
		const { expand } = this.state;
		this.setState({ expand: !expand });
	};
	ChangeCard = (e) => {
		this.setState({
			isShowCard: e
		})
	}

	// 发送验证码
	sendCode = () => {
		httpRequest.post({
			url: sellerApi.business.sendCode,
			data: {
				mobile: this.state.data.mobile
			}
		}).then(res => {
			if (res.code == 200) {
				message.success('验证码已发送')
				this.setState({
					time: Countdown
				})
			}
 		})
	}

	render() {
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		let { data, isShowCard, time } = this.state;
		let company_name = _.get(this.state, 'data.company_name', '');
		let account_number = _.get(this.state, 'data.account_number', '');
		let bank_name_master = _.get(this.state, 'data.bank_name_master', '');

		let user_name = _.get(this.state, 'data.user_name', '');
		let mobile = _.get(this.state, 'data.mobile', '');

		let card_id = _.get(this.state, 'data.id', '');
		let { shopType } = this.props.screenProps;
		const isPersonalShop = shopType == 2 || shopType == 4 || shopType == 5; // 2 个人公有店，4 个人私域店，5 个人私有店
		return (
			<div className='account-Info-box'>
				{
					// 已绑卡
					isShowCard && card_id ? (
						<div className='card-bg-box'>
							<div className='card-title'>{bank_name_master}</div>
							<div className='card-number'>{account_number}</div>
							{
								isPersonalShop ? <div className='user_detail'>{company_name} {mobile}</div> : null
							}

							<div className='card-opreat' onClick={() => {
								this.ChangeCard(false)
							}}>
								<div className='opreat-btn' onClick={() => {
									this.ChangeCard(false)
								}}>修改绑定</div>
							</div>
						</div>
					) : (
						isPersonalShop ? (
							<Form className="order-search-form" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
								<Row gutter={24}>
									<Col span={span}>
										<Form.Item label={'开户名'}>
											{company_name}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span}>
										<Form.Item label={'银行卡号'}>
											{getFieldDecorator('account_number', {
												initialValue: account_number,
												rules: [
													{
														required: true, message: '银行卡号不能为空', whitespace: true
													}
												],
											})(<Input placeholder="" style={{ width: 240 }} />)}
											{/* <span className='introduce'>推荐使用<span className='c-btn' onClick={() => {
												this.props.form.setFieldsValue({
													bank_name_master: '工商银行'
												})
											}}>工商银行</span>，提现到账快人一步</span> */}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span}>
										<Form.Item label={'开户银行'}>
											{getFieldDecorator('bank_name_master', {
												initialValue: bank_name_master ? bank_name_master : '',
												rules: [
													{
														required: true, message: '开户银行不能为空', whitespace: true
													}
												],
											})(
												<Select
													showSearch
													style={{ width: 240 }}
													placeholder="Select a person"
													optionFilterProp="children"
													filterOption={(input, option) =>
														option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
													}
												>
													<Option value={''}>{'请选择'}</Option>
													{
														bankList.map((item, index) => {
															return <Option key={index} value={item}>{item}</Option>
														})
													}
												</Select>
											)}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span}>
										<Form.Item label={'手机号码'}>
											{mobile}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span}>
										<Col span={18} offset={offset} style={{ paddingLeft: 0, marginBottom: 14 }}>绑定银行卡用于平台余额提现，请仔细核对所绑定的银行卡信息，确保真实有效。</Col>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span}>
										<Form.Item label={'手机验证码：'}>
											{getFieldDecorator('mobile_code', {
												rules: [
													{
														required: true, message: '手机验证码不能为空'
													}
												],
											})(<Input placeholder="" style={{ width: 120, marginRight: 10 }} />)}
											<RepeatButton
												type="primary"
												disabled={time > 0}
												onClick={this.sendCode}
											>
												{/* 获取手机验证码 */}
												<CountdownPhone time={time} successContext={'获取手机验证码'} successCallBack={() => {
													this.setState({
														time: 0
													})
												}} />
											</RepeatButton>
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span}>
										<Col span={18} offset={offset} style={{ paddingLeft: 0, marginBottom: 14 }}>手机验证码发送到开设本店铺的会员手机号码。</Col>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span} style={{ display: 'flex' }}>
										<div style={{ width: '20.83333333%' }}></div>
										<div style={{ width: 200 }}>
											<RepeatButton
												type="primary"
												onClick={() => {
													this.props.form.validateFields((err, values) => {
														console.log('values', values)
														if (!err) {
															if (card_id) {
																httpRequest.put({
																	url: sellerApi.business.editBank_Card,
																	data: {
																		...values,
																		id: card_id
																	}
																}).then(res => {
																	message.success('操作成功');
																	this.getBank_Card()
																	this.ChangeCard(true)
																	// this.props.handleOk();
																})
															} else {
																httpRequest.post({
																	url: sellerApi.business.editBank_Card,
																	data: {
																		...values
																	}
																}).then(res => {
																	message.success('操作成功');
																	this.getBank_Card()
																	this.ChangeCard(true)

																	// this.props.handleOk();
																})
															}
														}
													});
												}}
											>
												提交
                      </RepeatButton>
											<RepeatButton
												style={{ marginLeft: 8 }}
												onClick={() => {
													this.ChangeCard(true)
												}}
											>
												取消
                      </RepeatButton>
										</div>
									</Col>
								</Row>
							</Form>
						) : (
							<Form className="order-search-form" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
								<Row gutter={24}>
									<Col span={16}>
										<Form.Item label={'公司名称'}>
											{company_name}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={16}>
										<Form.Item label={'公司银行账户'}>
											{getFieldDecorator('account_number', {
												initialValue: account_number,
												rules: [
													{
														required: true, message: '公司银行账户不能为空', whitespace: true
													}
												],
											})(<Input placeholder="" style={{ width: 240 }} />)}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={16}>
										<Form.Item label={'开户银行'}>
											{getFieldDecorator('bank_name_master', {
												initialValue: bank_name_master ? bank_name_master : '',
												rules: [
													{
														required: true, message: '开户银行不能为空', whitespace: true
													}
												],
											})(<Select placeholder="" style={{ width: 240 }} showSearch
												style={{ width: 240 }}
												placeholder="Select a person"
												optionFilterProp="children"
												// onChange={onChange}
												// onFocus={onFocus}
												// onBlur={onBlur}
												// onSearch={onSearch}
												filterOption={(input, option) =>
													option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
												}>
												<Option value={''}>{'请选择'}</Option>
												{
													bankList.map((item, index) => {
														return <Option key={index} value={item}>{item}</Option>
													})
												}

											</Select>
											)}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={16} style={{ display: 'flex' }}>
										<div style={{ width: '20.83333333%' }}></div>
										<div style={{ width: 200 }}>
											<RepeatButton type="primary" onClick={() => {
												this.props.form.validateFields((err, values) => {
													if (!err) {
														if (card_id) {
															httpRequest.put({
																url: sellerApi.business.editBank_Card,
																data: {
																	// shop_id: parseInt(localStorage.getItem('shopId')),
																	...values,
																	id: card_id
																}
															}).then(res => {
																message.success('操作成功');
																this.getBank_Card()
																this.ChangeCard(true)
																// this.props.handleOk();
															})
														} else {
															httpRequest.post({
																url: sellerApi.business.editBank_Card,
																data: {
																	// shop_id: parseInt(localStorage.getItem('shopId')),
																	...values
																}
															}).then(res => {
																message.success('操作成功');
																this.getBank_Card()
																this.ChangeCard(true)
																// this.props.handleOk();
															})
														}
													}
												});
											}}>
												提交
                      </RepeatButton>
											<RepeatButton style={{ marginLeft: 8 }} onClick={() => {
												this.ChangeCard(true)
											}}>
												取消
                      </RepeatButton>
										</div>
									</Col>
								</Row>
							</Form>
						)
					)
				}
			</div>
		);
	}
}

export default Form.create()(BindCard);

