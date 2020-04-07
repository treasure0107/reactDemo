import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import PropTypes from 'prop-types';
class RepeatButton extends Component {

    static propTypes = {
        otherType: PropTypes.string,
        onClick:PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            // titleContent:'订单 - - 订单列表',
            // SearchData:'',
            // activeKey:'1'
        }
    }
    isRepeat = true
    RepeatClick = ()=> {
        if (this.isRepeat) {
            this.isRepeat = false;
            setTimeout(() => {
                this.isRepeat = true;
            }, 200)
        } else {
            return;
        }
        this.props.onClick();
    }// activeKey

    render() {
        if (!this.props.otherType) {
            return (
                <Button {...this.props} onClick={this.RepeatClick.bind(this)}>
                   {this.props.children}
                </Button>
            )
        } else {
            return (
                React.createElement(
                    this.props.otherType,
                    { className: _.get(this.props,'className',''),style:_.get(this.props,'style',''),onClick:this.RepeatClick},
                    this.props.children,
                )
            )
        }
    }
}
// RepeatButton.PropTypes = {
//     type: PropTypes.string,
//     onClick:PropTypes.func
// };

export default RepeatButton;