
//已废弃，采用WindowLogin.jsx by leite 2019-07-11



/*
import { Modal, Button } from 'antd';

import React,{Component} from 'react';

import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import { Form, Icon, Input, Checkbox } from 'antd';




class PopLogin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible:  false,
            isLogin : false,
            loginType : "normal"
        };
    }

    showModal() {
        this.setState({
            visible: true,
        });
    };

    handleOk (e){
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel (e){
        console.log(e);
        this.props.changeIsShowPopLogin(false);
        this.setState({
            visible: false,
        });
    };
    changeLoginState(value){


        this.setState({
            isLogin : value, //visible: false,
        })
        if(value){

            this.setState({
                visible: false,
            })
            this.props.changeIsShowPopLogin(false);
        }
        this.props.setLoginInfo({
            type: 'setLoginInfo',
            payload: {isLogin:value},
        })
    }
    changeLoginType(value){
        this.setState({
            loginType :value
        })
    }




    render(){
        console.log(this,'1111')
        return(
            <div>
                {/!*<Button type="primary" onClick={this.showModal.bind(this)} >*!/}
                    {/!*Open Modal*!/}
                {/!*</Button>*!/}
                <Modal
                    width={350}
                    footer={null}
                    title="登录"
                    destroyOnClose
                    visible={this.props.isSHowPopLogin}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                >
                    { this.state.loginType == "normal" ?
                        <WrappedHorizontalLoginForm  changeLoginState={this.changeLoginState.bind(this)} changeLoginType={this.changeLoginType.bind(this)}></WrappedHorizontalLoginForm>
                        :
                        <WrappedHorizontalPhoneLoginForm  changeLoginState={this.changeLoginState.bind(this)} changeLoginType={this.changeLoginType.bind(this)}></WrappedHorizontalPhoneLoginForm>}
                </Modal>
            </div>
        )
    }
}



class PhoneLogin extends React.Component {
    constructor(props) {
        super(props);
    }
    handleSubmit (e)   {
        e.preventDefault();
        let _this = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                //登录接口
                _this.props.changeLoginState(true)

            }else{
                _this.props.changeLoginState(false)
            }
        });

    };
    componentDidMount() {
        // To disabled submit button at the beginning.
        //this.props.form.validateFields();
    }
    compareToFirstPassword  (rule, value, callback) {
        const form = this.props.form;
        if (value &&value.length < 6) {
            callback('用户名必须6位');
        } else {
            callback();
        }
    };
    changeLoginType(){
        this.props.changeLoginType("normal")
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        let _this = this;
        return (
            <div id="components-form-demo-normal-login">
                <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [
                                { required: true, message: '请输入手机号码' },
                                {
                                    validator: this.compareToFirstPassword.bind(this),
                                },
                            ],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入手机号码" name={"username"}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>记住我</Checkbox>)}
                        <Link className="login-form-forgot" href="">
                            忘记密码
                        </Link>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                        <Link href="">没账户？现在区注册!</Link>
                        <Link to="javascript:void(0)" onClick={this.changeLoginType.bind(this)}>账号密码登录</Link>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}




class NormalLoginForm extends React.Component {
    constructor(props){
        super(props);


    }
    handleSubmit (e)   {
        e.preventDefault();
        let _this = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                //登录接口
                _this.props.changeLoginState(true)

            }else{
                _this.props.changeLoginState(false)
            }
        });

    };
    componentDidMount() {
        // To disabled submit button at the beginning.
        //this.props.form.validateFields();
    }
    compareToFirstPassword  (rule, value, callback) {
        const form = this.props.form;
        if (value &&value.length < 6) {
            callback('用户名必须6位');
        } else {
            callback();
        }
    };
    changeLoginType(){
        this.props.changeLoginType("phone")
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        let _this = this;
        return (
            <div id="components-form-demo-normal-login">
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [
                            { required: true, message: '请输入账户' },
                            {
                                validator: this.compareToFirstPassword.bind(this),
                            },
                        ],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="用户名" name={"username"}
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="密码"
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(<Checkbox>记住我</Checkbox>)}
                    <Link className="login-form-forgot" to="">
                        忘记密码
                    </Link>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                    <Link to="">没账户？现在区注册!</Link>
                    <Link to="javascript:void(0)" onClick={this.changeLoginType.bind(this)}>手机验证码登录</Link>
                </Form.Item>
            </Form>
            </div>
        );
    }
}


const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(NormalLoginForm);

const WrappedHorizontalPhoneLoginForm = Form.create({ name: 'horizontal_login2' })(PhoneLogin);





//export  default GoodsCountInput;


// mapStateToProps可以不传，如果不传，组件不会监听store的变化，也就是说Store的更新不会引起UI的更新
function mapStateToProps(state) {
    return {
        loginInfo: state.loginInfo
    }
}
// mapDispatchToProps
// mapDispatchToProps用于建立组件跟store.dispatch的映射关系,可以是一个object，也可以传入函数
// 如果mapDispatchToProps是一个函数，它可以传入dispatch,ownProps, 定义UI组件如何发出action，实际上就是要调用dispatch这个方法
function mapDispatchToProps(dispatch) {
    return {
        setLoginInfo: (state) => dispatch(state),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PopLogin)
*/
