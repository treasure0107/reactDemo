import React, {Component, Fragment} from 'react';
import Title from '../common/Title';
import {Tabs, Checkbox, message, Button, Pagination, Modal} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import '../common/style/goodsList.scss';
import {Link} from "react-router-dom";
import OssUpload from 'components/common/OssUpload';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js'

const {TabPane} = Tabs;

class GoodsPhotoGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品  --   我的图片库',
      list: [],
      fileList: [],
      arr: [],
      fileItem: {},
      url: '',
      listData: [],
      total: 0,
      page: 1,
      delList: [],
      allChecked: false,
      visible: false,
      imgUrlObj: {},
      folder_id: 0,
      uploadingFileList: [],
      pic_set: []
    };
    this.deleteImg = this.deleteImg.bind(this)
  }

  componentWillMount() {
    let folder_id = this.props.match.params.id;
    this.setState({
      folder_id
    })
  }

  componentDidMount() {
    this.getGoodsPicture(1, 18);
  }

  getImageInfo(url, callback) {
    let img = new Image();
    img.src = url;
    if (img.complete) {
      // 如果图片被缓存，则直接返回缓存数据
      callback(img.width, img.height);
    } else {

      img.onload = function () {
        callback(img.width, img.height);
      }
    }
  }

  //  我的图片库
  getGoodsPicture(page, size) {
    let folder_id = this.props.match.params.id;
    httpRequest.get({
      url: sellerApi.goods.goodsPicture,
      data: {
        page: page,
        size: size,
        folder_id: folder_id
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
    this.setState({
      page: page
    });
    this.getGoodsPicture(page, pageSize);
    this.state.list.forEach(check => {
      this.setState({
        ['thisStatus' + check.goods_picture__id]: false
      })
    });
    this.setState({
      allChecked: false
    });
  }

  uploadGoodsPicture(pic_set) {
    let folder_id = this.state.folder_id;
    httpRequest.post({
      url: sellerApi.goods.goodsPicture,
      data: {
        pic_set: pic_set,
        folder_id: folder_id
      }
    }).then(res => {
      if (res.code == "200") {
        this.getGoodsPicture(1, 18);
        setTimeout(() => {
          this.setState({
            page: 1
          });
        }, 1000)
      }
    })
  }


  onChangeChecked(index, id, e) {
    let newList = this.state.list;
    let delList = this.state.delList;
    this.setState({
      ['thisStatus' + id]: e.target.checked
    }, () => {
      let allChecked = true;
      for (let i = 0; i < newList.length; i++) {
        if (!this.state['thisStatus' + newList[i].id]) {
          allChecked = false;
          break
        }
      }
      this.setState({
        allChecked
      })
    });
    if (e.target.checked) {
      this.setState({
        delList: [...delList, id]
      })
    } else {
      let list = delList.filter((item) => {
        if (item != id) {
          return item;
        }
      });
      this.setState({
        delList: list
      })
    }
  }

  onChangeAll(e) {
    this.state.list.forEach(check => {
      this.setState({
        ['thisStatus' + check.goods_picture__id]: e.target.checked
      })
    });
    this.setState({
      allChecked: e.target.checked
    });
  }

  handleOk(e) {
    let allChecked = this.state.allChecked;
    if (allChecked) {
      let pic_set = [];
      this.state.list && this.state.list.map((item, index) => {
        pic_set.push(item.goods_picture__id)
      });
      this.setState({
        pic_set
      }, () => {
        this.delApi(this.state.pic_set)
      })
    } else {
      this.delApi(this.state.delList)
    }
    this.setState({
      visible: false
    });
  };

  handleCancel(e) {
    this.setState({
      visible: false,
    });
  };

  //删除按钮
  del() {
    let allChecked = this.state.allChecked;
    if (!allChecked && this.state.delList.length <= 0) {
      message.error("请先选择图片");
      return false;
    }
    this.setState({
      visible: true
    });
  }

  //删除图片请求方法
  delApi(pic_set) {
    let list = this.state.list;
    let folder_id = this.state.folder_id;
    httpRequest.delete({
      url: sellerApi.goods.goodsPicture,
      data: {
        pic_set: pic_set,
        folder_id: folder_id
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          allChecked: false,
          delList: []
        });
        if (pic_set.length == list.length) {
          this.getGoodsPicture(1, 18);
          this.setState({
            page: 1
          });
        } else {
          let page = this.state.page;
          this.getGoodsPicture(page, 18);
        }
      }
    })
  }

  handleOnLoad() {

  }


  deleteImg(name) {
    this.props.setFieldsValue({
      [name]: ''
    })
  }

  handleOnChangeUploadImg({fileList}, imgUrl) {
    fileList.map((file, i) => {
      let fileObj = {};
      fileObj.size = (file.size / 1024).toFixed(2);
      fileObj.pic_url = imgUrl;
      fileObj.width = 100;
      fileObj.height = 300;
      let list = [];
      list.push(fileObj);
      this.uploadGoodsPicture(list);
    });
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

  //图片渲染组件
  getDataItem() {
    let _this = this;
    return (_this.state.list &&
      _this.state.list.map((item, index) => {
        return (
          <div className="list-item" key={item.goods_picture__id}>
            <div className="img-item">
              <img src={item.pic_url} onLoad={this.handleOnLoad.bind(this)} alt=""/>
              <div className="img-news clearfix">
                <div className="img-size-l fl">
                  <span>{item.width}</span>
                  <span className={item.width ? null : "hide"}>x</span>
                  <span>{item.height}</span>
                </div>
                <div className="img-size-r fr">
                  <span>{item.size} <span className={item.size ? null : "hide"}>K</span> </span>
                </div>
              </div>
            </div>
            <div className="check-box">
              <Checkbox className="checked-item" value={item.goods_picture__id} data-index={item.goods_picture__id}
                        checked={this.state['thisStatus' + item.goods_picture__id]}
                        onChange={this.onChangeChecked.bind(_this, index, item.goods_picture__id)}/>
            </div>

          </div>
        )
      })
    )
  }

  render() {
    return (
      <div className='goods-photo-gallery'>
        <Title title={this.state.titleContent}/>
        <div className="goods-photo-gallery-con goods-main">
          <div className="photo-gallery-btn mr30 pl20 clearfix">
            <Button className="add-comment fl" icon="arrow-left"
                    onClick={() => {
                      this.props.history.push(`/seller/goods/GoodsPhotoGalleryFolder`)
                    }}>
              返回上一步</Button>
            <OssUpload fileList={this.state.fileList}
                       text={"上传图片"}
                       showUploadList={false}
                       multiple={true}
                       imgNumber={50}
                       onChange={this.handleOnChangeOssUpload.bind(this)}/>

            {/*<Form.Item>*/}
            {/*  <OssUpload imgNumber={10}*/}
            {/*             multiple={true}*/}
            {/*             onChange={this.handleOnChangeUploadImg.bind(this)}*/}
            {/*             text={"上传图片"}/>*/}
            {/*</Form.Item>*/}

          </div>
          <div className="photo-list clearfix">
            {this.getDataItem()}
          </div>
          {this.state.total > 0 ?
            <div className="clearfix mt30">
              <div className="mt30 fr" style={{textAlign: "right", paddingRight: "50px"}}>
                <Pagination defaultCurrent={1} total={this.state.total} pageSize={18}
                            current={this.state.page}
                            onChange={this.handleOnChangePagination.bind(this)}/>
              </div>
              <div>
                <div className="check-all-box fl">
                  <Checkbox className="checked-item checkedAll"
                            checked={this.state.allChecked}
                            onChange={this.onChangeAll.bind(this)}>全选</Checkbox>
                  <Button className="del-btn" type="primary" onClick={this.del.bind(this)}>删除</Button>
                </div>
              </div>
            </div> : null
          }
        </div>
        <Modal
          title="确认删除"
          visible={this.state.visible}
          width={360}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          wrapClassName="del-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div>
            您确认要删除吗？
          </div>
        </Modal>
      </div>
    )
  }
}

export default GoodsPhotoGallery;
