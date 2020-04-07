import React from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select, Radio, Modal } from 'antd';
import moment from 'moment';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import TrainModal from './TrainModal';
import CusServiceModal from './CusServiceModal';
import ISOpicModal from './ISOpicModal';
import Qualifications from './Qualifications';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import 'moment/locale/zh-cn';



class Credentials extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 培训
            visibleTrain: false,
            visibleGold: false,
            visibleISO: false,
            visibleQualifications: false,
            btnType: {}
        }
    }

    componentDidMount() {
        httpRequest.get({
            url: sellerApi.train.default,
        }).then(res=>{
            console.log(res,'是否参加过培训？')
        })
        if (this.props.activeKey == 4) {
            this.getData();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.activeKey == 4 && nextProps.activeKey != this.props.activeKey) {
            this.getData();
        }
    }
    getData = () => {
        httpRequest.get({
            url: sellerApi.shop.getQualifications,
            // data: {
            //     shop_id: parseInt(localStorage.getItem('shopId')),
            // }
        }).then(res => {
            let { data } = res;
            let { btnType } = this.state;
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].apply_type == 4) {
                        btnType.qualifications = data[i].review_status;
                    } else if (data[i].apply_type == 3) {
                        btnType.train = data[i].review_status;
                    } else if (data[i].apply_type == 1) {
                        btnType.cusServiceInfo = data[i].review_status;
                    } else if (data[i].apply_type == 2) {
                        btnType.iso = data[i].review_status;
                    }
                }
            }
            this.setState({
                btnType: btnType
            })
            //  console.log('res', res)
        })
    }


    handleSearch(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    };
    showQualificationsModal = () => {
        this.setState({
            visibleQualifications: true,
        });
    };
    handleQualificationsOk = e => {
        if (!this._qualifications.onSubmit()) {
            return;
        }
        this.setState({
            visibleQualifications: false,
        });
    };
    handleQualificationsCancel = e => {
        this.setState({
            visibleQualifications: false,
        });
    };
    showTrainModal = () => {
        this.setState({
            visibleTrain: true,
        });
    };
    handleTrainOk = e => {
        if (!this._train.onSubmit()) {
            return;
        }
        this.setState({
            visibleTrain: false,
        });
    };

    closeModal() {
        this.setState({
            visibleTrain: false,
        });
    }


    handleTrainCancel = e => {
        this.setState({
            visibleTrain: false,
        });
    };

    showISOModal = () => {
        this.setState({
            visibleISO: true,
        });
    };
    handleISOOk = e => {
        if (!this._iSOpic.onSubmit()) {
            return;
        }
        this.setState({
            visibleISO: false,
        });
    };
    handleISOCancel = e => {
        this.setState({
            visibleISO: false,
        });
    };

    showGoldModal = () => {
        this.setState({
            visibleGold: true,
        });
    };
    handleGoldOk = e => {
        if (!this._cusServiceModal.onSubmit()) {
            return;
        }
        this.setState({
            visibleGold: false,
        });
    };
    handleGoldCancel = e => {
        this.setState({
            visibleGold: false,
        });
    };

    render() {
        const { getFieldDecorator, getFieldsValue, setFieldsValue } = this.props.form;
        let { btnType } = this.state;
        return (
            <div className='base-Info-box'>
                <div className='content-line-box'>
                    <div className='content-detail'>
                        <div className='title'>实地认证商家：</div>
                        <div className='icon'><span className='iconfont iconshidirenzheng'></span></div>
                        <div className='content'>邀请平台对厂商进行实地考察认证</div>
                    </div>
                    {
                        btnType.qualifications == 1 ? <div className='opreat-box'><span className='iconfont iconqueding active'></span><span>已完成</span></div>
                            : btnType.qualifications == 3 ? <div className='opreat-box'><span className='iconfont iconqueding'></span><span>认证中</span></div>
                                : <div className='opreat-box'>
                                    {btnType.qualifications == 2 ?
                                        <React.Fragment>
                                            <span>审核未通过</span>
                                        </React.Fragment> : null}
                                    <Button type='primary' onClick={() => {
                                        this.showQualificationsModal();
                                    }}>申请认证</Button></div>
                    }
                </div>
                <div className='content-line-box'>
                    <div className='content-detail'>
                        <div className='title'>专业培训商家：</div>
                        <div className='icon'><span className='iconfont iconzhuanyepeixun'></span></div>
                        <div className='content'>申请到总部进行专业的店铺运营培训</div>
                    </div>
                    <div className='opreat-box'>
                        {
                            btnType.train == 1 ? <div className='opreat-box'><span className='iconfont iconqueding active'></span><span>已完成</span></div>
                                : btnType.train == 3 ? <div className='opreat-box'><span className='iconfont iconqueding'></span><span>认证中</span></div>
                                    : <div className='opreat-box'>
                                        {btnType.train == 2 ?
                                            <React.Fragment>
                                                <span>审核未通过</span>
                                            </React.Fragment> : null}
                                        <Button type='primary' onClick={() => {
                                            this.showTrainModal();
                                        }}>报名培训</Button></div>
                        }
                    </div>
                </div>
                <div className='content-line-box'>
                    <div className='content-detail'>
                        <div className='title'>金牌服务商家：</div>
                        <div className='icon'><span className='iconfont iconjinpaifuwu'></span></div>
                        <div className='content'>独特专属标识，店铺排名靠前、商品权重更高</div>
                    </div>
                    <div className='opreat-box'>
                        {
                            btnType.cusServiceInfo == 1 ? <div className='opreat-box'><span className='iconfont iconqueding active'></span><span>已完成</span></div>
                                : btnType.cusServiceInfo == 3 ? <div className='opreat-box'><span className='iconfont iconqueding'></span><span>认证中</span></div>
                                    : <div className='opreat-box'>
                                        {btnType.cusServiceInfo == 2 ?
                                            <React.Fragment>
                                                <span>审核未通过</span>
                                            </React.Fragment> : null}
                                        <Button type='primary' onClick={() => {
                                            this.showGoldModal();
                                        }}>申请金牌</Button></div>
                        }
                    </div>
                </div>
                <div className='content-line-box'>
                    <div className='content-detail'>
                        <div className='title'>质量保证标识：</div>
                        <div className='icon'><span className='iconfont iconzhiliangbaozheng'></span></div>
                        <div className='content'>印厂提供ISO证书，获得质保标志，买家更放心</div>
                    </div>
                    <div className='opreat-box'>
                        {
                            btnType.iso == 1 ? <div className='opreat-box'><span className='iconfont iconqueding active'></span><span>已完成</span></div>
                                : btnType.iso == 3 ? <div className='opreat-box'><span className='iconfont iconqueding'></span><span>认证中</span></div>
                                    : <div className='opreat-box'>
                                        {btnType.iso == 2 ?
                                            <React.Fragment>
                                                <span>审核未通过</span>
                                            </React.Fragment> : null}
                                        <Button type='primary' onClick={() => {
                                            this.showISOModal();
                                        }}>参加质保</Button></div>
                        }
                    </div>
                </div>
                <Modal
                    title="请上传并提交实地认证的照片"
                    visible={this.state.visibleQualifications}
                    onOk={this.handleQualificationsOk}
                    onCancel={this.handleQualificationsCancel}
                    // footer={null}
                    className='shop-set-modal'
                    okText='提交'
                    cancelText='取消'
                >
                    <Qualifications wrappedComponentRef={(_child) => this._qualifications = _child} getData={this.getData} />
                </Modal>
                <Modal
                    title="请上传并提交实地认证的照片"
                    visible={this.state.visibleTrain}
                    onOk={this.handleTrainOk}
                    onCancel={this.handleTrainCancel}
                    // footer={null}
                    className='shop-set-modal'
                    okText='提交'
                    cancelText='取消'
                >
                    <TrainModal closeModal={this.closeModal.bind(this)} wrappedComponentRef={(_child) => this._train = _child} getData={this.getData} />
                </Modal>
                <Modal
                    title="申请金牌服务"
                    visible={this.state.visibleGold}
                    // visible={this.state.visibleTrain}
                    onOk={this.handleGoldOk}
                    onCancel={this.handleGoldCancel}
                    // footer={null}
                    className='shop-set-modal'
                    okText='提交'
                    cancelText='取消'
                >
                    <CusServiceModal wrappedComponentRef={(_child) => this._cusServiceModal = _child} getData={this.getData} />
                </Modal>

                <Modal
                    title="请上传并提交ISO证书照片"
                    visible={this.state.visibleISO}
                    onOk={this.handleISOOk}
                    onCancel={this.handleISOCancel}
                    // footer={null}
                    className='shop-set-modal'
                    okText='提交'
                    cancelText='取消'
                >
                    <ISOpicModal wrappedComponentRef={(_child) => this._iSOpic = _child} getData={this.getData} />
                </Modal>


            </div>
        );
    }
}

const CredentialsfoForm = Form.create()(Credentials);
export default CredentialsfoForm;

