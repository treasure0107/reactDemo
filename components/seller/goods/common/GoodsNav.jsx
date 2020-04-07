import React, {Component} from 'react';
import {Icon} from 'antd';

class GoodsNav extends Component {
    constructor(props){
        super(props);
        this.state={
            activeIndex:0
        }
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className="nav clearfix">
                <div className="nav-item activeColor">
                    <div className="nav-icon fl">
                        <p>
                            <i className="iconfont icondianneifenleicebianlandaohang fs25"></i>
                        </p>
                        <p className="mt10"><span>选择商品分类</span></p>
                    </div>
                    <div className="arrow-r fl">
                        <Icon type="right"/>
                    </div>
                </div>

                <div className={"nav-item ml60 "+(this.props.activeIndex >0?"activeColor":"")} >
                    <div className="nav-icon fl">
                        <p>
                            <i className="iconfont iconeditor fs25"></i>
                        </p>

                        <p className="mt10"><span>填写商品信息</span></p>
                    </div>
                    <div className="arrow-r fl">
                        <Icon type="right"/>
                    </div>
                </div>
                <div className={"nav-item ml60 "+(this.props.activeIndex >1?"activeColor":"")}>
                    <div className="nav-icon fl">
                        <p>
                            <i className="iconfont iconquedingshangpinshuxing fs25"></i>
                        </p>

                        <p className="mt10"><span>确定商品属性与价格 </span></p>
                    </div>
                    <div className="arrow-r fl">
                        <Icon type="right"/>
                    </div>
                </div>
                <div className={"nav-item ml60 "+(this.props.activeIndex >4?"activeColor":"")}>
                    <div className="nav-icon fl">
                        <p>
                            <i className="iconfont iconguanlianshangpin fs25"></i>
                        </p>
                        <p className="mt10"><span>推荐商品，发布成功 </span></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default GoodsNav;