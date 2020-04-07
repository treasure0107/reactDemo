import React, { Component,Fragment } from 'react';
import { Tabs, Form, Button, Col, Input, message } from 'antd';
import Title from '../common/Title';
import { withRouter } from 'react-router';
import Handling from 'components/common/Handling';
import httpRequest from 'utils/ajax';
import { sellerApi } from 'utils/api';
import _ from 'lodash';
import moment from 'moment';
import lang from "assets/js/language/config"
import comUtil from 'utils/common.js'

import '../common/style/home.scss'
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const { TabPane } = Tabs;
 import '../common/style/orderList.scss';
const { TextArea } = Input;

class GetOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '1'
        }
    }
    componentDidMount() {
        this.getData();
    }
    getData = () => {
        Handling.start();
        httpRequest.get({
            url: sellerApi.home.purchase_cat,
            data: {
                quoted_id: this.props.match.params.id
            }
        }).then(res => {
            Handling.stop();
            this.setState({
                data: _.get(res, 'data', {}),
            })
        }).catch(() => {
            Handling.stop();
        })
    }

    submitOp = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Handling.start();
                let PurchaseType = _.get(this.state.data, 'buyer.PurchaseType', 1);
                let GoodsQty = _.get(this.state.data, 'buyer.GoodsQty', 0);
                if (PurchaseType == 1) {
                    values.goods_qty = GoodsQty
                } else {
                    values.goods_qty = 0
                }
                 values.total_price = parseFloat(values.total_price)
                httpRequest.post({
                    url: sellerApi.home.purchase_cat,
                    data: {
                        quoted_id: parseFloat(this.props.match.params.id),
                        ...values
                    }
                }).then(res => {
                    Handling.stop();
                    message.success('操作成功');
                    this.props.history.goBack();
                }).catch(() => {
                    Handling.stop();
                })
            }
        });
    }

    download = (url) =>{
        httpRequest.get({
            url: sellerApi.home.home_Download+'?url=' +url
        }).then(res => {

        }).catch(() => {
        })
    }

    render() {
        let { activeKey } = this.state;
        let { getFieldDecorator } = this.props.form;
        let { type } = this.props.match.params;
        let { data } = this.state;
        let GoodsName = _.get(data, 'buyer.GoodsName', lang.common.isNull);
        let GoodsQty = _.get(data, 'buyer.GoodsQty', lang.common.isNull);
        let QuotedEndTime = _.get(data, 'buyer.QuotedEndTime', lang.common.isNull);
        let DeliveryEndTime = _.get(data, 'buyer.DeliveryEndTime', lang.common.isNull);
        let Code = _.get(data, 'buyer.Code', lang.common.isNull);
        let MaterielName = _.get(data, 'buyer.MaterielName', lang.common.isNull);
        let AttrName = _.get(data, 'buyer.AttrName', lang.common.isNull);
        let GoodsPicture = _.get(data, 'buyer.GoodsPicture', lang.common.isNull);
        let PurchaseSn = _.get(data, 'buyer.PurchaseSn', lang.common.isNull);
        let City = _.get(data, 'buyer.City', lang.common.isNull);
        let BuyerName = _.get(data, 'buyer.BuyerName', lang.common.isNull);
        let Documents = _.get(data, 'buyer.Documents', []);
        let PurchaseList = _.get(data, 'buyer.PurchaseList', []);
        let PurchaseListDesc = _.get(data, 'buyer.PurchaseListDesc', '');
        let Price = _.get(data, 'seller.TotalPrice', lang.common.isNull);
        let Remark = _.get(data, 'seller.Remark', lang.common.isNull);
        let Include = _.get(data, 'buyer.Include', lang.common.isNull);
        let Invoice = _.get(data, 'buyer.Invoice', lang.common.isNull);
        let PurchaseType = _.get(this.state.data, 'buyer.PurchaseType', 1);
        let special_note = _.get(this.state.data, 'buyer.SpecialNote', lang.common.isNull);
         let PurchaseList = 1
        return (
            <div className='home-set-page'>
                <Title title={'报价抢单'} back={true} url={type == 1?'/seller/home/offer/1':'/seller/home/offer/2'}/>
                <div className='offer-Info-box'>
                    <Form className="offer-sub-form" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                        <div className='title-content-box'>
                            <div className='title-content'>
                                <div className='line'></div>
                                <div className='content'>基本信息</div>
                                <div className='clear'></div>
                            </div>
                            <div>
                                <div className='offer-info'>
                                    <div className='offer-info-content' style={{width:'80%'}}>
                                        <div className='info-title'>采购编号：</div>
                                        <div className='info-content' style={{width:300}}>{PurchaseSn}</div>
                                    </div>
                                </div>
                                <div className='offer-info'>
                                    <div className='offer-info-content'>
                                        <div className='info-title'>采购城市：</div>
                                        <div className='info-content'>{City}</div>
                                    </div>
                                    <div className='offer-info-content'>
                                        <div className='info-title'>采购人：</div>
                                        <div className='info-content'>{BuyerName}</div>
                                    </div>
                                    <div className='offer-info-content'>
                                        <div className='info-title'>报价截止：</div>
                                        <div className='info-content'>{moment.unix(QuotedEndTime).format(dateFormat)}</div>
                                    </div>
                                </div>
                                <div className='offer-info'>
                                    <div className='offer-info-content'>
                                        <div className='info-title'>采购商品：</div>
                                        <div className='info-content'>{GoodsName}</div>
                                    </div>
                                    <div className='offer-info-content'>
                                        <div className='info-title'>总数量：</div>
                                        <div className='info-content'>{GoodsQty}</div>
                                    </div>
                                    <div className='offer-info-content'>
                                        <div className='info-title'>交货日期：</div>
                                        <div className='info-content'>{moment.unix(DeliveryEndTime).format(dateFormat)}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='clear'></div>
                        </div>
                        <div className='title-content-box'>
                            <div className='title-content'>
                                <div className='line'></div>
                                <div className='content'>详情描述</div>
                                <div className='clear'></div>
                            </div>
                            <div className='offer-dec'>
                                {
                                    PurchaseType == 1 ? <Fragment>
                                        <div className='offer-dec-content'>
                                            <div className='dec-title'>物料编码：</div>
                                            <div className='dec-content'>{Code}</div>
                                        </div>
                                        <div className='offer-dec-content'>
                                            <div className='dec-title'>物料名称：</div>
                                            <div className='dec-content'>{MaterielName}</div>
                                        </div>
                                        <div className='offer-dec-content'>
                                            <div className='dec-title'>规格要求：</div>
                                            <div className='dec-content'>
                                                {
                                                    (Array.isArray(AttrName) ? AttrName.map((item, index) => {
                                                        return <span>{item}</span>
                                                    }) : null)
                                                }
                                            </div>
                                        </div>
                                    </Fragment> :
                                        <div className='offer-dec-content'>
                                            <div className='dec-title'>采购清单：</div>
                                            <div className='dec-content'>
                                              {
                                                PurchaseListDesc&&
                                                <p>{PurchaseListDesc}</p>
                                              }
                                                {
                                                    (Array.isArray(PurchaseList) ? PurchaseList.map((item, index) => {
                                                        return <div className='file-box' style={{cursor:'pointer'}} onClick={() => {
                                                            window.location.href = sellerApi.home.home_Download + '?url=' + item.url
                                                        }} key={index}>{item.imgName}</div>
                                                    }) : null)
                                                }
                                            </div>
                                        </div>
                                }

                                <div className='offer-dec-content'>
                                    <div className='dec-title'>成品图片：</div>
                                    <div className='dec-content'>
                                        {
                                            Array.isArray(GoodsPicture)&&GoodsPicture.length>0? GoodsPicture.map((item, index) => {
                                                return <img className='pic' src={item.url} key={index} onClick={()=>{
                                                    window.open(item.url)
                                                }}/>
                                            }):<span>暂无</span>
                                        }

                                    </div>
                                </div>
                                <div className='offer-dec-content'>
                                    <div className='dec-title'>文件：</div>
                                    <div className='dec-content'>
                                        <div className='file-list'>
                                        {
                                            Array.isArray(Documents) && Documents.map((item, index) => {
                                                return <div className='file-box' onClick={()=>{
                                                    window.location.href= sellerApi.home.home_Download + '?url=' +item.url
                                                    this.download(item.url)
                                                }} key={index}>{item.imgName}</div>
                                            })
                                        }
                                            {/* <div>R-200带箭托彩盒文件.pdf</div>
                                            <div>采购清单.EXL</div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className='offer-dec-content'>
                                    <div className='dec-title'>特别说明：</div>
                                    <div className='dec-content'>
                                        <span className='explain-text'>{special_note}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='clear'></div>
                        </div>
                        <div className='title-content-box from-title'>
                            <div className='title-content left'>
                                <div className='line'></div>
                                <div className='content'>报价</div>
                                <div className='clear'></div>
                            </div>
                            {
                                type == 1?<Form.Item className='left'>
                                {getFieldDecorator('total_price', {
                                     initialValue: start_price,
                                    rules: [
                                        {
                                            required: true,
                                            validator: (rule, value, callback) => {
                                                comUtil.moneyLimit(rule, value, callback, {
                                                    max: 99999999, min: 0, content: '只能输入1-99999999之间数字保留2位小数。', firstContent: '抢单报价必填。'
                                                })
                                            }
                                        },
                                    ],
                                })(<Input placeholder="" style={{ width: 100 }} />)}
                            </Form.Item>:<span className='price-unit'>￥{
                                isNaN(parseFloat(Price))?'':parseFloat(Price).toFixed(2)
                            }</span>
                            }
                            <span className='introduce'><span className='unit'>元 (说明： { <span className='baoprice'>
                                <span>
                            {Invoice == 1 ? '含增值税普通发票' : Invoice == 2 ? '含增值税专用发票' : '不开发票'}、</span>
                            {
                                Include ?
                                  <Fragment>
                                    <span>{Include.includes(1) ? '含运费' : '不含运费'}、</span>
                                    <span>{Include.includes(2) ? '含打样' : '不含打样'}</span>
                                    <span>{Include.includes(3) ? '、月结' : ''}</span>
                                  </Fragment>
                                  : <Fragment>
                                    <span>不含运费</span>
                                    <span>不含打样</span>
                                  </Fragment>
                              }
                            </span>
                            })</span></span>
                            <div className='clear'></div>
                        </div>
                        <div className='title-content-box from-title'>
                            <div className='title-content left'>
                                <div className='line'></div>
                                <div className='content'>备注</div>
                                <div className='clear'></div>
                            </div>
                            {
                                type == 1?<Form.Item className='left'>
                                {getFieldDecorator('remark', {
                                     initialValue: start_price,
                                    rules: [
                                        {
                                            required: true,
                                            max: 50,
                                            message: '备注区限50字以内。'
                                             validator: (rule, value, callback) => {
                                                 comUtil.moneyLimit(rule, value, callback)
                                             }
                                        },
                                    ],
                                })(<TextArea autosize={{ minRows: 2, maxRows: 2 }} placeholder="" style={{ width: 594 }} />)}
                            </Form.Item>:<div className='type-remark'>
                                {
                                    Remark
                                }
                            </div>
                            }
                            <span className='introduce'></span>
                            <div className='clear'></div>
                        </div>
                        {
                            type == 1? <Button type={'primary'} className='sub-btn' onClick={() => {
                                this.submitOp();
                            }}>
                                报价抢单
                            </Button>:null
                        }

                    </Form>
                </div>
            </div>
        )
    }
}

export default withRouter(Form.create()(GetOffer));
