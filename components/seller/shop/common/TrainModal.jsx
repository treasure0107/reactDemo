import React from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select, message, Cascader, Upload, Modal, Checkbox } from 'antd';
import OssUpload from 'components/common/OssUpload'
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import TrainingModal from './TrainingModal'
import 'moment/locale/zh-cn';
import '../style/trainingmodal.scss'

// 培训弹窗
class TrainModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			// 培训
			visibleTrain: false,
			previewVisible: false,
			previewImage: '',
			fileList: [
			],
			visible: false,
			trainList: null
		}
	}

	handleOnChange = ({ fileList }, imgUrl) => {
		return fileList.map(file => ({
			status: file.status,
			uid: file.uid,
			url: file.url || imgUrl,  // 多图上传是，已上传的话，就取已上传的图片url
		}));
	};

	onSubmit = () => {
		let { validateFields, getFieldsValue } = this.props.form;
		let isOk = true;

		validateFields((err, values) => {
			if (err) {
				isOk = false;
			} else {
				values.pic_url = values.pic_url[0].url

				httpRequest.post({
					url: sellerApi.shop.submitQualifications,
					data: {
						// shop_id: localStorage.getItem('shopId'),
						apply_type: 3,
						...values
					}
				}).then(res => {
					isOk = true
					message.success('提交成功')
					this.props.getData();
				}).catch(() => {
					isOk = false
				})
			}
		});
		return isOk;
	}

	// 点此链接
	ClickHeer() {
		this.props.closeModal();
		setTimeout(() => {
			this.showModal()
		}, 200)
	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleOk = e => {
		console.log(e);
		this.setState({
			visible: false,
		});
	};

	handleCancel = e => {
		console.log(e);
		this.setState({
			visible: false,
		});
		setTimeout(() => {
			httpRequest.get({
				url: sellerApi.train.default,
			}).then(res => {
				this.setState({
					trainList: res.data
				})
				console.log(res, '是否参加过培训2？')
			})
		}, 100)
	};

	componentDidMount() {
		httpRequest.get({
			url: sellerApi.train.default,
		}).then(res => {
			this.setState({
				trainList: res.data
			})
			console.log(res, '是否参加过培训2？')
		})
	}

	render() {
		const { previewVisible, previewImage, fileList } = this.state;
		const uploadButton = (
			<div style={{ color: '#A5A5A6' }}>
				<Icon type="plus" />
				<div className="ant-upload-text" style={{ fontSize: 13 }}>添加图片</div>
			</div>
		);
		const { getFieldDecorator, getFieldsValue, setFieldsValue } = this.props.form;

		return (
			<div className='base-Info-box'>
				<Form className="order-search-form" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
					<Row gutter={24}>
						<Col span={15}>
							<Form.Item label={'培训证书'}>
								{/* {getFieldDecorator('certificate', {
                                    rules: [
                                        {
                                            required: true, message: '培训证书不能为空',
                                        }
                                    ],
                                })(<Input placeholder="" style={{ display: 'none' }} />)} */}
								<div className='train-upload-box'>
									{getFieldDecorator('pic_url',
										{
											valuePropName: 'fileList',
											getValueFromEvent: this.handleOnChange,
											rules: [
												{
													required: true, message: '该图片为必传项',
												}
											],
										})(<OssUpload imgNumber={1} text={'上传图片'} className='shop-set-modal' />)}
									<div className='jump-to-train-box'>
										{
											this.state.trainList && this.state.trainList.is_submit == 0 ?
												<div className="train-div">
													没有培训证书? 报名培训
                                                <span style={{ cursor: 'pointer' }} onClick={this.ClickHeer.bind(this)} className='jump-to-train'>点此链接</span>
												</div> :
												<div className="train-div">您已报名参加商家培训，好好学习，早日拿证</div>
										}

									</div>
								</div>
							</Form.Item>
						</Col>
					</Row>
					{/* <Row gutter={24}>
                        <Col span={15}>
                            <Col span={8}>
                                 <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            </Col>
                            <Col span={15}>
                                <div className='jump-to-train-box'>
                                    没有培训证书? 报名培训  <span className='jump-to-train'>点此链接</span>
                                </div>
                            </Col>
                        </Col>
                    </Row> */}
					<Row gutter={24}>
						<Col span={15}>
							<Form.Item label={'持证人'}>
								{getFieldDecorator('hold_seller_id', {
									rules: [
										{
											required: true, message: '持证人姓名不能为空',
										}
									],
								})(<Input maxLength={10} placeholder="" style={{ width: 240 }} />)}
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={15}>
							<Form.Item label={'证书编号'}>
								{getFieldDecorator('certificate_code', {
									rules: [
										{
											required: true, message: '证书编号不能为空',
										}
									],
								})(<Input placeholder="" style={{ width: 240 }} />)}
							</Form.Item>
						</Col>
					</Row>
				</Form>

				<div>
					{/* <Button type="primary" onClick={this.showModal}>
                        Open Modal
                    </Button> */}
					<Modal
						wrapClassName="training-modal"
						title="申请商家培训"
						visible={this.state.visible}
						onOk={this.handleOk}
						onCancel={this.handleCancel}
						width="720px"
						footer={null}
					>
						<div>
							<p className="level-title">壹级标题</p>
							<p className="level-ct">
								欢迎使用“网易考拉”提供的产品和服务！网易考拉（或简称“我们”）深知个人信息对您的重要性，我们一向庄严承诺保护使用我们的产品和服务（以下统称“网易考拉服务”）之用户（以下统称“用户”或“您”）的个人信息及隐私安全。
                            </p>
						</div>
						<div>
							<p className="secondary-title">二级标题哒哒</p>
							<p className="level-ct">
								重点 内容突出为粗体带下划线提供的产品和服务！您在使用网易考。
                            </p>
						</div>
						<div>
							<p className="fully-title">三级标题</p>
							<p className="level-ct">更新于2019.07.08 23:00</p>
						</div>
						<TrainingModal handleCancel={this.handleCancel}></TrainingModal>
					</Modal>
				</div>


				<div>
					<section className='train-explain'>说明:
                            <div style={{ marginLeft: 8 }}>
							<div>
								点击方框上传培训证书照片;
                                </div>
							<div>将在2个工作日内审核您的照片</div>
						</div>
					</section>
				</div>
			</div>
		);
	}
}

export default Form.create()(TrainModal);

