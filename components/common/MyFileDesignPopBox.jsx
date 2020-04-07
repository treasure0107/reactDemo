/*
 * MyFileDesignPopBox.jsx
 *
 * props: (must have)
 *   listType => {String} => ["myfile", "mydesign"]
 *   userTag => {String} => ["goodsdetail", "order"]
 *   pbVisible => {Boolean}
 *   closePB => {Function}
 *   openDesignOnline => {Function}
 * props: (option)
 *   orderSN => {String}
 *   chooseFileForOrder => {Function}
 *   chooseFileForGoods => {Function}
 *   hasPublicDesignListFlag => {Boolean}
 *   pid => {String}
 *   hasPid => {Boolean}
 *   noDesignOnline => {Boolean}
 *
 * Usage:
 * import MyFileDesignPopBox from "components/common/MyFileDesignPopBox";
    <MyFileDesignPopBox
      closePB={() => this.closePB()}
      listType={"myfile"}
      userTag={"order"}
      pbVisible={this.state.orderChooseFileVisible}
      orderSN={this.props.orderSN}
    />
 */

import React, {Fragment} from "react";
import "./style/myfiledesignpopbox.scss";
import OssUpload from "components/common/OssUpload";
import MyBoxList from "components/common/MyBoxList";
import Handling from "components/common/Handling";
import httpRequest from "utils/ajax";
import api from "utils/api";
import lang from "assets/js/language/config";
import $ from "jquery";
import {Modal, Pagination, message} from 'antd';
import TBZGoto from "components/third/tbz/TBZGoto.jsx";
import ComUtil from "utils/common";
import moment from "moment";

const fileTypeCanPreview = ComUtil.fileTypeCanPreview;
const fileTypeZIPRAR = ComUtil.fileTypeZIPRAR;

class MyFileDesignPopBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myFileListTotal: 0,
      myFileListPageSize: 7,
      myFileList: [],
      myFileListHelp: [],
      currentMyFilePageIndex: 1,
      currentMyFileIndex: 0,
      myFileInit: false,
      myFileTag: this.props.listType === "myfile" ? true : false,

      myDesignListTotal: 0,
      myDesignListPageSize: 7,
      myDesignList: [],
      myDesignListHelp: [],
      currentMyDesignPageIndex: 1,
      currentMyDesignIndex: 0,
      myDesignInit: false,
      myDesignTag: this.props.listType === "mydesign" ? true : false,

      publicDesignListTotal: 0,
      publicDesignListPageSize: 12,
      publicDesignList: [],
      publicDesignListHelp: [],
      currentPublicDesignPageIndex: 1,
      currentPublicDesignIndex: 0,
      publicDesignInit: false,
      publicDesignTag: this.props.listType === "publicdesign" ? true : false,

      fileList: [],

      enterLocalUploadFlag: false,

      designListTypeTxt: this.props.listType === "mydesign" ? lang.user.designOnline : (this.props.listType === "publicdesign" ? lang.user.myDesign : "")
    };
  }

  componentDidMount() {
    this.renderDefaultList();
  }

  renderDefaultList() {
    if (this.props.listType === "myfile") {
      this.getMyFile(1, this.state.myFileListPageSize);
    } else if (this.props.listType === "mydesign") {
      this.getMyDesign(1, this.state.myDesignListPageSize);
    } else if (this.props.listType === "publicdesign") {
      this.getPublicDesign(1, this.state.publicDesignListPageSize);
    }
  }

  getMyFile(page, pageSize) {
    let _this = this;
    let myFileList = [];
    let myFileListHelp = [];

    _this.setState({
      currentMyFilePageIndex: page
    });

    Handling.start();
    httpRequest.get({
      url: api.user.fileCenter + "?page_size=" + pageSize + "&page=" + page,
    }).then(res => {
      Handling.stop();
      for (let i = 0, len = res.data.data.length; i < len; i++) {
        let obj = {};
        obj.fileId = res.data.data[i].file_id;
        if (fileTypeCanPreview.test(res.data.data[i].file_url)) {
          obj.imageUrl = res.data.data[i].file_url;
        } else if (fileTypeZIPRAR.test(res.data.data[i].file_url)) {
          obj.imageUrl = require("assets/images//user/file-icon-zip-rar.png");
        } else if (ComUtil.fileTypePDF.test(res.data.data[i].file_url)) {
          obj.imageUrl = require("assets/images//user/file_icon_pdf.png");
        } else if (ComUtil.fileTypeCDR.test(res.data.data[i].file_url)) {
          obj.imageUrl = require("assets/images//user/file_icon_cdr.png");
        } else if (ComUtil.fileTypePSD.test(res.data.data[i].file_url)) {
          obj.imageUrl = require("assets/images//user/file_icon_psd.png");
        } else if (ComUtil.fileTypeAI.test(res.data.data[i].file_url)) {
          obj.imageUrl = require("assets/images//user/file_icon_ai.png");
        } else {
          obj.imageUrl = require("assets/images//user/file-icon.png");
          obj.showFileSuffix = true;
        }
        obj.fileSuffix = res.data.data[i].file_url.split('.').pop();
        obj.name = res.data.data[i].file_name;
        obj.dlName = res.data.data[i].file_name;
        obj.dateTime = res.data.data[i].create_time;
        obj.fileUrl = res.data.data[i].file_url;
        myFileList.push(obj);
        myFileListHelp.push({
          opsActive: false,
          editMode: false,
          chooseActive: false
        });
      }
      _this.setState({
        myFileList: myFileList,
        myFileListHelp: myFileListHelp,
        myFileListTotal: res.data.total
      });
      _this.initMyFile();
    }).catch(res => {
      Handling.stop();
      _this.initMyFile();
    });
  }

  initMyFile() {
    this.setState({
      myFileInit: true
    });
  }

  getMyDesign(page, pageSize) {
    let _this = this;
    let myDesignList = [];
    let myDesignListHelp = [];

    _this.setState({
      currentMyDesignPageIndex: page
    });

    Handling.start();
    httpRequest.get({
      url: api.tbz.savedTemplateList + "?page=" + page + "&limit=" + pageSize
    }).then(res => {
      Handling.stop();
      for (let i = 0, len = res.data.data.length; i < len; i++) {
        let obj = {};
        let suffix = ".pdf";
        obj.imageUrl = res.data.data[i].thumbnailUrl;
        obj.fileUrl = res.data.data[i].thumbnailUrl;
        obj.name = res.data.data[i].title;
        obj.dateTime = moment.unix(res.data.data[i].thumbnail_should_at).format("YYYY-MM-DD HH:mm:ss");
        obj.jumpUrl = res.data.data[i].Jump_url;
        obj.fileName = res.data.data[i].title + suffix;
        obj.dlName = res.data.data[i].title + "." + res.data.data[i].thumbnailUrl.split('.').pop();
        obj.templateId = res.data.data[i].templateId;
        obj.itemSaveTime = res.data.data[i].thumbnail_should_at;
        myDesignList.push(obj);
        myDesignListHelp.push({
          opsActive: false,
          editMode: false,
          chooseActive: false
        });
      }
      _this.setState({
        myDesignList: myDesignList,
        myDesignListHelp: myDesignListHelp,
        myDesignListTotal: res.data.total
      });
      _this.initMyDesign();
    }).catch(res => {
      Handling.stop();
      _this.initMyDesign();
    });
  }

  initMyDesign() {
    this.setState({
      myDesignInit: true
    });
  }

  closePB() {
    this.props.closePB();
  }

  chooseMyFile() {
    if (!this.state.myFileTag) {
      this.setState({
        myFileTag: true,
        myDesignTag: false
      });
      this.getMyFile(1, this.state.myFileListPageSize);
    }
  }

  chooseMyDesign() {
    if (!this.state.myDesignTag) {
      this.setState({
        myDesignTag: true,
        myFileTag: false
      });
      this.getMyDesign(1, this.state.myDesignListPageSize);
    }
  }

  uploadFromLocal() {
    $(".ep-my-file-design-pb-inner .ep-oss-upload .ant-upload-select .ant-upload").click();
  }

  ossUploadHandleChange({fileList}, imgUrl) {
    this.setState({
      fileList: fileList
    });

    if (!this.state.enterLocalUploadFlag) {
      this.setState({
        enterLocalUploadFlag: true
      });
      Handling.start();
    }

    if (fileList.length > 0) {
      if (fileList[0].status === "done") {
        Handling.stop();
        this.setState({
          enterLocalUploadFlag: false
        });
        let fileUrl = fileList[0].url || imgUrl;
        let fileName = fileList[0].name;
        let fileSize = fileList[0].size;
        let fileObj = {
          fileUrl: fileUrl,
          fileName: fileName,
          fileSize: fileSize
        };
        this.localUploadOk(fileObj);
        this.setState({
          fileList: []
        });
      }
    }
  }

  localUploadOk(fileObj) {
    this.createFileInFileCenter(fileObj);
  }

  createFileInFileCenter(fileObj) {
    let _this = this;
    httpRequest.post({
      url: api.user.fileCenter,
      data: {
        file_url: fileObj.fileUrl,
        file_name: fileObj.fileName,
        file_size: fileObj.fileSize
      }
    }).then(res => {
      _this.getMyFile(1, this.state.myFileListPageSize);
    });
  }

  setMyFileListHelp(list) {
    this.setState({
      myFileListHelp: list
    });

    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].chooseActive) {
        this.setState({
          currentMyFileIndex: i
        });
        break;
      }
    }
  }

  setMyDesignListHelp(list) {
    this.setState({
      myDesignListHelp: list
    });

    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].chooseActive) {
        this.setState({
          currentMyDesignIndex: i
        });
        break;
      }
    }
  }

  setPublicDesignListHelp(list) {
    this.setState({
      publicDesignListHelp: list
    });

    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].chooseActive) {
        this.setState({
          currentPublicDesignIndex: i
        });
        break;
      }
    }
  }

  chooseFileOrDesign() {
    if (this.props.userTag === "order") {
      if (this.state.myFileTag) {
        if (this.state.myFileListHelp[this.state.currentMyFileIndex].chooseActive) {
          this.props.chooseFileForOrder("myfile", this.state.myFileList, this.state.currentMyFileIndex);
        } else {
          message.info(lang.user.plsChoosePrintFileFirst);
        }
      } else if (this.state.myDesignTag) {
        if (this.state.myDesignListHelp[this.state.currentMyDesignIndex].chooseActive) {
          this.props.chooseFileForOrder("mydesign", this.state.myDesignList, this.state.currentMyDesignIndex);
        } else {
          message.info(lang.user.plsChoosePrintFileFirst);
        }
      }
    } else if (this.props.userTag === "goodsdetail") {
      if (this.state.myFileTag) {
        if (this.state.myFileListHelp[this.state.currentMyFileIndex].chooseActive) {
          this.props.chooseFileForGoods("myfile", this.state.myFileList, this.state.currentMyFileIndex);
        } else {
          message.info(lang.user.plsChoosePrintFileFirst);
        }
      } else if (this.state.myDesignTag) {
        if (this.state.myDesignListHelp[this.state.currentMyDesignIndex].chooseActive) {
          this.props.chooseFileForGoods("mydesign", this.state.myDesignList, this.state.currentMyDesignIndex);
        } else {
          message.info(lang.user.plsChoosePrintFileFirst);
        }
      }
    }
  }

  getPublicDesign(page, pageSize) {
    let _this = this;
    let publicDesignList = [];
    let publicDesignListHelp = [];

    _this.setState({
      currentPublicDesignPageIndex: page
    });

    let pidArg = "";
    if (this.props.hasPid) {
      pidArg = "&pid=" + this.props.pid;
    }

    Handling.start();
    httpRequest.get({
      url: api.tbz.publicTemplateList + "?page=" + page + "&limit=" + pageSize + "&user_id=0&username=0" + pidArg
    }).then(res => {
      Handling.stop();
      for (let i = 0, len = res.data.data.length; i < len; i++) {
        let obj = {};
        let suffix = ".pdf";
        obj.imageUrl = res.data.data[i].thumbnail;
        obj.name = res.data.data[i].title;
        obj.fileName = res.data.data[i].title + suffix;
        obj.templateId = res.data.data[i].templateId;
        obj.jumpUrl = res.data.data[i].Jump_url;
        publicDesignList.push(obj);
        publicDesignListHelp.push({
          opsActive: false,
          editMode: false,
          chooseActive: false
        });
      }
      _this.setState({
        publicDesignList: publicDesignList,
        publicDesignListHelp: publicDesignListHelp,
        publicDesignListTotal: res.data.total
      });
      _this.initPublicDesign();
    }).catch(res => {
      Handling.stop();
      _this.initPublicDesign();
    });
  }

  initPublicDesign() {
    this.setState({
      publicDesignInit: true
    });
  }

  toggleDesignList() {
    if (!this.state.publicDesignTag) {
      this.setState({
        publicDesignTag: true,
        myDesignTag: false,
        designListTypeTxt: lang.user.myDesign,
        myDesignList: []
      });
      this.getPublicDesign(1, this.state.publicDesignListPageSize);
    } else {
      this.setState({
        myDesignTag: true,
        publicDesignTag: false,
        designListTypeTxt: lang.user.designOnline,
        publicDesignList: []
      });
      this.getMyDesign(1, this.state.myDesignListPageSize);
    }
  }

  plsChoosePublicDesign() {
    message.info(lang.user.myFileObj.plsChooseDesignTxt);
  }

  render() {
    return (
      <Fragment>
        <Modal
          destroyOnClose
          centered
          closable={false}
          maskClosable={false}
          width={720}
          height={530}
          wrapClassName={"ep-my-file-design-pb"}
          footer={null}
          visible={this.props.pbVisible}
          onCancel={() => this.closePB()}
        >
          <div className="ep-my-file-design-pb-inner">
            {
              this.props.userTag === "goodsdetail" || this.props.userTag === "order" ?
              <div className="ml-relative ml-full-w ep-head">
                <div className="ml-text-center">
                  <span className="ml-block">{lang.user.submitPrintFile}</span>
                </div>
                <div className="ml-abs ml-pointer ep-head-close" onClick={() => this.closePB()}></div>
              </div> : null
            }

            <div className="ml-relative ep-head1">
              {
                this.props.userTag === "goodsdetail" || this.props.userTag === "order" ?
                <Fragment>
                  <div className="ml-full-h ep-btns">
                    <div className={"ml-table ml-left ml-pointer ml-no-user-select ml-full-h ep-btn ep-btn-my-upload" + (this.state.myFileTag ? " ep-btn-active" : "")} onClick={() => this.chooseMyFile()}>
                      <div className="ml-table-cell ml-text-center">
                        <span className="ml-block">{lang.user.myUpload}</span>
                      </div>
                    </div>
                    <div className={"ml-table ml-left ml-pointer ml-no-user-select ml-full-h ep-btn ep-btn-my-auto-design" + (this.state.myDesignTag ? " ep-btn-active" : "")} onClick={() => this.chooseMyDesign()}>
                      <div className="ml-table-cell ml-text-center">
                        <span className="ml-block">{lang.user.myAutoDesign}</span>
                      </div>
                    </div>
                    <div className="ml-left ml-full-h ep-btn-others"></div>
                  </div>
                </Fragment> : null
              }
            </div>

            <div className={"ep-body" + (this.state.myDesignTag && this.state.myDesignList.length === 0 && this.state.myDesignInit && this.props.noDesignOnline ? " ep-body-void" : "")}>
              {
                this.state.myFileTag ?
                <Fragment>
                  <div className="ml-left ml-pointer ml-relative ep-g-btn-upload-from-local ep-upload-from-local" onClick={() => this.uploadFromLocal()}>
                    <div className="ml-block-center ep-btn-icon"></div>
                    <div className="ml-text-center ep-btn-text"><span className="ml-block">{lang.user.uploadFromLocal}</span></div>
                    <div className="ml-abs ep-oss-upload">
                      <OssUpload
                        uploadType={"file"}
                        uploadSize={2048}
                        fileList={this.state.fileList}
                        onChange={this.ossUploadHandleChange.bind(this)}>
                      </OssUpload>
                    </div>
                  </div>
                  <MyBoxList
                    userTag={this.props.userTag}
                    myBoxList={this.state.myFileList}
                    myBoxListHelp={this.state.myFileListHelp}
                    changeBoxListHelp={(list) => this.setMyFileListHelp(list)}
                    myStyle={"t2"}
                    hasChoose={true}
                  />
                </Fragment> : null
              }
              {
                // Not needed.
                0 && this.state.myFileTag && this.state.myFileList.length === 0 && this.state.myFileInit ?
                <Fragment>
                  <div className="ml-block-center ep-myfile-empty-icon"></div>
                  <div className="ml-text-center ep-myfile-empty-txt"><span className="ml-block">{lang.user.myFileObj.emptyFileListTxt}</span></div>
                </Fragment> : null
              }

              {
                this.state.myDesignTag ?
                <Fragment>
                  {
                    !this.props.noDesignOnline ?
                    <div className="ml-left ml-pointer ep-goto-design-online" onClick={() => this.props.openDesignOnline()}>
                      <div className="ml-block-center ep-btn-icon"></div>
                      <div className="ml-text-center ep-btn-text"><span className="ml-block">{lang.user.designOnline}</span></div>
                    </div> : null
                  }
                  <MyBoxList
                    userTag={this.props.userTag}
                    backTargetUrl={this.props.backTargetUrl || ""}
                    orderSN={this.props.orderSN || ""}
                    orderGoodsId={this.props.orderGoodsId || ""}
                    hasHover={true}
                    hoverTag={"orderMyDesign"}
                    hasTBZJump={true}
                    myBoxList={this.state.myDesignList}
                    myBoxListHelp={this.state.myDesignListHelp}
                    changeBoxListHelp={(list) => this.setMyDesignListHelp(list)}
                    myStyle={"t2"}
                    hasChoose={true}
                  />
                </Fragment> : null
              }
              {
                this.state.myDesignTag && this.state.myDesignList.length === 0 && this.state.myDesignInit && this.props.noDesignOnline ?
                <Fragment>
                  <div className="ml-block-center ep-myfile-empty-icon"></div>
                  <div className="ml-text-center ep-myfile-empty-txt"><span className="ml-block">{lang.user.myFileObj.emptyDesignListTxt}</span></div>
                </Fragment> : null
              }

              {
                this.state.publicDesignTag ?
                <Fragment>
                  <MyBoxList
                    myBoxList={this.state.publicDesignList}
                    myBoxListHelp={this.state.publicDesignListHelp}
                    changeBoxListHelp={(list) => this.setPublicDesignListHelp(list)}
                    myStyle={"t2"}
                    hasChoose={true}
                  />
                </Fragment> : null
              }
              {
                this.state.publicDesignTag && this.state.publicDesignList.length === 0 && this.state.publicDesignInit ?
                <Fragment>
                  <div className="ml-block-center ep-myfile-empty-icon"></div>
                  <div className="ml-text-center ep-myfile-empty-txt"><span className="ml-block">{lang.user.myFileObj.emptyPublicDesignListTxt}</span></div>
                </Fragment> : null
              }
            </div>

            <div className="ml-full-w ml-table ep-foot">
              <div className="ml-table-cell">
                <div className="ep-foot-inner">
                  <div className="ml-left">
                    {
                      this.state.myFileTag && this.state.myFileList.length > 0 ?
                      <Pagination
                        onChange={(page, pageSize) => this.getMyFile(page, pageSize)}
                        total={this.state.myFileListTotal}
                        pageSize={this.state.myFileListPageSize}
                        current={this.state.currentMyFilePageIndex}
                      ></Pagination> : null
                    }
                    {
                      this.state.myDesignTag && this.state.myDesignList.length > 0 ?
                      <Pagination
                        onChange={(page, pageSize) => this.getMyDesign(page, pageSize)}
                        total={this.state.myDesignListTotal}
                        pageSize={this.state.myDesignListPageSize}
                        current={this.state.currentMyDesignPageIndex}
                      ></Pagination> : null
                    }
                    {
                      this.state.publicDesignTag && this.state.publicDesignList.length > 0 ?
                      <Pagination
                        onChange={(page, pageSize) => this.getPublicDesign(page, pageSize)}
                        total={this.state.publicDesignListTotal}
                        pageSize={this.state.publicDesignListPageSize}
                        current={this.state.currentPublicDesignPageIndex}
                      ></Pagination> : null
                    }
                  </div>
                  {
                    ( (this.state.myFileTag && this.state.myFileList.length > 0) ||
                      (this.state.myDesignTag && this.state.myDesignList.length > 0)
                    ) && !this.state.publicDesignTag ?
                    <div className="ml-pointer ml-no-user-select ml-table ml-right ep-foot-submit" onClick={() => this.chooseFileOrDesign()}>
                      <div className="ml-table-cell">
                        <span className="ml-block">{lang.user.myFileObj.submitConfirm}</span>
                      </div>
                    </div> : null
                  }
                  {
                    this.state.publicDesignTag && this.state.publicDesignList.length > 0 ?
                    (
                      this.state.publicDesignListHelp[this.state.currentPublicDesignIndex].chooseActive
                      ?
                      <TBZGoto openTarget={"_self"} backTargetUrl={window.location.origin + window.location.pathname} url={this.state.publicDesignList[this.state.currentPublicDesignIndex].jumpUrl}>
                        <div className="ml-pointer ml-no-user-select ml-table ml-right ep-foot-submit">
                          <div className="ml-table-cell">
                            <span className="ml-block">{lang.user.myFileObj.gotoDesign}</span>
                          </div>
                        </div>
                      </TBZGoto>
                      :
                      <div className="ml-pointer ml-no-user-select ml-table ml-right ep-foot-submit ep-foot-submit-inactive" onClick={() => this.plsChoosePublicDesign()}>
                        <div className="ml-table-cell">
                          <span className="ml-block">{lang.user.myFileObj.gotoDesign}</span>
                        </div>
                      </div>
                    ) : null
                  }
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    )
  }
}

export default MyFileDesignPopBox;
