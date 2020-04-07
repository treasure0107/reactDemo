/**
 * MyBoxList.jsx
 * 
 * Must have:
 *   props.myBoxList => {Array}
 *   props.myBoxListHelp => {Array}
 *   props.changeBoxList => {Function}
 *   props.changeBoxListHelp => {Function}
 *   props.deleteBox => {Function}
 *   props.editBoxName => {Function}
 * Option:
 *   props.hasHover => {Boolean}
 *   props.hoverTag => {String}
 *   props.myStyle => {String}
 *   props.hasChoose => {Boolean}
 *   props.hasTBZJump => {Boolean}
 *   props.showPreview => {Boolean}
 *   props.userTag => {String}
 * 
 * Usage:
 * import MyBoxList from "components/common/MyBoxList";
 */

import React, {Fragment} from "react";
import "./style/myboxlist.scss";
import lang from "assets/js/language/config";
import ConfirmModal from "components/common/ConfirmModal";
import $ from "jquery";
import {message} from 'antd';
import TBZGoto from "components/third/tbz/TBZGoto.jsx";
import {sellerApi} from "utils/api.js";
import ComUtil from "utils/common";
import ImagePreview from "components/common/ImagePreview.jsx";

const fileTypeMustDownload = ComUtil.fileTypeMustDownload;

