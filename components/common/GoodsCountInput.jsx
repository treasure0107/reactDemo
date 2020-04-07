import { InputNumber } from 'antd';

import React, { Component } from 'react';

import { connect } from 'react-redux';
import './style/goodscountInput.scss'



/**
 * 商品数量
 * numberVal 默认数量
 */
class GoodsCountInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numberVal: ""
        }
    }
    onChange (value) {
        this.setState({
            numberVal: value
        });
        // this.props.numberInputBack(value);
        // console.log('changed', this.props);
        this.props.setGoodsBuyNumber({
            type:1,
            key:'goodsBuyNumber',
            payload:value,
        });
        // this.props.setGoodsBuyNumber({
        //     type: 'setGoodsBuyNumber',
        //     payload: value,

        // })
    }

   
    render () {
        return (
            <div className="goodscount">
                <div className="name">数量</div>
                <div className="text">
                    <InputNumber min={1} max={this.props.stock} defaultValue={this.props.defaultNumber} onChange={this.onChange.bind(this)} />
                    <span>库存 {this.props.stock} 个</span>
                </div>
            </div>
        )
    }
}



//export  default GoodsCountInput;


// mapStateToProps可以不传，如果不传，组件不会监听store的变化，也就是说Store的更新不会引起UI的更新
function mapStateToProps (state) {
    return {
        goodsBuyNumber: state.reducers.goodsBuyNumber
    }
}
// mapDispatchToProps
// mapDispatchToProps用于建立组件跟store.dispatch的映射关系,可以是一个object，也可以传入函数
// 如果mapDispatchToProps是一个函数，它可以传入dispatch,ownProps, 定义UI组件如何发出action，实际上就是要调用dispatch这个方法
function mapDispatchToProps (dispatch) {
    return {
        setGoodsBuyNumber:(state)=>dispatch(state)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GoodsCountInput)
