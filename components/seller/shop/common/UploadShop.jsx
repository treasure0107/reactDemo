import React from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select, Radio, Cascader, Upload, Modal } from 'antd';
import moment from 'moment';
import { CityData } from "assets/js/city";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const { RangePicker } = DatePicker;
const options = CityData;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
class Qualifications extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 培训
            visibleTrain: false,
            previewVisible: false,
            previewImage: '',
            fileList: [
            ]
        }
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    handleChange = ({ fileList }) => this.setState({ fileList });

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
            <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
            >
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>
        );
    }
}

export default Form.create()(Qualifications);

