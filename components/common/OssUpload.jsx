// 调用示例
/**
 * 参数解释：
 * imgNumber 上传数量
 * text: 上传内容文字描述
 * uploadType: 上传文件类型(图片-默认不传，视频-video)
 * uploadIcon: 是否显示图标
 * wrapperClass: 外层类名
 * uploadSize: 上传图片/视频大小
 * showUploadList: 是否展示文件预览列表
 * storeDir: 图片服务器存储位置
 * multiple: 是否支持多图上传
 * customsType: 自定义上传类型
 * */

// 结合表单使用
{/*
<Form.Item>
  {getFieldDecorator('license_file_img', {
    valuePropName: 'fileList',
    getValueFromEvent: this.handleOnChange,
  })(<OssUpload accept={'.jpg, .jpeg, .png'} imgNumber={1} text={'营业执照'}/>)}
</Form.Item>
handleOnChange({ fileList }, imgUrl) {
  return fileList.map(file => ({
    status: file.status,
    uid: file.uid,
    url: file.url || imgUrl,  // 多图上传是，已上传的话，就取已上传的图片url
  }));
};
*/
}

// 不结合表单使用
{/*
this.handleOnChange = this.handleOnChange.bind(this)
const { fileList } = this.state
<OssUpload fileList={fileList} onChange={this.handleOnChange} imgNumber={1}/>
handleOnChange({ fileList }, imgUrl) {
  this.setState({
    fileList: fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.url || imgUrl, // 多图上传是，已上传的话，就取已上传的图片url
    }))
  })
}
*/
}

import React from 'react'
import {Icon, Modal, Upload, message} from 'antd'
import httpRequest from 'utils/ajax'
import api from 'utils/api'

// const fileTypeZIP = /.*\.(zip)$/;

export default class OssUpload extends React.Component {
  constructor() {
    super()
    this.state = {
      previewVisible: false,
      previewImage: '',
      action: '',
      data: {},
      list: [],
    }
  }

  handleCancel = () => {
    this.setState({previewVisible: false})
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }
  // onChange (fileList, imgUrl) {
  //   if (fileList.file.status) {
  //     this.props.onChange(fileList,imgUrl)
  //   }
  // }
  async beforeOnChange(fileList, imgUrl, imgName) {
    const {onChange} = this.props
    if (fileList.file.status != 'done') {
      onChange && onChange(fileList, imgUrl, imgName)
    } else {
      const isSupportedVideo = this.type == 'video/mp4'
      const isSupportedImg = this.type === 'image/jpeg' || this.type === 'image/jpg' || this.type === 'image/png' || this.type === 'image/gif'
      // 是否开启图片内容鉴定
      if (isSupportedVideo) {
        onChange(fileList, imgUrl, imgName)
      } else if (isSupportedImg) {
        const res = await httpRequest.get({url: api.getImType})
        if (res.data.auto_reg_pron == 1 && res.data.auto_reg_sensitive_words) {
          httpRequest.noMessage().post({
            url: api.picVerify,
            data: {
              url: imgUrl
            }
          }).then((result) => {
            if (result.data[0].code == 200) {
              if (result.data[0].results[0].suggestion == 'block' || result.data[0].results[0].suggestion == 'review') {
                message.error('图片审核不通过或者网速过慢，请重新上传', 2)
                const fileListArr = fileList.fileList
                fileListArr.pop()  // 如果图片审核不通过，删除当前上传图片，返回新数组，保留之前上传的图片
                onChange && onChange({fileList: fileListArr}, '', imgName)
              } else {
                onChange && onChange(fileList, imgUrl, imgName)
              }
            } else {
              onChange && onChange(fileList, imgUrl, imgName)
            }
          })
        } else {
          onChange && onChange(fileList, imgUrl, imgName)
        }
      } else {
        onChange(fileList, imgUrl, imgName)
      }
    }
  }

