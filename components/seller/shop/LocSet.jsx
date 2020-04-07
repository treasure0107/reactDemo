import React, { Component } from 'react';
import { Table, Button, Modal, Form,Row,Col,Input } from 'antd';
import Title from '../common/Title';
import lang from "assets/js/language/config"
import { withRouter } from 'react-router';
import '../common/style/shopSet.scss'
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
 import '../common/style/orderList.scss';

class LocSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '导航名称',
                    dataIndex: 'nav_name',
                    key: 'nav_name',
                    render: (text, record, index) => {
                        return <div className='table-first-data'>{text}</div>
                    }
                },
                {
                    title: '链接地址',
                    dataIndex: 'nav_url',
                    key: 'nav_url',
                    render: (text, record, index) => {
                        return <a href={text} target="view_window" className='table-second-data'>{text}</a>
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'opreat',
                    key: 'opreat',
                    render: (text, record, index) => {
                        return <div className='region-box'>
                            <div>
                                <span onClick={()=>{
                                    this.setState({
                                        changeId:record.navigation_id
                                    },()=>{
                                        this.showModal(record.nav_name,record.nav_url)
                                    })
                                }}><span className='iconfont iconfuzhi1'></span>编辑</span>
                            </div>
                            <div onClick={()=>{
                                this.deleteData(record.navigation_id)
                            }}>
                                <span className='iconfont iconshanchu'></span><span>删除</span>
                            </div>
                        </div>
                    }
                },
            ],
            data: [],
            addressValue:'',
            nameValue:'',
            changeId:''
        }
    }
   
    showModal = (name,addres) => {
        const { setFieldsValue } = this.props.form;
        if(name&&addres){
            this.setState({
                addressValue:addres,
                nameValue:name
            },()=>{
                this.setState({
                    visible: true,
                });
            })
        }else{
            this.setState({
                addressValue:'',
                nameValue:''
            },()=>{
                this.setState({
                    visible: true,
                });
            })
        }
    
    };
    handleOk = e => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                if(this.state.changeId){
                    this.changeData(values)
                }else{
                    this.creatData(values)
                }
            }
        });
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    componentDidMount(){
        this.getListData()
    }

    getListData=()=>{
        httpRequest.get({
            url: sellerApi.shop.shopLocList,
             data:{
                 shop_id:localStorage.getItem('shopId')
             }
        }).then(res => {
            this.setState({
                data:res.data
            })
        })
    }

    creatData=(values)=>{
        httpRequest.put({
            url: sellerApi.shop.shopLocList,
            data:{
                 shop_id:localStorage.getItem('shopId'),
                ...values
            }
        }).then(res => {
           this.getListData();
        })
    }

    changeData=(values)=>{
        httpRequest.post({
            url: sellerApi.shop.shopLocList+this.state.changeId+'/',
            data:{
                ...values
            }
        }).then(res => {
            this.getListData();
        })
    }

    deleteData=(id)=>{
        httpRequest.delete({
            url: sellerApi.shop.shopLocList+id+'/',
        }).then(res => {
            this.getListData();
        })
    }

    render() {
        let { data, columns,addressValue,nameValue } = this.state;
        const { getFieldDecorator, getFieldsValue,setFieldsValue } = this.props.form;
        return (
            <div>
                <Title title={'导航设置'} />
                <div className='shop-loc-set-page'>
                    <div style={{ marginBottom: 20, textAlign: 'right' }}>
                        <Button type="primary" icon="plus-circle" onClick={()=>{
                            this.setState({
                                changeId:''
                            },()=>{
                                this.showModal('','')
                            })
                        }}>
                            添加导航
                        </Button>
                    </div>
                    <Table rowKey={(data,index)=>index} dataSource={data} columns={columns} pagination={false} locale={{emptyText:lang.common.tableNoData}}/>
                    <Modal
                        title={this.state.changeId ? '编辑导航' : '新增导航'} 
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                         footer={null}
                        className='shop-set-modal'
                        okText='提交'
                        cancelText='取消'
                        destroyOnClose={true}
                    >
                        <Form className="order-search-form" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Row gutter={24}>
                                <Col span={15}>
                                    <Form.Item label={'导航名称'}>
                                        {getFieldDecorator('nav_name', {
                                            initialValue:nameValue,
                                            rules: [
                                                {
                                                    required: true, message: '导航名称不能为空',
                                                }
                                            ],
                                        })(<Input placeholder="" style={{ width: 240 }} />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={15}>
                                    <Form.Item label={'导航链接'}>
                                        {getFieldDecorator('nav_url', {
                                            initialValue:addressValue,
                                            rules: [
                                                {
                                                    required: true, message: '导航链接不能为空',
                                                }
                                            ],
                                        })(<Input placeholder="" style={{ width: 240 }} />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}
export default withRouter(Form.create()(LocSet))
