import React from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select, Radio,Cascader,Modal,message } from 'antd';
import moment from 'moment';
import { CityData } from "assets/js/city";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import comUtil from 'utils/common.js'
import MapModal from './MapModal';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';

const { RangePicker } = DatePicker;
const options = CityData;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class ContactUs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expand: false,
            visibleGold:false,
            data:{},
            provider:'',
            city:'',
            loc_detail:''
        }
    }
  

    handleReset() {
        this.props.form.resetFields();
    };

    toggle() {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };
    
    componentDidMount(){
        if(this.props.activeKey == 2){
            httpRequest.get({
                // url: sellerApi.shop.baseInfo+localStorage.getItem('shopId')+'/',
                url: sellerApi.shop.baseInfo,
            }).then(res => {
                let {data} = res;
                data.locDetail = comUtil.getLocaData([data.province,data.city,data.district])[0];

                console.log("data.locDetail---",data.locDetail);
                this.setState({
                    data:data
                });
                // this.props.handleOk();
            })
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.activeKey == 2&&nextProps.activeKey!=this.props.activeKey){
            httpRequest.get({
                // url: sellerApi.shop.baseInfo+localStorage.getItem('shopId')+'/',
                url: sellerApi.shop.baseInfo,
            }).then(res => {
                let {data} = res;
                data.locDetail = comUtil.getLocaData([data.province,data.city,data.district])[0];
                this.setState({
                    data:data
                });
                // this.props.handleOk();
            })
        }  
    }

    showGoldModal = () => {
        this.setState({
            visibleGold: true,
        });
    };
    handleGoldOk = e => {
        this.props.form.setFieldsValue({positioning:this._mapModal.state.locDetaile})
        this.setState({
            visibleGold: false,
        });
    };
    handleGoldCancel = e => {
        this.setState({
            visibleGold: false,
        });
    };
    // getLocaData=(data)=>{
    //     console.log(data)
    //     if(Array.isArray(data)){
    //         let arrayList=[];
    //         let cityList = []; 
    //         for(let i=0;i<data.length;i++){

    //         }
    //     }else{
    //         return data.split('_')
    //     }
    // }   

    locObj={}
    render() {
        const { getFieldDecorator, getFieldsValue,setFieldsValue } = this.props.form;
        let {data,provider,city} = this.state
        return (
            <div className='base-Info-box'>
                <Form className="order-search-form" onSubmit={this.handleSearch} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                    <Row gutter={24}>
                        <Col span={15}>
                            <Form.Item label="位于">
                                {getFieldDecorator('locDetail',{
                                     initialValue:data.locDetail,
                                     rules: [
                                        {
                                            required: true, message: '位于不能为空',
                                        }
                                    ]
                                })(
                                    <Cascader displayRender={(e,b)=>{
                                        if(e.length){
                                            if(b[1]){
                                                this.locObj.city = b[1].value+'_'+b[1].label
                                            }
                                            if(b[0]){
                                                this.locObj.province = b[0].value+'_'+b[0].label
                                            }
                                            if(b[2]){
                                                this.locObj.district = b[2].value+'_'+b[2].label
                                            }
                                            this.state.loc_detail = e[0]+e[1];
                                           // return e[0] + ' / ' +e[1]+' / '+e[2]
                                        }

                                        console.log("e---",e);
                                        return e
                                    }} ref={(cascader)=>{this.cascader = cascader}} options={options}  placeholder={'请选择'} style={{width:240}} onChange={(e,b)=>{
                                        this.state.loc_detail = b[0].label+b[1].label
                                    }}/>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={15}>
                            <Form.Item label={'地址'}>
                                {getFieldDecorator('address', {
                                    initialValue:data.address,
                                    rules: [
                                        {
                                            required: true, message: '地址不能为空',
                                        }
                                    ],
                                })(<Input placeholder="" style={{width:240}} onChange={(e)=>{
                                    data.address = e.target.value;
                                    this.setState({
                                        data:data
                                    })
                                }}/>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={15}>
                            <Form.Item label={'经纬度'}>
                                <div>
                                    {getFieldDecorator('positioning', {
                                        initialValue:data.positioning,
                                        rules: [
                                            {
                                                required: true,message:'经纬度不能为空'
                                            }
                                        ],
                                    })(<Input placeholder="" disabled style={{ width: 240 }} />)}
                                    <span style={{marginLeft:8}} className={data.address&&data.address.length>2?'get-coordinate':'none-opreat'} onClick={()=>{
                                        if(data.address&&data.address.length>2){
                                            this.showGoldModal()
                                        }
                                    }}>获取定位坐标</span>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={15}>
                            <Form.Item label={'订单通知手机号'}>
                                {getFieldDecorator('mobile', {
                                    initialValue:data.mobile,
                                    rules: [
                                        {
                                            required: true, message: '请输入正确的手机号',pattern:comUtil.phoneReg
                                        }
                                    ],
                                })(<Input placeholder="" style={{width:240}}/>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={15}>
                            <Form.Item label={'订单通知邮箱'}>
                                {getFieldDecorator('email', {
                                    initialValue:data.email,
                                    rules:[
                                        {
                                            pattern:comUtil.emailReg,message:'请输入正确的邮箱'
                                        }
                                    ]
                                })(<Input style={{width:240}}/>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    {/*<Row gutter={24}>*/}
                        {/*<Col span={15}>*/}
                            {/*<Form.Item label={'审核状态'}>*/}
                                {/*<section>*/}
                                    {/*{*/}
                                        {/*data.audit_status == 0?'未审核': data.audit_status == 1?'审核中':'审核通过'*/}
                                    {/*}*/}
                                {/*</section>*/}
                            {/*</Form.Item>*/}
                        {/*</Col>*/}
                    {/*</Row>*/}
                    <Row gutter={24}>
                        <Col span={15} style={{ display: 'flex' }}>
                            <div style={{ width: '20.83333333%' }}></div>
                            <div style={{ width: 200 }}>
                                <Button type="primary" onClick={() => {
                                    let FieldsValue = getFieldsValue();
                                    this.props.form.validateFields((err, values) => {
                                        if(!err){
                                            // console.log('Received values of form: ', values);
                                            // this.locObj.city = [values.locDetail[0].label,values.locDetail[0].value]
                                            // this.locObj.district = [values.locDetail[1].label,values.locDetail[1].value]
                                            // this.locObj.province = [values.locDetail[2].label,values.locDetail[2].value]
                                            values.province = this.locObj.province;
                                            values.city =  this.locObj.city;
                                            values.district = this.locObj.district;
                                            values.positioning = values.positioning[0]+','+values.positioning[1];
                                            delete values.locDetail
                                            httpRequest.post({
                                                // url: sellerApi.shop.baseInfo+localStorage.getItem('shopId')+'/',
                                                url: sellerApi.shop.baseInfo,
                                                data: {
                                                    ...values
                                                }
                                            }).then(res => {
                                                message.success('操作成功');
                                                // this.props.handleOk();
                                            })
                                        }
                                    });
                                }}>
                                    提交
                            </Button>
                            {/* <Button style={{ marginLeft: 8 }}>
                                    取消
                            </Button> */}
                            </div>
                        </Col>
                    </Row>
                </Form>
                <Modal
                    title="获取经纬度"
                   // visible={true}
                    visible={this.state.visibleGold}
                    onOk={this.handleGoldOk}
                    onCancel={this.handleGoldCancel}
                    // footer={null}
                    className='shop-map-modal'
                    okText='提交'
                    cancelText='取消'
                >
                    <MapModal ref={(_child) => this._mapModal = _child} address={ this.state.loc_detail+data.address}/>
                </Modal>
            </div>
        );
    }
}

const ContactUsForm = Form.create()(ContactUs);
export default ContactUsForm;

