import React, { Component } from 'react';
import { Tabs, Form, Input, Select, Pagination, DatePicker, Row, Col, Button } from 'antd';
import ListTableDetail from './ListTableDetail';
import Handling from 'components/common/Handling';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import { BigNumber } from 'bignumber.js';
import comUtil from 'utils/common.js'

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import _ from 'lodash'

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm';
const Searchdate = 'YYYY-MM-DD';

let pageSize = 5;
const { Option } = Select;
const Search = Input.Search;
const { TabPane } = Tabs;

class ListDetail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			typeCount: {},
			page: 1,
			status: props.statusType ? props.statusType : '10',
			values: {
				order_goods: '',
				order_sn: '',
				order_type: '',
				user_id: '',
			}
		}
		this.onPaginationChange = this.onPaginationChange.bind(this);
	}
	// 获取订单查询页面的查询条件数据
	SubSearchData = () => {
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (values.dealTime) {
					if (values.dealTime.length > 0) {
						let use_start_time = moment(values.dealTime[0]).format(Searchdate) + ' 00:00';
						let use_end_time = moment(values.dealTime[1]).format(Searchdate) + ' 23:59';
						// moment(time).valueOf();
						values.create_start_time = moment(use_start_time).unix()
						//  moment(values.dealTime[0]).format(dateFormat);
						values.create_end_time = moment(use_end_time).unix()
						// moment(values.dealTime[1]).format(dateFormat);
					}
				}
				for (let key in values) {
					if (!values[key]) {
						delete values[key];
					}
				}
				delete values.dealTime;
				this.setState({
					values: values
				}, () => {
					values.size = pageSize;
					values.page = 1;
					// 搜索接口
					this.getListData(values);
				})
			} else {
				//_this.props.changeLoginState(false)
			}
		});

		// let Data = getFieldsValue();
		// Data.orderState == '订单状态' ? '' : orderState;
		// Data.orderType == '订单类型' ? '' : orderType;
	}

	componentDidMount() {
		this.getListData({
			page: 1,
			size: pageSize
		});
		// this.getStatusCount();
	}

	getListData = (data, type) => {
		let { status, total, values } = this.state;
		if (status != 10) {
			if (status == 8) { // 售后/退款中
				data.is_after = 1;
			} else {
				data.status = status;
			}
			if (total % pageSize == 1 && type == 'put' && data.page > 1) {
				data.page = data.page - 1;
			}
		}
		Handling.start();
		for (let key in values) {
			if (!values[key]) {
				delete values[key]
			}
		}
		this.setState({
			page: data.page
		})
		httpRequest.get({
			url: sellerApi.order.orderList,
			data: {
				// user_id:parseInt(this.deleteId),
				//    shop_id:parseInt(localStorage.getItem('shopId')),
				//    user_id:parseInt(localStorage.getItem('user_id')),
				...values,
				...data,
				source_key: 'pc'
			}
		}).then(res => {
			this.setState({
				data: _.defaultTo(_.get(res, 'data.data', []), []),
				total: _.defaultTo(_.get(res, 'data.total', 0), 0),
				typeCount: _.defaultTo(_.get(res, 'status_count', {}), {})
			});
			Handling.stop();
		}).catch(() => {
			Handling.stop();
		})
	}

	// getStatusCount=()=>{
	//     httpRequest.get({
	//         url:sellerApi.order.getStatusCount,
	//       }).then(res =>{
	//           this.setState({
	//             typeCount:_.defaultTo(_.get(res,'data',{}),{}),
	//           })
	//       })
	// }

	tabChange = (e) => {
		this.setState({
			status: e
		}, () => {
			this.getListData({
				page: 1,
				size: pageSize,
			});
		})
	}
	onPaginationChange(pageNumber, current) {
		this.getListData({ page: pageNumber, size: pageSize });
		this.setState({
			page: pageNumber
		})
	}
	onShowSizeChange(current, pageSize) {
		// console.log(current, pageSize);
	}

	onRef = (ref) => {
        this.ListTableDetail = ref
    }

	render() {
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		let { data, total, typeCount, page, status } = this.state;
		return (
			<div>
				<div className='form-box'>
					<Form layout="inline" onSubmit={this.handleSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
						<Row gutter={24}>
							<Col span={6}>
								<Form.Item label={'订单号'}>
									{getFieldDecorator('order_sn', {

									})(<Input
										placeholder="订单号"
										style={{ width: 160 }}
									/>)}
								</Form.Item>
							</Col>
							<Col span={6}>
								<Form.Item label={'用户名'}>
									{getFieldDecorator('username', {

									})(<Input
										placeholder="用户名"
										style={{ width: 160 }}
									/>)}
								</Form.Item>
							</Col>
							<Col span={6}>
								<Form.Item label={'订单类型'}>
									{getFieldDecorator('order_type', {
										initialValue: ''
										// rules: [{ required: true, message: 'Please input your username!' }],
									})(
										<Select size={'default'} style={{ width: 160 }}>
											<Option key={'全部订单'} value={''}>{'全部订单'}</Option>
											{/* <Option key={'库存商品订单'} value={'0'}>{'库存商品订单'}</Option> */}
											<Option key={'生产类订单'} value={'1'}>{'生产类订单'}</Option>
											<Option key={'定制商品订单'} value={'2'}>{'定制商品订单'}</Option>
											<Option key={'分期类订单'} value={'3'}>{'分期类订单'}</Option>
											<Option key={'采购类订单'} value={'6'}>{'采购类订单'}</Option>
											<Option key={'自提订单'} value={'7'}>{'自提订单'}</Option>
											<Option key={'线下快印订单'} value={'8'}>{'线下快印订单'}</Option>
											<Option key={'分销订单'} value={'9'}>{'分销订单'}</Option>
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col span={6}>
								<Form.Item label={'商品名称'}>
									{getFieldDecorator('goods_name', {

									})(<Input
										placeholder="商品名称"
										style={{ width: 160 }}
									/>)}
								</Form.Item>
							</Col>
							<Col span={6}>
								<Form.Item label={'手机号'}>
									{getFieldDecorator('mobile', {

									})(<Input
										placeholder="手机号"
										style={{ width: 160 }}
									/>)}
								</Form.Item>
							</Col>
							<Col span={6}>
								<Form.Item label={'收货人'}>
									{getFieldDecorator('consignee', {

									})(<Input
										placeholder="收货人"
										style={{ width: 160 }}
									/>)}
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={24} className='timer-row'>
							<Col span={16}>
								<Form.Item label="查询时段">
									{getFieldDecorator('dealTime')(
										<RangePicker format={Searchdate} style={{ width: 350 }} placeholder={['开始时间', '结束时间']} />
									)}
								</Form.Item>
								<div style={{ lineHeight: '40px', display: 'inline-block' }}>
									<Button type="primary" onClick={this.SubSearchData}>搜索</Button>
									<Button type="primary" className='no-bg-btn' style={{ marginLeft: 12 }} onClick={() => {
										let { checkedList } = this.ListTableDetail.state;
										let newArray = [];
										for (let i = 0; i < checkedList.length; i++) {
											if (checkedList[i].type) {
												newArray.push(checkedList[i].value)
											}
										}
										// if (newArray.length == 0) {
										// 	comUtil.confirmModal({
										// 		okText: '确定',
										// 		cancelText: '取消',
										// 		className: 'seller-confirm-modal',
										// 		content: '请选择要导出的订单',
										// 		cancelButtonProps: { style: { display: 'none' } },
										// 		// title:'',
										// 		onOk: () => {
										// 			// window.location.href = loc;
										// 		}
										// 	})
										// 	return;
										// }
										this.props.form.validateFields((err, values) => {
											if (values.dealTime && values.dealTime.length > 0) {
												let use_start_time = moment(values.dealTime[0]).format(Searchdate) + ' 00:00';
												let use_end_time = moment(values.dealTime[1]).format(Searchdate) + ' 23:59';
												values.create_start_time = moment(use_start_time).unix()
												values.create_end_time = moment(use_end_time).unix()
											}
											delete values.dealTime;
											console.log('values',values)
											Handling.start();
											httpRequest.get({
												url: newArray.length > 0 ? sellerApi.order.exportOrder + '?' + `order_list=[${newArray.toString()}]` : sellerApi.order.exportOrder,
												data: {
													...values
												}
											}).then(res => {
												Handling.stop();
												window.location.href = sellerApi.order.exportOrderDownload + `?file_name=${res.data}`
											}).catch(() => {
												Handling.stop();
											})
										})
									}}>导出订单</Button>
								</div>
							</Col>
							{/* <Col span={11} style={{lineHeight:'40px'}}>
                                <Button type="primary">搜索</Button>
                                <Button type="primary" className='no-bg-btn' style={{marginLeft:12}}>导出订单</Button>
                            </Col> */}
						</Row>
					</Form>
				</div>
				<div>
					<Tabs type="card" onChange={this.tabChange} activeKey={status}>
						<TabPane tab="全部订单" key="10"></TabPane>
						<TabPane tab={`待付款${typeCount.o2 ? `(${typeCount.o2})` : ''}`} key="2"></TabPane>
						<TabPane tab={`待发货${typeCount.o4 ? `(${typeCount.o4})` : ''}`} key="4"></TabPane>
						<TabPane tab={`待收货${typeCount.o5 ? `(${typeCount.o5})` : ''}`} key="5"></TabPane>
						<TabPane tab={`待评价${typeCount.o6 ? `(${typeCount.o6})` : ''}`} key="6"></TabPane>
						<TabPane tab={`已完成${typeCount.o7 ? `(${typeCount.o7})` : ''}`} key="7"></TabPane>
						{/* <TabPane tab={`待接单${typeCount.o1 ? `(${typeCount.o1})` : ''}`} key="1"></TabPane> */}
						<TabPane tab={`待确认${typeCount.o3 ? `(${typeCount.o3})` : ''}`} key="3"></TabPane>
						<TabPane tab={`售后/退款中${typeCount.f1 ? `(${typeCount.f1})` : ''}`} key="8"></TabPane>
						{/* <TabPane tab="待收货" key="10"></TabPane> */}
					</Tabs>
					<div className='order-list-table-box'>
						<ListTableDetail
							data={data}
							getListData={this.getListData}
							pageSize={pageSize}
							page={page}
							onRef={this.onRef}

						/>
						{
							data.length > 0 ?
								<Pagination
									style={{ marginTop: 16 }}
									// showSizeChanger
									// onShowSizeChange={this.onShowSizeChange}
									onChange={(e, d, f) => {
										this.onPaginationChange(e, d, f)
									}}
									total={total}
									pageSize={pageSize}
									//   size={'small'}
									current={page}
									showTotal={
										(total, page) => {
											if (total < pageSize) {
												return `共${Math.ceil(total / pageSize)}页，每页${total}条`
											} else {
												return `共${Math.ceil(total / pageSize)}页，每页${pageSize}条`
											}
										}
									}
								/>
								: null
						}

					</div>
				</div>
			</div>
		)
	}
}
const WrappedHorizontalForm = Form.create()(ListDetail);

export default WrappedHorizontalForm


