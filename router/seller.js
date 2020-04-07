import Loadable from 'react-loadable';
import Loading from 'components/common/loading'


export const SellerIndex = Loadable({
  loader: () => import('components/seller/home'),
  loading: Loading
});
export const Orders = Loadable({
  loader: () => import('components/seller/orders'),
  loading: Loading
});
export const Goods = Loadable({
  loader: () => import('components/seller/goods'),
  loading: Loading
});
export const Privilege = Loadable({
  loader: () => import('components/seller/authority'),
  loading: Loading
});
export const Promotion = Loadable({
  loader: () => import('components/seller/promotion'),
  loading: Loading
});


// 报表
export const Statement = Loadable({
  loader: () => import('components/seller/statement'),
  loading: Loading
});

export const ProductsOverview = Loadable({
  loader: () => import('components/seller/statement/ProductsOverview'),
  loading: Loading
});

export const TradeStatistic = Loadable({
  loader: () => import('components/seller/statement/TradeStatistic'),
  loading: Loading
});

export const Regional = Loadable({
  loader: () => import('components/seller/statement/Regional'),
  loading: Loading
});

export const WealthStatistics = Loadable({
  loader: () => import('components/seller/statement/WealthStatistics'),
  loading: Loading
});

export const OrderList = Loadable({
  loader: () => import('components/seller/orders/OrderList'),
  loading: Loading
});
export const StagesInfo = Loadable({
  loader: () => import('components/seller/orders/StagesInfo'),
  loading: Loading
});

export const OrderInfo = Loadable({
  loader: () => import('components/seller/orders/OrderInfo'),
  loading: Loading
});
export const OrderOperation = Loadable({
  loader: () => import('components/seller/orders/OrderOperation'),
  loading: Loading
});
export const OrderShortage = Loadable({
  loader: () => import('components/seller/orders/OrderShortage'),
  loading: Loading
});
export const OrderDeliver = Loadable({
  loader: () => import('components/seller/orders/OrderDeliver'),
  loading: Loading
});
export const OrderEvaluateList = Loadable({
  loader: () => import('components/seller/orders/EvaluateList'),
  loading: Loading
});
export const OrderReplyEvaluate = Loadable({
  loader: () => import('components/seller/orders/ReplyEvaluate'),
  loading: Loading
});
export const OrderAftermarket = Loadable({
  loader: () => import('components/seller/orders/Aftermarket'),
  loading: Loading
});
export const OrderAftermarketDetail = Loadable({
  loader: () => import('components/seller/orders/AftermarketDetail'),
  loading: Loading
});
export const OrderRefundList = Loadable({
  loader: () => import('components/seller/orders/RefundList'),
  loading: Loading
});
export const OrderRefundDetail = Loadable({
  loader: () => import('components/seller/orders/RefundDetail'),
  loading: Loading
});
export const CouponIndex = Loadable({
  loader: () => import('components/seller/promotion/CouponIndex'),
  loading: Loading
});
export const CouponGetList = Loadable({
  loader: () => import('components/seller/promotion/CouponGetList'),
  loading: Loading
});