class MyBoxList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteVisible: false,
      currentIndex: 0,
      imagePreviewVisible: false,
      currentPreviewUrl: "",
    };
  }

  showItemOps(index) {
    if (this.props.hasHover) {
      let myBoxListHelp = this.props.myBoxListHelp;
      for (let i = 0, len = myBoxListHelp.length; i < len; i++) {
        if (i === index) {
          myBoxListHelp[i].opsActive = true;
        } else {
          myBoxListHelp[i].opsActive = false;
        }
      }
      this.props.changeBoxListHelp(myBoxListHelp);
    }
  }

  clearItemOps() {
    if (this.props.hasHover) {
      let myBoxListHelp = this.props.myBoxListHelp;
      for (let i = 0, len = myBoxListHelp.length; i < len; i++) {
        myBoxListHelp[i].opsActive = false;
      }
      this.props.changeBoxListHelp(myBoxListHelp);
    }
  }

  dlFile(index) {
    let url = this.props.myBoxList[index].fileUrl;
    let name = encodeURIComponent(this.props.myBoxList[index].fileName);
    ComUtil.dlFile(url, name);
  }

  deleteHandleCancel() {
    this.setState({
      deleteVisible: false
    });
  }

  deleteHandleOk() {
    if (1) {
      this.doDelete();
    }
  }

  doDelete() {
    this.deleteHandleCancel();

    this.props.deleteBox(this.state.currentIndex);
  }

  confirmDelete(index) {
    this.setState({
      deleteVisible: true,
      currentIndex: index
    });
  }

  renameFile(index) {
    this.setState({
      currentIndex: index
    });

    let myBoxListHelp = this.props.myBoxListHelp;
    for (let i = 0, len = myBoxListHelp.length; i < len; i++) {
      if (i === index) {
        myBoxListHelp[i].editMode = true;
      } else {
        myBoxListHelp[i].editMode = false;
      }
    }
    this.props.changeBoxListHelp(myBoxListHelp);

    let _this = this;
    let timer = setInterval(function() {
      if (_this.editInputDom) {
        _this.editInputDom.value = _this.props.myBoxList[index].name;
        _this.editInputDom.focus();
        clearInterval(timer);
      }
    }, 200);
  }

  cancelEdit() {
    let myBoxListHelp = this.props.myBoxListHelp;
    for (let i = 0, len = myBoxListHelp.length; i < len; i++) {
      myBoxListHelp[i].editMode = false;
    }
    this.props.changeBoxListHelp(myBoxListHelp);
  }

  doRenameFile(event) {
    let newBoxName = $(event.target).val();
    if (this.props.myBoxList[this.state.currentIndex].name === newBoxName) {
      this.cancelEdit();
      return true;
    }
    this.props.editBoxName(this.state.currentIndex, newBoxName,
      () => {
        this.cancelEdit();
      },
      () => {
        this.clearInput();
      }
    );
  }

  confirmEdit(event) {
    this.doRenameFile(event);
  }

  doEdit(event) {
    if (event.keyCode === 13) {
      this.doRenameFile(event);
    }
  }

  clearInput() {
    this.editInputDom.value = this.props.myBoxList[this.state.currentIndex].name;
    message.warn(lang.user.myFileObj.fileExist);
  }

  chooseFile(index) {
    if (this.props.hasChoose) {
      this.setState({
        currentIndex: index
      });

      let myBoxListHelp = this.props.myBoxListHelp;
      for (let i = 0, len = myBoxListHelp.length; i < len; i++) {
        if (i === index) {
          myBoxListHelp[i].chooseActive = true;
        } else {
          myBoxListHelp[i].chooseActive = false;
        }
      }

      this.props.changeBoxListHelp(myBoxListHelp);
    }

    if (this.props.showPreview && !this.state.imagePreviewVisible) {
      this.previewImage(this.props.myBoxList[index].fileUrl);
    }
  }

  previewImage(url) {
    if (ComUtil.fileTypeCanPreview.test(url)) {
      this.showImagePreview(url);
    } else {
      message.info(lang.common.fileTypeNoPreview);
    }
  }

  showImagePreview(url) {
    this.setState({
      imagePreviewVisible: true,
      currentPreviewUrl: url,
    });
  }

  hideImagePreview() {
    this.setState({
      imagePreviewVisible: false,
      currentPreviewUrl: "",
    });
  }

  render() {
    return (
      <Fragment>
        <div className="myboxlist-item-list" onMouseLeave={() => this.clearItemOps()}>
        {
          this.props.myBoxList.map((item, index) => {
            return (
              <div key={index} className={"ml-left ml-relative myboxlist-item" + (this.props.myStyle ? (" myboxlist-item-" + this.props.myStyle) : "")} onMouseOver={() => this.showItemOps(index)}>
                <div className={"ml-table ml-block-center ml-content-box ml-relative ep-item-img" + (this.props.hasChoose && this.props.myBoxListHelp[index].chooseActive ? " ep-item-img-active" : "")} onClick={() => this.chooseFile(index)}>
                  <div className={"ml-table-cell ml-content-box ep-item-img-inner" + (this.props.showPreview ? " ml-pointer" : "")}>
                    {
                      <img className="ml-block ml-block-center" src={item.imageUrl} />
                    }
                  </div>
                  {
                    item.showFileSuffix
                    ?
                    <div className="ml-abs ml-table ep-file-suffix">
                      <div className="ml-table-cell ml-text-center">
                        <span className="ml-block">{item.fileSuffix}</span>
                      </div>
                    </div>
                    :
                    null
                  }

                  {
                    <div className="ml-abs ep-choose-before"></div>
                  }

                  {
                    this.props.hasChoose && this.props.myBoxListHelp[index].chooseActive ? <div className="ml-abs ep-file-choose-icon"></div> : null
                  }
                </div>

                <div className="ml-table ml-relative ml-block-center ep-item-txt">
                  <div className="ml-table-cell">
                    <span className="ml-block ml-ellipsis1" title={item.name}>{item.name}</span>
                  </div>
                  {
                    this.props.myBoxListHelp[index].editMode
                    ?
                    <div className="ml-abs ml-content-box ep-item-txt-edit">
                      <input ref={el => this.editInputDom = el} type="text" className="ml-input" onBlur={this.confirmEdit.bind(this)} onKeyUp={this.doEdit.bind(this)} />
                    </div>
                    :
                    this.editInputDom = null ? null : null
                  }
                </div>

                <div className="ep-item-date-time">
                  <span className="ml-block">{item.dateTime}</span>
                </div>

                {
                  (this.props.hasHover && this.props.myBoxListHelp[index].opsActive && !this.props.myBoxListHelp[index].editMode)
                  ?
                  <Fragment>
                    {
                      this.props.hoverTag === "userMyFile" ?
                      <div className="ml-abs ep-hover-btns">
                        <div className="ml-table ml-left ml-pointer ml-no-user-select ep-item-delete" onClick={() => this.confirmDelete(index)}>
                          <div className="ml-table-cell ml-text-center">
                            <span className="ml-block">{lang.user.delete}</span>
                          </div>
                        </div>

                        <div className="ml-table ml-left ml-pointer ml-no-user-select ep-item-rename" onClick={() => this.renameFile(index)}>
                          <div className="ml-table-cell ml-text-center">
                            <span className="ml-block">{lang.user.rename}</span>
                          </div>
                        </div>

                        <div className="ml-table ml-left ml-pointer ml-no-user-select ep-item-download" onClick={() => this.dlFile(index)}>
                          <div className="ml-table-cell ml-text-center">
                            <span className="ml-block">{lang.user.dl}</span>
                          </div>
                        </div>
                      </div> : null
                    }

                    {
                      this.props.hoverTag === "userMyDesign" || this.props.hoverTag === "orderMyDesign" || this.props.hoverTag === "publicDesign" ?
                      <Fragment>
                        {
                          this.props.hasTBZJump ?
                          <TBZGoto
                            url={item.jumpUrl}
                            backTargetUrl={this.props.backTargetUrl || ""}
                            orderSN={this.props.orderSN || ""}
                            orderGoodsId={this.props.orderGoodsId || ""}
                            backTag={(this.props.hoverTag === "userMyDesign" ? "goods_search" :
                                      (this.props.userTag === "goodsdetail" ? "goods_detail" :
                                      (this.props.userTag === "order" ? "order_list" : "")))}
                            openTarget={this.props.hoverTag === "publicDesign" || this.props.hoverTag === "orderMyDesign" ? "_self" : ""}
                          >
                            <div className={"ml-abs ml-pointer ml-table ep-edit-design" + (this.props.hoverTag === "orderMyDesign" ? " ep-edit-design1" : "")}>
                              <div className="ml-table-cell">
                                <div className="ep-inner"></div>
                              </div>
                            </div>
                          </TBZGoto> : null
                        }
                      </Fragment> : null
                    }
                  </Fragment>
                  :
                  null
                }
              </div>
            )
          })
        }
        </div>
        
        <ConfirmModal
          visible={this.state.deleteVisible}
          title={""}
          width={420}
          content={lang.user.myFileObj.deleteTipsInfo}
          isBtnReverse={true}
          btn1Text={lang.common.ok}
          btn2Text={lang.common.cancel}
          btn1HighLight={true}
          handleCancel={() => this.deleteHandleCancel()}
          handleOk={() => this.deleteHandleOk()}
        />

        {
          this.props.showPreview && this.state.imagePreviewVisible ?
          <ImagePreview
            visible={this.props.showPreview && this.state.imagePreviewVisible}
            imageUrl={this.state.currentPreviewUrl}
            closeBox={() => this.hideImagePreview()}
          >
          </ImagePreview> : null
        }
      </Fragment>
    )
  }
}

export default MyBoxList;