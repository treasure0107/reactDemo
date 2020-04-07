import React, { Fragment } from 'react';
import { Modal } from 'antd';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';

class RealNameAuthentication extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			previewImg: '',
			visible: false,
			data: null
		}
	}


	componentDidMount() {
		if (this.props.activeKey == '2') {
			httpRequest.get({
				url: sellerApi.business.personalInfo,
			}).then(res => {
				this.setState({
					data: res.data,
				})
			})
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeKey == '2' && nextProps.activeKey != this.props.activeKey) {
			httpRequest.get({
				url: sellerApi.business.personalInfo,
			}).then(res => {
				this.setState({
					data: res.data,
				})
			})
		}
	}
	previewImg = (e) => {
		this.setState({
			previewImg: e.target.getAttribute('src'),
			visible: true
		})
	}
	hideModal = () => {
		this.setState({
			visible: false
		})
	}
	render() {
		const { visible, previewImg, data } = this.state
		return (
			<div className='account-Info-box realNameAuthentication'>
				{
					data ? (
						<Fragment>
							<div className="item realName clearfix">
								<span className="fl">真实姓名：</span>
								<span className="fl">{data.company_name}</span>
							</div>
							<div className="item idNumber clearfix">
								<span className="fl">身份证号：</span>
								<span className="fl">{data.business_license_id}</span>
							</div>
							<div className="item idCardPhotos clearfix">
								<span className="fl">认证照片：</span>
								<div className="photos fl" onClick={this.previewImg}>
									<div className="photo center fl">
										<img src={data.license_fileImg || ''} alt="持证照片"/>
										<p>持证照片</p>
									</div>
									<div className="photo center fl">
									<img src={data.legal_person_img_pos} alt="身份证正面"/>
										<p>身份证正面</p>
									</div>
									<div className="photo center fl">
										<img src={data.legal_person_img_neg} alt="身份证反面"/>
										<p>身份证反面</p>
									</div>
								</div>
							</div>
						</Fragment>
					) : null
				}
				<Modal
					wrapClassName="previewImgModal"
					visible={visible}
					footer={null}
					onCancel={this.hideModal}
				>
					<img src={previewImg} style={{width: '100%', height: '100%'}} alt=""/>
				</Modal>
			</div>
		);
	}
}

export default RealNameAuthentication;

