import React from 'react';
import {Button,Alert,Table  } from 'antd';
import { withRouter } from "react-router";
import lang from "assets/js/language/config"

const columns = [
    {
      title: '订单号',
      dataIndex: 'name',
      render: text => <a href="javascript:;">{text}</a>,
    },
    {
      title: '订单状态',
      dataIndex: 'age',
    },
    {
      title: '您可进行的操作',
      dataIndex: 'address',
    },
    {
        title: '操作',
        dataIndex: 'opreation',
    },
  ];
  const data = [
    {
      key: '1',
      name: '2019060317430967996',
      age: 32,
      address: 'New York No. 1 Lake Park',
      opreation:'查看'
    },
    {
      key: '2',
      name: '2019060317430967997',
      age: 42,
      address: 'London No. 1 Lake Park',
      opreation:'查看'
    },
    {
      key: '3',
      name: '2019060317430967999',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      opreation:'查看'
    },
    {
      key: '4',
      name: '2019060317430967992',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
      opreation:'查看'
    },
  ];
//   const rowSelection = {
//     onChange: (selectedRowKeys, selectedRows) => {
//       console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//     },
//     // getCheckboxProps: record => ({
//     //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
//     //   name: record.name,
//     // }),
//   };
  
class OperationList extends React.Component {
    constructor(props){
        super(props);
    }


    render() {
        return (
            <div>
                <div style={{textAlign:"right",marginBottom:20}}>
                    <Button
                        icon="left"
                        onClick={()=>{
                            this.props.history.push('/seller/orders/OrderList')
                        }}
                    >
                        订单列表
                    </Button>
                </div>
                <Alert message={`以下订单无法被${this.props.type}`} type="error" style={{marginBottom:20}}/>
                <Table columns={columns} dataSource={data} pagination={false} locale={{emptyText:lang.common.tableNoData}}/>,
            </div>
        );
    }
}

export default withRouter(OperationList);


