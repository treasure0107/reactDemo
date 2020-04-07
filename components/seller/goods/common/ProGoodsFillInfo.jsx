import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom'
import {Tabs, Input, Button, Select, Checkbox, Icon, message, Radio, Modal, Tooltip} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import AddGoodsTypeModal from "./AddGoodsTypeModal"
import MyPhotoGalleryModal from "./MyPhotoGalleryModal"
import TbzPhotoModal from "./TbzPhotoModal"
import AddFreightTemplateModal from "./AddFreightTemplateModal"
import OssUpload from "components/common/OssUpload"
import Ueditor from "components/common/Ueditor";
import {connect} from 'react-redux'
import {actionCreator} from "../store";
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js';
import jdfFeatures from 'seller/images/jdf_features.png';
import EmailVerify from "components/seller/shop/cloudStorage/EmailVerify"
import '../../shop/cloudStorage/style/cloudStorage.scss'
import emoji from 'emoji'

const {Option} = Select;
const {TabPane} = Tabs;
const {TextArea} = Input;

class ProGoodsFillInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastActive: 0,
      active: 2,
      is_return: '0',
      list: [],
      fileItem: {},
      videoUrl: '',
      goods_name: '',
      shop_category_id: 0,
      shipping_id: "",
      account: "",
      template_name: "",
      oldTemplate_name: "默认",
      template_type: 1,
      assign: false,
      storeClassifyList: [],
      goodsPictureList: [],
      imgList: [],
      mobileImgList: [],
      ueditorImgList: [],
      imgLength: 1,
      goods_desc_mobile: [],
      isNext: true,
      isNextUE: true,
      bigImgUrl: "",
      bigImgVisible: false,
      visibleResetAttr: false,
      visible: false,
      visibleApplyAccount: false,
      paymentValue: 1,
      balancePaymentValue: 1,
      dayNum: "",
      dateNum: "",
      monthNum: "",
      assignList: [],
      payment_info: {
        buyer_id: 0
      },
      buyer_id: 0,
      isDraft: 0,
      weight: "",
      unit_name: "",
      valid_id: 0,   //5弹出重量
      goods_type: 0,   //5弹出重量
      goodsLabelList: [],
      sheet_size_id: 2,
      body_sheet_size_id: 2,
      features_id: 0,
      productionMode: 1,
      modeSelf: 5,
      sheet_size_list: [],
      featuresList: [],
      sheet_size: {},
      pressSheetSize: {},
      bodyPressSheetSize: {},
      features: "",
      pressSheetWidth: "",
      pressSheetHeight: "",
      pressSheetBodyWidth: "",
      pressSheetBodyHeight: "",
      bindCloudAccountType: 1,
      is_jdf_temp_name: true,
      emojiArr: "",
      textAreaEmoji: "",
      visibleEmojis: false
    };
    this.handleOnChangeGooodsName = this.handleOnChangeGooodsName.bind(this);
    this.handleOnChangeTemplateName = this.handleOnChangeTemplateName.bind(this)
  }

  componentDidMount() {
    this.getStoreClassify();
    this.getFreightTemplate();
    this.getAssign();
    this.getPrintAccountBind();
    this.getFeatures();
    let goods_id = this.props.match.params.goods_id;
    if (goods_id > 0) {
      this.setState({isDraft: false});
    } else {
      this.setState({isDraft: true});
    }

    if (this.props.shopType != 0) {
      this.getAssign();
    }
  }

  getClassifyStatus(status) {
    if (status == 1) {
      setTimeout(() => {
        this.getStoreClassify();
      }, 600)
    }
  }

  //获取店内分类数据
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

  getPrintAccountBind() {
    httpRequest.get({
      url: sellerApi.goods.printAccountBind,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        if (comUtil.isEmpty(res.data.account)) {
          this.setState({
            template_type: 0,
          })
        }
        this.setState({
          account: res.data.account
        })
      }
    })
  }

  getFeatures() {
    httpRequest.get({
      url: sellerApi.goods.features,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          featuresList: res.data.features,
          sheet_size_list: res.data.sheet_size,
        })
      }
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let goods = nextProps.goods;
    let goodsLabelList = nextProps.goodsLabelList;
    let unit_name = nextProps.unit_name;
    let payment_info = nextProps.payment_info;
    let valid_id = nextProps.valid_id;
    this.setState({
        goods_name: goods.goods_name,   //商品名称
        shipping_id: goods.shipping_id,
        shop_category_id: goods.shop_category_id,
        goods_sn: goods.goods_sn,
        goods_alarm_qty: goods.goods_alarm_qty,
        imgList: goods.image_list,
        goods_thumb_image: goods.goods_thumb_image,
        goods_desc: goods.goods_desc,
        goods_desc_mobile: goods.goods_desc_mobile,
        videoUrl: goods.video,
        weight: goods.weight,
        unit_name: unit_name,
        payment_info: payment_info,
        valid_id: valid_id,
        goods_type: goods.goods_type,
        goodsLabelList: goodsLabelList,
        template_name: goods.template_name,
        oldTemplate_name: goods.template_name,
        template_type: goods.template_type || 1,
        sheet_size: goods.sheet_size,
        features: goods.features,
        textAreaEmoji: goods.share_content
      }, () => {
        let paymentInfo = this.state.payment_info;
        let buyer_id = "";
        if (paymentInfo) {
          buyer_id = paymentInfo.buyer_id;
        }
        if (buyer_id != 0) {
          let paymentValue = 1;
          let balancePaymentValue = 1;
          if (payment_info.advance_deposit === "" || payment_info.advance_deposit === null && payment_info.advance_per != "") {
            paymentValue = 1;
            payment_info.advance_deposit = null
          }
          if (payment_info.advance_per === "" || payment_info.advance_per === null && payment_info.advance_deposit != "") {
            paymentValue = 2;
            payment_info.advance_per = null
          }
          if (payment_info.repay_day === "" || payment_info.repay_day === null && payment_info.repay_after != "") {
            balancePaymentValue = 1;
            payment_info.repay_day = null;
            payment_info.repay_month = null;
          }
          if (payment_info.repay_after === "" || payment_info.repay_after === null && payment_info.repay_day != "") {
            balancePaymentValue = 2;
            payment_info.repay_after = null
          }
          this.setState({
            assign: true,
            paymentValue,
            balancePaymentValue,
            payment_info: paymentInfo,
          });
        }
        let template_type = this.state.template_type;
        let sheet_size = this.state.sheet_size;
        let features = this.state.features;
        let template_name = this.state.template_name;
        if (template_type > 3) {
          this.setState({
            productionMode: 3,
            features_id: features
          });
          if (!comUtil.isEmpty(sheet_size)) {
            if (template_type == 5) {
              this.setState({
                sheet_size_id: sheet_size.size_id,
                body_sheet_size_id: sheet_size.body_size_id,
                pressSheetSize: sheet_size.pressSheetSize,
                bodyPressSheetSize: sheet_size.bodyPressSheetSize,
              });
              if (sheet_size.size_id == 1) {
                this.setState({
                  pressSheetWidth: sheet_size.pressSheetSize.width,
                  pressSheetHeight: sheet_size.pressSheetSize.height,
                })
              }
              if (sheet_size.body_size_id == 1) {
                this.setState({
                  pressSheetBodyWidth: sheet_size.bodyPressSheetSize.width,
                  pressSheetBodyHeight: sheet_size.bodyPressSheetSize.height
                })
              }
            }
            if (template_type == 6) {
              if (sheet_size.size_id == 1) {
                this.setState({
                  pressSheetWidth: sheet_size.pressSheetSize.width,
                  pressSheetHeight: sheet_size.pressSheetSize.height
                })
              }
              if (sheet_size.body_size_id == 1) {
                this.setState({
                  pressSheetBodyWidth: sheet_size.bodyPressSheetSize.width,
                  pressSheetBodyHeight: sheet_size.bodyPressSheetSize.height
                })
              }
              this.setState({
                sheet_size_id: sheet_size.size_id,
                body_sheet_size_id: sheet_size.body_size_id,
                pressSheetSize: sheet_size.pressSheetSize,
                bodyPressSheetSize: sheet_size.bodyPressSheetSize,
              });
            }
          }
        } else if (template_type == 1) {
          this.setState({
            productionMode: 1
          });
        } else if (template_type == 3) {
          this.setState({
            productionMode: 3,
            modeSelf: 3
          });
        }
        if (template_name) {
          this.setState({
            is_jdf_temp_name: true
          })
        } else {
          this.setState({
            is_jdf_temp_name: false
          })
        }
      }
    );
  }

  //下一步
  nextStepTwo(active) {
    let {
      template_type, goodsLabelList, template_name, assign, paymentValue, balancePaymentValue, isNext, productionMode,
      modeSelf, sheet_size_id, pressSheetSize, sheet_size, body_sheet_size_id, bodyPressSheetSize, features_id, textAreaEmoji
    } = this.state;
    let UE = window.UE;
    let ueEditor = UE.getEditor('container');
    let goods_thumb_image = "";
    let imgList = this.state.imgList || [];
    let ueEditorTit = "富文本编辑器";
    let contentEditor = ueEditor.getContent();
    for (let i = 0; i < imgList.length; i++) {
      if (imgList[i].is_main == 1) {
        goods_thumb_image = imgList[i].pic_url
      } else {
        goods_thumb_image = imgList[0].pic_url
      }
    }
    if (comUtil.isEmpty(this.state.goods_name)) {
      message.warning('请输入的商品名称');
      return false;
    }
    if (!isNext) {
      message.warning('输入的商品名称不规范');
      return false;
    }
    if (!goods_thumb_image) {
      message.warning('请在我的图片库选择图片');
      return false;
    }
    if (comUtil.isEmpty(this.state.shipping_id)) {
      message.warning('请选择运费模板');
      return false;
    }
    let unitId = this.props.unitId.toString();
    if (comUtil.isEmpty(unitId)) {
      message.warning('没有单位！');
      return false;
    }
    let goods_id = this.props.match.params.goods_id;
    let draft_id = this.props.match.params.draft_id;
    let category_id = this.props.classifyId;
    if (goods_id > 0 || draft_id > 0) {
      category_id = this.props.goods.category_id
    } else {
      category_id = this.props.classifyId
    }
    let label_list = [];
    goodsLabelList && goodsLabelList.length > 0 &&
    goodsLabelList.map((item, index) => {
      if (item.is_checked == 1) {
        label_list.push(item.goods_label_id)
      }
    });
    if (productionMode == 3) {
      let sheet_size_list = this.state.sheet_size_list;
      if (sheet_size_id == 2) {
        sheet_size_list && sheet_size_list.length > 0 && sheet_size_list.map((item, index) => {
          if (item.id == 2) {
            pressSheetSize = item.pressSheetSize
          }
        })
      }
      if (body_sheet_size_id == 2) {
        sheet_size_list && sheet_size_list.length > 0 && sheet_size_list.map((item, index) => {
          if (item.id == 2) {
            bodyPressSheetSize = item.pressSheetSize
          }
        })
      }
      if (template_type == 5) {
        if (sheet_size_id == 1) {
          if (comUtil.isEmpty(pressSheetSize.width) || comUtil.isEmpty(pressSheetSize.height)) {
            message.warning("请输入自定义宽高！");
            return
          }
        }
        if (comUtil.isEmpty(features_id)) {
          message.warning("请选择拼版方式！");
          return
        }
      }
      if (template_type == 6) {
        if (sheet_size_id == 1) {
          if (comUtil.isEmpty(pressSheetSize.width) || comUtil.isEmpty(pressSheetSize.height)) {
            message.warning("请输入自定义宽高！");
            return
          }
        }
        if (body_sheet_size_id == 1) {
          if (comUtil.isEmpty(bodyPressSheetSize.width) || comUtil.isEmpty(bodyPressSheetSize.height)) {
            message.warning("请输入自定义宽高！");
            return
          }
        }
        if (comUtil.isEmpty(features_id)) {
          message.warning("请输入自定义宽高！");
          return
        }
      }
    }
    let goods = {
      category_id: category_id,
      shop_category_id: this.state.shop_category_id,
      goods_name: this.state.goods_name,
      goods_thumb_image: goods_thumb_image,
      image_list: this.state.imgList,
      shipping_id: this.state.shipping_id,
      video: this.state.videoUrl || "",
      goods_desc: ueEditor.getContent(),
      goods_type: this.state.goods_type,
      goods_desc_mobile: this.state.goods_desc_mobile || [],
      return_mark: [0, 0, 0],
      goods_server: [0, 0, 0],
      goods_label: label_list,
      weight: this.state.weight || 0,
      template_name: template_name || "默认",
      template_type: template_type,
      features: features_id,
      sheet_size: {
        size_id: sheet_size_id,
        pressSheetSize: pressSheetSize,
        cover_size_id: sheet_size_id,
        coverPressSheetSize: pressSheetSize,
        body_size_id: body_sheet_size_id,
        bodyPressSheetSize: bodyPressSheetSize,
      },
      share_content: textAreaEmoji
    };
    this.props.saveGoods(goods);
    let payment_info = this.state.payment_info;
    this.props.savePaymentInfo(payment_info);
    if (draft_id > 0) {
      let cat_id = this.props.goods.category_id;
      let page_index = window.sessionStorage.getItem("page_index");
      if (page_index <= 1) {
        this.getAttrData(cat_id);
      }
    }
    if (assign) {
      if (payment_info.buyer_id == 0) {
        message.warning('请选择指定客户!');
        return false
      }
      if (paymentValue == 1) {
        if (payment_info.advance_per === "" || payment_info.advance_per === null) {
          message.warning('请输入订金比例!');
          return false;
        }
      } else if (paymentValue == 2) {
        if (payment_info.advance_deposit === "" || payment_info.advance_deposit === null) {
          message.warning('请输入订金金额!');
          return false;
        }
      }
      if (balancePaymentValue == 1) {
        if (!payment_info.repay_after) {
          message.warning('请输入尾款日期!');
          return false;
        }
      } else if (balancePaymentValue == 2) {
        if (!payment_info.repay_day && !payment_info.repay_month) {
          message.warning('请输入尾款日期!');
          return false;
        }
      }
    }
    if (!comUtil.isEmpty(contentEditor)) {
      this.apiVerify(contentEditor, ueEditorTit, 2);
    } else {
      this.props.activeValue(active);
    }
  }

  //一键发布
  oneButtonPublish() {
    let {
      assign, paymentValue, balancePaymentValue, goodsLabelList, goods_type, template_type,
      template_name, productionMode, modeSelf, sheet_size_id, pressSheetSize, body_sheet_size_id, bodyPressSheetSize, features_id, textAreaEmoji
    } = this.state;
    let isNext = this.state.isNext;
    let UE = window.UE;
    let ueEditor = UE.getEditor('container');
    let goods_thumb_image = "";
    let imgList = this.state.imgList || [];
    let ueEditorTit = "富文本编辑器";
    let contentEditor = ueEditor.getContent();
    let shopType = this.props.shopType;
    let sku_list = this.props.sku_list;
    let quantity = this.props.quantity;
    let label_list = [];
    goodsLabelList && goodsLabelList.length > 0 &&
    goodsLabelList.map((item, index) => {
      if (item.is_checked == 1) {
        label_list.push(item.goods_label_id)
      }
    });
    for (let i = 0; i < imgList.length; i++) {
      if (imgList[i].is_main == 1) {
        goods_thumb_image = imgList[i].pic_url
      } else {
        goods_thumb_image = imgList[0].pic_url
      }
    }
    if (comUtil.isEmpty(this.state.goods_name)) {
      message.warning('请输入的商品名称');
      return false;
    }
    if (!isNext) {
      message.warning('输入的商品名称不规范');
      return false;
    }
    if (!goods_thumb_image) {
      message.warning('请在我的图片库选择图片');
      return false;
    }
    if (comUtil.isEmpty(this.state.shipping_id)) {
      message.warning('请选择运费模板');
      return false;
    }
    let goods_id = this.props.match.params.goods_id;
    let draft_id = this.props.match.params.draft_id;
    let category_id = this.props.classifyId;
    if (goods_id > 0 || draft_id > 0) {
      category_id = this.props.goods.category_id
    } else {
      category_id = this.props.classifyId
    }
    if (productionMode == 3) {
      if (template_type == 5) {
        if (sheet_size_id == 1) {
          if (comUtil.isEmpty(pressSheetSize.width) || comUtil.isEmpty(pressSheetSize.height)) {
            message.warning("请输入自定义宽高！");
            return
          }
        }
      }
      if (template_type == 6) {
        if (sheet_size_id == 1) {
          if (comUtil.isEmpty(pressSheetSize.width) || comUtil.isEmpty(pressSheetSize.height)) {
            message.warning("请输入自定义宽高！");
            return
          }
        }
        if (body_sheet_size_id == 1) {
          if (comUtil.isEmpty(bodyPressSheetSize.width) || comUtil.isEmpty(bodyPressSheetSize.height)) {
            message.warning("请输入自定义宽高！");
            return
          }
        }
      }
    }
    let goods = {
      category_id: category_id,
      shop_category_id: this.state.shop_category_id,
      goods_name: this.state.goods_name,
      goods_thumb_image: goods_thumb_image,
      image_list: this.state.imgList,
      shipping_id: this.state.shipping_id,
      video: this.state.videoUrl || "",
      goods_desc: ueEditor.getContent(),
      goods_desc_mobile: this.state.goods_desc_mobile || [],
      return_mark: [0, 0, 0],
      goods_server: [0, 0, 0],
      goods_label: label_list,
      weight: this.state.weight || 0,
      goods_type: goods_type,
      template_name: template_name,
      template_type: template_type,
      features: features_id,
      sheet_size: {
        size_id: sheet_size_id,
        pressSheetSize: pressSheetSize,
        cover_size_id: sheet_size_id,
        coverPressSheetSize: pressSheetSize,
        body_size_id: body_sheet_size_id,
        bodyPressSheetSize: bodyPressSheetSize,
      },
      share_content: textAreaEmoji
    };
    let payment_info = this.state.payment_info;
    if (payment_info.buyer_id == 0) {
      payment_info = ""
    }
    if (assign) {
      if (payment_info.buyer_id == 0) {
        message.warning('请选择指定客户!');
        return false
      }
      if (paymentValue == 1) {
        if (payment_info.advance_per === "" || payment_info.advance_per === "undefined") {
          message.warning('请输入订金比例!');
          return false;
        }
      } else if (paymentValue == 2) {
        if (payment_info.advance_deposit === "" || payment_info.advance_deposit === "undefined") {
          message.warning('请输入订金金额!');
          return false;
        }
      }
      if (balancePaymentValue == 1) {
        if (!payment_info.repay_after) {
          message.warning('请输入尾款日期!');
          return false;
        }
      } else if (balancePaymentValue == 2) {
        if (!payment_info.repay_day && !payment_info.repay_month) {
          message.warning('请输入尾款日期!');
          return false;
        }
      }
    }
    if (!comUtil.isEmpty(contentEditor)) {
      this.apiVerify(contentEditor, ueEditorTit, 2);
    }
    let goodslinkgoods = this.props.goodslinkgoods;
    if (goodslinkgoods.length == 0) {
      goodslinkgoods = ""
    }
    let editData = {};
    if (goods_type == 0) {
      editData = {
        shop_type: shopType,
        goods: goods,
        basicList: this.props.basicList,
        sku_sn: this.props.sku_sn,
        goodslinkgoods: goodslinkgoods,
        payment_info: payment_info,
        specification_hide: this.props.specification_hide_list,
        sku_list: sku_list,
        quantity: quantity,
        quotation_attr: {
          quotation_attrs: this.props.specificationList,
          step_price: [],
        },
        unit: this.props.unitId,
        valid_id: this.props.valid_id
      };
    } else {
      editData = {
        shop_type: this.props.shopType,
        goods: goods,
        payment_info: payment_info,
        quotation_info: this.props.quotation_info,
        quotation_attr: {
          quotation_attrs: this.props.specificationList,
          step_price: this.props.step_price,
        },
        basicList: this.props.basicList,
        goodslinkgoods: goodslinkgoods,
        specification_hide: this.props.specification_hide_list,
        unit: this.props.unitId,
        valid_id: this.props.valid_id,
      };
    }
    httpRequest.post({
      url: sellerApi.goods.sellerGoods + "?goods_id=" + this.props.match.params.goods_id,
      data: editData
    }).then(res => {
      if (res.code == "200") {
        this.props.history.push(`/seller/goods/goodsList/0`);
      } else {
        message.error(res.data)
      }
    })
  }

  //获取属性模板
  getAttrData(cat_id) {
    httpRequest.get({
      url: sellerApi.goods.goodsShopAttr,
      data: {
        cat_id: cat_id,
      }
    }).then(res => {
      if (res.code == "200") {
        let specificationList = res.data.specification;
        let basicList = res.data.basic;
        let specification_hide = res.data.specification_hide;
        this.props.saveSpecificationList(specificationList);
        this.props.saveSpecificationHideList(specification_hide);
        this.props.saveBasicList(basicList);
      } else {
        message.error(res.msg || "该分类没有属性模板请先添加")
      }
    })
  }

  //保存草稿，返回列表
  saveDrafts() {
    let draft_id = window.sessionStorage.getItem("draft_id");
    let {
      goodsLabelList, goods_type, template_type, template_name, productionMode, modeSelf, sheet_size_id,
      pressSheetSize, body_sheet_size_id, bodyPressSheetSize, features_id, textAreaEmoji
    } = this.state;
    if (comUtil.isEmpty(this.state.goods_name)) {
      message.warning("请输入商品名称！");
      return false;
    }
    let UE = window.UE;
    let ueEditor = UE.getEditor('container');
    let goods_thumb_image = "";
    let imgList = this.state.imgList || [];
    let contentEditor = ueEditor.getContent();
    for (let i = 0; i < imgList.length; i++) {
      if (imgList[i].is_main == 1) {
        goods_thumb_image = imgList[i].pic_url
      } else {
        goods_thumb_image = imgList[0].pic_url
      }
    }
    let label_list = [];
    goodsLabelList && goodsLabelList.length > 0 &&
    goodsLabelList.map((item, index) => {
      if (item.is_checked == 1) {
        label_list.push(item.goods_label_id)
      }
    });
    let goods = {
      category_id: this.props.classifyId,
      category_name: this.props.classifyName,
      shop_category_id: this.state.shop_category_id,
      goods_name: this.state.goods_name,
      goods_thumb_image: goods_thumb_image,
      image_list: this.state.imgList,
      shipping_id: this.state.shipping_id,
      video: this.state.videoUrl || "",
      goods_desc: ueEditor.getContent(),
      template_name: this.state.template_name,
      template_type: this.state.template_type,
      goods_type: this.state.goods_type,
      goods_desc_mobile: this.state.goods_desc_mobile || [],
      return_mark: [0, 0, 0],
      goods_server: [0, 0, 0],
      goods_label: label_list,
      features: features_id,
      sheet_size: {
        size_id: sheet_size_id,
        pressSheetSize: pressSheetSize,
        cover_size_id: sheet_size_id,
        coverPressSheetSize: pressSheetSize,
        body_size_id: body_sheet_size_id,
        bodyPressSheetSize: bodyPressSheetSize,
      },
      share_content: textAreaEmoji
    };
    let unitId = this.props.unitId;
    let unit_name = this.props.unit_name;
    this.props.saveGoods(goods);
    if (draft_id > 0) {
      httpRequest.put({
        url: sellerApi.goods.draft,
        data: {
          draft_id: draft_id,
          page_index: 1,
          goods_draft: {
            goods: goods,
            unit: unitId,
            unit_name: unit_name
          }
        }
      }).then(res => {
        if (res.code == "200") {
          this.props.history.push(`/seller/goods/GoodsDraftList`);
        }
      })
    } else {
      httpRequest.post({
        url: sellerApi.goods.draft,
        data: {
          page_index: 1,
          goods_draft: {
            goods: goods,
            unit: unitId,
            unit_name: unit_name
          }
        }
      }).then(res => {
        if (res.code == "200") {
          this.props.history.push(`/seller/goods/GoodsDraftList`);
        }
      })
    }
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

  getFreightTemplateModalStatus(value) {
    this.getFreightTemplate();
  }

  //切换
  callbackTab(key) {

  }

  //上传视频
  handleOnChangeOssUpload({fileList}, imgUrl) {
    setTimeout(() => {
      this.setState({
        videoUrl: imgUrl
      })
    }, 500);
  }

  apiVerifyGoodName(content, tit) {
    let _this = this;
    httpRequest.get({
      url: sellerApi.goods.getStore,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        let auto_reg_sensitive_words = res.data.auto_reg_sensitive_words;
        let auto_reg_pron = res.data.auto_reg_pron;
        if (auto_reg_sensitive_words == 1 && auto_reg_pron == 1) {
          comUtil.wordsVerify(content, (wordsVerify) => {
            if (wordsVerify == "block") {
              this.setState({
                isNext: false
              });
              message.error("你输的" + tit + "内容不规范");
            } else {
              this.setState({
                isNext: true
              });
            }
          });
        }
      }
    });
  }

  apiVerify(content, tit, active) {
    let _this = this;
    httpRequest.get({
      url: sellerApi.goods.getStore,
      data: {}
    }).then(res => {
      if (res.code == "200") {
        let auto_reg_sensitive_words = res.data.auto_reg_sensitive_words;
        let auto_reg_pron = res.data.auto_reg_pron;
        if (auto_reg_sensitive_words == 1 && auto_reg_pron == 1) {
          comUtil.wordsVerify(content, (wordsVerify) => {
            if (wordsVerify == "block") {
              this.setState({
                isNextUE: false,

              });
              message.error("你输的" + tit + "内容不规范");
            } else {
              this.setState({
                isNextUE: true,
              });
              _this.props.activeValue(active);
            }
          });
        } else {
          _this.props.activeValue(active);

        }
      }
    });
  }

  //商品名称
  handleOnChangeGooodsName(e) {
    this.setState({
      goods_name: e.target.value
    })
  }

  handleOnBlurGooodsName(e) {
    let content = e.target.value;
    let tit = "商品名称";
    this.setState({
      goods_name: e.target.value
    });
    this.apiVerifyGoodName(content, tit, 1);
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
  setMainPic(index, e) {
    e.stopPropagation();
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
  showBigImg(index, e) {
    e.stopPropagation();
    let newImgList = this.state.imgList;
    let bigImgUrl = newImgList[index].pic_url;
    this.setState({
      bigImgUrl,
      bigImgVisible: true
    });
  }

  //展示大图组件
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
  delImg(index, e) {
    e.stopPropagation();
    let newImgList = this.state.imgList;
    if (newImgList) {
      let imgList = newImgList.splice(index, 1);
      this.setState({
        imgList: newImgList
      });
    }
  }

  swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  }

  //图片互换位置
  handleSwapUp(index, e) {
    e.stopPropagation();
    if (index != 0) {
      let imgList = this.state.imgList;
      let list = this.swapArray(imgList, index, index - 1);
      this.setState({
        imgList: list
      })
    } else {
      message.warning("已经处于第一位，无法向前移动")
    }
  }

  //图片互换位置
  handleSwapDown(index, e) {
    e.stopPropagation();
    let imgList = this.state.imgList;
    let len = imgList.length;
    if (index + 1 != len) {
      let list = this.swapArray(imgList, index, index + 1);
      this.setState({
        imgList: list
      })
    } else {
      message.warning("已经处于最后，无法向后移动")
    }
  }

  //手机端详情图片
  getMobileImgList(mobileImgList) {
    if (!comUtil.isEmpty(mobileImgList)) {
      let newImgList = this.state.goods_desc_mobile || [];
      this.setState({
        goods_desc_mobile: newImgList.concat(mobileImgList)
      })
    }
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

  //图帮主
  getTbzImgList(TbzImgList) {
    let UE = window.UE;
    let ueEditor = UE.getEditor('container');
    let contentEditor = ueEditor.getContent();
    if (!comUtil.isEmpty(TbzImgList)) {
      let newImgList = this.state.imgList || [];
      let goods_desc = contentEditor;
      // let goods_desc = this.state.goods_desc;
      let new_goods_desc = "";
      this.setState({
        imgList: newImgList.concat(TbzImgList)
      });
      let str = '';
      TbzImgList && TbzImgList.map((item, index) => {
        str += '<span class="tbzGoodsDetails" style="display: inline-block; margin-top: 10px; position: relative;">' +
          '<a href="javascript:void(0);" class="onlineDesign" style="position: absolute;top: 10px;right: 10px;padding: 5px 10px;font-size: 12px;color: #FF9800;border: 1px solid #FF9800;border-radius: 15px;text-decoration: none;display: none;">' +
          '在线设计</a><span class="tbzLink" style="display: none;">' + item.link + '</span><img src="' + item.pic_url + '" alt=""></span>';
      });

      if (!comUtil.isEmpty(goods_desc)) {
        new_goods_desc = str + goods_desc;
      } else {
        new_goods_desc = str
      }
      this.setState({
        goods_desc: new_goods_desc
      }, () => {
        let UE = window.UE;
        let ueditor = UE.getEditor("container", {
          autoHeightEnabled: false,
          autoFloatEnabled: true
        });
        let goods_desc_str = this.state.goods_desc;
        // ueditor.setContent(goods_desc_str, true);
        ueditor.setContent(goods_desc_str);
      })
    }
  }

  getTbzMobileImgList(TbzImgList) {
    if (!comUtil.isEmpty(TbzImgList)) {
      let newImgList = this.state.goods_desc_mobile || [];
      this.setState({
        goods_desc_mobile: newImgList.concat(TbzImgList)
      })
    }
  }

  handleChangeAssign(e) {
    this.setState({
      assign: e.target.checked
    })
  }

  handleChangeAssignId(value) {
    let {assignList} = this.state;
    let user_info = "";
    assignList && assignList.map((item, index) => {
      if (item.private_shop_id == value) {
        if (!comUtil.isEmpty(item.user_email)) {
          user_info = item.user_email
        } else {
          user_info = item.user_mobile
        }
      }
    });
    if (!comUtil.isEmpty(value)) {
      value = parseFloat(value)
    }
    let data = Object.assign({}, this.state.payment_info, {buyer_id: value, user_info: user_info});
    this.setState({
      payment_info: data
    })
  }

  onChangePayment(e) {
    let value = e.target.value;
    let payment_info = this.state.payment_info;
    let data = {};
    if (value == 1) {
      data = Object.assign({}, payment_info, {advance_deposit: null});
    } else {
      data = Object.assign({}, payment_info, {advance_per: null});
    }
    this.setState({
      paymentValue: value,
      payment_info: data
    });
  }

  handleOnChangeEarnestMoney(e) {
    let reg = /\D/g;
    let value = e.target.value.replace(reg, "");
    if (!comUtil.isEmpty(value)) {
      value = parseFloat(value)
    }
    let data = Object.assign({}, this.state.payment_info, {advance_deposit: value});
    this.setState({
      payment_info: data
    })
  }

  handleOnChangeEarnestMoneyPer(e) {
    // let reg = /^([1-9]{1})$|^([1-9]\d)$/;
    let reg = /\D/g;
    // let value = "";
    // if (reg.test(e.target.value)) {
    //   value = e.target.value
    // }
    let value = e.target.value.replace(reg, "");
    if (!comUtil.isEmpty(value)) {
      value = parseFloat(value)
    }
    let data = Object.assign({}, this.state.payment_info, {advance_per: value});
    this.setState({
      payment_info: data
    })
  }

  onChangeBalancePayment(e) {
    let value = e.target.value;
    let payment_info = this.state.payment_info;
    let data = {};
    if (value == 1) {
      data = Object.assign({}, payment_info, {repay_day: null, repay_month: null});
    } else {
      data = Object.assign({}, payment_info, {repay_after: null});
    }
    this.setState({
      balancePaymentValue: value,
      payment_info: data
    });
  }

  handleOnChangeDay(e) {
    let reg = /\D/g;
    let value = e.target.value.replace(reg, "");
    if (value < 1 || value > 365) {
      value = ""
    }
    if (!comUtil.isEmpty(value)) {
      value = parseFloat(value)
    }
    let data = Object.assign({}, this.state.payment_info, {repay_after: value});
    this.setState({
      payment_info: data
    })
  }

  handleOnChangeDate(e) {
    let reg = /\D/g;
    let value = e.target.value.replace(reg, "");
    if (value < 1 || value > 28) {
      value = ""
    }
    if (!comUtil.isEmpty(value)) {
      value = parseFloat(value)
    }
    let data = Object.assign({}, this.state.payment_info, {repay_day: value});
    this.setState({
      payment_info: data
    })
  }

  handleOnChangeMonth(e) {
    let reg = /\D/g;
    let value = e.target.value.replace(reg, "");
    if (value < 1 || value > 12) {
      value = ""
    }
    if (!comUtil.isEmpty(value)) {
      value = parseFloat(value)
    }
    let data = Object.assign({}, this.state.payment_info, {repay_month: value});
    this.setState({
      payment_info: data
    })
  }

  getAssign() {
    httpRequest.get({
      url: sellerApi.goods.sePermissions,
      data: {
        page_size: 100,
        page: 1,
        is_delete: 0,
        is_enabled: 1
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          assignList: res.data.result
        })
      }
    });
  }

  delMobileImg(index) {
    let newMobileImgList = this.state.goods_desc_mobile;
    if (newMobileImgList) {
      let list = newMobileImgList.splice(index, 1);
      this.setState({
        goods_desc_mobile: newMobileImgList
      });
    }
  }

  handleOnChangeGooodsWeight(e) {
    // let reg = /[^(\.\d+)?$]/g;
    let val = e.target.value.replace(/[^\d.]/g, "").replace(/\.{2,}/g, ".").replace(/^\./g, "").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    this.setState({
      weight: val
    })
  }

  handleOkResetAttr() {
    this.setState({
      visibleResetAttr: false
    })
  }

  handleCancelResetAttr() {
    this.setState({
      visibleResetAttr: false
    })
  }

  //商品标签
  handleGoodsLabel(id, e) {
    let goodsLabelList = this.state.goodsLabelList;
    goodsLabelList && goodsLabelList.length > 0 && goodsLabelList.map((item, index) => {
      if (id == item.goods_label_id) {
        if (e.target.checked) {
          item.is_checked = 1
        } else {
          item.is_checked = 0
        }
      }
    });
    this.setState({
      goodsLabelList
    })
  }

  handleProductionMode(e) {
    let jdf_temp_name = window.sessionStorage.getItem("jdf_temp_name");
    let template_name = this.state.template_name;
    this.setState({
      productionMode: e.target.value,
      template_name: jdf_temp_name || template_name,
      oldTemplate_name: jdf_temp_name || template_name,
    }, () => {
      if (this.state.productionMode == 1) {
        this.setState({
          template_type: 1
        })
      } else {
        this.setState({
          template_type: this.state.modeSelf
        })
      }
    });

  };

  handleProductionModeSelf(e) {
    this.setState({
      modeSelf: e.target.value,
    }, () => {
      let modeSelf = this.state.modeSelf;
      this.setState({
        template_type: modeSelf
      })
    });
  };

  handlePressSheetSize(e) {
    this.setState({
      sheet_size_id: e.target.value
    }, () => {
      let pressSheetSize = this.state.pressSheetSize;
      if (this.state.sheet_size_id == 1) {
        pressSheetSize.width = e.target.width;
        pressSheetSize.height = e.target.height;
      } else {
        pressSheetSize.width = e.target.width;
        pressSheetSize.height = e.target.height;
        this.setState({
          pressSheetWidth: "",
          pressSheetHeight: ""
        })
      }
    });
  }

  handlePressSheetWidth(e) {
    let pressSheetSize = this.state.pressSheetSize;
    let reg = /\D/g;
    let value = e.target.value.replace(reg, "");
    if (value == 0) {
      value = ""
    }
    this.setState({
      pressSheetWidth: value
    }, () => {
      pressSheetSize.width = this.state.pressSheetWidth;
    })
  }

  handlePressSheetHeight(e) {
    let pressSheetSize = this.state.pressSheetSize;
    let reg = /\D/g;
    let value = e.target.value.replace(reg, "");
    if (value == 0) {
      value = ""
    }
    this.setState({
      pressSheetHeight: value
    }, () => {
      pressSheetSize.height = this.state.pressSheetHeight;
    })
  }

  handlePressSheetSizeBody(e) {
    this.setState({
      body_sheet_size_id: e.target.value
    }, () => {
      let bodyPressSheetSize = this.state.bodyPressSheetSize;
      if (this.state.body_sheet_size_id == 1) {
        bodyPressSheetSize.width = e.target.width;
        bodyPressSheetSize.height = e.target.height;
      } else {
        bodyPressSheetSize.width = e.target.width;
        bodyPressSheetSize.height = e.target.height;
        this.setState({
          pressSheetBodyWidth: "",
          pressSheetBodyHeight: ""
        })
      }
    });
  }

  handlePressSheetWidthBody(e) {
    let bodyPressSheetSize = this.state.bodyPressSheetSize;
    let reg = /\D/g;
    let value = e.target.value.replace(reg, "");
    if (value == 0) {
      value = ""
    }
    this.setState({
      pressSheetBodyWidth: value
    }, () => {
      bodyPressSheetSize.width = this.state.pressSheetBodyWidth;
    })
  }

  handlePressSheetHeightBody(e) {
    let bodyPressSheetSize = this.state.bodyPressSheetSize;
    let reg = /\D/g;
    let value = e.target.value.replace(reg, "");
    if (value == 0) {
      value = ""
    }
    this.setState({
      pressSheetBodyHeight: value
    }, () => {
      bodyPressSheetSize.height = this.state.pressSheetBodyHeight;
    })
  }

  handleChangeFeatures(value) {
    this.setState({
      features_id: value
    })
  }

  featuresShow() {
    this.setState({
      visible: true
    });
  }

  handleOk() {
    this.setState({
      visible: false
    })
  }

  handleCancel() {
    this.setState({
      visible: false,
      visibleApplyAccount: false,
    })
  }

  handleEditTemplateName() {
    this.setState({
      is_jdf_temp_name: false
    })
  }

  handleDefaultTemplateName() {
    let oldTemplate_name = this.state.oldTemplate_name;
    this.setState({
      template_name: oldTemplate_name
    })
  }

  handleOnChangeTemplateName(e) {
    this.setState({
      template_name: e.target.value
    })
  }

  handleApply() {
    this.setState({
      visibleApplyAccount: true,
      bindCloudAccountType: 1
    })
  }

  applyCloudSucc(visibleApplyAccount) {
    this.setState({
      visibleApplyAccount
    });
    this.getPrintAccountBind()
  }

  toBindCloudAccount(type) {
    this.setState({
      bindCloudAccountType: type
    });
    this.getPrintAccountBind()
  }

  insertText(obj, str) {
    if (document.selection) {
      var sel = document.selection.createRange();
      sel.text = str;
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
      var startPos = obj.selectionStart,
        endPos = obj.selectionEnd,
        cursorPos = startPos,
        tmpStr = obj.value;
      obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
      cursorPos += str.length;
      obj.selectionStart = obj.selectionEnd = cursorPos;
    } else {
      obj.value += str;
    }
    this.setState({
      textAreaEmoji: obj.value
    })
  }

  moveEnd(obj) {
    obj.focus();
    var len = obj.value.length;
    if (document.selection) {
      var sel = obj.createTextRange();
      sel.moveStart('character', len);
      sel.collapse();
      sel.select();
    } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
      obj.selectionStart = obj.selectionEnd = len;
    }
  }

  handleEmoji(emoji) {
    this.insertText(document.getElementById("textAreaEmoji"), emoji);
    this.setState({
      visibleEmojis: false
    })
  }

  handleTextArea(e) {
    let val = e.target.value;
    this.setState({
      textAreaEmoji: val
    })
  }

  handleInsertEmojis() {
    // console.log("emojiList...", emoji.EMOJI_MAP);
    let obj = emoji.EMOJI_MAP;
    let emojiArr = [];
    for (var i in obj) {
      // console.log("emojiList...", i, ":", obj[i]);
      emojiArr.push(i)
    }
    this.setState({
      emojiArr
    });
    this.setState({
      visibleEmojis: true
    })
  }

  handleOkEmojis() {
    this.setState({
      visibleEmojis: false
    })
  }

  handleCancelEmojis() {
    this.setState({
      visibleEmojis: false
    })
  }

  render() {
    const {
      isNext, template_name, template_type, payment_info, assign, paymentValue, balancePaymentValue,
      isDraft, unit_name, valid_id, weight, visibleResetAttr, account, goodsLabelList, sheet_size_list, featuresList,
      sheet_size_id, features_id, productionMode, modeSelf, visible, visibleApplyAccount, bindCloudAccountType,
      is_jdf_temp_name, pressSheetWidth, pressSheetHeight, body_sheet_size_id, pressSheetBodyWidth, pressSheetBodyHeight,
      emojiArr, textAreaEmoji, visibleEmojis
    } = this.state;
    const isJdfName = window.sessionStorage.getItem("isJdfName");
    return (
      <div className="goods-info">
        <div className="goods-tit">商品信息</div>
        <div>
          <div>
            <div className="mt15">
              <span className="tit"><span className="asterisk">* </span>平台商品分类：</span>
              <span>{this.props.classifyName}</span>
            </div>
            <div className="mt15">
              <span className="tit">本店商品类型：</span>
              <Select
                defaultValue={this.state.shop_category_id}
                value={this.state.shop_category_id}
                style={{width: 180}}
                onChange={this.handleChangeGoodsType.bind(this)}>
                <Option value={0}>请选择</Option>
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
              <span className="tit"><span className="asterisk">* </span>商品名称：</span>
              <Input className={`goods-name ${isNext ? null : " activeBorder"}`}
                     value={this.state.goods_name}
                     onChange={this.handleOnChangeGooodsName}
                     onBlur={this.handleOnBlurGooodsName.bind(this)}
                     placeholder="请输入商品名称" maxLength={30}/>
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
                      <li className="imgItem item-img"
                          key={index}
                          style={{backgroundImage: "url(" + item.pic_url + ")"}}>
                        <span className="set-m" onClick={this.setMainPic.bind(this, index)}>设为主图</span>
                        <Icon type="close-circle" className="icon-d" onClick={this.delImg.bind(this, index)}/>
                        <Icon type="home" className={item.is_main == 1 ? "icon-h show" : "icon-h hide"}/>
                        <img src={item.pic_url} alt="" onClick={this.showBigImg.bind(this, index)}/>
                        <div className="swap">
                            <span className="swap-btn">
                              <Icon type="swap-left" onClick={this.handleSwapUp.bind(this, index)}/>
                            </span>
                          <span className="swap-btn">
                              <Icon type="swap-right" onClick={this.handleSwapDown.bind(this, index)}/>
                            </span>
                        </div>
                      </li>
                    )
                  })
                  }
                </ul>
                {this.bigImg()}
                <div className="mt15">
                  <MyPhotoGalleryModal status={1} imgList={this.getImgList.bind(this)}
                                       imgListLen={this.state.imgList}/>
                  <TbzPhotoModal classifyName={this.props.classifyName}
                                 classifyId={this.props.classifyId}
                                 imgListLen={this.state.imgList}
                                 pid={this.props.pid}
                                 tbzImgList={this.getTbzImgList.bind(this)}
                                 status={1}/>
                  <span className="ml10">支持买家在线设计</span>
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
                           uploadType={"video"}
                />
              </div>
              <div className="displayInlineBlock mt15 ml10" id="videoCon"
                   style={{verticalAlign: "middle", height: "128px"}}>
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
                value={this.state.shipping_id}
                style={{width: 160}}
                className="goods-type"
                onChange={this.handleChangeFreight.bind(this)}
              >
                <Option value={0}>请选择</Option>
                {
                  this.state.goodsPictureList &&
                  this.state.goodsPictureList.map((item, index) => {
                    return (
                      <Option value={item.template_id} key={index}>{item.template_name}</Option>
                    )
                  })
                }
              </Select>
              <AddFreightTemplateModal onFreightTemplateModalValue={this.getFreightTemplateModalStatus.bind(this)}/>
            </div>
            <div className="mt15">
              <span className="tit">
                <span className="asterisk">* </span>商品单位：
                 </span>
              <span>{unit_name}</span>
            </div>
            {valid_id == 5 ?
              <div className="mt15">
                <span className="tit"><span className="asterisk">* </span>单位商品重量：</span>
                <Input style={{width: 160}} className="goods-type"
                       value={weight}
                       onChange={this.handleOnChangeGooodsWeight.bind(this)}
                       placeholder="请输入商品重量" maxLength={30}/>
                <span className="ml10">g </span> <span> / {unit_name}</span>
              </div> : null
            }
          </div>
        </div>
        <div className="goods-tit mt30">商品详情</div>
        <div className="mt15 minHeight">
          <Tabs onChange={this.callbackTab.bind(this)} type="card">
            <TabPane tab="电脑端" key="1">
              <div className="editor-con">
                {
                  <Ueditor defaultContent={this.state.goods_desc}/>
                }
              </div>
              <div className="mt15">
                <MyPhotoGalleryModal status={2} ueditorImgList={this.getUeditorImgList.bind(this)}/>
              </div>
            </TabPane>
            <TabPane tab="手机端" key="2">
              <div className="clearfix">
                <div className="mobile-box h28 fl">
                  {this.state.goods_desc_mobile && this.state.goods_desc_mobile.length > 0 &&
                  this.state.goods_desc_mobile.map((item, index) => {
                    return (
                      <div key={index} className="mobile-img">
                        <div className="delShade">
                          <span className="delMobileImg" onClick={this.delMobileImg.bind(this, index)}>删除</span>
                        </div>
                        <img src={item} alt=""/>
                      </div>
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
                    <TbzPhotoModal classifyName={this.props.classifyName}
                                   goodsMobileImgList={this.state.goods_desc_mobile}
                                   pid={this.props.pid}
                                   mobileImgList={this.getTbzMobileImgList.bind(this)}
                                   status={3}/>
                  </div>
                </div>
              </div>
            </TabPane>
            {this.props.loginInfo.isDirectShop ?
              <TabPane tab="推广文案" key="3">
                <TextArea style={{height: "360px"}} id="textAreaEmoji" value={textAreaEmoji}
                          onChange={this.handleTextArea.bind(this)}/>
                <Button onClick={this.handleInsertEmojis.bind(this)} className="mt10">插入表情</Button>
              </TabPane> : null
            }
          </Tabs>
        </div>
        {/*JDF自动化生产*/}
        <div className="mt30 pb10 pro-m">
          <div>
            <span className="tit">商品生产方式：</span>
            <span>自动推送文件需要先绑定</span>
            <span className="activeColor">云存储账号;</span>
            {/*      this.props.history.push(`/seller/shop/cloudstorage`);*/}
            {comUtil.isEmpty(account) ?
              <Button className="btn goods-btn ml30" onClick={this.handleApply.bind(this)}>立即免费申请</Button> :
              <span className="ml30">
                <span>已绑定</span>
                <span className="account ml5">{account}</span>
              </span>
            }
          </div>
          <div className="mt15">
            <span className="tit"></span>
            <Radio.Group onChange={this.handleProductionMode.bind(this)}
                         disabled={account ? false : true}
                         value={productionMode}>
              <Radio value={1}>手动生产方式</Radio>
              <Radio value={3} className="ml130">自动生产方式</Radio>
            </Radio.Group>
          </div>
          {!comUtil.isEmpty(account) ?
            <div>
              {productionMode == 3 ?
                <div className="pl30">
                  <div className="mt15">
                    <span className="tit"></span>
                    <Radio.Group onChange={this.handleProductionModeSelf.bind(this)}
                                 value={modeSelf}>
                      <Radio value={5}>数码生产</Radio>
                      <Radio value={3} className="ml30">传统生产</Radio>
                    </Radio.Group>
                  </div>
                  {modeSelf != 3 ? <div className="pro-s">
                    <div className="mt15">
                      <span className="ml20">纸张尺寸：</span>
                      <div className="mt10 ml16">
                        {modeSelf == 5 && this.props.valid_id == 4 ? <span className="ml30">封面：</span> : null}
                        <Radio.Group className="ml60 mt10" onChange={this.handlePressSheetSize.bind(this)}
                                     value={sheet_size_id}>
                          {sheet_size_list && sheet_size_list.length > 0 && sheet_size_list.map((item, index) => {
                            return (
                              <Radio value={item.id} className="mb10" key={index} width={item.pressSheetSize.width}
                                     height={item.pressSheetSize.height}>
                                {item.name} {item.pressSheetSize.width}*{item.pressSheetSize.height} mm
                              </Radio>
                            )
                          })}
                          <Radio value={1} width={pressSheetWidth} height={pressSheetHeight}>
                            自定义：
                            <span>宽 <Input className="w100" value={pressSheetWidth}
                                           onChange={this.handlePressSheetWidth.bind(this)}/> mm,</span>
                            <span>高 <Input className="w100" value={pressSheetHeight}
                                           onChange={this.handlePressSheetHeight.bind(this)}/> mm</span>
                          </Radio>
                        </Radio.Group>
                      </div>
                      {modeSelf == 5 && this.props.valid_id == 4 ? <div className="mt10 ml16">
                        <span className="ml30">内页：</span>
                        <Radio.Group className="ml60 mt10" onChange={this.handlePressSheetSizeBody.bind(this)}
                                     value={body_sheet_size_id}>
                          {sheet_size_list && sheet_size_list.length > 0 && sheet_size_list.map((item, index) => {
                            return (
                              <Radio value={item.id} className="mb10" key={index} width={item.pressSheetSize.width}
                                     height={item.pressSheetSize.height}>
                                {item.name} {item.pressSheetSize.width}*{item.pressSheetSize.height} mm
                              </Radio>
                            )
                          })}
                          <Radio value={1} width={pressSheetBodyWidth} height={pressSheetBodyHeight}>
                            自定义：
                            <span>宽 <Input className="w100" value={pressSheetBodyWidth}
                                           onChange={this.handlePressSheetWidthBody.bind(this)}/> mm,</span>
                            <span>高 <Input className="w100" value={pressSheetBodyHeight}
                                           onChange={this.handlePressSheetHeightBody.bind(this)}/> mm</span>
                          </Radio>
                        </Radio.Group>
                      </div> : null}
                    </div>
                    <div className="mt15">
                      <span className="ml20">拼版方式：</span>
                      <Select
                        value={features_id}
                        style={{width: 160}}
                        className="goods-type"
                        onChange={this.handleChangeFeatures.bind(this)}>
                        <Option value={0}>请选择</Option>
                        {featuresList && featuresList.length > 0 &&
                        featuresList.map((item, index) => {
                          return (
                            <Option value={item.id} key={index}>{item.name}</Option>
                          )
                        })
                        }
                      </Select>
                      <Icon type="question-circle" className="ml10 labelColor" onClick={this.featuresShow.bind(this)}/>
                    </div>
                  </div> : null}
                </div>
                : null}
              {productionMode != 1 && modeSelf == 3 ? <div className="mt15">
                <span className="tit" style={{width: 160}}>模板名：</span>
                {is_jdf_temp_name ?
                  <Fragment>
                    <span>{template_name}</span>
                    <span onClick={this.handleEditTemplateName.bind(this)} className="labelColor ml10">
                          <Icon type="edit"/>修改</span>
                  </Fragment> :
                  <Fragment>
                    <Input className={`goods-name`} style={{width: 160}} value={template_name}
                           onChange={this.handleOnChangeTemplateName}
                           placeholder="自定义" maxLength={128}/>
                    {isJdfName == 1 ?
                      <span onClick={this.handleDefaultTemplateName.bind(this)} className="labelColor ml10">
                          <Icon type="history"/>使用默认</span> : null
                    }
                  </Fragment>}
              </div> : null}
            </div> : null}
          {productionMode == 3 ?
            <div className="pro-icon mt15 ml60">买家确认后，系统会自动推送生产文件到您的云存储。</div> :
            <div className="pro-icon mt15 ml60">买家确认后，系统会自动推送PDF 文件到您的云存储，用于手动拼版等操作。</div>
          }
        </div>
        {goodsLabelList && goodsLabelList.length > 0 ?
          <div className="mt30 pb10 goods-label">
            <div className="clearfix">
              <div className="tit fl">商品标签设置：</div>
              <div className="fl label-c">
                {goodsLabelList.map((item, index) => {
                  return (
                    <div className="pb10 displayInlineBlock" key={index}>
                      <Checkbox checked={item.is_checked == 1 ? true : false}
                                onChange={this.handleGoodsLabel.bind(this, item.goods_label_id)}>{item.label_name}</Checkbox>
                      <Icon type="question-circle" className="mr30 labelColor icon-desc"
                            title={item.seller_description}/>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mt10 show-effect">
              <img className="effect-img" src={require('assets/images/seller/goodsLabelExample.png')} alt=""/>
              <a href="javascript:void (0);" className="labelColor effect-exp">示例效果 </a>
            </div>
          </div> : null}

        <div className={`${this.props.shopType == 1 || this.props.shopType == 5 ? "show" : " hide"}`}>
          <div className="mt30 pb10">
            <span className="tit">指定客户可见：</span>
            <Checkbox checked={assign} onChange={this.handleChangeAssign.bind(this)}>设置（非必须）</Checkbox>
          </div>
          <div className={`${assign ? "show" : " hide"}`}>
            <div className="mt15">
              <span className="tit" style={{width: 160}}>指定客户：</span>
              <Select
                value={payment_info && payment_info.buyer_id}
                style={{width: 180}}
                onChange={this.handleChangeAssignId.bind(this)}>
                <Option value={0}>请选择</Option>
                {
                  this.state.assignList &&
                  this.state.assignList.map((item, index) => {
                    return (
                      <Option value={item.private_shop_id} key={index}>{item.user_name}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className="mt15">
              <span className="tit" style={{width: 160}}>订金：</span>
              <Radio.Group onChange={this.onChangePayment.bind(this)} value={paymentValue}>
                <Radio value={1}>
                  <Input className="goods-name" style={{width: 60}}
                         value={payment_info && payment_info.advance_per}
                         onChange={this.handleOnChangeEarnestMoneyPer.bind(this)}
                         disabled={paymentValue != 1}
                         placeholder=""/> <span>%</span>
                </Radio>
                <Radio value={2} style={{marginLeft: "30px"}}>
                  <Input className="goods-name" style={{width: 100}}
                         value={payment_info && payment_info.advance_deposit}
                         onChange={this.handleOnChangeEarnestMoney.bind(this)}
                         disabled={paymentValue != 2}/> <span>元</span>
                </Radio>
              </Radio.Group>
            </div>
            <div className="mt15">
              <div className="tit" style={{width: 160, verticalAlign: "top", marginTop: "5px"}}>尾款：</div>
              <Radio.Group onChange={this.onChangeBalancePayment.bind(this)} value={balancePaymentValue}>
                <Radio value={1} style={{display: "block", marginBottom: "10px"}}>
                  <span>发货后</span>
                  <Input className="goods-name ml10 mr10" style={{width: 180}}
                         value={payment_info && payment_info.repay_after}
                         disabled={balancePaymentValue != 1}
                         onChange={this.handleOnChangeDay.bind(this)}
                         placeholder="请输入小于365的正整数"/>
                  <span>日内支付</span>
                </Radio>
                <Radio value={2} style={{display: "block"}}>
                  <span>每月</span>
                  <Input className="goods-name ml10 mr10" style={{width: 180}}
                         value={payment_info && payment_info.repay_day}
                         disabled={balancePaymentValue != 2}
                         onChange={this.handleOnChangeDate.bind(this)}
                         placeholder="请输入小于29的正整数"/>
                  <span>号支付</span>
                  <Input className="goods-name ml10 mr10" style={{width: 180}}
                         value={payment_info && payment_info.repay_month}
                         disabled={balancePaymentValue != 2}
                         onChange={this.handleOnChangeMonth.bind(this)}
                         placeholder="请输入小于13的正整数"/>
                  <span>个月前的未付尾款订单</span>
                </Radio>
              </Radio.Group>
            </div>
          </div>
        </div>
        <div className="btn-box mt30 clearfix">
          <Button type="primary" className={`btn fl ml30 ${this.props.match.params.goods_id > 0 &&
          window.sessionStorage.getItem("isPublish") != 1 ? "show" : " hide"}`}
                  onClick={this.oneButtonPublish.bind(this)}>一键发布</Button>
          <Button className={`fl ml30 goods-btn ${isDraft ? "show" : " hide"}`}
                  onClick={this.saveDrafts.bind(this)}>保存草稿，返回列表</Button>
          <Button type="primary" className="btn fr mr10"
                  onClick={this.nextStepTwo.bind(this, this.state.active)}>下一步</Button>
        </div>
        <Modal
          title="商品属性编辑提醒"
          visible={visibleResetAttr}
          width={460}
          onOk={this.handleOkResetAttr.bind(this)}
          onCancel={this.handleCancelResetAttr.bind(this)}
          maskClosable={false}
          keyboard={false}
          // wrapClassName="del-Modal"
          cancelText={'暂不修改'}
          okText={'是的，使用新模板编辑'}>
          <div style={{padding: "10px 0px"}}>
            平台对本商品的规格属性项进行了调整，是否使用新的属性模板编辑
            本商品属性与价格，以方便被筛选推荐、增加曝光？
          </div>
        </Modal>
        <Modal
          title=""
          visible={visible}
          width={900}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          wrapClassName="features-Modal"
          footer={null}
          cancelText={'取消'}
          okText={'确定'}>
          <div style={{padding: "10px 0px"}}>
            <img src={jdfFeatures} alt=""/>
          </div>
        </Modal>
        <Modal
          title="云存储账户"
          visible={visibleApplyAccount}
          width={800}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          wrapClassName="cloudStorage"
          footer={null}
          cancelText={'取消'}
          okText={'确定'}>
          <div className="cloudAccount">
            <EmailVerify btnText={bindCloudAccountType == 1 ? '申请云存储账号' : '绑定云存储账号'}
                         type={bindCloudAccountType == 1 ? "apply" : "bind"}
                         verifyId="applyVerify"
                         from="goodsEdit"
                         applyCloudSucc={this.applyCloudSucc.bind(this)}
                         toBindCloudAccount={this.toBindCloudAccount.bind(this)}>
            </EmailVerify>
          </div>
        </Modal>
        <Modal
          title="插入表情"
          visible={visibleEmojis}
          width={800}
          onOk={this.handleOkEmojis.bind(this)}
          onCancel={this.handleCancelEmojis.bind(this)}
          footer={false}
          maskStyle={false}
          mask={false}
          wrapClassName="emojis-Modal"
          cancelText={'取消'}
          okText={'确定'}>
          <div style={{padding: "10px 0px"}}>
            <div className="emoji-con" style={{border: "1px solid #ddd"}}>
              {
                emojiArr && emojiArr.map((item, index) => {
                  return (
                    <span key={index} className="emoji" onClick={this.handleEmoji.bind(this, item)}>{item}</span>
                  )
                })
              }
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    goods: state.goods.goods,
    classifyId: state.goods.classifyId,
    goods_id: state.goods.goods_id,
    payment_info: state.goods.payment_info,
    shopType: state.sellerLogin.loginInfo.shopType,
    quotation_info: state.goods.quotation_info,
    quotation_attrs: state.goods.quotation_attrs,
    specification_hide_list: state.goods.specification_hide_list,
    basicList: state.goods.basicList,
    step_price: state.goods.step_price,
    goodslinkgoods: state.goods.goodslinkgoods,
    unitId: state.goods.unitId,
    unit_name: state.goods.unit_name,
    valid_id: state.goods.valid_id,
    specificationList: state.goods.specificationList,
    goodsLabelList: state.goods.goodsLabelList,
    pid: state.goods.pid,
    sku_list: state.goods.sku_list,
    quantity: state.goods.quantity,
    loginInfo: state.sellerLogin.loginInfo
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveGoods(goods) {
      dispatch(actionCreator.getGoods(goods))
    },
    saveSpecificationList(list) {
      dispatch(actionCreator.getSpecicationList(list))
    },
    saveBasicList(list) {
      dispatch(actionCreator.getBasicList(list))
    },
    saveSpecificationHideList(list) {
      dispatch(actionCreator.getSpecicationHideList(list))
    },
    savePaymentInfo(payment_info) {
      dispatch(actionCreator.getPaymentInfo(payment_info))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProGoodsFillInfo));


