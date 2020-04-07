/*
 * DesignOnline.jsx
 * 
 * For tbz.
 * 
 * props (must have):
 *   visible => {Boolean}
 *   closeBox => {Function}
 *   hasPid => {Boolean}
 *   pid => {String}
 *   classifyNameKeyWords => {String}
 * props (option):
 *   userTag => {String}
 *   backTargetUrl => {String}
 * 
 * Usage:
 * import DesignOnline from "components/common/DesignOnline.jsx";
    {
      this.state.visible ?
      <DesignOnline
        visible={this.state.visible}
        closeBox={() => this.closeBox()}
      >
      </DesignOnline> : null
    }
 */

import React, {Fragment} from "react";
import "./style/designonline.scss";
import lang from "assets/js/language/config";
import httpRequest from "utils/ajax";
import api from "utils/api";
import Handling from "components/common/Handling";
import MyBoxList from "components/common/MyBoxList";
import {Pagination} from "antd";

class DesignOnline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      publicDesignListTotal: 0,
      publicDesignListPageSize: 16,
      publicDesignList: [],
      publicDesignListHelp: [],
      currentPublicDesignPageIndex: 1,
      currentPublicDesignIndex: 0,
      publicDesignClassifyName: "",
      publicDesignCustomTags: [],
      publicDesignCustomTagsHelp: [],
      currentPublicDesignCustomTagIndex: 0,
      currentPublicDesignKeyWords: "",
    };
  }

  componentDidMount() {
    let keyWords = "&keywords=" + this.props.classifyNameKeyWords;
    this.getDesignOnlineData(1, this.state.publicDesignListPageSize, keyWords, this.state.currentPublicDesignCustomTagIndex);
  }

  pageItemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a className='ant-pagination-item-link ep-prev'>{"< " + lang.user.prevpage}</a>;
    }
    if (type === 'next') {
      return <a className='ant-pagination-item-link ep-next'>{lang.user.nextpage + " >"}</a>;
    }
    return originalElement;
  }

  /**
   * Get data from server.
   * 
   * @param {Number} page 
   * @param {Number} pageSize 
   * @param {String} keyWords 
   * @param {Number} currentPublicDesignCustomTagIndex 
   */
  getDesignOnlineData(page = 1, pageSize = this.state.publicDesignListPageSize, keyWords = "", currentPublicDesignCustomTagIndex = 0) {
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
      url: api.tbz.publicTemplateList + "?page=" + page + "&limit=" + pageSize + "&user_id=0&username=0" + pidArg + keyWords
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

      let publicDesignCustomTags = res.data.classify.customTags;
      publicDesignCustomTags.unshift(lang.common.all);
      let publicDesignCustomTagsHelp = [];
      for (let i = 0, len = publicDesignCustomTags.length; i < len; i++) {
        if (i === currentPublicDesignCustomTagIndex) {
          publicDesignCustomTagsHelp.push({
            active: true
          });
        } else {
          publicDesignCustomTagsHelp.push({
            active: false
          });
        }
      }

      _this.setState({
        publicDesignList: publicDesignList,
        publicDesignListHelp: publicDesignListHelp,
        publicDesignListTotal: res.data.total,
        publicDesignClassifyName: res.data.classify.name,
        publicDesignCustomTags: publicDesignCustomTags,
        publicDesignCustomTagsHelp: publicDesignCustomTagsHelp,
      });
    }).catch(res => {
      Handling.stop();
    });
  }

  chooseCustomTag(index) {
    let publicDesignCustomTagsHelp = this.state.publicDesignCustomTagsHelp;

    for (let i = 0, len = publicDesignCustomTagsHelp.length; i < len; i++) {
      if (i === index) {
        publicDesignCustomTagsHelp[i].active = true;
      } else {
        publicDesignCustomTagsHelp[i].active = false;
      }
    }

    this.setState({
      publicDesignCustomTagsHelp: publicDesignCustomTagsHelp
    });

    let keyWords1 = "&keywords=" + this.props.classifyNameKeyWords;
    let keyWords2 = this.state.publicDesignCustomTags[index];
     User choose "all".
    if (index === 0) {
      keyWords2 = "";
    }
    let keyWords = keyWords1 + keyWords2;
     Cache keyWords.
    this.setState({
      currentPublicDesignKeyWords: keyWords,
      currentPublicDesignCustomTagIndex: index
    });

    this.getDesignOnlineData(1, this.state.publicDesignListPageSize, keyWords, index);
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

  closeMe() {
    document.body.classList.remove("ml-body-no-scroll");
    this.props.closeBox();
  }

  render() {
    if (this.props.visible) {
      document.body.classList.add("ml-body-no-scroll");
    }

    return (
      <Fragment>
        {
          this.props.visible ?
          <Fragment>
            <div className="ml-fixed ep-design-online">
              <div className="ml-block-center ep-box-inner">

                <div className="ml-relative ml-full-w ml-table ep-head">
                  <div className="ml-table-cell ml-text-center ep-head-inner">
                    <span className="ml-block">{lang.user.designOnline}</span>
                  </div>
                  <div className="ml-abs ml-table ml-pointer ml-no-user-select ep-back" onClick={() => this.closeMe()}>
                    <div className="ml-table-cell">
                      <span className="ml-block">{"<" + lang.common.back}</span>
                    </div>
                  </div>
                </div>

                <div className="ml-full-w ep-head1">
                  <div className="ep-box1 ml-table">
                    <div className="ml-table-cell">
                      <div className="ep-spans">
                        <div className="ml-left ml-full-h ml-table ep-span1">
                          <div className="ml-table-cell">
                            <span className="ml-block">{this.state.publicDesignClassifyName}</span>
                          </div>
                        </div>

                        <div className="ml-left ml-full-h ml-table ep-span2">
                          <div className="ml-table-bottom">
                            <span className="ml-block">{this.props.classifyNameKeyWords}</span>
                          </div>
                        </div>

                        {
                          this.props.userTag === "goodsdetail" && this.props.classifyNameKeyWords.length > 0 ?
                          <div className="ml-left ml-full-h ml-table ep-span3">
                            <div className="ml-table-bottom">
                              <span className="ml-block ml-pointer ml-no-user-select" onClick={() => this.closeMe()}>{lang.common.changeSize}</span>
                            </div>
                          </div> : null
                        }
                      </div>
                    </div>
                  </div>

                  <div className="ml-relative ml-flex ep-box2">
                    {
                      this.state.publicDesignCustomTags.map((item, index) => {
                        return (
                          <Fragment key={index}>
                            <div className={"ml-left ml-table ml-pointer ml-no-user-select ep-tag-item" + (this.state.publicDesignCustomTagsHelp[index].active ? " ep-tag-item-active" : "")} onClick={() => this.chooseCustomTag(index)}>
                              <div className="ml-table-cell">
                                <span className="ml-block">{item}</span>
                              </div>
                            </div>
                          </Fragment>
                        )
                      })
                    }

                    <span className="ml-abs ml-block ml-span14 ep-tag-label">{lang.common.filterTxt}</span>
                  </div>
                </div>

                <div className="ml-full-w ep-body">
                  <MyBoxList
                    userTag={this.props.userTag}
                    backTargetUrl={this.props.backTargetUrl}
                    hasHover={true}
                    hoverTag={"publicDesign"}
                    hasTBZJump={true}
                    myBoxList={this.state.publicDesignList}
                    myBoxListHelp={this.state.publicDesignListHelp}
                    changeBoxListHelp={(list) => this.setPublicDesignListHelp(list)}
                    myStyle={"t3"}
                    orderSN={this.props.orderSN || ""}
                    orderGoodsId={this.props.orderGoodsId || ""}
                  />
                </div>

                <div className="ml-full-w ep-foot">
                  {
                    this.state.publicDesignList.length > 0 ?
                    <Pagination
                      onChange={(page, pageSize) => this.getDesignOnlineData(page, pageSize, this.state.currentPublicDesignKeyWords, this.state.currentPublicDesignCustomTagIndex)}
                      total={this.state.publicDesignListTotal}
                      pageSize={this.state.publicDesignListPageSize}
                      current={this.state.currentPublicDesignPageIndex}
                      itemRender={this.pageItemRender}
                      showQuickJumper={true}
                      showTotal={(total, range) => `${lang.common.total} ${Math.ceil(total / this.state.publicDesignListPageSize)} ${lang.common.page}`}
                    ></Pagination> : null
                  }
                </div>

              </div>
            </div>
          </Fragment> : null
        }
      </Fragment>
    )
  }
}

export default DesignOnline;