export const WelcomePage = Loadable({
  loader: () => import('components/seller/home/Welcome'),
  loading: Loading
});
export const OfferPage = Loadable({
  loader: () => import('components/seller/purchase/SendOffer'),
  loading: Loading
});
export const GetOffer = Loadable({
  loader: () => import('components/seller/purchase/GetOffer'),
  loading: Loading
});
export const Notice = Loadable({
  loader: () => import('components/seller/home/Notice'),
  loading: Loading
})
export const PreparePage = Loadable({
  loader: () => import('components/seller/home/Prepare'),
  loading: Loading
});
export const ShopClose = Loadable({
  loader: () => import('components/seller/home/ShopClose'),
  loading: Loading
});
export const Help = Loadable({
  loader: () => import('components/seller/home/Help'),
  loading: Loading
});
export const HelpDetail = Loadable({
  loader: () => import('components/seller/home/HelpDetail'),
  loading: Loading
});
export const Delivery = Loadable({
  loader: () => import('components/seller/delivery'),
  loading: Loading
});
export const DeliverGoods = Loadable({
  loader: () => import('components/seller/delivery/DeliverGoods'),
  loading: Loading
});
export const DeliverTemplate = Loadable({
  loader: () => import('components/seller/delivery/Template'),
  loading: Loading
});
export const SameCityTemplate = Loadable({
  loader: () => import('components/seller/delivery/SameCity'),
  loading: Loading
});
export const TakeTheir = Loadable({
  loader: () => import('components/seller/delivery/TakeTheir'),
  loading: Loading
});
export const GoodsList = Loadable({
  loader: () => import('components/seller/goods/GoodsList'),
  loading: Loading
});
export const Distribute = Loadable({
  loader: () => import('components/seller/goods/Distribute'),
  loading: Loading
});
export const GoodsAuthorization = Loadable({
  loader: () => import('components/seller/goods/GoodsAuthorization'),
  loading: Loading
});
export const AuthorizeDetail = Loadable({
  loader: () => import('components/seller/goods/AuthorizeDetail'),
  loading: Loading
});
export const GoodsLogList = Loadable({
  loader: () => import('components/seller/goods/GoodsLogList'),
  loading: Loading
});
export const GoodsStoreClassify = Loadable({
  loader: () => import('components/seller/goods/GoodsStoreClassify'),
  loading: Loading
});
export const GoodsStoreTwoClassify = Loadable({
  loader: () => import('components/seller/goods/GoodsStoreTwoClassify'),
  loading: Loading
});
export const GoodsPhotoGallery = Loadable({
  loader: () => import('components/seller/goods/GoodsPhotoGallery'),
  loading: Loading
});
export const GoodsPhotoGalleryFolder = Loadable({
  loader: () => import('components/seller/goods/GoodsPhotoGalleryFolder'),
  loading: Loading
});
export const GoodsUserComment = Loadable({
  loader: () => import('components/seller/goods/GoodsUserComment'),
  loading: Loading
});
export const AddGoodsComment = Loadable({
  loader: () => import('components/seller/goods/AddGoodsComment'),
  loading: Loading
});
export const AddProduceGoods = Loadable({
  loader: () => import('components/seller/goods/AddProduceGoods'),
  loading: Loading
});
export const AddInventoryGoods = Loadable({
  loader: () => import('components/seller/goods/AddInventoryGoods'),
  loading: Loading
});
export const AddGoodsClassify = Loadable({
  loader: () => import('components/seller/goods/AddGoodsClassify'),
  loading: Loading
});
export const RecycleGoods = Loadable({
  loader: () => import('components/seller/goods/RecycleGoods'),
  loading: Loading
});
export const GoodsDraftList = Loadable({
  loader: () => import('components/seller/goods/GoodsDraftList'),
  loading: Loading
});
export const Shop = Loadable({
  loader: () => import('components/seller/shop'),
  loading: Loading
});
export const LocSet = Loadable({
  loader: () => import('components/seller/shop/LocSet'),
  loading: Loading
});
export const ShopSet = Loadable({
  loader: () => import('components/seller/shop/ShopSet'),
  loading: Loading
});
export const CouponEditor = Loadable({
  loader: () => import('components/seller/promotion/CouponEditor'),
  loading: Loading
});
export const SalesActivity = Loadable({
  loader: () => import('components/seller/shop/SalesActivity'),
  loading: Loading
});


export const ShopDecoration = Loadable({
  loader: () => import('components/seller/shop/decoration/ShopDecoration'),
  loading: Loading
});

//商家

export const Business = Loadable({
  loader: () => import('components/seller/business'),
  loading: Loading
});
export const Settlement = Loadable({
  loader: () => import('components/seller/business/Settlement'),
  loading: Loading
});
export const Account = Loadable({
  loader: () => import('components/seller/business/Account'),
  loading: Loading
});
export const DistributionEarning = Loadable({
  loader: () => import('components/seller/business/DistributionEarning'),
  loading: Loading
});
export const Invoice = Loadable({
  loader: () => import('components/seller/business/InvoiceIndex'),
  loading: Loading
});
export const InvoiceInfo = Loadable({
  loader: () => import('components/seller/business/InvoiceInfo'),
  loading: Loading
});
export const CashWithdrawal = Loadable({
  loader: () => import('components/seller/business/CashWithdrawal'),
  loading: Loading
});
export const EditInvoiceInfo = Loadable({
  loader: () => import('components/seller/business/EditInvoiceInfo'),
  loading: Loading
});
export const InvoiceSuccess = Loadable({
  loader: () => import('components/seller/business/InvoiceSuccess'),
  loading: Loading
});

// 登录
export const LoginIndex = Loadable({
  loader: () => import('components/seller/login/index.js'),
  loading: Loading
});
export const Login = Loadable({
  loader: () => import('components/seller/login/Login'),
  loading: Loading
});
export const ShopsManage = Loadable({
  loader: () => import('components/seller/login/ShopsManage'),
  loading: Loading
});

// 权限
export const SwitchShop = Loadable({
  loader: () => import('components/seller/shop/SwitchShop'),
  loading: Loading
})
export const VisitorManage = Loadable({
  loader: () => import('components/seller/authority/VisitorManage'),
  loading: Loading
})
export const InviteVisit = Loadable({
  loader: () => import('components/seller/authority/InviteVisit'),
  loading: Loading
})

