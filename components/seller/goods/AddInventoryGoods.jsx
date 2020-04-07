import React, {Component} from 'react';
import Title from '../common/Title';
import GoodsNav from './common/GoodsNav'
import SelectGoodsClassify from './common/SelectGoodsClassify'
import InventoryGoodsFillInfo from './common/InvGoodsFillInfo'
import ProGoodsConfirmAttr from './common/ProGoodsConfirmAttr'
import InvGoodsConfirmAttr from './common/InvGoodsConfirmAttr'
import InvGoodsAttrPrice from './common/InvGoodsAttrPrice'
import InvGoodsReleaseAssociated from './common/InvGoodsReleaseAssociated'
import {connect} from 'react-redux'
import {actionCreator} from "./store";
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import '../common/style/goodsAddEdit.scss';
import comUtil from 'utils/common.js';

class AddInventoryGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - - 库存类商品',
      selectClassify: 0,
      ClassifyId: 0,
      goods_type: 0,
      classifyName: '',
      specificationList: [],
      spu_id: ""
    }
  }

  isShow(index) {
    this.setState({
      selectClassify: index
    })
  }

  //获取属性Id
  getClassifyId(ClassifyId) {
    this.setState({
      ClassifyId: ClassifyId
    })
  }

  //获取属性名称
  getClassifyName(classifyName) {
    this.setState({
      classifyName: classifyName
    })
  }

  //获取子组件传的单位值
  getUnit(unitObj) {
    this.setState({
      unitObj: unitObj
    })
  }

  //初始化清除缓存
  initClearStore() {
    this.props.saveGoodsId(0);
    this.props.saveUnitId("");
    this.props.saveSkuList("");
  }

  componentDidMount() {
    this.initClearStore();
    let goods_id = this.props.match.params.goods_id;
    this.setState({
      goods_id
    });

    if (goods_id > 0) {
      this.setState({
        selectClassify: 1
      });
      this.props.saveGoodsId(goods_id);
      this.getShopGoodsEdit(goods_id);
    } else {
      this.props.saveGoods("");
      this.props.saveQuotationInfo("");
      this.props.saveSpecificationList("");
      this.props.saveSkuList("");
      this.props.saveStepPrice("");
    }
  }

  //编辑获取数据
  getShopGoodsEdit(goods_id) {
    httpRequest.get({
      url: sellerApi.goods.shopGoods,
      data: {
        // shop_id: 1,
        goods_id: goods_id
      }
    }).then(res => {
      if (res.code == "200") {
        let goods = res.data.goods;
        let basicList = res.data.quotation_info.basic;
        let specificationList = res.data.quotation_info.specification;
        let specification_hide_list = res.data.quotation_info.specification_hide;
        let sku_list = res.data.sku_list;
        let goodslinkgoods = res.data.goodslinkgoods;
        let step_price = res.data.step_price;
        let spu_id = res.data.goods.spu_id;
        let unitId = Number(res.data.unit);
        this.setState({
          spu_id
        });
        this.props.saveGoods(goods);
        this.props.saveClassifyId(goods.category_id);
        this.props.saveBasicList(basicList);
        this.props.saveSpecificationList(specificationList);
        this.props.saveSkuList(sku_list);
        this.props.saveStepPrice(step_price);
        this.props.saveUnitId(unitId);
        this.props.saveGoodsLinkGoods(goodslinkgoods);
        this.props.saveSpecificationHideList(specification_hide_list);
        this.setState({classifyName: goods.category_name})
      }
    })
  }

  render() {
    const selectClassify = this.state.selectClassify;
    return (
        <div className="produce-goods-main">
          <Title title={this.state.titleContent}/>
          <GoodsNav activeIndex={selectClassify}/>
          <div className={selectClassify > 0 ? "hide" : "show"}>
            <SelectGoodsClassify activeValue={this.isShow.bind(this)}
                                 ClassifyId={this.getClassifyId.bind(this)}
                                 classifyName={this.getClassifyName.bind(this)}/>
          </div>
          <div className={selectClassify == 1 ? "show" : "hide"}>
            <InventoryGoodsFillInfo activeValue={this.isShow.bind(this)}
                                    classifyName={this.state.classifyName}/>
          </div>
          <div className={selectClassify == 2 ? "show" : "hide"}>
            <ProGoodsConfirmAttr activeValue={this.isShow.bind(this)}
                                 goods_type={this.state.goods_type}
                                 unitObj={this.getUnit.bind(this)}/>
          </div>
          <div className={selectClassify == 3 ? "show" : "hide"}>
            <InvGoodsConfirmAttr activeValue={this.isShow.bind(this)}
                                 classifyName={this.state.classifyName}/>
          </div>
          <div className={selectClassify == 4 ? "show" : "hide"}>
            <InvGoodsAttrPrice activeValue={this.isShow.bind(this)}
                               classifyName={this.state.classifyName}/>
          </div>
          <div className={selectClassify == 5 ? "show" : "hide"}>
            <InvGoodsReleaseAssociated activeValue={this.isShow.bind(this)}
                                       classifyName={this.state.classifyName}
                                       spu_id={this.state.spu_id}
                                       unitObj={this.state.unitObj}/>
          </div>
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
    saveSkuList(list) {
      dispatch(actionCreator.getSkuList(list))
    },
    saveStepPrice(goods) {
      dispatch(actionCreator.getStepPrice(goods))
    },
    saveGoodsId(goods) {
      dispatch(actionCreator.getGoodsId(goods))
    },
    saveClassifyId(classifyId) {
      dispatch(actionCreator.getClassifyId(classifyId))
    },
    saveUnitId(unitId) {
      dispatch(actionCreator.getUnitId(unitId))
    },
    saveGoodsLinkGoods(list) {
      dispatch(actionCreator.getGoodsLinkGoods(list))
    },
    saveSpecificationHideList(list) {
      dispatch(actionCreator.getSpecicationHideList(list))
    }
  }
};
export default connect(null, mapDispatchToProps)(AddInventoryGoods);