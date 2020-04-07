import React, { Component } from 'react';
import { Modal, Timeline, Form, Select, Input, Button } from 'antd';
import './style/tabslist.scss';
import { Link } from 'react-router-dom';
/**
 * tabs切换的列表组件
 * tablist 传进来的数据 label为显示的 value 为传给后台的 number 未读数量
 * tabsvalue 当前选中的
 */
class TabsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tablist: props.tablist,
             tabsvalue:this.props.curval||0,
        }
    }
    tabsclick(val) {
         console.log('服务类订单')
         this.setState({
             tabsvalue: val
         });
        this.props.tabsChange(val);
        setTimeout(() => {
             console.log(this.props.serviceOrder)
        }, 200)
    }
    render() {
        const { tablist, curval } = this.props;
        return (
            <ul id="Tabswitch" className="tabs tabslist">
                {tablist.length > 0 ? tablist.map((i, index) => {
                    return (
                        <li key={i.value} className={`tabLi serviceorderLi ${curval == i.value || !curval && index == 0 ? 'active' : ''} ${i.textright ? '' : ''}`} data-item={i.value} onClick={this.tabsclick.bind(this, i.value)}>
                            <a>{i.label}<span className="allOrders"> {i.number > 0 ? i.number : null}</span></a>
                        </li>
                    )
                }) : null}
            </ul>
        )
    }
}
export default TabsList;
