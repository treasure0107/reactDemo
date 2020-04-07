import React, {Component} from 'react';
import Title from '../common/Title';
import GoodsNav from './common/GoodsNav'
import SelectGoodsClassify from './common/SelectGoodsClassify'
import ProGoodsFillInfo from './common/ProGoodsFillInfo'
import ProGoodsConfirmAttr from './common/ProGoodsConfirmAttr'
import ProGoodsConfirmAttrPrice from './common/ProGoodsConfirmAttrPrice'
import ProGoodsOfferSpotCheck from './common/ProGoodsOfferSpotCheck'
import ProGoodsReleaseAssociated from './common/ProGoodsReleaseAssociated'
import {connect} from 'react-redux'
import {actionCreator} from "./store";
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import comUtil from 'utils/common.js';
import '../common/style/goodsAddEdit.scss';
import {message, Modal} from "antd";

class AddProduceGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goods_id: 0,
      titleContent: '商品 - - 创建商品',
      selectClassify: 0,
      ClassifyId: 0,
      goods_type: 1,
      classifyName: '',
      basicList: [],
      specificationList: [],
      visibleResetAttr: false,
      spu_id: "",
    }
  }

  isShow(index) {
    this.setState({
      selectClassify: index
    })
  }

  getClassifyId(ClassifyId) {
    this.setState({
      ClassifyId: ClassifyId
    })
  }

  getClassifyName(classifyName) {
    this.setState({
      classifyName: classifyName
    })
  }

  //初始化清除缓存
  initClearStore() {
    this.props.saveGoodsId(0);
    this.props.saveUnitId("");
    this.props.saveGoodsLinkGoods("");
    this.props.savePaymentInfo({
      buyer_id: 0
    });
  }

  componentWillMount() {
    window.sessionStorage.setItem("draft_id", this.props.match.params.draft_id);
    this.initClearStore();
    let goods_id = this.props.match.params.goods_id;
    let draft_id = this.props.match.params.draft_id;
    this.setState({goods_id});
    if (draft_id > 0) {
      this.getDraft(draft_id);
    } else {
      if (goods_id > 0) {
        this.setState({
          selectClassify: 1,
          titleContent: "商品 - - 编辑商品"
        });
        this.getShopGoodsEdit(goods_id);
        this.props.saveGoodsId(goods_id);
      } else {
        this.props.saveGoods("");
        this.props.saveQuotationInfo("");
        this.props.saveSpecificationList("");
        // this.props.saveBasicList("");
        this.props.saveStepPrice("");
        this.props.saveSkuList("");
        this.props.saveQuantity("")
      }
    }
  }

  componentDidMount() {


  }

  //获取草稿详情
  getDraft(draft_id) {
    httpRequest.get({
      url: sellerApi.goods.draft,
      data: {
        draft_id: draft_id
      }
    }).then(res => {
      if (res.code == "200") {
        let page_index = res.data.page_index;
        let goods = res.data.goods_draft.goods;
        let basicList = res.data.goods_draft.basicList;
        let specificationList = res.data.goods_draft.specificationList;
        let quotation_info = res.data.goods_draft.quotation_info;
        let unitId = Number(res.data.goods_draft.unit || 0);
        this.props.saveUnitId(unitId);
        this.props.saveGoods(goods);
        this.props.saveBasicList(basicList);
        this.props.saveQuotationInfo(quotation_info);
        //区分SKU组合和基准报价
        let goods_type = goods.goods_type;
        if (goods_type == 1) {
          let quotation_attrs = res.data.goods_draft.quotation_attrs;
          let step_price = res.data.goods_draft.step_price;
          this.props.saveQuotationAttrs(quotation_attrs);
          this.props.saveStepPrice(step_price);
        } else {
          let sku_list = res.data.goods_draft.sku_list;
          let quantity = res.data.goods_draft.quantity;
          this.props.saveSkuList(sku_list);
          this.props.saveQuantity(quantity)
        }
        window.sessionStorage.setItem("page_index", page_index);
        window.sessionStorage.setItem("category_id", goods.category_id);
        if (specificationList) {
          this.props.saveSpecificationList(specificationList);
        }
        let specification_hide_list = res.data.specification_hide;
        this.setState({
          selectClassify: page_index,
          classifyName: goods.category_name
        })
      }
    })
  }

  //编辑获取数据
  getShopGoodsEdit(goods_id) {
    httpRequest.get({
      url: sellerApi.goods.sellerGoods,
      data: {
        goods_id: goods_id
      }
    }).then(res => {
      if (res.code == "200") {
        let goods = res.data.goods;
        let basicList = res.data.basic;
        let specificationList = res.data.specification;
        let quotation_info = res.data.quotation_info;
        let goodslinkgoods = res.data.goodslinkgoods;
        let spu_id = res.data.goods.spu_id;
        let unitId = parseFloat(goods.unit);
        let unit_name = goods.unit_name;
        let update_msg = goods.update_msg;
        let ClassifyId = goods.category_id;
        let valid_id = goods.valid_id;
        let specification_hide_list = res.data.specification_hide;
        let payment_info = res.data.payment_info;
        let goodsLabelList = res.data.goods_label_list;
        this.props.saveGoods(goods);
        this.props.savePaymentInfo(payment_info);
        this.props.saveBasicList(basicList);
        this.props.saveSpecificationList(specificationList);
        this.props.saveQuotationInfo(quotation_info);
        this.props.saveUnitId(unitId);
        this.props.saveUnitName(unit_name);
        this.props.saveValidId(valid_id);
        this.props.saveClassifyId(goods.category_id);
        this.props.saveGoodsLinkGoods(goodslinkgoods);
        this.props.saveSpecificationHideList(specification_hide_list);
        this.props.saveGoodsLabelList(goodsLabelList);
        this.props.savePid(goods.pid);
        let goods_type = goods.goods_type;
        this.getAttrDataTemplate(goods.category_id)
        //区分SKU组合和基准报价
        if (goods_type == 1) {
          let quotation_attrs = res.data.quotation_attr.quotation_attr;
          let step_price = res.data.quotation_attr.step_price;
          this.props.saveQuotationAttrs(quotation_attrs);
          this.props.saveStepPrice(step_price);
        } else {
          let sku_list = res.data.sku_list;
          let quantity = res.data.quantity;
          this.props.saveSkuList(sku_list);
          this.props.saveQuantity(quantity)
        }
        this.setState({
          spu_id,
          ClassifyId,
          classifyName: goods.category_name
        });
        if (update_msg == 1) {
          this.setState({
            visibleResetAttr: true
          })
        }
      }
    })
  }

  handleOkResetAttr() {
    this.props.saveSpecificationList("");
    setTimeout(() => {
      let {ClassifyId} = this.state;
      this.getAttrData(ClassifyId);
      this.setState({
        visibleResetAttr: false
      })
    }, 300);
    window.sessionStorage.setItem("isPublish", "1");
  }

  handleCancelResetAttr() {
    let {spu_id} = this.state;
    let update_msg = 0;
    this.updateGoodsMsg(spu_id, update_msg);
    this.setState({
      visibleResetAttr: false
    });
    window.sessionStorage.setItem("isPublish", "0");
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
        this.props.saveValidId(res.data.valid_id);
        this.props.saveUnitId(res.data.unit);
        this.props.saveUnitName(res.data.unit_name);
      } else {
        message.error(res.msg || "该分类没有属性模板请先添加")
      }
    })
  }

  getAttrDataTemplate(cat_id) {
    httpRequest.get({
      url: sellerApi.goods.goodsShopAttr,
      data: {
        cat_id: cat_id,
      }
    }).then(res => {
      if (res.code == "200") {
        if (res.data.jdf_temp_name) {
          window.sessionStorage.setItem("isJdfName", "1");
        } else {
          window.sessionStorage.setItem("isJdfName", "0");
        }

      }
    })
  }

  //修改商品通知
  updateGoodsMsg(spu_id, update_msg) {
    httpRequest.post({
      url: sellerApi.goods.updateGoodsMsg,
      data: {
        spu_id: spu_id,
        update_msg: update_msg
      }
    }).then(res => {
      if (res.code == "200") {
      } else {
        message.error(res.msg)
      }
    })
  }

  render() {
    const {titleContent, selectClassify, classifyName, visibleResetAttr} = this.state;
    return (
      <div className="produce-goods-main">
        <Title title={titleContent}/>
        <GoodsNav activeIndex={selectClassify}/>
        <div className={selectClassify > 0 ? "hide" : "show"}>
          <SelectGoodsClassify activeValue={this.isShow.bind(this)}
                               ClassifyId={this.getClassifyId.bind(this)}
                               classifyName={this.getClassifyName.bind(this)}/>
        </div>
        <div className={selectClassify == 1 ? "show" : "hide"}>
          <ProGoodsFillInfo activeValue={this.isShow.bind(this)}
                            classifyName={classifyName}/>
        </div>
        <div className={selectClassify == 2 ? "show" : "hide"}>
          <ProGoodsConfirmAttr activeValue={this.isShow.bind(this)}
                               classifyName={classifyName}
                               goods_type={this.state.goods_type}/>
        </div>
        <div className={selectClassify == 3 ? "show" : "hide"}>
          <ProGoodsConfirmAttrPrice activeValue={this.isShow.bind(this)}
                                    specificationList={this.state.specificationList}/>
        </div>
        <div className={selectClassify == 4 ? "show" : "hide"}>
          <ProGoodsOfferSpotCheck activeValue={this.isShow.bind(this)}
                                  classifyName={classifyName}/>
        </div>
        <div className={selectClassify == 5 ? "show" : "hide"}>
          <ProGoodsReleaseAssociated activeValue={this.isShow.bind(this)}
                                     classifyName={classifyName}
                                     spu_id={this.state.spu_id}/>
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
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveGoods(goods) {
      dispatch(actionCreator.getGoods(goods))
    },
    saveQuotationInfo(quotation_info) {
      dispatch(actionCreator.getQuotationInfo(quotation_info))
    },
    saveSpecificationList(list) {
      dispatch(actionCreator.getSpecicationList(list))
    },
    saveBasicList(list) {
      dispatch(actionCreator.getBasicList(list))
    },
    saveStepPrice(goods) {
      dispatch(actionCreator.getStepPrice(goods))
    },
    saveQuotationAttrs(list) {
      dispatch(actionCreator.getQuotationAttrs(list))
    },
    saveGoodsId(goodsId) {
      dispatch(actionCreator.getGoodsId(goodsId))
    },
    saveClassifyId(classifyId) {
      dispatch(actionCreator.getClassifyId(classifyId))
    },
    saveUnitId(unitId) {
      dispatch(actionCreator.getUnitId(unitId))
    },
    saveUnitName(unitName) {
      dispatch(actionCreator.getUnitName(unitName))
    },
    saveGoodsLinkGoods(list) {
      dispatch(actionCreator.getGoodsLinkGoods(list))
    },
    saveSpecificationHideList(list) {
      dispatch(actionCreator.getSpecicationHideList(list))
    },
    savePaymentInfo(payment_info) {
      dispatch(actionCreator.getPaymentInfo(payment_info))
    },
    saveSkuList(list) {
      dispatch(actionCreator.getSkuList(list))
    },
    saveQuantity(list) {
      dispatch(actionCreator.getQuantity(list))
    },
    saveValidId(unitName) {
      dispatch(actionCreator.getValidId(unitName))
    },
    saveGoodsLabelList(list) {
      dispatch(actionCreator.getGoodsLabelList(list))
    },
    savePid(pid) {
      dispatch(actionCreator.getPid(pid))
    }
  }
};
export default connect(null, mapDispatchToProps)(AddProduceGoods);