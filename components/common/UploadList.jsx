

import React from "react";
import { Form,Table, Input, Modal, Upload, Icon, message, Button } from 'antd';
import "./style/uploadlist.scss"

function getBase64 (img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload (file) {
    const isJPG = file.type === 'image/jpeg'||file.type === 'image/png';
    if (!isJPG) {
        message.error('请上传正确格式的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片大小超过了2MB!');
    }
    return isJPG && isLt2M;
}

/**
 * 暂时没用到
 */
class UploadModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url:''
        };
    }
    handleChange (info) {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            let url=info.file.response.url;
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                    url
                }),
            );

        }
    }
    handleSubmit (e) {
        e.preventDefault();
        let _this = this;
        if(!this.state.imageUrl){
            message.warn('图片必须上传');
            return;
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                 values.url=_this.state.url;
                 _this.props.submit(values)
            } else {

            }
        })
    }
    render () {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        const { getFieldDecorator } = this.props.form;
        let _this = this;
        return (
            <div className="uploadmodal">
                <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                    <Form.Item>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange.bind(this)}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('num', {
                            rules: [
                                { required: true, message: '请输入权重', whitespace: true },
                                { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正确的数值' }
                            ],
                        })(
                            <Input
                                placeholder="请输入权重" name={"num"}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </Form.Item>


                </Form>
            </div>
        )
    }
}
class UploadList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isshowpop: false,
            isshowalert: false,
            imglist:[{'url':'11',num:2},{'url':'11',num:2}]
        };
    }
    handleOk () {
        this.setState({
            isshowpop: false
        })
    }
    showpopset (val) {
        this.setState({
            isshowpop: val
        })
    }
    submit(val){
        this.state.imglist.push(val);
        this.showpopset(false);
    }
    del(val,text,index){
        this.delindex=index;
        this.showpopalertset(true);
    }
    showpopalertset(val){
        this.setState({
            isshowalert: val
        })
    }
    delok(){
        this.state.imglist.splice(this.delindex,1);
        this.setState({
            imglist:this.state.imglist
        })  
        this.showpopalertset(false)
    }


    render () {
        const {imglist}=this.state;
        const columns=[{
                            title:'地址',
                            dataIndex: 'url',
                            key: 'url',
                        },
                         {
                            title:'权重',
                            dataIndex: 'num',
                            key: 'num',
                        },
                        {
                            title:'操作',
                            dataIndex: 'opa',
                            key: 'opa',
                             render: (text, record,index) => (
                                 <Button onClick={this.del.bind(this,record,text,index)}>删除</Button>
                            ),
                        }];
        const dataSource=this.state.imglist;
        return (
            <div>
                <Button type="primary" onClick={this.showpopset.bind(this, true)}>点击新增</Button>
                <div className="imglist">
                    <Table rowKey={(data,index)=>index} dataSource={dataSource} columns={columns} pagination={false}/>    
                    {/* {imglist.length>0?imglist.map((i,index)=>{
                        return (
                            <div className="li">
                                <span>{i.url}</span>
                                <span className="opa">删除</span>
                            </div>
                        )
                    }):null} */}
                </div>
                <Modal
                    width={350}
                    title="提示"
                    destroyOnClose
                    visible={this.state.isshowalert}
                    onOk={this.delok.bind(this)}
                    onCancel={this.showpopalertset.bind(this, false)}
                >
                    确定要删除么
                </Modal>
                <Modal
                    width={350}
                    footer={null}
                    title="新增"
                    destroyOnClose
                    visible={this.state.isshowpop}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.showpopset.bind(this, false)}
                >
                    <WrappedHorizontalUploadModalForm submit={this.submit.bind(this)}></WrappedHorizontalUploadModalForm>
                </Modal>
            </div>
        );
    }
    
}                                        
const WrappedHorizontalUploadModalForm = Form.create({ name: 'uploadmodal' })(UploadModal);  
export default UploadList ;  
  
    
