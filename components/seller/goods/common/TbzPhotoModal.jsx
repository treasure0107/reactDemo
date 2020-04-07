/*
* 我的图片库
* */
import React, {Component} from 'react';
import {Modal, Button, Checkbox, Select, message, Pagination} from 'antd';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js';

const {Option} = Select;

class TbzPhotoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      bigImgVisible: false,
      list: [],
      tbzImgList: [],
      classifyList: [],
      sizeList: [],
      filterList: [],
      goodsMobileImgList: [],
      goodsMobileImgListLen: 0,
      total: 0,
      classifyId: 2,
      keywords: "",
      bigImgUrl: "",
      sizeItem: "",
      filterItem: "",
      imgNum: 0,
      imgListLen: 0,
      status: 0
    }
  }

  onChangeChecked(id, index, e) {
    let tbzImgList = this.state.tbzImgList;
    let imgListLen = this.state.imgListLen;
    let goodsMobileImgList = this.state.goodsMobileImgList;
    let goodsMobileImgListLen = this.state.goodsMobileImgListLen;
    let status = this.state.status;
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
    let obj = {};
    obj.link = e.target.dataLink;
    obj.pic_url = e.target.value;
    obj.is_main = 0;
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
        tbzImgList: [...tbzImgList, obj],
        goodsMobileImgList: [...goodsMobileImgList, obj.pic_url]
      }, () => {
        imgNum = this.state.tbzImgList.length;
        this.setState({
          imgNum
        })
      });
      this.setState({
        ['thisStatus' + id]: e.target.checked
      })
    } else {
      let newTbzImgList = tbzImgList.filter((item) => {
        if (item.pic_url != obj.pic_url) {
          return item;
        }
      });
      let newGoodsMobileImgList = goodsMobileImgList.filter((item) => {
        if (item != obj.pic_url) {
          return item;
        }
      });
      imgNum = newTbzImgList.length;
      this.setState({
        tbzImgList: newTbzImgList,
        goodsMobileImgList: newGoodsMobileImgList,
        ['thisStatus' + id]: false,
        imgNum
      })
    }


  }

  componentDidMount() {

  }

  handleChangeClassify(value) {
    this.setState({
      classifyId: value,
      sizeItem: "",
      filterItem: ""
    }, () => {
      this.getTbzCategory();
      this.getTbzList(1, 16);
    })
  }

  //  微创印图片库
  getTbzCategory() {
    httpRequest.get({
      url: sellerApi.goods.tbzCategory,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        let classifyList = res.data;
        let sizeList = [];
        let filterList = [];
        let classifyId = this.state.classifyId;
        classifyList && classifyList.map((item, index) => {
          if (item.classify.classifyId == classifyId) {
            sizeList = item.classify.children;
            filterList = item.classify.customTags;
          }
        });
        this.setState({
          classifyList,
          sizeList,
          filterList,
        })
      }
    })
  }

  //  微创印图片库
  getTbzList(page, size) {
    let {classifyId, keywords, sizeItem, filterItem} = this.state;
    keywords = sizeItem + filterItem;
    httpRequest.get({
      url: sellerApi.goods.tbzList,
      data: {
        pid: classifyId,
        keywords: keywords,
        page: page,
        limit: size,
      }
    }).then(res => {
      if (res.code == "200") {
        let total = res.data.total;
        let list = res.data.data;
        this.setState({
          list,
          total
        })
      }
    })
  }

  handleSize(val) {
    this.setState({
      sizeItem: val
    }, () => {
      this.getTbzList(1, 16);
    })
  }

  handleFilter(val) {
    this.setState({
      filterItem: val
    }, () => {
      this.getTbzList(1, 16);
    })
  }

  handleOnChangePagination(page, pageSize) {
    this.getTbzList(page, pageSize);
  }

  showModalTbz() {
    let status = this.props.status;
    let pid = this.props.pid;
    if (this.props.pid) {
      pid = parseFloat(pid)
    } else {
      pid = 2
    }
    this.setState({
      goodsMobileImgList: [],
      classifyId: pid
    }, () => {
      this.getTbzCategory();
      this.getTbzList(1, 16);
    });
    console.log("pid---", this.props.pid);
    this.state.list.forEach(check => {
      this.setState({
        ['thisStatus' + check.templateId]: false
      })
    });
    let classifyName = this.props.classifyName;
    // let classifyId = this.props.classifyId;
    let imgList = this.props.imgListLen;
    let goodsMobileImgList = this.props.goodsMobileImgList;
    if (!comUtil.isEmpty(imgList)) {
      let newImgListLen = imgList.length;
      this.setState({
        imgListLen: newImgListLen
      })
    }

    if (!comUtil.isEmpty(goodsMobileImgList)) {
      let newGoodsMobileImgListLen = goodsMobileImgList.length;
      this.setState({
        goodsMobileImgListLen: newGoodsMobileImgListLen
      })
    }

    this.setState({
      visible: true,
      classifyName,
      status,
      tbzImgList: [],
      imgNum: 0,
    });
  };

  handleKnow() {
    let status = this.state.status;
    this.setState({
      visible: false,
    });
    if (status == 1) {
      this.props.tbzImgList(this.state.tbzImgList)
    } else {
      this.props.mobileImgList(this.state.goodsMobileImgList)
    }

  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancelBigImg = e => {
    this.setState({
      bigImgVisible: false,
    });
  };

  handlePreviewImg(url) {
    this.setState({
      bigImgVisible: true,
      bigImgUrl: url
    })
  }

  bigImg() {
    let {bigImgUrl} = this.state;
    return (
      <React.Fragment>
        <Modal
          title="预览图片"
          visible={this.state.bigImgVisible}
          onCancel={this.handleCancelBigImg}
          width={800}
          wrapClassName={'tbz-big-img-modal'}
          footer={false}
        >
          <div className="big-img">
            <img src={bigImgUrl} alt=""/>
          </div>
        </Modal>
      </React.Fragment>
    )
  }

  render() {
    const {sizeList, filterList, sizeItem, filterItem, imgNum, classifyName} = this.state;
    return (
      <React.Fragment>
        <Button className="btn goods-btn" onClick={this.showModalTbz.bind(this)}>微创印图片库</Button>
        <Modal
          closable={false}
          visible={this.state.visible}
          width={1200}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
          wrapClassName={'tbz-photo-gallery-modal'}
          footer={false}>
          <div className="tbz-con">
            <div className="tbz-h">
              <div className="tbz-h-l">
                <span className="mr10">您正在为</span>
                <span className="activeColor mr10"> {classifyName} </span>
                选择商品图，最多可选10张
              </div>
              <div className="tbz-h-r">
                <span className="tbz-t">已选 <span className="activeColor"> {imgNum}</span> 张</span>
                <Button className="add btn-icon btn-pro ml10" type="primary"
                        onClick={this.handleKnow.bind(this)}>我选好了</Button>
              </div>
            </div>
            <div className="filter-main">
              <div>
                <Select
                  value={this.state.classifyId}
                  style={{width: 190}}
                  className="classifySelect"
                  onChange={this.handleChangeClassify.bind(this)}>
                  {
                    this.state.classifyList &&
                    this.state.classifyList.map((item, index) => {
                      return (
                        <Option value={item.classify.classifyId} key={index}>{item.classify.name}</Option>
                      )
                    })
                  }
                </Select>
              </div>
              <div className="filter-con filter-size">
                <span>尺寸：</span>
                <span className={`f-item ${sizeItem == "" ? "activeItem" : null}`}
                      onClick={this.handleSize.bind(this, "")}>全部</span>
                {sizeList &&
                sizeList.map((item, index) => {
                  return (
                    <span className={`f-item ${item == sizeItem ? "activeItem" : null}`} key={index}
                          onClick={this.handleSize.bind(this, item)}>{item}</span>
                  )
                })
                }
              </div>
              <div className="filter-con filter-customTags">
                <span>筛选：</span>
                <span className={`f-item ${filterItem == "" ? "activeItem" : null}`}
                      onClick={this.handleFilter.bind(this, "")}>全部</span>
                {filterList &&
                filterList.map((item, index) => {
                  return (
                    <span className={`f-item ${item == filterItem ? "activeItem" : null}`} key={index}
                          onClick={this.handleFilter.bind(this, item)}>{item}</span>
                  )
                })
                }
              </div>
            </div>
            <div className="tbz-list">
              <ul className="clearfix">
                {this.state.list &&
                this.state.list.map((item, index) => {
                  return (
                    <li className="fl mt10" key={item.templateId}>
                      <div className="img-check-box tbz-img">
                    <span className="tbzpreviewImg"
                          onClick={this.handlePreviewImg.bind(this, item.thumbnail)}>预览</span>
                        <Checkbox className="checked-item"
                                  dataLink={item.link}
                                  value={item.thumbnail}
                                  checked={this.state['thisStatus' + item.templateId]}
                                  onChange={this.onChangeChecked.bind(this, item.templateId, index)}>
                          <img src={item.thumbnail} alt=""/>
                        </Checkbox>
                      </div>
                      <div className="tbz-news">
                        <div className="tbz-n">
                          <span className="tbz-tit">{item.title}</span>
                        </div>
                        <div className="tbz-n clearfix">
                          <span className="tbz-icon tbz-size fl">{item.classifyName}</span>
                          <span className="tbz-icon tbz-num fr">模版编号:{item.templateId}</span>
                        </div>
                      </div>
                    </li>
                  )
                })
                }
              </ul>
            </div>

          </div>
          <div className="mt30 Page-box" style={{textAlign: "right"}}>
            <Pagination defaultCurrent={1} total={this.state.total} pageSize={16}
                        onChange={this.handleOnChangePagination.bind(this)}/>
          </div>
        </Modal>
        {this.bigImg()}
      </React.Fragment>
    );
  }
}


export default TbzPhotoModal;