  render() {
    const {fileList, imgNumber, text, uploadType, wrapperClass, uploadIcon = true, showUploadList = true, multiple = false, customsType} = this.props;
    const {previewVisible, previewImage, action, data, imgUrl, imgName} = this.state;
    const uploadButton = (
      <div>
        {
          uploadIcon ? <Icon type="plus"/> : null
        }
        <div className="ant-upload-text">{text}</div>
      </div>
    );
    return (
      <div className={wrapperClass ? `clearfix ${wrapperClass}` : 'clearfix'}>
        <Upload
          accept={uploadType == 'video' ? '.mp4' : uploadType == 'file' ? '*' : uploadType == 'customs' ? customsType : '.jpg, .jpeg, .png'}
          action={action}
          listType="picture-card"
          fileList={fileList || []}
          data={data}
          beforeUpload={(file) => this.beforeUpload(file)}
          // onChange={(fileList) => this.onChange(fileList, imgUrl)}
          onChange={(fileList => this.beforeOnChange(fileList, imgUrl, imgName))}
          onPreview={this.handlePreview}
          showUploadList={showUploadList}
          disabled={fileList && fileList.length >= imgNumber && uploadType == 'file'}
          multiple={multiple}
        >
          {fileList && fileList.length >= imgNumber && uploadType != 'file' ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    )
  }

  beforeUpload(file) {
    let params = {};
    this.type = file.type;
    const fileName = file.name;
    const {uploadType, uploadSize} = this.props;
    let isSupportedImg = null;
    let isSupportedVideo = null;
    if (uploadType == 'video') {
      isSupportedVideo = validateUpload({
        supported: this.type === 'video/mp4',
        unsupportedTxt: '只支持mp4格式的视频',
        size: uploadSize || 10,
        exceedTxt: `只支持小于${uploadSize || 10}MB的视频`,
        file
      })
    } else if (uploadType == 'file') {
      isSupportedImg = validateUpload({
        supported: this.type != 'video/mp4',
        unsupportedTxt: '暂不支持上传视频',
        size: uploadSize || 3,
        exceedTxt: `只支持小于${uploadSize || 3}MB的文件`,
        file
      })
    } else if (uploadType == "customs") {
      isSupportedImg = validateUpload({
        supported: this.type === 'image/jpeg' || this.type === 'image/jpg' || this.type === 'image/png' || this.type === 'image/bmp' || this.type === 'text/plain' || this.type == "application/msword" || this.type == "application/vnd.ms-excel" || this.type == "application/pdf" || this.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        unsupportedTxt: '只支持 jpg/jpeg/png/bmp/TXT/DOC/EXL/PDF/DOCX格式的图片',
        size: uploadSize || 10,
        exceedTxt: `只支持小于${uploadSize || 10}MB的图片`,
        file
      })
    } else {
      isSupportedImg = validateUpload({
        supported: this.type === 'image/jpeg' || this.type === 'image/jpg' || this.type === 'image/png' || this.type === 'image/gif',
        unsupportedTxt: '只支持 jpg/jpeg/png 格式的图片',
        size: uploadSize || 3,
        exceedTxt: `只支持小于${uploadSize || 3}MB的图片`,
        file
      })
    }

    return new Promise((resolve, reject) => {
      // Temp case.
      // No need anymore.
      // if (this.props.noZIP && fileTypeZIP.test(fileName)) {
      //   message.info("非常抱歉，目前暂不支持ZIP文件，请上传其它格式文件");
      //   reject(false);
      // }

      const {storeDir} = this.props
      if (isSupportedImg || isSupportedVideo) {
        httpRequest.get({
          url: api.ossUpload,
          data: {
            upload_dir: storeDir ? storeDir.indexOf('/') > -1 ? storeDir : storeDir + '/' : "web/"
          }
        }).then(res => {
          if (res.code == 200) {
            const data = res.data;
            const _key = data.dir + randomString(10) + new Date().getTime() + getFileType(fileName)
            params.key = _key
            params.signature = data.signature
            params.OSSAccessKeyId = data.accessid
            params.policy = data.policy
            params.success_action_status = "200"
            this.setState(() => ({
              action: data.host,
              data: params,
              imgUrl: data.host + "/" + _key,
              imgName: fileName
            }), () => {
              resolve(true)
            })
          }
        }).catch((error) => {
          message.error('网络异常，请重试！')
          reject(false)
        })
      } else {
        reject(false)
      }
    })
  }
}

function validateUpload({supported, unsupportedTxt, size, exceedTxt, file}) {
  if (!supported) {
    message.error(unsupportedTxt)
  }
  const isLt = file.size / 1024 / 1024 < size
  if (!isLt) {
    message.error(exceedTxt)
  }
  if (supported && isLt) {
    return true
  }
  return false
}

function randomString(len) {
  len = len || 32
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

function getFileType(filename) {
  const pos = filename.lastIndexOf('.')
  let suffix = ''
  if (pos != -1) {
    suffix = filename.substring(pos)
  }
  return suffix
}

// function getBase64(img, callback) {
//   const reader = new FileReader()
//   reader.addEventListener('load', () => callback(reader.result))
//   reader.readAsDataURL(img)
// }
