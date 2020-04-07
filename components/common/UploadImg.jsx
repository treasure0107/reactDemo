

import React from "react";
import { Form, Table, Input, Modal, Upload, Icon, message, Button } from 'antd';
import "./style/uploadimg.scss";
import BigImgShow from './BigImgShow';
import {Link} from 'react-router-dom';

function getBase64 (img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload (file) {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
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
 * 图片上传的组件
 * isshowalert 展示del提示
 * imglist 上传的图片列表
 * delindex 删除的索引
 * maxnum 最大上传数量
 * curindex 当前大图索引
 */
class UploadImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isshowalert: false,
            imglist: [],
            delindex: -1,
            maxnum: props.maxnum ? props.maxnum : 8,
            curindex: 0,
        };
    }
    del (val, index) {
        this.delindex = index;
        this.showpopalertset(true);
    }
    showpopalertset (val) {
        this.setState({
            isshowalert: val
        })
    }
    delok () {
        this.state.imglist.splice(this.delindex, 1);
        this.setState({
            imglist: this.state.imglist
        })
        this.showpopalertset(false)
    }
    handleChange (info, index) {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            let url = info.file.response;
            // if (index) {
            //     this.state.imglist[index] = url;
            // } else {
            //     this.state.imglist.push(url);
            // }
            // this.setState({
            //     imglist: this.state.imglist,
            //     loading: false,
            // })
            getBase64(info.file.originFileObj, imageUrl => {

                if (index != 'undefined' && index != undefined) {
                    this.state.imglist[index] = { url: imageUrl };
                } else {
                    this.state.imglist.push({ url: imageUrl });
                }
                this.setState({
                    imglist: this.state.imglist,
                    loading: false,
                })
            }
            );

        }
    }
    imgclick (curindex) {
        let { imglist } = this.state;
        this.setState({
            curindex: curindex,
            showbigimg: true,
        })
    }
    showbigimgchange (val) {
        this.setState({
            showbigimg: val
        });
    }


    render () {
        const { imglist, maxnum, curindex, showbigimg } = this.state;
        const uploadButton = (
            <div>
                <Icon  style={{ fontSize: '20px',color:'#999'}} type={this.state.loading ? 'loading' : 'plus'} />
                {/* <div className="ant-upload-text">Upload</div> */}
            </div>
        );
        return (
            <div>
                <div className="uploadimg">
                    {imglist.length > 0 ? imglist.map((i, index) => {
                        return (
                            <div className="imgs" key={index} >
                                <img src={i.url} alt="" onClick={this.imgclick.bind(this, index)} />
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    beforeUpload={beforeUpload}
                                    onChange={info => this.handleChange(info, index)}
                                >
                                    {/* <span className='inconfont'>edit</span> */}
                                </Upload>
                                <div className="del" onClick={this.del.bind(this, index)}>
                                    X
                                </div>
                                {/* <div className="bigeye"><Link href={i.url} target="_blank">大图</Link></div> */}

                            </div>
                        )
                    }) : null}
                    {
                        imglist.length < maxnum ? (
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange.bind(this)}
                                multiple={true}
                            >
                                {uploadButton}
                            </Upload>
                        ) : null
                    }
                </div>
                <BigImgShow showbigimgchange={this.showbigimgchange.bind(this, false)} curindex={curindex} imglist={imglist} showbigimg={showbigimg}></BigImgShow>
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
            </div>
        );
    }

}

export default UploadImg;


