import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select, Radio, message, Modal, Tooltip, Spin } from 'antd';
import moment from 'moment';
import { CityData } from "assets/js/city";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import OssUpload from 'components/common/OssUpload'
import _ from 'lodash'
import { withRouter } from 'react-router';
import Title from '../common/Title';
import lang from "assets/js/language/config"
import comUtil from 'utils/common.js'
import InvoiceCompany from './common/InvoiceCompany'
import RepeatButton from 'components/common/RepeatButton'
import Handling from 'components/common/Handling'

import '../common/style/business.scss'

const { RangePicker } = DatePicker;
const options = CityData;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
let width = 180;
// 最小提现金额
let minMoney = 10;
let span = 20;
let offset = 4;
class CashWithdrawal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			expand: false,
			listData: [],
			logo: [],
			redioIndex: 1,
			selectChange: 7, visible: false, fetching: false,
			value: [], provinceList: [], cityList: [], data: {},
		}
		this.lastFetchId = 0;
		this.fetchUser = _.debounce(this.fetchUser, 800);
	}

	componentDidMount() {
		let { shopType } = this.props.screenProps;
		this.getWithdrawal();
		if (shopType == 2 || shopType == 4 || shopType == 5) {
			// this.getWithdrawal();
		} else {
			this.getProviderList();
		}
	}
	getWithdrawal = () => {
		httpRequest.get({
			url: sellerApi.business.getWithdrawal,
		}).then(res => {
			this.setState({
				data: res.data,
			})
		})
	}

	getProviderList = () => {
		httpRequest.get({
			url: sellerApi.business.bankProvince,
		}).then(res => {
			this.setState({
				provinceList: res.data ? res.data : [],
			})
		})
	}

	getCityList = (provider) => {
		this.props.form.setFieldsValue({
			city_name: '', bank_name: ''
		})
		httpRequest.get({
			url: sellerApi.business.bankCity,
			data: {
				province_name: provider.replace(/[\r\n]/g, "")
			}
		}).then(res => {
			this.setState({
				cityList: res.data ? res.data : [],
			})
		})
	}

	// submitPersonalOpreat = (values) => {
	// 	let { data } = this.state;
	// 	values.bank_name = _.get(this.state, 'data.bank_name_master');
	// 	values.bank_account = data.bank_account;
	// 	values.company_name = data.company_name;
	// 	console.log('values', values)
	// 	httpRequest.post({
	// 		url: sellerApi.business.submitWithdrawal,
	// 		data: {
	// 			...values
	// 		}
	// 	}).then(res => {
	// 		message.success('操作成功');
	// 		this.props.history.goBack();
	// 	})
	// }

	submitOpreat = (values, isCompany) => {
		let { data } = this.state;
		// let company_name = _.get(data, 'company_name')
		// let bank_account = _.get(data, 'bank_account')
		if (isCompany) {
			values.bank_name_master = _.get(this.state, 'data.bank_name_master');
			values.prov_name = values.prov_name.replace(/[\r\n]/g, "")
		} else {
			values.bank_name = _.get(this.state, 'data.bank_name_master');
		}
		values.bank_account = data.bank_account;
		values.company_name = data.company_name;
		if (!values.bank_name || !values.bank_account) {
			message.warn('请先绑定银行卡')
			return
		}
		Handling.start();
		httpRequest.post({
			url: sellerApi.business.submitWithdrawal,
			data: {
				...values
			}
		}).then(res => {
			if (res.code == 200) {
				message.success('操作成功');
				Handling.stop();
				this.props.history.goBack();
			}
		}).catch(res => {
			Handling.stop();
		})
	}

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


	selectChange = (e) => {
		this.setState({
			selectChange: e
		})
	}


	showModal = () => {
		this.setState({
			visible: true,
		});
	};
	handleOk = e => {
		this.setState({
			visible: false,
		});
	};
	handleCancel = e => {
		this.setState({
			visible: false,
		});
	};



	fetchUser = value => {
		this.lastFetchId += 1;
		const fetchId = this.lastFetchId;
		this.setState({ listData: [] });

		let { prov_name, city_name } = this.props.form.getFieldsValue();
		let bank_name_master = _.get(this.state, 'data.bank_name_master', lang.common.isNull)
		let data = {}
		if (prov_name) data.province_name = prov_name.replace(/[\r\n]/g, "");
		if (city_name) data.city_name = city_name;
		if (!value) {
			this.setState({ fetching: false })
			// for fetch callback order
			return;
		} else {
			this.setState({ fetching: true })
		}
		httpRequest.get({
			url: sellerApi.business.getBankName,
			data: {
				...data,
				bank_name: bank_name_master,
				input_name: value
			}
		}).then(res => {
			if (fetchId !== this.lastFetchId) {
				return;
			}
			let listData = _.get(res, 'data', []).map(user => ({
				text: user.branch_bank_name,
				value: user.branch_bank_name,
			}));
			this.setState({ listData, fetching: false });
		}).catch(() => {
			if (fetchId !== this.lastFetchId) {
				// for fetch callback order
				return;
			}
		})

		// fetch(sellerApi.business.getBankName)
		//   .then(response => response.json())
		//   .then(body => {
		//     if (fetchId !== this.lastFetchId) {
		//       // for fetch callback order
		//       return;
		//     }
		//     const listData = body.results.map(user => ({
		//       text: `${user.name.first} ${user.name.last}`,
		//       value: user.login.username,
		//     }));
		//     this.setState({ listData, fetching: false });
		//   });
	};

	handleChange = value => {
		this.props.form.setFieldsValue({
			bank_name: value
		})
		this.setState({
			value,
			listData: [],
			fetching: false,
		});
	};

	// 修改银行卡号
	toEditBankCard = () => {
		this.props.history.push('/seller/business/account/4')
	}
	render() {
		const { getFieldDecorator, setFieldsValue } = this.props.form;
		let { listData, logo, redioIndex, selectChange, fetching, value, provinceList, cityList, data } = this.state;
		let company_name = _.get(data, 'company_name')
		let user_name = _.get(data, 'user_name')
		let bank_account = _.get(data, 'bank_account')
		let bank_name_master = _.get(data, 'bank_name_master')
		let balance = _.get(data, 'balance', 0)
		let frozen_money = _.get(data, 'frozen_money', 0)
		let { shopType } = this.props.screenProps;
		let isPersonalShop = shopType == 2 || shopType == 4 || shopType == 5;
		// let company_name = _.get(data,'company_name',lang.common.isNull)
		return (

			<div className='business-set-page'>
				<Title title={'申请提现'} />
				<div className='account-Info-box'>
					{
						!isPersonalShop ? (
							<div className='money-detail-box'>
								<div className='money-detail' style={{ margin: 0 }}>
									<div>
										<span className='shop-title'>可用店余额（￥）</span><Tooltip placement="top" title={'可用店铺余额=店铺余额-不可用店铺余额'}>
											<Icon type="question-circle" />
										</Tooltip>
										<span>(不可用店铺余额{frozen_money}元)</span>
									</div>
									<div className='second-box'>
										<span className='shop-price'>{balance}</span>
									</div>
								</div>
							</div>
						) : null
					}
					{
						isPersonalShop ?
							<Form className="order-search-form" labelCol={{ span: offset }} wrapperCol={{ span: 18 }}>
								<Row gutter={24}>
									<Col span={span}>
										<Form.Item label={'真实姓名：'}>
											{company_name}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span}>
										<Form.Item label={'可提现金额：'}>
											￥{balance}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span}>
										<Form.Item label={'银行名称：'}>
											<div className='bank-name-box'>
												<div className='bank-name-master'>{bank_name_master || '未绑定'}</div>
												<div className='change-bank-info' onClick={this.toEditBankCard}>{bank_name_master ? '修改银行卡信息' : '绑定银行卡'}</div>
											</div>
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span}>
										<Form.Item label={'银行卡号：'}>
											{bank_account || '未绑定'}
										</Form.Item>
									</Col>
								</Row>

								<Row gutter={24}>
									<Col span={span}>
										<div>
											<Form.Item label={'提现金额：'}>
												{getFieldDecorator('withdraw_money', {
													initialValue: data.withdraw_money, rules: [
														{
															required: true, whitespace: true, validator: (rule, value, callback) => {
																comUtil.moneyLimit(rule, value, callback, {
																	min: minMoney,
																	max: balance,
																	content: `提现最低不能小于${minMoney},最大不能超过您店铺可用金额${balance},小数保留2位，请重新输入`, firstContent: '请输入提现金额'
																})
															}
														}
													],
												})(<Input placeholder="" style={{ width: width, marginRight: 10 }} />)}
												元, 提现金额最低为10元(人民币)且提现金额不能为空
                                </Form.Item>
										</div>
									</Col>
								</Row>
								{/* <Row gutter={24}>
                        <Col span={span}>
                            <Form.Item label={'手机号码：'} className='get-code'>
                                {company_name}
                            </Form.Item>
                        </Col>
                    </Row> */}
								<Row gutter={24}>
									<Col span={span}>
										<Col span={18} offset={offset} style={{ paddingLeft: 0, marginBottom: 14 }}>
											<div style={{ width: 200 }}>
												<RepeatButton type="primary" onClick={() => {
													this.props.form.validateFields((err, values) => {
														if (!err) {
															//  delete values.shop_name;
															this.submitOpreat(values)
														}
													});
												}}>
													提交
                        </RepeatButton>
												<Button style={{ marginLeft: 8 }} onClick={() => {
													this.props.history.goBack()
												}}>
													返回
                        </Button>
											</div>
										</Col>
									</Col>
								</Row>
							</Form> :
							<Form className="order-search-form" labelCol={{ span: offset }} wrapperCol={{ span: 18 }}>
								<Row gutter={24}>
									<Col span={16}>
										<Form.Item label={'公司名称'}>
											{company_name}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={16}>
										<Form.Item label={'公司银行账号：'}>
											{bank_account}
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={16}>
										<Form.Item label={'开户银行：'}>
											{bank_name_master}
										</Form.Item>
									</Col>
								</Row>

								<Row gutter={24}>
									<Col span={span}>
										<Form.Item label={'开户省市：'}>
											{getFieldDecorator('shop_name', {
												initialValue: 1,
												rules: [
													{
														required: true, message: '公司银行账户不能为空'
													}
												],
											})(<Input placeholder="" style={{ width: width, display: 'none' }} />)}
											<div className='business-location'>
												<Form.Item style={{ marginBottom: 0 }}>
													{getFieldDecorator('prov_name', {
														initialValue: '',
														rules: [
															{
																required: true, message: '省不能为空'
															}
														],
													})(<Select placeholder="" style={{ width: 145 }} onChange={(e) => {
														this.getCityList(e)
													}}>
														<Option value=''>{'省'}</Option>
														{
															provinceList.map((item, index) => {
																return <Option value={item} key={index}>{item}</Option>
															})
														}
													</Select>
													)}
												</Form.Item>
												<Form.Item style={{ marginBottom: 0 }}>
													{getFieldDecorator('city_name', {
														initialValue: '',
														rules: [
															{
																required: true, message: '市不能为空'
															}
														],
													})(<Select placeholder="" style={{ width: 145 }} onChange={() => {
														this.props.form.setFieldsValue({
															bank_name: ''
														})
													}}>
														<Option value=''>{'市'}</Option>
														{
															cityList.map((item, index) => {
																return <Option value={item} key={index}>{item}</Option>
															})
														}
													</Select>)}
												</Form.Item>
											</div>
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span}>
										<Form.Item label={'开户支行：'}>
											{getFieldDecorator('bank_name', {
												// initialValue: data.shop_name,
												rules: [
													{
														required: true, message: '公司银行账户不能为空'
													}
												],
											})(<Select
												showSearch
												// labelInValue
												// value={value}
												//  placeholder="Select users"
												notFoundContent={fetching ? <Spin size="small" /> : '暂无数据'}
												filterOption={false}
												onSearch={this.fetchUser}
												onChange={this.handleChange}
												style={{ width: 400 }}
											>
												{listData.map(d => (
													<Option key={d.value}>{d.text}</Option>
												))}
											</Select>)}
										</Form.Item>
									</Col>
								</Row>
								{/* <Row gutter={24}>
                            <Col span={16}>
                                <Form.Item label={'支行详细地址：'}>
                                    {getFieldDecorator('addr', {
                                        initialValue: data.business_range, rules: [
                                            {
                                                required: true, message: '详细地址不能为空', whitespace: true
                                            }
                                        ],
                                    })(<Input.TextArea rows={4} style={{ width: width }} />)}
                                </Form.Item>
                            </Col>
                        </Row> */}
								<Row gutter={24}>
									<Col span={span}>
										<div>
											<Form.Item label={'提现金额：'}>
												{getFieldDecorator('withdraw_money', {
													initialValue: data.withdraw_money, rules: [
														{
															required: true, whitespace: true, validator: (rule, value, callback) => {
																comUtil.moneyLimit(rule, value, callback, {
																	min: minMoney,
																	max: balance,
																	content: `提现最低不能小于${minMoney},最大不能超过您店铺可用金额${balance},小数保留2位，请重新输入`, firstContent: '请输入提现金额'
																})
															}
														}
													],
												})(<Input placeholder="" style={{ width: width, marginRight: 10 }} />)}
											</Form.Item>
										</div>
									</Col>
								</Row>
								<Row gutter={24}>
									<Col span={span}>
										<Col span={18} offset={offset} style={{ paddingLeft: 0, marginBottom: 14 }}>
											<div className='cash-tips-info'>
												请注意，2019年7月起商家提现，需先给平台开具提现等额的增值税专用发票（13%）。开具后请快递至公司地址，平台收到发票后，会尽快安排打款。
                                        <a onClick={() => {
													this.showModal()
												}}>点击此处查看开票信息详情</a>
											</div>
										</Col>
									</Col>
								</Row>

								<Row gutter={24}>
									<Col span={span}>
										<Col span={18} offset={offset} style={{ paddingLeft: 0, marginBottom: 14 }}>
											<div style={{ width: 200 }}>
												<RepeatButton type="primary" onClick={() => {
													this.props.form.validateFields((err, values) => {
														if (!err) {
															delete values.shop_name;
															this.submitOpreat(values, true)
														}
													});
												}}>
													提交
                        </RepeatButton>
												<Button style={{ marginLeft: 8 }} onClick={() => {
													this.props.history.goBack()
												}}>
													返回
                        </Button>
											</div>
										</Col>
									</Col>
								</Row>
							</Form>
					}
				</div>
				<Modal
					title="开票信息"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					okText='确认'
					cancelButtonProps={{ style: { display: 'none' } }}
					className='invoice-company-modal'
				>
					<InvoiceCompany />
				</Modal>
			</div>
		);
	}
}

export default withRouter(Form.create()(CashWithdrawal));

