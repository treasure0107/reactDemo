

import React from "react";
import Provinces from "./ProvinceCityArea"
import {Link} from 'react-router-dom'
import "./style/goods-params.scss"

/**
 * 展示商品规格参数的组件
 * isShowCitySelect 选择地址的
 */
class GoodsParams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowCitySelect: false,
        };
    }

    render () {

        return (
            <div className="goodsparams">
                <ul>
                    <li>
                        <div className="name">
                            配送
                        </div>
                        <div className="text">
                            <span>深圳市</span>
                            <i>至</i>
                            <Provinces change={this.props.changeProvinces} isHide={""} defaultInfo={["440000", "440300", "440305"]} ></Provinces>
                            <span className="available">{this.props.available ? '有货' : '无货'}，</span>
                            {this.props.postage ? (
                                <span className="postage">[ 快递：¥{this.props.postage}] <i>仅供参考，详细运费请咨询客服</i></span>
                            ) : null}
                        </div>
                    </li>
                    {this.props.server ? (
                        <li>
                            <div className="name">
                                服务
                        </div>
                            <div className="text">
                                <Link to={this.props.server.url}>{this.props.server.name}</Link>
                                <span>发货并提供售后服务。</span>
                            </div>
                        </li>
                    ) : null}
                    {this.props.integral ? (
                        <li>
                            <div className="name">可用积分</div>
                            <div className="text">
                                可用 <span>{this.props.integral}</span>
                            </div>
                        </li>
                    ) : null}
                    <li>
                        <div className="name">承诺</div>
                        <div className="text">
                            {this.props.promise ? this.props.promise.map((i, index) => {
                                return <span key={index}>{i.name}</span>
                            }):null}
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}

 const CityOrientation = (props) => {

 }

export default GoodsParams;


