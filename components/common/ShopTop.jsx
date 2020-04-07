import React, { Component, Fragment } from 'react';
import { message, Popover } from 'antd';
import { withRouter, Link} from 'react-router-dom'
import GoodsType from 'components//shop/GoodsType'
import comUtils from 'utils/common'
import httpRequest from 'utils/ajax.js'
import api from "utils/api"
import "./style/shopTop.scss";
import SellerIm from "components/common/SellerImIcon";
import BuriedPoint from "components/common/BuriedPoint.jsx";


/**
 * 封装的头部 包含顶层位置 搜搜框 二级分类等等
 */
class ShopTop extends Component {
	constructor(props) {
		super(props);

    // console.log(this.props,"this.props")
    const pathName = this.props.location.pathname;
   const isGoodsInfo = (pathName.includes("shop") && pathName.includes("goods") && pathName.split("/").length==6);

		this.state = {
      isGoodsInfo: isGoodsInfo,
			showcate: false,
			shopId: this.props.match.params.shopId,
			goodId: "",
			shopBaseInfo: JSON.parse(JSON.stringify(props.shopBaseInfo)) || {},
			isPreview: comUtils.getQueryString('pr'),
			is_collect_shop: props.shopBaseInfo && props.shopBaseInfo.is_collect_shop,
      focuson: 0,
      category_id:this.props.category_id,
      cateArr:[] //当前类别数组
		}
	}

	static defaultProps = {
		statusObj: {
			"0": { txt: "VIP商家", cls: "" },
			"1": { txt: "金牌商家", cls: "" },
			"2": { txt: "银牌商家", cls: "" },
			"3": { txt: "铜牌商家", cls: "" }
		}
	}


	mouserenter = () => {
		this.setState({ showcate: true });
	}
	mouseleaver = () => {
		this.setState({ showcate: false });
	}
	componentDidMount() {
    this.getShopIdAndGoodId()

    // console.log(this.state.category_id,"this.state.category_id");
		// this.storewhethercollection() //店铺是否被收藏
  }
  componentWillReceiveProps(nextprops){

		const pathName = nextprops.location.pathname;
	  this.setState({
		isGoodsInfo: (pathName.includes("shop") && pathName.includes("goods") && pathName.split("/").length==6)
	  })
    if(nextprops.category_id!=null && nextprops.category_id != this.state.category_id){
      this.setState({
        category_id: nextprops.category_id
      },() => {
        this.getCategory(nextprops.category_id);
      })
    }
    // console.log(nextprops,"nextpropsnextpropsnextpropsnextprops")
  }

  //获取商品类别
  getCategory = async (val) => {
    let params = {
      url:api.search.get_category_fetch_name,
      data:{
        category_id:val
      }
    }

    const resData = await httpRequest.get(params);
    if(resData.code !=200){
      return;
    }
    this.setState({
      cateArr:resData.data
    })




  }

	// 收藏店铺方法
	payattentionstore() {
		let action = "shop_collect"
		httpRequest.put({
			url: api.mycollection.collectionshop,
			data: {
				action: action,
				shop_id: this.state.shopBaseInfo.shop_id
			}
		}).then(res => {
			message.success(res.msg)
			this.setState({
				focuson: 1,
				is_collect_shop: 1
			})
		})
	}

	getShopIdAndGoodId() {

		let shopId = window.location.pathname.split("/shop")[1];
		let goodId = window.location.pathname.split('/goods/')[1];
		this.setState({
			//shopId: shopId,
			goodId: goodId
		})
	}

	// 获取优惠券列表
	getCouponList(coupons) {
		return (
			<div className="couponWrapper">
				{
					coupons.map(coupon => {
						const couponId = coupon.coupon_id
						const couponType = coupon.coupon_type
						const discountPrice = parseFloat(coupon.discount_price)
						return (
							<div className="clearfix couponItem" key={couponId}>
								<div className="couponImg amount fl">
									<div className="reduction">{
										couponType == 1 ? (<>{discountPrice} <em>折</em></> ):(<><em>￥</em>{discountPrice}</>)
									}</div>

								</div>
								<div className="fl couponDesc">
									<p className="useRange textover">{comUtils.formatCouponsTit(coupon)}</p>
									<p className="validityTime">
										{coupon.use_time_type_id ? this.formatDays(coupon.use_days_time) + '天有效期' : (this.formatDate(coupon.use_start_time) + ' - ' + this.formatDate(coupon.use_end_time))}
									</p>
								</div>
								{
									this.state['coupon' + couponId] || coupon.is_receive
									?
									<div className="getSucc couponBtn fl">领取成功</div>
									:
									<div className="getCoupon couponBtn fl" onClick={() => this.getCoupon(couponId, coupon)}>领取</div>
								}
							</div>
						)
					})
				}
			</div>
		)
	}

	// 领取优惠券
	getCoupon(couponId, coupon) {
		httpRequest.post({
			url: api.shop.getCoupon,
			data: {
				coupon_id: couponId
			}
		}).then(res => {
			this.setState({
				['coupon' + couponId]: true
			})
		})

		// For buried point.
		BuriedPoint.track({
			name: "点击领取优惠券",
			options: {
				"优惠券金额": coupon.discount_price,
				"页面": this.props.shopPageFlag ? "店铺首页" : "商品详情页"
			}
		});
	}

	formatDate(sec) {
		return comUtils.formatDate(sec * 1000, 'yyyy.MM.dd')
	}

	formatDays(sec) {
		return sec / 86400
	}

	openNewTab(url) {
		window.open(url)
	}

	// 运营后台配置的店铺标签
	getLabelList(start, end) {
		return this.state.shopBaseInfo.seller_label_list.slice(start, end).map((item, index) => (
			<span className="describe_span quality_span" key={index}>{item}</span>
		))
	}

