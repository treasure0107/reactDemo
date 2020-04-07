import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Checkbox, Button, message, Pagination, Icon } from 'antd'
import httpRequest from 'utils/ajax'
import { sellerApi } from 'utils/api'
import { getFloorContent } from '../common/common'
import { actionCreator } from '../store';
import floorConfig from '../common/floorConfig'
import OssUpload from 'components/common/OssUpload'
import Folder from './Folder'
import Gallery from './Gallery'
import '../style/shopDecoration.scss'
import copy from 'copy-to-clipboard'

class GalleryList extends Component {
  constructor(props) {
    super(props)
    this.handleUpload = this.handleUpload.bind(this)
    this.onRef = this.onRef.bind(this)
    this.state = {
      isGoodsFloor: props.floorType == floorConfig.goodsFloorOne.type || props.floorType == floorConfig.goodsFloorTwo.type,  // 是否是商品楼层
      isTopAdv: props.floorType == floorConfig.topAdv.type,
      isBanner: props.floorType == floorConfig.banner.type,
      checkNumContent: getFloorContent(props.floorType, 'checkNum'),  // 需要选择图片或者商品个数的文字描述
      fileList: [],  // 上传
      isShowFolder: true,
      folderId: '',             // 文件夹ID
      uploadingFileList: []     // 记录上传成功的图片数据
    }
  }

  render() {
    const { fileList, isShowFolder, folderId, isBanner, isTopAdv, checkNumContent, isGoodsFloor } = this.state
    const { checkedNum, imgList, source } = this.props
    return (
      <Fragment>
        <div className="header">
          <span className="imgNum fl">{checkNumContent}</span>
          {
            // 商品楼层无需 新建文件夹和上传 按钮
            !isGoodsFloor ? (
              isShowFolder ? (
                <Button type="primary" className="fr newFolder" onClick={this.createNewFolder}>新建文件夹</Button>
                ) : (
                <Fragment>
                  <Button type="primary" className="fr toFolder" onClick={this.backToFolder}>返回</Button>
                  <OssUpload 
                    onChange={this.handleUpload}
                    showUploadList={false}
                    fileList={fileList}
                    wrapperClass="uploadImg fr"
                    text={'上传图片'}
                    uploadIcon={false}
                    multiple={true}
                  />
                </Fragment>
              )
            ) : null
          }
          <span className="selected fr">已选{checkedNum || imgList.length}个</span>
        </div>
        {
          !isGoodsFloor ? (
            isShowFolder ? (
              <Folder openFolder={this.openFolder} ref={el => this.folder = el}/>
            ) : (
              <Gallery source={source} isGoodsFloor={false} folderId={folderId} onRef={ this.onRef } isBanner={isBanner} isTopAdv={isTopAdv} />
            )
          ) : (
            <Gallery source={source} isGoodsFloor={true} isBanner={isBanner} isTopAdv={isTopAdv} />
          )
        }
      </Fragment>
    )
  }
  onRef(ref) {
    this.gallery = ref
  }
  // 上传
  handleUpload = (info, imgUrl) => {
    const { uploadingFileList } = this.state
    const { file, fileList } = info
    console.log('file', file)
    this.setState({
      fileList: fileList.map(file => ({
        status: file.status,
        uid: file.uid,
        url: file.url || imgUrl, // 多图上传时，已上传的话，就取已上传的图片url
      }))
    })
    if (file.status === 'done') {
      const imgParams = {}
      for(let i = 0; i < uploadingFileList.length; i++) {
        if (uploadingFileList[i].uid == file.uid) {
          const size = uploadingFileList[i].size
          if (size) {
            imgParams.size = size
          }
        }
      }
      const imgArr = []
      imgParams.pic_url = file.url
      let image = new Image()
      image.src = imgUrl
      image.onload = () => {
        imgParams.width = image.width
        imgParams.height = image.height
        imgArr.push(imgParams)
        this.gallery.uploadImg(imgArr)
      }
    } else {
      const copyUploadingFileList = JSON.parse(JSON.stringify(uploadingFileList))
      if (file.size) {
        copyUploadingFileList.push(file)
      }
      this.setState({
        uploadingFileList: copyUploadingFileList
      })
    }
  }

  // 打开文件夹
  openFolder = (folderId) => {
    this.setState({
      isShowFolder: false,
      folderId
    })
  }
  createNewFolder = () => {
    this.folder.createNewFolder()
  }
  backToFolder = () => {
    this.setState({
      isShowFolder: true
    })
  }
}

const mapState = (state) => {
  return {
    floorType: state.shopDecoration.floorType,
    imgList: state.shopDecoration.imgList,
    checkedNum: state.shopDecoration.checkedNum
  }
}

export default connect(mapState, null)(GalleryList)