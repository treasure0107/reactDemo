import React, {Component} from 'react';
import {Tabs, Input, Button, Select, Icon, message, Modal} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import AddGoodsTypeModal from "./AddGoodsTypeModal"
import MyPhotoGalleryModal from "./MyPhotoGalleryModal"

import OssUpload from "components/common/OssUpload"
import Ueditor from "components/common/Ueditor";
import {connect} from 'react-redux'
import {actionCreator} from "../store";
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js';

const {Option} = Select;
const {TabPane} = Tabs;

class InvGoodsFillInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastActive: 0,
      active: 2,
      is_return: '0',
      list: [],
      fileList: [],
      fileItem: {},
      videoUrl: '',
      goods_name: '',
      goods_sn: "",
      goods_price: "",
      market_price: '',
      goods_alarm_qty: '',
      weight: '',
      goods_weight_unit: '',
      shop_category_id: "",
      shipping_id: "",
      storeClassifyList: [],
      goodsPictureList: [],
      imgList: [],
      imgEditorList: [],
      mobileImgList: [],
      ueditorImgList: [],
      goods_desc_mobile: [],
      imgLength: 1,
      bigImgUrl: "",
      bigImgVisible: false
    };
    this.handleOnChangeGooodsName = this.handleOnChangeGooodsName.bind(this);
    this.handleChangeGoodsNum = this.handleChangeGoodsNum.bind(this);
    this.handleChangeGoodsPrice = this.handleChangeGoodsPrice.bind(this);
    this.handleBlurGoodsPrice = this.handleBlurGoodsPrice.bind(this);
    this.handleChangeGoodsMarketPrice = this.handleChangeGoodsMarketPrice.bind(this);
    this.handleBlurMarketPrice = this.handleBlurMarketPrice.bind(this);
    this.handleChangeGoodsStoreWarn = this.handleChangeGoodsStoreWarn.bind(this);
    this.handleChangeGoodsWeight = this.handleChangeGoodsWeight.bind(this);
    this.handleBlurGoodsWeight = this.handleBlurGoodsWeight.bind(this);
  }

  componentDidMount() {
    this.getStoreClassify();
    this.getFreightTemplate();
  }

  getClassifyStatus(status) {
    if (status == 1) {
      setTimeout(() => {
        this.getStoreClassify();
      }, 600)
    }
  }

  getStoreClassify() {
    httpRequest.get({
      url: sellerApi.goods.storeClassifyShopClass,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          storeClassifyList: res.data
        })

      }
    })
  }

  //运费模板
  getFreightTemplate() {
    httpRequest.get({
      url: sellerApi.goods.shippingTemplate,
      data: {
        size: 1000
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          goodsPictureList: res.data
        })
      }
    })
  }

  nextStepTwo(active) {
    let UE = window.UE;
    let ueEditor = UE.getEditor('container');
    // console.log(ueEditor.getContent());
    let goods_thumb_image = "";
    let imgList = this.state.imgList;
    if (imgList) {
      for (let i = 0; i < imgList.length; i++) {
        if (imgList[i].is_main == 1) {
          goods_thumb_image = imgList[i].pic_url
        } else {
          goods_thumb_image = imgList[0].pic_url
        }
      }
    }
    let goods_name = this.state.goods_name;
    let goods_price = this.state.goods_price;
    let shipping_id = this.state.shipping_id;
    let market_price = this.state.market_price;
    let goods_alarm_qty = this.state.goods_alarm_qty;
    let videoUrl = this.state.videoUrl || "";
    let weight = this.state.weight;
    if (comUtil.isEmpty(goods_name)) {
      message.warning('请输入商品名称');
      return false;
    }
    if (comUtil.isEmpty(goods_price)) {
      message.warning('请输入商品售价');
      return false;
    }
    if (comUtil.isEmpty(market_price)) {
      message.warning('请输入划线价');
      return false;
    }
    if (comUtil.isEmpty(goods_alarm_qty)) {
      message.warning('请输入预警库存数');
      return false;
    }
    if (comUtil.isEmpty(weight)) {
      message.warning('请输入商品重量');
      return false;
    }
    if (!goods_thumb_image) {
      message.warning('请在我的图片库选择图片');
      return false;
    }
    if (comUtil.isEmpty(shipping_id)) {
      message.warning('请选择运费模板');
      return false;
    }
    let goodsdata = {
      category_id: this.props.classifyId,   //本店商品类型id
      shop_category_id: this.state.shop_category_id,   //本店商品类型
      goods_name: goods_name,   //商品名称
      shipping_id: shipping_id,   //运费模板
      goods_sn: this.state.goods_sn,
      goods_price: goods_price,
      market_price: market_price,
      goods_thumb_image: goods_thumb_image,
      goods_alarm_qty: goods_alarm_qty,
      weight: weight,
      image_list: this.state.imgList,
      video: videoUrl,
      return_mark: [0, 0, 0],
      goods_server: [0, 0, 0],
      goods_desc: ueEditor.getContent(),
      goods_desc_mobile: this.state.goods_desc_mobile || []
    };
    this.props.saveGoods(goodsdata);
    this.props.activeValue(active);
  }

  lastStep(active) {
    this.props.activeValue(active);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let goods = nextProps.goods;
    this.setState({
      goods_name: goods.goods_name,   //商品名称
      shop_category_id: goods.shop_category_id,
      shipping_id: goods.shipping_id,
      goods_sn: goods.goods_sn,
      goods_price: goods.goods_price,
      market_price: goods.market_price,
      weight: goods.weight,
      goods_alarm_qty: goods.goods_alarm_qty,
      imgList: goods.image_list,
      goods_thumb_image: goods.goods_thumb_image,
      goods_desc: goods.goods_desc,
      goods_desc_mobile: goods.goods_desc_mobile,
      videoUrl: goods.video
    });
  }

  //本店商品类型
  handleChangeGoodsType(value, label, extra) {
    this.setState({
      shop_category_id: value
    });
  }

  //运费模板
  handleChangeFreight(value) {
    this.setState({
      shipping_id: value
    })
  }

  callbackTab(key) {

  }

  //上传视频
  handleOnChangeOssUpload(fileList, imgUrl) {
    setTimeout(() => {
      this.setState({
        videoUrl: imgUrl
      })
    }, 500);

  }

  //商品名称
  handleOnChangeGooodsName(e) {
    this.setState({
      goods_name: e.target.value
    })
  }

  //商品货号
  handleChangeGoodsNum(e) {
    this.setState({
      goods_sn: e.target.value
    })
  }

  //商品售价
  handleChangeGoodsPrice(e) {
    let val = e.target.value.replace(/[^(\-|\+)?\d+(\.\d+)?$]/g, '');
    this.setState({
      goods_price: val
    })
  }

  //划线价
  handleChangeGoodsMarketPrice(e) {
    let val = e.target.value.replace(/[^(\-|\+)?\d+(\.\d+)?$]/g, '');
    this.setState({
      market_price: val
    })
  }

  //商品售价
  handleBlurGoodsPrice(e) {
    let val = e.target.value;
    let reg = /^\d+(\.\d{0,3})?$/;
    if (!reg.test(val)) {
      message.error("最多输入三位小数的数字");
      val = ""
    }
    this.setState({
      goods_price: val
    });
    setTimeout(() => {
      let market_price = this.state.market_price;
      let goods_price = this.state.goods_price;
      if (Number(goods_price) > Number(market_price)) {
        message.error("商品售价必须小于划线价")
      }
    }, 100)

  }

  //划线价
  handleBlurMarketPrice(e) {
    let val = e.target.value;
    let reg = /^\d+(\.\d{0,3})?$/;
    if (!reg.test(val)) {
      message.error("最多输入三位小数的数字");
      val = ""
    }
    this.setState({
      market_price: val
    });
    setTimeout(() => {
      let goods_price = this.state.goods_price;
      let market_price = this.state.market_price;
      if (Number(goods_price) > Number(market_price)) {
        message.error("商品售价必须小于划线价")
      }
    }, 100)
  }


  //预警库存数
  handleChangeGoodsStoreWarn(e) {
    let reg = /\D/g;
    let val = e.target.value.replace(reg, "");
    this.setState({
      goods_alarm_qty: val
    })
  }

  //商品重量
  handleChangeGoodsWeight(e) {
    this.setState({
      weight: e.target.value
    })
  }

  handleBlurGoodsWeight(e) {
    let val = e.target.value;
    let reg = /^\d+(\.\d{0,2})?$/;
    if (!reg.test(val)) {
      message.error("最多输入两位小数的数字");
      val = ""
    }
    this.setState({
      weight: val
    })
  }

  //商品重量单位
  handleChangeGoodsWeightUnit(value) {
    this.setState({
      goods_weight_unit: value.key
    })
  }

  //获取图片库的图片
  getImgList(imgList) {
    let imgArr = [];
    if (this.state.imgList) {
      imgArr = this.state.imgList;
    }
    let list = [];
    imgList && imgList.map((item, index) => {
      let imgObj = {};
      imgObj.pic_url = item;
      imgObj.is_main = 0;
      list.push(imgObj);
    });

    if (imgArr.length > 0) {
      list = list.concat(imgArr)
    }
    this.setState({
      imgList: list
    })
  }

  //设置主图
  setMainPic(index) {
    let newImgList = this.state.imgList;
    newImgList[index].is_main = 1;
    for (let i = 0; i < newImgList.length; i++) {
      if (i != index) {
        newImgList[i].is_main = 0;
      }
    }
    this.setState({
      imgList: newImgList
    });
  }

  //展示大图
  showBigImg(index) {
    let newImgList = this.state.imgList;
    let bigImgUrl = newImgList[index].pic_url;
    this.setState({
      bigImgUrl,
      bigImgVisible: true
    });
  }

  bigImg() {
    let {bigImgUrl} = this.state;
    return (
        <React.Fragment>
          <Modal
              title="预览商品图"
              visible={this.state.bigImgVisible}
              onCancel={this.handleCancelBigImg.bind(this)}
              width={600}
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

  handleCancelBigImg() {
    this.setState({
      bigImgVisible: false,
    });
  };

  //删除图片
  delImg(index) {
    let newImgList = this.state.imgList;
    if (newImgList) {
      let imgList = newImgList.splice(index, 1);
      this.setState({
        imgList: newImgList
      });
    }
  }

  //手机端详情图片
  getMobileImgList(mobileImgList) {
    this.setState({
      goods_desc_mobile: mobileImgList
    })
  }

  //富文本编辑器图片
  getUeditorImgList(ueditorImgList) {
    this.setState({
      ueditorImgList: ueditorImgList
    }, () => {
      let UE = window.UE;
      let ueditor = UE.getEditor("container", {
        autoHeightEnabled: false,
        autoFloatEnabled: true
      });
      let imgList = this.state.ueditorImgList;
      let str = "";
      imgList && imgList.map((item, index) => {
        str = str + `<p><img src=${item} _src=${item}></p>`
      });
      ueditor.setContent(str, true);
    })
  }

  render() {
    return (
        <div className="goods-info">
          <div className="goods-tit">商品信息</div>
          <div>
            <div>
              <div className="mt15">
                <span className="tit"><span className="asterisk">* </span>平台商品分类：</span>
                <span>{this.props.classifyName}</span>
                {/*<span><Icon type="edit"/> </span>*/}
              </div>
              <div className="mt15">
                <span className="tit">本店商品类型：</span>
                <Select
                    defaultValue={this.state.shop_category_id}
                    value={this.state.shop_category_id}
                    style={{width: 180}}
                    onChange={this.handleChangeGoodsType.bind(this)}>
                  <Option value=''>请选择</Option>
                  {this.state.storeClassifyList &&
                  this.state.storeClassifyList.map((item, index) => {
                    return (
                        <Option value={item.seller_category_id} key={index}>{item.category_name}</Option>
                    )
                  })
                  }
                </Select>
                {/*添加分类*/}
                <AddGoodsTypeModal classifyStatus={this.getClassifyStatus.bind(this)}/>
              </div>
              <div className="mt15">
               <span className="tit">
                 <span className="asterisk">* </span>商品名称：</span>
                <Input className="goods-name" value={this.state.goods_name} onChange={this.handleOnChangeGooodsName}
                       placeholder="请输入商品名称,不超过30个字" maxLength={30}/>
              </div>
              <div className="mt15">
               <span className="tit">
                  <span className="asterisk">* </span>商品货号：</span>
                <Input className="goods-name" placeholder="请输入商品货号" value={this.state.goods_sn}
                       onChange={this.handleChangeGoodsNum}/>
              </div>
              <div className="mt15">
                <span className="tit">
                <span className="asterisk">* </span>商品售价：</span>
                <Input className="goods-name" placeholder="请输入商品售价"
                       value={this.state.goods_price}
                       onChange={this.handleChangeGoodsPrice}
                       onBlur={this.handleBlurGoodsPrice}/> 元
              </div>
              <div className="mt15">
                 <span className="tit">
                     <span className="asterisk">* </span>划线价：
                 </span>
                <Input className="goods-name" placeholder="请输入划线价"
                       value={this.state.market_price}
                       onChange={this.handleChangeGoodsMarketPrice}
                       onBlur={this.handleBlurMarketPrice}/> 元
              </div>
              <div className="mt15">
                <span className="tit"><span className="asterisk">* </span>预警库存数：</span>
                <Input className="goods-name" placeholder="请输入商品预售库存数"
                       value={this.state.goods_alarm_qty}
                       onChange={this.handleChangeGoodsStoreWarn}/>
              </div>
              <div className="mt15">
                <span className="tit"><span className="asterisk">* </span>商品重量：</span>
                <Input className="goods-name" placeholder="请输入商品重量"
                       value={this.state.weight}
                       onChange={this.handleChangeGoodsWeight}
                       onBlur={this.handleBlurGoodsWeight}/>
                <span>克</span>
              </div>
              <div className="mt15">
                <div>
                  <span className="tit">
                      <span className="asterisk">* </span>商品图片：
                   </span>
                  <span className="fs12">首张商品主图：建议尺寸：800*800起,图片格式：jpg，gif，
                    png，jpeg；鼠标移至图片，左上角可“设为主图”，右上角可“删除”</span>
                </div>
                <div className="imglist">
                  <ul className="clearfix">
                    {this.state.imgList &&
                    this.state.imgList.map((item, index) => {
                      return (
                          <li className="imgItem" key={index}>
                            <span className="set-m" onClick={this.setMainPic.bind(this, index)}>设为主图</span>
                            <Icon type="close-circle" className="icon-d" onClick={this.delImg.bind(this, index)}/>
                            <Icon type="home" className={item.is_main == 1 ? "icon-h show" : "icon-h hide"}/>
                            <img src={item.pic_url} alt="" onClick={this.showBigImg.bind(this, index)}/>
                          </li>
                      )
                    })
                    }
                  </ul>
                  {this.bigImg()}
                  <div className="mt15">
                    <MyPhotoGalleryModal status={1} imgList={this.getImgList.bind(this)}
                                         imgListLen={this.state.imgList}/>
                  </div>
                </div>
              </div>
              <div className="mt15">
                <div>
                    <span className="tit">
                       商品视频：
                     </span>
                  <span>要求格式：只支持MP4；大小10MB; &nbsp; 建议：像素398*398px；10秒以内的视频</span>
                </div>
                <div className="addVideo mt15 displayInlineBlock" style={{verticalAlign: "middle"}}>
                  <OssUpload imgNumber={1} text={"上传视频"}
                             onChange={this.handleOnChangeOssUpload.bind(this)}
                             uploadType={"video"}/>
                </div>
                <div className="displayInlineBlock mt15 ml10" style={{verticalAlign: "middle", height: "128px"}}>
                  <video controls="controls" src={this.state.videoUrl} id="videoPlay"
                         autoPlay={false} type="video/mp4" className={this.state.videoUrl ? "show" : "hide"}
                         style={{height: "128px"}}>
                  </video>
                </div>
              </div>
              <div className="mt15">
                           <span className="tit">
                               <span className="asterisk">* </span>运费模板：
                           </span>
                <Select
                    // defaultValue={this.state.shipping_id}
                    value={this.state.shipping_id}
                    style={{width: 160}}
                    className="goods-type"
                    onChange={this.handleChangeFreight.bind(this)}
                >
                  <Option value="">请选择运费模板</Option>
                  {
                    this.state.goodsPictureList &&
                    this.state.goodsPictureList.map((item, index) => {
                      return (
                          <Option value={Number(item.template_id)} key={index}>{item.template_name}</Option>
                      )
                    })
                  }

                </Select>
              </div>

            </div>
          </div>
          <div className="goods-tit mt30">商品详情</div>
          <div className="mt15 minHeight">
            <Tabs onChange={this.callbackTab.bind(this)} type="card">
              <TabPane tab="电脑端" key="1">
                <div className="editor-con">
                  <Ueditor defaultContent={this.state.goods_desc}/>
                </div>
                <div className="mt15">
                  <MyPhotoGalleryModal status={2} ueditorImgList={this.getUeditorImgList.bind(this)}/>
                </div>
              </TabPane>
              <TabPane tab="手机端" key="2">
                <div className="clearfix">
                  <div className="mobile-box h28 fl">
                    {this.state.goods_desc_mobile &&
                    this.state.goods_desc_mobile.map((item, index) => {
                      return (
                          <div key={index} className="mobile-img"><img src={item} alt=""/></div>
                      )
                    })
                    }
                  </div>
                  <div className="fl mt20 m-i">
                    <p className="m-i-t pb10">一、基本要求</p>
                    <p> 1、手机端详情页要求：</p>
                    <p> 图片不超过20张；</p>
                    <p>建议：所有图片都是本宝贝相关的图片。</p>
                    <p className="m-i-t mt15 pb10"> 二、图片大小</p>
                    <p>1、建议使用宽度480 ~ 620像素、高度小于等于960像素的图片；</p>
                    <p>2、格式为：JPG\JEPG\GIF\PNG；</p>
                    <p>举例：可以上传一张宽度为480，高度为960像素，格式为JPG的图片。</p>
                    <div className="mt15">
                      <MyPhotoGalleryModal status={3}
                                           mobileImgList={this.getMobileImgList.bind(this)}
                                           goodsMobileImgList={this.state.goods_desc_mobile}/>
                    </div>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
          <div className="btn-box mt30">
            <Button type="primary" className="btn ml30"
                    onClick={this.nextStepTwo.bind(this, this.state.active)}>下一步</Button>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    goods: state.goods.goods,
    classifyId: state.goods.classifyId,
    goods_id: state.goods.goods_id,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveGoods(goods) {
      dispatch(actionCreator.getGoods(goods))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InvGoodsFillInfo);