	render() {
		const { showcate, isPreview } = this.state
		const { statusObj, previewNav, coupons, topAdv } = this.props
		const {
			shop_id,
			navMenu = [],
			proType,
			shop_name,
			server_commit,
			after_sale_day,
			rank_status,
			ratings
		} = this.state.shopBaseInfo;

		const nav = previewNav.length > 0 ? previewNav : navMenu
		const serverArr = server_commit && server_commit.toString().split(",")
		return (
			<Fragment>
				<div className={`shop_top ${this.state.isGoodsInfo? "goods_info":""} `}>
					{
						!isPreview
							?
							<div className="navbar">
								<div className="mg">
									<div className="navBarWrapper">
										<div className="mg clearfix">
											{
												this.state.isGoodsInfo ? (
													<div className="fl">
														<Link to={`//shop/${this.state.shopId}`}>店铺首页</Link>
														{
															this.state.cateArr.length>0 &&
																this.state.cateArr.map((item,idx) => {
																	return <span className="cate_item" key={idx}><em className="cate_line">-</em><Link to={`//search/category/${item.id}`}>{item.name}</Link></span>
																})
														}
													</div>
												) : (
													<div className="fl">
														<span><a href={"//shop/"+ this.state.shopBaseInfo.shop_id} target={"_blank"}>{shop_name}</a></span>
														<div className="imglist">
															{statusObj[rank_status] && <span className="describe_span vip_span">{statusObj[rank_status].txt}</span>}
															{serverArr.includes("2") && <span className="describe_span specialist_span">专人设计</span>}
															{serverArr.includes("0") && <span className="describe_span quality_span">{after_sale_day}天无忧</span>}
															{serverArr.includes("1") && <span className="describe_span speed_span">极速出货</span>}
															{
																// 运营后台给店铺自定义的标签，上面的serverArr相加最多显示5个
																serverArr.length == 3 ? (
																	this.getLabelList(0, 1)
																) : serverArr.length == 2 ? (
																	this.getLabelList(0, 2)
																) : serverArr.length == 1 ? (
																	this.getLabelList(0, 3)
																) : (
																	this.getLabelList(0, 4)
																)
															}
															{/* <img src={require('assets/images//common/right1.png')} alt="" />
																							<img src={require('assets/images//common/right1.png')} alt="" /> */}
														</div>
														<div className="rate">
															<span>描述<a className="increase"> {ratings&&ratings.desc_comment>0?ratings.desc_comment:4.5} ↑</a></span>
															<span>服务<a className="increase"> {ratings&&ratings.server_comment>0?ratings.server_comment:4.5} ↑</a></span>
															<span>物流<a className="increase"> {ratings&&ratings.express_comment>0?ratings.express_comment:4.5} ↑</a></span>
														</div>
													</div>
												)
											}
											<div className="fr">
												{
													coupons.length > 0
													?
													<Popover
														placement="bottomRight"
														content={this.getCouponList(coupons)}
													>
														<div className="coupon fr">优惠券</div>
													</Popover>
													:
													null
												}
												<span className="fr">
													<i>
														{
															this.state.is_collect_shop == 1 ?
															<span><a className="focusbg"></a>已关注</span>:
															<span className="foucs_shop" onClick={this.payattentionstore.bind(this)}><a className="focusdpbg"></a>关注店铺</span>
														}
													</i>
												</span>
												<span className="fr">
														<SellerIm uid={this.state.shopId} msg={'https://' + window.location.hostname + '//shop/' + this.state.shopId}></SellerIm>
                            <i style={{cursor:"pointer"}} onClick={()=>{document.getElementsByClassName("seller-im-icon-box")[0].click()}}>在线客服</i>
													</span>
													{
														this.state.isGoodsInfo ? (
															<span className="fr"><a href={"//shop/"+ this.state.shopBaseInfo.shop_id} target={"_blank"}>{shop_name}</a></span>
														) : null
													}
											</div>
										</div>
									</div>
								</div>
							</div>
							:
							null
					}
					<div>
					{
						topAdv.jumpUrl && topAdv.imgUrl
							?
							(
								<div className="topAdv">
									<div className="auto">
										<a href={topAdv.jumpUrl}>
											<img src={topAdv.imgUrl} alt="顶部广告" />
										</a>
									</div>
								</div>
							)
							:
							null
					}
					<div className="mainbar">
						<div className="mg">
							<div className="li">
								{
									!isPreview
									?
									<span onClick={() => this.openNewTab(this.props.shopDecoration == 1 ? `//shop/${shop_id}` : `//shop/${shop_id}/goodslist/search/all`)}>首页</span>
									:
									<span>首页</span>
								}
							</div>
							{
								proType && proType.length > 0 ? (
									<div className={showcate ? 'act li' : 'li'} onMouseEnter={this.mouserenter} onMouseLeave={this.mouseleaver}>
										<a>店铺分类
											<div className="sel"></div>
										</a>
										{
											!isPreview ? (
												<div className={showcate ? 'pop' : "hidden"}>
													<GoodsType proType={proType}></GoodsType>
												</div>
											) : null
										}
									</div>
								) : null
							}
							<div className="li">
								{	!isPreview ? (
									<span onClick={() => this.openNewTab(`//shop/${shop_id}/goodslist/search/all`)}>全部商品</span>
								) : (
									<span>全部商品</span>
								)}
							</div>
							{
								nav.map((item, idx) => {
									return (
										<div className="li" key={idx}>
											{!isPreview ? <span onClick={() => this.openNewTab(item.nav_url)}>{item.nav_name}</span> : <span>{item.nav_name}</span>}
										</div>
									)
								})
							}
						</div>
					</div>
					</div>
				</div>
			</Fragment>
		)
	}
}
export default withRouter(ShopTop);
