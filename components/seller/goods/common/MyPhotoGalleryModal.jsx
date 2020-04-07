/*
* 我的图片库
* */
import React, {Component} from 'react';
import {Modal, Button, Checkbox, message, Pagination} from 'antd';
import OssUpload from 'components/common/OssUpload';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js';
import MyPhotoFolderModal from "./MyPhotoFolderModal"

class MyPhotoGalleryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      id: '',
      list: [],
      fileList: [],
      fileItem: {},
      url: '',
      listData: [],
      imgList: [],
      imgLength: 0,
      total: 0,
      status: 0,
      imgNum: 0,
      checkedImgList: [],
      goodsMobileImgList: [],
      goodsMobileImgListLen: 0,
      imgUrlObj: {},
      isFolderShow: true,
      folderId: "",
      uploadingFileList: []
    }
  }

  showModal() {
    let imgList = this.props.imgListLen;
    let goodsMobileImgList = this.props.goodsMobileImgList;
    let status = this.props.status;
    // this.getGoodsPicture(1, 18);
    if (!comUtil.isEmpty(imgList)) {
      this.setState({
        imgLength: imgList.length
      })
    }

    if (!comUtil.isEmpty(goodsMobileImgList)) {
      let newGoodsMobileImgListLen = goodsMobileImgList.length;
      this.setState({
        goodsMobileImgListLen: newGoodsMobileImgListLen
      })
    }

    this.state.list.forEach(check => {
      this.setState({
        ['thisStatus' + check.id]: false,
      })
    });

    this.setState({
      checkedImgList: [],
      visible: true,
      isFolderShow: true,
      status
    })

  };

  handleOk = e => {
    if (this.props.status == 1) {
      let newCheckedImgList = this.state.checkedImgList;
      this.props.imgList(newCheckedImgList)
    }
    if (this.props.status == 2) {
      let ueditorImgList = this.state.checkedImgList;
      this.props.ueditorImgList(ueditorImgList)
    }
    if (this.props.status == 3) {
      let mobileImgList = this.state.checkedImgList;
      this.props.mobileImgList(mobileImgList)
    }
    this.setState({
      visible: false,
      imgNum: 0
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  onChangeChecked(id, index, e) {
    let val = e.target.value;
    let checkedImgList = this.state.checkedImgList;
    let status = this.state.status;
    let imgListLen = this.state.imgLength;
    let goodsMobileImgListLen = this.state.goodsMobileImgListLen;

    if (status == 1 && imgListLen == 10) {
      message.error("商品图片已经有10张图片！");
      this.setState({
        ['thisStatus' + id]: false
      });
      return false
    }
    if (status == 3 && goodsMobileImgListLen == 20) {
      message.error("手机端商品图片已经有20张图片！");
      this.setState({
        ['thisStatus' + id]: false
      });
      return false
    }
    let imgNum = this.state.imgNum;
    if (e.target.checked) {
      let len = 10 - parseFloat(imgListLen);
      let mLen = 20 - parseFloat(goodsMobileImgListLen);
      if (status == 1 && imgNum >= len) {
        this.setState({
          ['thisStatus' + id]: false
        });
        message.error("商品图片最多只能有10张图片！");
        return false;
      }

      if (status == 3 && imgNum >= mLen) {
        this.setState({
          ['thisStatus' + id]: false
        });
        message.error("手机端商品图片最多只能有20张图片！");
        return false;
      }
      this.setState({
        ['thisStatus' + id]: e.target.checked
      });
      this.setState({
        checkedImgList: [...checkedImgList, val]
      }, () => {
        imgNum = this.state.checkedImgList.length;
        this.setState({
          imgNum
        })
      })
    } else {
      let newCheckedImgList = checkedImgList.filter((item) => {
        if (item != val) {
          return item;
        }
      });
      imgNum = newCheckedImgList.length;
      this.setState({
        checkedImgList: newCheckedImgList,
        ['thisStatus' + id]: false,
        imgNum
      })
    }


  }

  componentDidMount() {

  }

  //  我的图片库
  getGoodsPicture(page, size) {
    let id = this.state.folderId;
    httpRequest.get({
      url: sellerApi.goods.goodsPicture,
      data: {
        page: page,
        size: size,
        folder_id: id
      }
    }).then(res => {
      if (res.code == "200") {
        let total = res.total;
        let list = res.data;
        this.setState({
          list,
          total
        })
      }
    })
  }

  handleOnChangePagination(page, pageSize) {
    this.getGoodsPicture(page, pageSize);
  }

  uploadGoodsPicture(pic_set) {
    let folder_id = this.state.folderId;
    httpRequest.post({
      url: sellerApi.goods.goodsPicture,
      data: {
        pic_set: pic_set,
        folder_id: folder_id
      }
    }).then(res => {
      if (res.code == "200") {
        this.getGoodsPicture(1, 18);
      }
    })
  }

  //上传图片
  handleOnChangeOssUpload(info, imgUrl) {
    const {uploadingFileList} = this.state;
    const {file, fileList} = info;
    this.setState({
      fileList: fileList.map(file => ({
        status: file.status,
        uid: file.uid,
        url: file.url || imgUrl, // 多图上传时，已上传的话，就取已上传的图片url
      }))
    });
    if (file.status === 'done') {
      const imgParams = {};
      for (let i = 0; i < uploadingFileList.length; i++) {
        if (uploadingFileList[i].uid == file.uid) {
          const size = uploadingFileList[i].size;
          if (size) {
            imgParams.size = size
          }
        }
      }
      const imgArr = [];
      imgParams.pic_url = file.url;
      let image = new Image();
      image.src = imgUrl;
      image.onload = () => {
        imgParams.width = image.width;
        imgParams.height = image.height;
        imgArr.push(imgParams);
        this.uploadGoodsPicture(imgArr);
      }
    } else {
      const copyUploadingFileList = JSON.parse(JSON.stringify(uploadingFileList));
      if (file.size) {
        copyUploadingFileList.push(file)
      }
      this.setState({
        uploadingFileList: copyUploadingFileList
      })
    }
  }

  /*  handleOnChangeOssUpload({fileList}, imgUrl) {
      if (fileList.length > 0) {
        fileList.forEach(file => {
          // set上传进度
          this.setState({
            fileList: [{
              status: file.status,
              uid: file.uid,
              url: file.url || imgUrl  // 已上传的话，就取已上传的图片url
            }]
          });
          const newImgUrlObj = {...this.state.imgUrlObj};
          // 只有第一次file可以获取到size, 所以加个判断
          if (file.size) {
            newImgUrlObj.size = (file.size / 1024).toFixed(2);
            this.setState({
              imgUrlObj: newImgUrlObj
            })
          }

          if (file.status == 'done') {
            const imgArr = [];
            newImgUrlObj.pic_url = imgUrl;
            let image = new Image();
            image.src = imgUrl;
            image.onload = () => {
              newImgUrlObj.width = image.width;
              newImgUrlObj.height = image.height;
              imgArr.push(newImgUrlObj);
              this.uploadGoodsPicture(imgArr);
            }
          }
        })
      }
    }*/

  getFolderId(folderId) {
    this.setState({
      folderId: folderId
    }, () => {
      if (this.state.folderId) {
        this.setState({
          isFolderShow: false
        });
        this.getGoodsPicture(1, 18);
      }
    })
  }

  afterCloseModal() {
    let list = this.state.list;
    list && list.length > 0 && list.forEach(check => {
      this.setState({
        ['thisStatus' + check.goods_picture__id]: false,
      })
    });
    this.setState({
      isFolderShow: true,
      list: []
    })
  }

  handleBack() {
    this.setState({
      isFolderShow: true
    })
  }

  render() {
    const {visible, isFolderShow} = this.state;
    return (
      <React.Fragment>
        <Button type="primary" className="btn mr15" onClick={this.showModal.bind(this)}>我的图片库</Button>
        <Modal
          title="我的图片库"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={750}
          afterClose={this.afterCloseModal.bind(this)}
          wrapClassName={'photo-gallery-modal'}
          cancelText={'取消'}
          okText={'确定'}>
          <Button icon="arrow-left"
                  className={`goods-btn fl ${!isFolderShow ? "show" : "hide"}`}
                  onClick={this.handleBack.bind(this)}>返回</Button>
          {
            isFolderShow ?
              <div className="photo-list">
                <MyPhotoFolderModal folderId={this.getFolderId.bind(this)}/>
              </div> :
              <div>
                <div className="photo-list">
                  <div className="photo-gallery-btn">
                    <OssUpload fileList={this.state.fileList}
                               text={"上传图片"}
                               showUploadList={false}
                               multiple={true}
                               onChange={this.handleOnChangeOssUpload.bind(this)}/>
                  </div>
                  <ul className="clearfix">
                    {this.state.list &&
                    this.state.list.map((item, index) => {
                      return (
                        <li className="p-l fl mr15 mt10" key={index}>
                          <div className="img-check-box">
                            <Checkbox className="checked-item"
                                      data-index={item.goods_picture__id}
                                      value={item.pic_url}
                                      checked={this.state['thisStatus' + item.goods_picture__id]}
                                      onChange={this.onChangeChecked.bind(this, item.goods_picture__id, index)}>
                              <img src={item.pic_url} alt=""/>
                            </Checkbox>
                          </div>
                        </li>
                      )
                    })
                    }
                  </ul>
                </div>
                <div className="mt30" style={{textAlign: "right"}}>
                  <Pagination defaultCurrent={1} total={this.state.total} pageSize={18}
                              onChange={this.handleOnChangePagination.bind(this)}/>
                </div>
              </div>
          }
        </Modal>
      </React.Fragment>
    );
  }
}

export default MyPhotoGalleryModal;

