import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select, Radio, message, Modal, Checkbox, Tooltip } from 'antd';
import moment from 'moment';
import { CityData } from "assets/js/city";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import OssUpload from 'components/common/OssUpload'
import _ from 'lodash'
const { RangePicker } = DatePicker;
const options = CityData;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class BaseInfo extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			expand: false,
			data: {},
			logo: [],
			checkList: [],
			selectChange: 7,
			visible: false,
			shopUrl: null,
			privateDomainQrCode: ''
		}
	}

	componentDidMount() {
		const { activeKey, loginInfo: { shopLabel, shopType } } = this.props
		if (activeKey == 1) {
			httpRequest.get({
				 url: sellerApi.shop.baseInfo+localStorage.getItem('shopId')+'/',
				url: sellerApi.shop.baseInfo
			}).then(res => {
				this.setState({
					data: res.data,
					logo: res.data && res.data.log ? [{
						uid: '-1',
						name: '店铺logo.jpg',
						url: res.data.log,
						status: 'done',
					}] : [],
					checkList: res.data.server_commit ? res.data.server_commit.split(',') : [],
					selectChange: _.get(res, 'data.after_sale_day', 7),
					shopUrl: res.data.shop_url
				})
				 私域店
				if (shopType == 3 || shopType == 4) {
					httpRequest.get({
						url: sellerApi.shop.privateDomainQrCode,
						data: {
							shop_code: res.data.shop_url,
							logo_url: res.data.log
						}
					}).then(res => {
						if (res.code == 200) {
							this.setState({
								privateDomainQrCode: res.data
							})
						}
					})
				}
			})
			httpRequest.get({
				 url: sellerApi.shop.baseInfo+localStorage.getItem('shopId')+'/',
				url: sellerApi.shop.QrCode,
				data: {
					shop_id: +localStorage.getItem('seller_shop_id')
				}
			}).then(res => {
				this.setState({
					qrcodeImg: res.data
				})
			})
		}
		if (shopLabel && shopLabel.indexOf('0') > -1) {
			httpRequest.get({
				 url: sellerApi.shop.baseInfo+localStorage.getItem('shopId')+'/',
				url: sellerApi.shop.QrCode2,
				data: {
					shop_id: +localStorage.getItem('seller_shop_id'),
					shop_url: "pages/payBill/main"
				}
			}).then(res => {
				this.setState({
					qrcodeImg2: res.data
				})
			})
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeKey == 1 && nextProps.activeKey != this.props.activeKey) {
			httpRequest.get({
				 url: sellerApi.shop.baseInfo+localStorage.getItem('shopId')+'/',
				url: sellerApi.shop.baseInfo
			}).then(res => {
				this.setState({
					data: res.data,
					logo: res.data && res.data.log ? [{
						uid: '-1',
						name: '店铺logo.jpg',
						url: res.data.log,
						status: 'done',
					}] : [],
					checkList: res.data.server_commit ? res.data.server_commit.split(',') : [],
					selectChange: _.get(res, 'data.after_sale_day', 7),
					shopUrl: res.data.shop_url
				})
			})
		}
	}

	handleOnChange({ fileList }, imgUrl) {
		return fileList.map(file => ({
			status: file.status,
			uid: file.uid,
			url: file.url || imgUrl,   多图上传是，已上传的话，就取已上传的图片url
		}));
	};

	handleReset() {
		this.props.form.resetFields();
	};

	toggle() {
		const { expand } = this.state;
		this.setState({ expand: !expand });
	};
	onCheck = (e) => {
		this.setState({
			checkList: e
		})
	}
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
	toInviteVisit = () => {
		this.props.history.push('/seller/authority/invitevisit')
	};
	copyStoreUrl = () => {
		this.copyFn('#copyStoreUrl', "https:m.paipaiyin.cn/shop/" + localStorage.getItem('seller_shop_id') + "?tem=1")
	};
	copyShopUrl = () => {
		const { loginInfo } = this.props
		if (!this.state.shopUrl) {
			message.warn('请先自定义店铺地址并提交')
			return
		}
		this.copyFn(
			'#shopUrl',
			`${document.querySelector('#shopUrl').value}${this.state.shopUrl}`
		)
	}
	copyFn(targetEl, val) {
		let input = document.querySelector(targetEl);
		input.value = val;
		input.select();
		document.execCommand("copy");
		message.success('复制成功')
	}
	render() {

		const { form: { getFieldDecorator, getFieldsValue }, loginInfo } = this.props;
		let { data, logo, checkList, selectChange } = this.state;
		const isPrivateDomain = loginInfo.shopType == 3 || loginInfo.shopType == 4
    const domain = isPrivateDomain ? (window.location.href.indexOf('ppytest') > -1 ? 'https:mstest.paipaiyin.cn/store/' :'https:ms.paipaiyin.cn/store/') : (window.location.href.indexOf('ppytest') > -1 ? 'https:ppytest.paipaiyin.cn/store/' : '/store/')

    return (
			<div className='base-Info-box'>
				<Form className="order-search-form" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
					<Row gutter={24}>
						<Col span={24}>
							<Form.Item label={'公司名称'} labelCol={{ span: 3 }}>
								{data.company_name}
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={24}>
							<Form.Item label={'店铺名称'} labelCol={{ span: 3 }}>
								{data.shop_name}
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={24}>
							<Form.Item label={'店铺logo'} labelCol={{ span: 3 }}>
								{getFieldDecorator('log',
									{
										valuePropName: 'fileList',
										getValueFromEvent: this.handleOnChange,
										initialValue: logo, rules: [
											{
												required: true, message: 'logo不能为空',
											}
										],
									})(<OssUpload imgNumber={1} text={'上传图片'} />)}
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={24}>
							<Form.Item label={'自定义店铺地址'} labelCol={{ span: 3 }}>
								<Row gutter={6}>
									<input style={{ opacity: 0 }} id="shopUrl" value={domain} />
									<Col span={12} style={{ width: 'auto', marginRight: 0 }}>
										{domain}
									</Col>
									<Col span={10} style={{ width: 'auto' }}>
										<Form.Item>
											{getFieldDecorator('shop_url', {
												initialValue: data.shop_url,
												rules: [{
													validator: (rule, value, callback) => {
														var reg = /^[0-9a-zA-Z]+$/;
														if (reg.test(value) && value.toString().length <= 30 || !value) {
															callback();
														} else {
															callback(`30个以内的字母或数字`);
														}
													}
												}],

											})(<Input style={{ width: 120 }} />)}
										</Form.Item>
									</Col>
									<Col span={10} style={{ width: 'auto' }}>
										<Button type="primary" style={{ marginLeft: 15 }} onClick={this.copyShopUrl}>复制地址</Button>
									</Col>
									{
										loginInfo.shopType == 1 || loginInfo.shopType == 5 ? (
											<Col span={10} style={{ width: 'auto' }}>
												<Button type="primary" style={{ marginLeft: 15 }} onClick={this.toInviteVisit}>邀请访问</Button>
											</Col>
										) : null
									}
								</Row>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={24}>
							<Form.Item label={'经营项目'} labelCol={{ span: 3 }}>
								{getFieldDecorator('business_range', {
									initialValue: data.business_range,
								})(<Input.TextArea rows={4} style={{ width: 240 }} />)}
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={24}>
							<Form.Item label={'服务承诺'} labelCol={{ span: 3 }}>
								{getFieldDecorator('server_commit', {
									initialValue: Array.isArray(checkList) ? checkList : [],
								})(<Checkbox.Group onChange={this.onCheck}>
									<Checkbox value={'0'}>售后无忧</Checkbox>
									<Select onChange={this.selectChange} disabled={checkList.indexOf('0') == -1} value={selectChange} size={'default'} style={{ width: 80, marginRight: 15 }}>
										<Option key={'7天'} value={7}>{'7天'}</Option>
										<Option key={'14天'} value={14}>{'14天'}</Option>
									</Select>
									<Checkbox value={'1'}>急速出货</Checkbox>
									<Checkbox value={'2'}>专人设计</Checkbox>
									<Icon type="question-circle" style={{ cursor: 'pointer' }} onClick={this.showModal} />
								</Checkbox.Group>)}
							</Form.Item>
						</Col>
					</Row>

					{loginInfo.shopType == 0 || loginInfo.shopType  == 2?
						<Row gutter={24} style={{ marginTop: '24px', paddingTop: '24px', marginBottom: '24px', borderTop: 'solid thin #F0F0F0' }}>
							<Col span={14}>
								<Form.Item label={'本店小程序'}>
									<img src={this.state.qrcodeImg} style={{ width: 150, display: 'block' }} />
									<a href={this.state.qrcodeImg} download="logo.png" style={{ width: 150, textAlign: 'center', display: 'block' }}>下载小程序二维码</a>
								</Form.Item>
							</Col>
						</Row> : null}
					{loginInfo.shopLabel && loginInfo.shopLabel.indexOf('0') > -1 ?
						<Row gutter={24} style={{ marginTop: '24px', paddingTop: '24px', marginBottom: '24px', borderTop: 'solid thin #F0F0F0' }}>
							<Col span={14}>
								<Form.Item label={'本店买单码'}>
									<img src={this.state.qrcodeImg2} style={{ width: 150, display: 'block' }} />
									<a href={this.state.qrcodeImg2} download="logo.png" style={{ padding: "0 10px" }}>下载本店买单码</a>
									<Tooltip placement="top" title={"该二维码可用于在线下收款转账，以订单形式转入您的账户，可便您的生意更清晰"}>
										<Icon type="question-circle" style={{ cursor: 'pointer' }} />
									</Tooltip>
								</Form.Item>
							</Col>
						</Row> : null}
					{
						isPrivateDomain ? (
							<Row gutter={24} style={{ marginBottom: '24px' }}>
								<Col span={14}>
									<Form.Item label={'私域店二维码'}>
										<img src={this.state.privateDomainQrCode} style={{ width: 150,marginTop:"10px", display: 'block' }} />
										<a href={this.state.privateDomainQrCode} download={`${loginInfo.shopName}私域店.png`} style={{ padding: "0 10px" }}>下载H5私域店二维码</a>
									</Form.Item>
								</Col>
							</Row>
						) : null
					}
					{
						loginInfo.shopLabel && loginInfo.shopLabel.indexOf('0') > -1 ? (
							<Row gutter={24} style={{ marginTop: '24px', paddingTop: '24px', borderTop: 'solid thin #F0F0F0' }}>
								<Col span={14}>
									<Form.Item label={'终端访问地址'}>

										<div>
											https:m.paipaiyin.cn/shop/{localStorage.getItem('seller_shop_id')}?tem=1
                    <span style={{ marginLeft: "10px", color: "#e6240f", cursor: "pointer", textDecoration: "underline" }} onClick={this.copyStoreUrl}>复制地址</span>
											<input style={{ opacity: 0 }} id='copyStoreUrl' />
										</div>
									</Form.Item>
								</Col>
							</Row>
						) : null
					}
          <Row gutter={24}>
            <Col span={24} style={{ display: 'flex' }}>
              <div style={{ width: '12.5%' }}></div>
              <div style={{ width: 200 }}>
                <Button type="primary" onClick={() => {
                  this.props.form.validateFields((err, values) => {
                    if (!err) {
                      if (checkList.indexOf('0') != -1) {
                        values.after_sale_day = selectChange
                      }
                      values.log = values.log[0].url;
                      if (values.server_commit) {
                        values.server_commit = values.server_commit.toString();
                      }
                      httpRequest.post({
                         url: sellerApi.shop.baseInfo+localStorage.getItem('shopId')+'/',
                        url: sellerApi.shop.baseInfo,
                        data: {
                          ...values
                        }
                      }).then(res => {
                        this.setState({
                          shopUrl: res.data.shop_url
                        })
                        message.success('操作成功');
                         this.props.handleOk();
                      })
                    }
                  });
                }}>
                  提交
                </Button>
              </div>
            </Col>
          </Row>
				</Form>
				<Modal
					title="商家服务承诺说明"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					okText='知道了'
					className='severs-promise-box'
					cancelButtonProps={{
						style: {
							display: 'none'
						}
					}}
				>
					<div className='line-box'>
						售后无忧：
                        <div className='content-box'>
							商家承诺“售后无忧”服务，则商家在平台销售的所有品，如果出现问题，买家可以申请重印或退换货
                        </div>
					</div>
					<div className='line-box'>
						闪电配送：
                        <div className='content-box'>
							商家承诺“闪电配送”服务，则商家需在完成后3个工作日内，将品送达买家。
                        </div>
					</div>
					<div className='line-box'>
						专人设计：
                        <div className='content-box'>
							商家承诺“专人设计”服务，则商家可为买家提供一对一品设计服务，相关费用另议。
                        </div>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapState = (state) => {
	return {
		loginInfo: state.sellerLogin.loginInfo
	}
}

const BaseInfoForm = Form.create()(BaseInfo);
export default connect(mapState, null)(withRouter(BaseInfoForm));

