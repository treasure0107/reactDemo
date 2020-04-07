import React, {Component} from 'react';
import Title from '../common/Title';
import {Tabs, Checkbox, message, Button, Input, Pagination, Modal, Icon} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import '../common/style/goodsList.scss';
import {Link} from "react-router-dom";
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';

const {TabPane} = Tabs;

class GoodsPhotoGalleryFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品  --   我的图片库',
      list: [],
      url: '',
      total: 0,
      page: 1,
      delList: [],
      visible: false,
      visibleNewFolder: false,
      titNewFolder: "新建文件夹",
      folderName: "",
      folder_id: "",
      folderStatus: true
    };
  }

  componentDidMount() {
    this.getPictureFolder(1, 18);
  }


  //  我的图片库文件夹 getPictureFolderFolder
  getPictureFolder(page, size) {
    httpRequest.get({
      url: sellerApi.goods.goodsPictureFolder,
      data: {
        page: page,
        size: size
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
    this.getPictureFolder(page, pageSize);
  }

  handleDelOk() {
    setTimeout(() => {
      let {folder_id, page} = this.state;
      httpRequest.delete({
        url: sellerApi.goods.goodsPictureFolder + "?folder_id=" + folder_id,
        data: {}
      }).then(res => {
        if (res.code == "200") {
          message.success("删除成功！");
          this.getPictureFolder(page, 18);
        }
      });
      this.setState({
        visible: false,
      });
    }, 600);

  };

  handleCancel(e) {
    this.setState({
      visible: false,
      visibleNewFolder: false,
      folderName: ""
    });
  };


  handleNewFolder() {
    this.setState({
      titNewFolder: "新建文件夹",
      visibleNewFolder: true,
      folderStatus: true,
    })
  }

  handleOkNewFolder() {
    let {folderStatus, folderName, folder_id, page} = this.state;
    if (folderStatus) {
      httpRequest.post({
        url: sellerApi.goods.goodsPictureFolder,
        data: {
          folder_name: folderName
        }
      }).then(res => {
        if (res.code == "200") {
          message.success("创建成功！");
          this.getPictureFolder(page, 18);
        }
      });
    } else {
      httpRequest.put({
        url: sellerApi.goods.goodsPictureFolder + "?folder_id=" + folder_id,
        data: {
          folder_name: folderName
        }
      }).then(res => {
        if (res.code == "200") {
          message.success("编辑 成功！");
          this.setState({
            folderName: ""
          });
          this.getPictureFolder(page, 18);
        }
      });
    }
    this.setState({
      visibleNewFolder: false
    })
  }

  handleEditFolder(id, folderName) {
    this.setState({
      titNewFolder: "重命名",
      visibleNewFolder: true,
      folderStatus: false,
      folder_id: id,
      folderName
    })
  }

  handleOnChangeFolder(e) {
    this.setState({
      folderName: e.target.value
    })
  }

  handleDeleteFolder(id) {
    this.setState({
      folder_id: id,
      visible: true
    })
  }

  handleLinkTo(folder_id) {
    this.props.history.push(`/seller/goods/GoodsPhotoGallery/${folder_id}`);
  }

  //图片渲染组件
  getDataItem() {
    let _this = this;
    return (_this.state.list &&
      _this.state.list.map((item, index) => {
        return (
          <div className="list-item" key={index}>
            <div className="folder-item">
              <div className="folder-con" onClick={this.handleLinkTo.bind(this, item.id)}>
                <p><Icon type="folder-open" className="folder-icon"/></p>
                <p><span className="folder-name">{item.folder_name}</span></p>
              </div>
              <div className="folder-news">
                <a href="javascript:void(0);" className="edit-btn"
                   onClick={this.handleEditFolder.bind(this, item.id, item.folder_name)}>
                  <Icon type="edit"/>
                </a>
                <span>{item.num}张图片</span>
                {
                  item.num <= 0 ?
                    <a href="javascript:void(0);" className="delete-btn"
                       onClick={this.handleDeleteFolder.bind(this, item.id)}>
                      <Icon type="delete"/>
                    </a> : null
                }
              </div>
            </div>
          </div>
        )
      })
    )
  }

  render() {
    const {visible, visibleNewFolder, titNewFolder, folderName} = this.state;
    return (
      <div className='goods-photo-gallery'>
        <Title title={this.state.titleContent}/>
        <div className="goods-photo-gallery-con goods-main">
          <div className="clearfix photo-gallery-btn mr30">
            <Button type="primary" className="btn fr" icon="folder-add"
                    onClick={this.handleNewFolder.bind(this)}>新建文件夹</Button>
          </div>
          <div className="photo-list clearfix">
            {this.getDataItem()}
          </div>
          <div className="clearfix mt30">
            <div className="mt30 fr" style={{textAlign: "right", paddingRight: "50px"}}>
              <Pagination defaultCurrent={1} total={this.state.total} pageSize={18}
                          current={this.state.page}
                          onChange={this.handleOnChangePagination.bind(this)}/>
            </div>
          </div>
        </div>
        <Modal
          title={titNewFolder}
          visible={visibleNewFolder}
          width={360}
          onOk={this.handleOkNewFolder.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          destroyOnClose={true}
          wrapClassName="del-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div>
            <span>文件夹名称：</span>
            <Input className="goods-name" style={{width: 160}}
                   value={folderName}
                   onChange={this.handleOnChangeFolder.bind(this)}
                   maxLength={10}
                   placeholder=""/>
          </div>
        </Modal>

        <Modal
          title="确认删除"
          visible={visible}
          width={360}
          onOk={this.handleDelOk.bind(this)}
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

export default GoodsPhotoGalleryFolder;
