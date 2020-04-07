
import React, { Component } from 'react';
import { Tabs, Icon,Button,Checkbox  } from 'antd';


class DeliverList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedList: [],
            checkAll: false,
        };
        this.onCheckAllChange = this.onCheckAllChange.bind(this);
        this.onChange = this.onChange.bind(this);
        // this.jumpToOperationPage = this.jumpToOperationPage.bind(this);
    }
    componentDidMount(){
        let checkTypeList = [];
        for(let i=0;i<this.props.data.length;i++){
            checkTypeList.push(false);
        } 
        this.setState({
            checkedList:checkTypeList
        });
    }
    componentWillReceiveProps(nextprops){
        if(this.props.data != nextprops.data){
            let checkTypeList = [];
            for(let i=0;i<this.props.data.length;i++){
                checkTypeList.push(false);
            }
            this.setState({
                checkedList:checkTypeList
            });
        }
    }
    onChange(e,index) {
        const {checkedList} = this.state;
        checkedList[index] = !checkedList[index];
        let newArray = checkedList.filter((item,index)=>{
            return item == true;
        });
        this.setState({
            checkedList:checkedList,
            checkAll:newArray.length == this.props.data.length
        })
    };

    onCheckAllChange(e) {
        this.setState({
            checkedList: e.target.checked ? this.state.checkedList.map((item,index)=>{
                return true
            }) : this.state.checkedList.map((item,index)=>{
                return false
            }),
            checkAll: e.target.checked,
        });
    };
    render() {
        const {checkedList} = this.state;
        let isChecked = (checkedList.filter((item,index)=>{
            return item == true;
        }).length == 0);
        return (
            <div>
                <table className='ecsc-default-table order'>
                    <thead>
                        <tr>
                            <th width="20%">
                                <div className="first_all">
                                    <Checkbox
                                        // indeterminate={this.state.indeterminate}
                                       // disabled={this.props.data.length == 0}
                                        onChange={this.onCheckAllChange}
                                        checked={this.state.checkAll}
                                    >
                                        发货单流水号
                                    </Checkbox>
                                </div>
                            </th>
                            <th width="14%"><a href="javascript:listTable.sort('order_sn', 'DESC'); " title="点击对列表排序">订单号</a></th>
                            <th width="10%"><a href="javascript:listTable.sort('consignee', 'DESC'); ">收货人</a></th>
                            <th width="8%"><a href="javascript:listTable.sort('add_time', 'DESC'); " title="点击对列表排序">下单时间</a></th>
                            <th width="8%"><a href="javascript:listTable.sort('update_time', 'DESC'); " title="点击对列表排序">发货时间</a><img src="images/sort_desc.gif" /></th>
                            <th width="10%">供货商</th>
                            <th width="10%">状态</th>
                            <th width="10%">操作人</th>
                            <th width="10%">操作</th>
                        </tr>
                    </thead>
                    {
                        this.props.data.map((item, index) => {
                            return <tbody  key={new Date().getTime() + index}>
                                <tr><td colSpan="20" className="sep-row"></td></tr>
                                <tr className="sep_bor">
                                    <td className="bdl">
                                        <div className="first_all">
                                        <Checkbox checked={checkedList[index]} onChange={(e) => {
                                            this.onChange(e, index);
                                        }}>
                                            {item.serialNumber}
                                        </Checkbox></div>
                                    </td>
                                    <td className="bdl" rowSpan="1">
                                        {item.orderNumber}                                
                                    </td>
                                    <td><a href="mailto:"> {item.receiver}</a></td>
                                    <td>{item.subTime}</td>
                                    <td>{item.deliverTime}</td>
                                    <td>{item.supplier}</td>
                                    <td>{item.status}</td>
                                    <td>{item.Operator}</td>
                                    <td className="ecsc-table-handle">
                                        <span><a href="order.php?act=delivery_info&amp;delivery_id=31" className="btn-orange"><Icon type="eye" /><p>查看</p></a></span>
                                        <span className="mr0"><a href="order.php?act=operate&amp;remove_invoice=1&amp;delivery_id=31" className="btn-red"><Icon type="delete" /><p>删除</p></a></span>
                                    </td>
                                </tr>
                            </tbody>
                        })
                    }
                </table>
                <Button type="primary" disabled={isChecked}>移除</Button>
                <Button type="primary" disabled={isChecked}>批量发货</Button>
            </div>
        )
    }
}

export default DeliverList;