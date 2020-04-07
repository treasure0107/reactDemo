import React, { Component, Fragment } from 'react'
import { Icon, Modal, Input, Button, Pagination, message } from 'antd'
import { sellerApi } from 'utils/api'
import httpRequest from 'utils/ajax'

class Folder extends Component {
  constructor() {
    super()
    this.state = {
      deleteVisible: false,
      editFolderVisible: false,
      folderId: '',
      folderName: '',
      folderTitle: '',
      isCreateNewFolder: false,
      folderData: null,
      page: 1,
      size: 12,
      total: 0
    }
  }
  componentDidMount() {
    this.getGalleryFolder()
  }
  getGalleryFolder() {
    const { page, size } = this.state
    httpRequest.get({
      url: sellerApi.goods.goodsPictureFolder,
      data: {
        page: page,
        size: size
      }
    }).then(res => {
      this.setState({
        folderData: res.data,
        total: res.total
      })
    })
  }
  render() {
    const { deleteVisible, editFolderVisible, folderName, folderTitle, folderData, page, size, total } = this.state
    return (
      <Fragment>
        {/* <div className="folderHeader clearfix">
          <Button type="primary" className="fr" onClick={this.createNewFolder}>新建文件夹</Button>
        </div> */}
        <div className="folders clearfix">
          {
            folderData && folderData.length > 0 && folderData.map(folder => {
              const { id, folder_name, num } = folder
              return (
                <div className="folderItem" key={id}>
                  <div className="folderTop" onClick={() => this.props.openFolder(id)}>
                    <div className="folderIcon center"><Icon type="folder-open"/></div>
                    <div className="folderName center">{folder_name}</div>
                  </div>
                  <div className="folderBottm">
                    <Icon type="edit" className="fl icon" onClick={() => this.editFolderName(id, folder_name)} />
                    <span className="imgNum">{num}张图片</span>
                    {
                      num == 0 ? (
                        <Icon type="delete" className="fr icon" onClick={() => this.deleteFolder(id)} />
                      ) : null
                    }
                  </div>
                </div>
              )
            })
          }
          <Pagination current={page} pageSize={size} total={total} onChange={this.onPageChange} />
        </div>
        <Modal
          title="确认删除"
          visible={deleteVisible}
          width={360}
          onOk={this.deleteOk}
          onCancel={this.deleteCancel}
          wrapClassName="del-Modal"
          centered
          cancelText={'取消'}
          okText={'确定'}>
          <div>
            您确认要删除吗？
          </div>
        </Modal>
        <Modal
          title={folderTitle}
          visible={editFolderVisible}
          width={360}
          onOk={this.editFolderNameOk}
          onCancel={this.editFolderCancel}
          destroyOnClose={true}
          wrapClassName="del-Modal"
          centered
          cancelText={'取消'}
          okText={'确定'}>
          <div>
            <span>文件夹名称：</span>
            <Input 
              className="goods-name"
              style={{width: 160}}
              value={folderName}
              onChange={this.onFolderNameChange}
              maxLength={10}
            />
          </div>
        </Modal>
      </Fragment>
    )
  }

  createNewFolder = () => {
    this.setState({
      editFolderVisible: true, 
      folderTitle: '新建文件夹',
      folderName: '', 
      isCreateNewFolder: true
    })
  }

  editFolderName = (folderId, folderName) => {
    this.setState({
      editFolderVisible: true,
      folderId,
      folderName,
      folderTitle: '重命名',
      isCreateNewFolder: false
    })
  }

  editFolderCancel = () => {
    this.setState({
      editFolderVisible: false
    })
  }

  // 修改文件夹名字，新建文件夹
  editFolderNameOk = () => {
    const { folderId, folderName, isCreateNewFolder } = this.state
    const params = {
      url: sellerApi.goods.goodsPictureFolder,
      data: {
        folder_name: folderName
      }
    }
    if (isCreateNewFolder) {
      httpRequest.post(params).then(res => {this.folderSucc('新建成功！')})
    } else {
      params.url = sellerApi.goods.goodsPictureFolder + "?folder_id=" + folderId
      httpRequest.put(params).then(res => {this.folderSucc('编辑成功！')})
    }
  }

  folderSucc(text) {
    message.success(text)
    this.getGalleryFolder()
    this.setState({
      editFolderVisible: false
    })
  }

  onFolderNameChange = (e) => {
    this.setState({
      folderName: e.target.value
    })
  }

  deleteFolder = (folderId) => {
    this.setState({
      deleteVisible: true,
      folderId
    })
  }

  // 删除文件夹
  deleteOk = () => {
    httpRequest.delete({
      url: sellerApi.goods.goodsPictureFolder + "?folder_id=" + this.state.folderId,
    }).then(res => {
      message.success("删除成功！")
      this.getGalleryFolder()
      this.setState({
        deleteVisible: false
      })
    })
  }
  deleteCancel = () => {
    this.setState({
      deleteVisible: false
    })
  }
  onPageChange = (page) => {
    this.setState({
      page
    }, () =>{
      this.getGalleryFolder()
    })
  }
}

export default Folder