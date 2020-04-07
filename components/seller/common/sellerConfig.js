import SellerIndex from '../home/index'
import SellerOrder from '../orders'
import SellerDelivery from '../delivery/index'
import SellerShop from '../shop/index'
import SellerGoods from '../goods'
import SellerPromotion from '../promotion'
import SellerBusiness from '../business'
import StateMent from '../statement'
import SellerAuthority from '../authority'
import SellerPurchase from '../purchase'

export const StatementList = [
  { name: '交易统计', url: '/seller/statement/tradestatistic', child: [], id: 1, icon: 'icondingdanliebiaocebianlandaohang' },
  {
    name: '商品概况',
    url: '/seller/statement/productsoverview',
    child: [],
    id: 1,
    icon: 'icondingdanliebiaocebianlandaohang'
  },
];
export const menuList = [
  { name: '首页', url: '/seller/home', path: 'se_home', component: SellerIndex },
  { name: '商品', url: '/seller/goods', path: 'se_goods', component: SellerGoods },
  { name: '订单', url: '/seller/orders', path: 'se_order', component: SellerOrder },
  { name: '报表', url: '/seller/statement', path: 'se_report', component: StateMent },
  { name: '促销', url: '/seller/promotion', path: 'se_promotion', component: SellerPromotion },
  { name: '权限', url: '/seller/authority', path: 'se_permissions', id: 5, component: SellerAuthority },
  { name: '配送', url: '/seller/delivery', path: 'se_ship', component: SellerDelivery },
  { name: '商家', url: '/seller/business', path: 'se_wallet', component: SellerBusiness },
  { name: '店铺', url: '/seller/shop', path: 'se_store', component: SellerShop },
  { name: '抢单', url: '/seller/purchase', path: 'se_purchase', component: SellerPurchase },
];
export const IndexChildrenList = [
  { name: '欢迎', url: '/seller/home/welcome', id: 1, icon: 'iconhuanyingcebianlandaohang' },
  // { name: '帮助', url: '/seller/home/help',child:['/seller/home/helpDetail'],id:2,icon:'iconbangzhucebianlandaohang'  },
  // {name: '报价', url: '/seller/home/offer', child: ['/seller/home/getoffer'], id: 4, icon: 'iconbaojia-'},
  { name: '通知', url: '/seller/home/notice', id: 5, icon: 'iconxiaoxicebianlandaohang', numberNotice: true }
];
export const OrderChildrenList = [
  { name: '订单列表', url: '/seller/orders/orderList', child: ['/seller/orders/orderInfo'], id: 1, icon: 'icondingdanliebiaocebianlandaohang' },

  { name: '分期订单', url: '/seller/orders/Stages', child: ['/seller/orders/orderInfo'], id: 5, icon: 'icondingdanliebiaocebianlandaohang' },

  { name: '评价列表', url: '/seller/orders/evaluateList', child: ['/seller/orders/reply'], id: 2, icon: 'iconxiaoxicebianlandaohang' },
  { name: '售后订单', url: '/seller/orders/aftermarket', child: ['/seller/orders/aftermarketDetail'], id: 3, icon: 'iconshouhoudingdancebianlandaohang' },
  { name: '退款订单', url: '/seller/orders/refundList', child: ['/seller/orders/refundDetail'], id: 4, icon: 'icontuikuandingdancebianlandaohang' },

  // { name: '缺货登记', url: '/seller/orders/Shortage',id:6 },
  // { name: '发货单列表', url: '/seller/orders/Deliver',id:7 },
]
export const goodsChildrenList = [
  // { name: '商品列表', url: '/seller/goods/goodsList/0', id: 1 },
  // { name: '我要分销', url: '/seller/goods/distribute', id: 2 },
  // { name: '商品授权', url: '/seller/goods/goodsAuthorization', id: 3 },
  { name: '店内分类', url: '/seller/goods/goodsStoreClassify', id: 4 },
  { name: '我的图片库', url: '/seller/goods/GoodsPhotoGalleryFolder', id: 5 },
  { name: '用户评论', url: '/seller/goods/goodsUserComment', id: 6 }
];
export const purchaseList = [
  { name: '报价', url: '/seller/purchase/offer', child: ['/seller/purchase/getoffer'], id: 4, icon: 'iconbaojia-' },
];
export const deliveryChildrenList = [
  { name: '快递发货', url: '/seller/delivery/delivergoods', child: ['/seller/delivery/template'], id: 1, icon: 'iconkuaidifahuocebianlandaohang' },
  { name: '同城配送', url: '/seller/delivery/sameCity', id: 2, icon: 'icontongchengpeisongcebianlandaohang' },
  { name: '上门自提', url: '/seller/delivery/takeTheir', id: 3, icon: 'iconmendian' },
]

export const shopChildrenList = [
  { name: '店铺设置', url: '/seller/shop/shopSet', id: 2, icon: 'icondianpushezhicebianlandaohang' },
  { name: '导航设置', url: '/seller/shop/locSet', id: 3, icon: 'icondaohangshezhicebianlandaohang' },
  { name: '店铺装修', url: '/seller/shop/shopDecoration', id: 4, icon: 'icondianpuzhuangxiucebianlandaohang' },
  { name: '切换店铺管理', url: '/seller/shop/switchshop', id: 5, icon: 'iconfangwenguanlicebianlandaohang' },
  { name: ' 云存储', url: '/seller/shop/cloudstorage', id: 6, icon: 'iconcloud' }
];
export const promotionChildrenList = [
  {
    name: '促销活动', url: '/seller/promotion/salesActivity', id: 3, icon: 'iconcuxiaohuodongcebianlandaohang',
    child: ['/seller/promotion/couponindex', '/seller/promotion/coupongetlist', '/seller/promotion/couponeditor']
  }
];
export const businessChildrenList = [
  { name: '账户', url: '/seller/business/account', id: 1, icon: 'iconwode', child: ['/seller/business/cashwithdrawal'] },
  { name: '结算', url: '/seller/business/settlement', id: 2, icon: 'iconjiesuancebianlandaohang' },
  { name: '分销收益', url: '/seller/business/distributionEarning', id: 3, icon: 'iconjiesuancebianlandaohang' },
  { name: '发票', url: '/seller/business/invoice', id: 4, icon: 'iconfapiaocebianlandaohang',
    child: ['/seller/business/invoiceinfo', '/seller/business/editinvoiceinfo', '/seller/business/success'] },
  // { name: '促销活动', url: '/seller/shop/salesActivity',id:3,icon:'iconcuxiaohuodongcebianlandaohang',
  //     child:['/seller/shop/couponindex','/seller/shop/coupongetlist']
  // }
];
export const authorityChildrenList = [
  { name: '访问管理', url: '/seller/authority/visitormanage', id: 1, icon: 'iconqiehuandianpuguanlicebianlandaohang' },
  { name: '邀请访问', url: '/seller/authority/invitevisit', id: 2, icon: 'iconhuaban1' }
];

