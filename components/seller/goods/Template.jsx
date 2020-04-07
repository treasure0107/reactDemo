import React from 'react';
import {Form, Row, Col, Input, Button, Icon, DatePicker, Table, Cascader, Radio, Modal, message} from 'antd';
import moment from 'moment';
import {CityData} from "assets/js/city";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import Title from '../common/Title';
import AreaTemplate from './common/AreaTemplate';
import '../common/style/deliverGoods.scss';
import {withRouter} from "react-router";
import RepeatButton from 'components/common/RepeatButton'
import _ from 'lodash';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api'
import comUtil from 'utils/common.js'
import lang from "assets/js/language/config"
import {object} from 'prop-types';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

let InputWidth = 130;
let smallInput = 75;

class Template extends React.Component {
  constructor(props) {
    super(props)
    let {getFieldDecorator} = props.form;
    this.state = {
      expand: false,
      titleContent: _.get(this.props, 'match.params.deliveryId', '') ? '修改运费模板' : '新建运费模板',
      visible: false,
      visibleConfirm: false,
      radioData: 1,
      listData: [],
      isCreate: true,
      isKg: false,
      add_item: 1,
      first_item: 1,
      add_item_kg: '1.0',
      first_item_kg: '1.0',
      a: 9,
      KgColumns: [
        {
          title: '可配送地区',
          dataIndex: 'area_name',
          key: 'area_name',
          render: (text, record, index) => {
            return <div className='region-box'>
              <div>
                {text == '全选' || text == '9_全选' ? '中国 （除指定地区外，其余地区的运费采用“默认运费”）' :
                  text.indexOf('_') == -1 ? text : text.split(',').map((item, index) => {
                    let itemData = comUtil.getLocaData(item)[1];
                    if (!itemData) {
                      itemData = text
                    }
                    if (index == text.split(',').length - 1) {
                      return itemData
                    } else {
                      return itemData + ','
                    }
                  })
                }
              </div>
              <div><span onClick={() => {
                this.showModal(record.area_name_relationship, index)
              }}>修改</span><span onClick={() => {
                comUtil.confirmModal({
                  okText: '确定',
                  cancelText: '取消',
                  className: 'seller-confirm-modal',
                  content: `您确定要删除该配送地区么？`,
                   title:'',
                  onOk: () => {
                    this.delDataSource(index)
                  }
                })
              }}>删除</span></div>
            </div>
          }
        },
         {
             title: 'Action',
             key: 'action',
             render: () => <a href="javascript:;">Delete</a>,
           },
        {
          title: '首重（Kg）',
          dataIndex: 'age',
          key: 'age',
          render: (text, record, index) => {
            return <Form.Item className='table-form'>
              {getFieldDecorator(`item_goods_kg_${index}`, {
                 initialValue: parseFloat(record.first_item).toFixed(1),
                initialValue: isNaN(parseFloat(record.first_item).toFixed(1)) ? '' : parseFloat(record.first_item).toFixed(1),
                rules: [{
                  required: true, validator: (rule, value, callback) => {
                    this.testWeight(rule, value, callback, '首重')
                  }
                }],
              })(
                <Input style={{width: smallInput}} onChange={(e) => {
                  this.state.KgDataSource[index].first_item = e.target.value;
                  this.setState({
                    KgDataSource: this.state.KgDataSource
                  })
                }}/>
              )}
            </Form.Item>
          }
        },
        {
          name: '运费',
          title: '运费（元）',
          dataIndex: 'address',
          key: 'address',
          render: (text, record, index) => {
            return <Form.Item className='table-form'>
              {getFieldDecorator(`cost_goods_kg_${index}`, {
                initialValue: record.ship_cost,
                rules: [{
                  required: true, validator: (rule, value, callback) => {
                    this.testShip_cost(rule, value, callback, '运费')
                  }
                }],
              })(
                <Input style={{width: smallInput}} onChange={(e) => {
                  this.state.KgDataSource[index].ship_cost = e.target.value;
                  this.setState({
                    KgDataSource: this.state.KgDataSource
                  })
                }}/>
              )}
            </Form.Item>
          }
        },
        {
          name: '续重',
          title: '续重（Kg）',
          dataIndex: 'count',
          key: 'count',
          render: (text, record, index) => {
            return <Form.Item className='table-form'>
              {getFieldDecorator(`item_goods_add_kg_${index}`, {
                 initialValue: parseFloat(record.add_item).toFixed(1),
                initialValue: isNaN(parseFloat(record.add_item).toFixed(1)) ? '' : parseFloat(record.add_item).toFixed(1),
                rules: [{
                  required: true, validator: (rule, value, callback) => {
                    this.testWeight(rule, value, callback, '续重')
                  }
                }],
              })(
                <Input style={{width: smallInput}} onChange={(e) => {
                  this.state.KgDataSource[index].add_item = e.target.value;
                  this.setState({
                    KgDataSource: this.state.KgDataSource
                  })
                }}/>
              )}
            </Form.Item>
          }
        },
        {
          name: '续费',
          title: '续费（元）',
          dataIndex: 'money',
          key: 'money',
          render: (text, record, index) => {
            return <Form.Item className='table-form'>
              {getFieldDecorator(`item_pay_money_kg_${index}`, {
                initialValue: record.cost_per_item,
                rules: [{
                  required: true, validator: (rule, value, callback) => {
                    this.testCost_per_item(rule, value, callback, '续费')
                  }
                }],
              })(
                <Input style={{width: smallInput}} onChange={(e) => {
                  this.state.KgDataSource[index].cost_per_item = e.target.value;
                  this.setState({
                    KgDataSource: this.state.KgDataSource
                  })
                }}/>
              )}
            </Form.Item>
          }
        }
      ],
      columns: [
        {
          title: '可配送地区',
          dataIndex: 'area_name',
          key: 'area_name',
          render: (text, record, index) => {
            return <div className='region-box'>
              <div>{text == '全选' || text == '9_全选' ? '中国 （除指定地区外，其余地区的运费采用“默认运费”）' :
                text.indexOf('_') == -1 ? text : text.split(',').map((item, index) => {
                  let itemData = comUtil.getLocaData(item)[1];
                  if (!itemData) {
                    itemData = text
                  }
                  if (index == text.split(',').length - 1) {
                    return itemData
                  } else {
                    return itemData + ','
                  }
                })}</div>
              <div><span onClick={() => {
                this.showModal(record.area_name_relationship, index)
              }}>修改</span><span onClick={() => {
                comUtil.confirmModal({
                  okText: '确定',
                  cancelText: '取消',
                  className: 'seller-confirm-modal',
                  content: `您确定要删除该配送地区么？`,
                   title:'',
                  onOk: () => {
                    this.delDataSource(index)
                  }
                })
              }}>删除</span></div>
            </div>
          }
        },
         {
             title: 'Action',
             key: 'action',
             render: () => <a href="javascript:;">Delete</a>,
           },
        {
          title: '首件（件）',
          dataIndex: 'age',
          key: 'age',
          render: (text, record, index) => {
            return <Form.Item className='table-form'>
              {getFieldDecorator(`item_goods${index}`, {
                 initialValue: record.first_item?parseInt(record.first_item):'',
                initialValue: isNaN(parseInt(record.first_item)) ? '' : parseInt(record.first_item),
                rules: [{
                  required: true, validator: (rule, value, callback) => {
                    this.testFirst_item(rule, value, callback, '首件')
                  }
                }],
              })(
                <Input style={{width: smallInput}} onChange={(e) => {
                  this.state.dataSource[index].first_item = e.target.value;
                  this.setState({
                    dataSource: this.state.dataSource
                  })
                }}/>
              )}
            </Form.Item>
          }
        },
        {
          name: '运费',
          title: '运费（元）',
          dataIndex: 'address',
          key: 'address',
          render: (text, record, index) => {
            return <Form.Item className='table-form'>
              {getFieldDecorator(`cost_goods${index}`, {
                initialValue: record.ship_cost,
                rules: [{
                  required: true, validator: (rule, value, callback) => {
                    this.testShip_cost(rule, value, callback, '运费')
                  }
                }],
              })(
                <Input style={{width: smallInput}} onChange={(e) => {
                  this.state.dataSource[index].ship_cost = e.target.value;
                  this.setState({
                    dataSource: this.state.dataSource
                  })
                }}/>
              )}
            </Form.Item>
          }
        },
        {
          name: '续件',
          title: '续件（件）',
          dataIndex: 'count',
          key: 'count',
          render: (text, record, index) => {
            return <Form.Item className='table-form'>
              {getFieldDecorator(`item_goods_add${index}y`, {
                 initialValue: record.add_item?parseInt(record.add_item):'',
                initialValue: isNaN(parseInt(record.add_item)) ? '' : parseInt(record.add_item),
                rules: [{
                  required: true, validator: (rule, value, callback) => {
                    this.testAdd_item(rule, value, callback, '续件')
                  }
                }],
              })(
                <Input style={{width: smallInput}} onChange={(e) => {
                  this.state.dataSource[index].add_item = e.target.value;
                  this.setState({
                    dataSource: this.state.dataSource
                  })
                }}/>
              )}
            </Form.Item>
          }
        },
        {
          name: '续费',
          title: '续费（元）',
          dataIndex: 'money',
          key: 'money',
          render: (text, record, index) => {
            return <Form.Item className='table-form'>
              {getFieldDecorator(`item_pay_money${index}`, {
                initialValue: record.cost_per_item,
                rules: [{
                  required: true, validator: (rule, value, callback) => {
                    this.testCost_per_item(rule, value, callback, '续费')
                  }
                }],
              })(
                <Input style={{width: smallInput}} onChange={(e) => {
                  this.state.dataSource[index].cost_per_item = e.target.value;
                  this.setState({
                    dataSource: this.state.dataSource
                  })
                }}/>
              )}
            </Form.Item>
          }
        }
      ],
      dataSource: [], KgDataSource: [], noCheckList: [], checkList: []
    }
  }

  componentDidMount() {
    let {deliveryId} = this.props.match.params;
    let {setFieldsValue} = this.props.form;
    if (deliveryId) {
      httpRequest.get({
        url: sellerApi.delivery.getDelivery,
        data: {
           shop_id:localStorage.getItem('shopId'),
          template_id: deliveryId
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data[0];
          if (data.billing_method == 0) {
            setFieldsValue({
               add_item:data.add_item,
               cost_per_item:data.cost_per_item,
              template_name: data.template_name,
              locDetail: comUtil.getLocaData([data.delivery_province, data.delivery_city, data.delivery_area])[0],
              billing_method: data.billing_method,
               ship_cost:data.ship_cost,
               first_item:data.first_item
            })
            for (let i = 0; i < data.region.length; i++) {
              data.region[i].key = i;
            }
            this.setState({
              dataSource: data.region,
              isKg: false,
              add_item: data.add_item,
              ship_cost: data.ship_cost,
              first_item: data.first_item,
              cost_per_item: data.cost_per_item,
            })
          } else {
            setFieldsValue({
               add_item:data.add_item_kg,
               cost_per_item:data.cost_per_item_kg,
              template_name: data.template_name,
              locDetail: comUtil.getLocaData([data.delivery_province, data.delivery_city, data.delivery_area])[0],
                locDetail:[data.delivery_province.toString(),data.delivery_city.toString(),data.delivery_area.toString()],
              billing_method: data.billing_method,
               ship_cost:data.ship_cost_kg,
               first_item:data.first_item_kg
            });
            for (let i = 0; i < data.region.length; i++) {
              data.region[i].key = i;
            }
            this.setState({
              KgDataSource: data.region,
              isKg: true,
              add_item_kg: data.add_item,
              ship_cost_kg: data.ship_cost,
              first_item_kg: data.first_item,
              cost_per_item_kg: data.cost_per_item,
            })
          }
        }
      }).catch(error => {
      })
    }
  }

  handleSearch(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
    });
  };

  showModal = (listData, index) => {
    let {isKg, KgDataSource, dataSource} = this.state;

    let list = [];
    let checkList = [];
    if (isKg) {
      for (let i = 0; i < KgDataSource.length; i++) {
        if (i != index) {
          for (let j = 0; j < JSON.parse(KgDataSource[i].area_name_relationship).length; j++) {
            list.push(JSON.parse(KgDataSource[i].area_name_relationship)[j].value)
          }
        } else {
          for (let j = 0; j < JSON.parse(KgDataSource[i].area_name_relationship).length; j++) {
            checkList.push(JSON.parse(KgDataSource[i].area_name_relationship)[j].value)
          }
        }
      }
    } else {
      for (let i = 0; i < dataSource.length; i++) {
        if (i != index) {
          for (let j = 0; j < JSON.parse(dataSource[i].area_name_relationship).length; j++) {
            list.push(JSON.parse(dataSource[i].area_name_relationship)[j].value)
          }
        } else {
          for (let j = 0; j < JSON.parse(dataSource[i].area_name_relationship).length; j++) {
            checkList.push(JSON.parse(dataSource[i].area_name_relationship)[j].value)
          }
        }
      }
    }
     if(isKg){
         for(let i=0;i<KgDataSource.length;i++){
             if(i != index){
                 for(let j=0;j<KgDataSource[i].area_name.split(',').length;j++){
                     list.push(KgDataSource[i].area_name.split(',')[j])
                 }
             }else{
                 for(let j=0;j<KgDataSource[i].area_name.split(',').length;j++){
                     checkList.push(KgDataSource[i].area_name.split(',')[j])
                 }
             }
         }
     }else{
         for(let i=0;i<dataSource.length;i++){
             if(i != index){
                 for(let j=0;j<dataSource[i].area_name.split(',').length;j++){
                     list.push(dataSource[i].area_name.split(',')[j])
                 }
             }else{
                 for(let j=0;j<dataSource[i].area_name.split(',').length;j++){
                     checkList.push(dataSource[i].area_name.split(',')[j])
                 }
             }
         }
     }

    let _this = this;
    document.onclick = function () {
      _this.areaTemplate && _this.areaTemplate.showModalType()
    }
    this.Repeat = true;
    this.setState({
      listData: listData,
      visible: true,
      isCreate: index != undefined ? false : true,
      ChangeIndex: index,
      noCheckList: list,
      checkList: checkList
    });
  };
  handleConfirmOk = () => {
    this.setState({
      visibleConfirm: false,
      isKg: !this.state.isKg
    })
  }

  showConfirmModal = (e) => {
    this.setState({
      visibleConfirm: true,
      radioData: e.target.value
    })
  }

  handleConfirmCancel = () => {
    if (this.state.radioData == 0) {
      this.props.form.setFieldsValue({billing_method: 1})
      this.setState({
        radioData: 1
      })
    } else {
      this.props.form.setFieldsValue({billing_method: 0})

      this.setState({
        radioData: 0
      })
    }
    this.setState({
      visibleConfirm: false
    })
  }

  Repeat = true;
   添加
  handleOk = (data, calback) => {
    let {dataSource, isCreate, ChangeIndex, isKg, KgDataSource} = this.state;
    let {getFieldsValue} = this.props.form;
    if (this.Repeat) {
      this.Repeat = false
    } else {
      setTimeout(() => {
        this.Repeat = true
      }, 150)
      return;
    }
    calback();
    let list = '';

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (list == '') {
          list = data[i].value + '_' + data[i].label;
        } else {
          list = list + ',' + data[i].value + '_' + data[i].label;
        }
      }
      add_item
      cost_per_item
      first_item
      ship_cost

      if (isKg) {
        if (isCreate) {
          KgDataSource.push({
            area_name_relationship: JSON.stringify(data),
            area_name: list,
            add_item: getFieldsValue().add_item_kg,
            cost_per_item: getFieldsValue().cost_per_item_kg,
            first_item: getFieldsValue().first_item_kg,
            ship_cost: getFieldsValue().ship_cost_kg,
            key: KgDataSource.length > 0 ? (parseInt(KgDataSource[KgDataSource.length - 1].key) + 1).toString() : 1
          })
        } else {
          KgDataSource[ChangeIndex].area_name_relationship = JSON.stringify(data);
          KgDataSource[ChangeIndex].area_name = list;

          KgDataSource[ChangeIndex].add_item = getFieldsValue().add_item_kg;
          KgDataSource[ChangeIndex].cost_per_item = getFieldsValue().cost_per_item_kg;
          KgDataSource[ChangeIndex].first_item = getFieldsValue().first_item_kg;
          KgDataSource[ChangeIndex].ship_cost = getFieldsValue().ship_cost_kg;
        }
      } else {
        if (isCreate) {
          dataSource.push({
            add_item: getFieldsValue().add_item,
            cost_per_item: getFieldsValue().cost_per_item,
            first_item: getFieldsValue().first_item,
            ship_cost: getFieldsValue().ship_cost,
            area_name_relationship: JSON.stringify(data),
            area_name: list,
            key: dataSource.length > 0 ? (parseInt(dataSource[dataSource.length - 1].key) + 1).toString() : 1
          })
        } else {
          dataSource[ChangeIndex].area_name_relationship = JSON.stringify(data);
          dataSource[ChangeIndex].area_name = list;

          dataSource[ChangeIndex].add_item = getFieldsValue().add_item;
          dataSource[ChangeIndex].cost_per_item = getFieldsValue().cost_per_item;
          dataSource[ChangeIndex].first_item = getFieldsValue().first_item;
          dataSource[ChangeIndex].ship_cost = getFieldsValue().ship_cost;

        }
      }
    }

    this.setState({
      visible: false,
      cityList: data,
    });

  };
   删除
  delDataSource = (index) => {
    let {dataSource, isKg, KgDataSource} = this.state;
    if (isKg) {
      KgDataSource.splice(index, 1);
      for (let i = 0; i < KgDataSource.length; i++) {
        let obj = {};
        obj['item_goods_kg_' + i] = KgDataSource[i].add_item;
        obj['cost_goods_kg_' + i] = KgDataSource[i].cost_per_item;
        obj['item_goods_add_kg_' + i] = KgDataSource[i].first_item;
        obj['item_pay_money_kg_' + i] = KgDataSource[i].ship_cost;
        this.props.form.setFieldsValue(obj);
      }
      this.setState({
        KgDataSource: KgDataSource
      })
    } else {
      dataSource.splice(index, 1);
      for (let i = 0; i < dataSource.length; i++) {
        let obj = {};
        obj['item_goods' + i] = parseInt(dataSource[i].add_item);
        obj['cost_goods' + i] = dataSource[i].cost_per_item;
        obj['item_goods_add' + i] = parseInt(dataSource[i].first_item);
        obj['item_pay_money' + i] = dataSource[i].ship_cost;
        this.props.form.setFieldsValue(obj);
      }
      this.setState({
        dataSource: dataSource
      })
    }
  }

  submitBtn = (values) => {
    let {deliveryId} = this.props.match.params;

    if (values.region && values.region.length == 1 && (values.region[0].area_name.indexOf('全选') != -1)) {
      values.region[0].area_name = '中国 （除指定地区外，其余地区的运费采用“默认运费”）';
    }
    if (deliveryId) {
       编辑
      httpRequest.put({
        url: sellerApi.delivery.editorDelivery,
        data: {
           shop_id: parseInt(localStorage.getItem('shopId')),
          template_id: parseInt(deliveryId),
          ...values
        }
      }).then(res => {
        if (res.code == 200) {
          message.success('修改运费模板成功');
          if (this.props.goodsItem == 1) {
            this.props.onValue(1);
          } else {
            this.props.history.goBack();
          }

        }
      }).catch(error => {
      })
    } else {
       新增
      httpRequest.post({
        url: sellerApi.goods.createDelivery,
        data: {
           shop_id: parseInt(localStorage.getItem('shopId')),
          ...values
        }
      }).then(res => {
        if (res.code == 200) {
          message.success('新增运费模板成功');
          if (this.props.goodsItem == 1) {
            this.props.onValue(1);
          } else {
            this.props.history.goBack();
          }
        }
      }).catch(error => {
      });
    }
  }

  handleCancel = e => {
     销毁document事件
    document.onclick = null;
    this.setState({
      visible: false,
    });
  };
   0.1 - 999.99
  testShip_cost = (rule, value, callback, content) => {
    var reg = /^\d+(\.\d{0,2})?$/;
    if (reg.test(value) && value >= 0 && value < 1000) {
      callback();
    } else if (!value) {
      callback(`${content}必填`);
    } else {
      callback(`请输入0.00~999.99的数字`);
    }
  };


  testFirst_item = (rule, value, callback, content) => {
    var reg = /^([1-9]\d{0,3}|9999)$/;
    if (reg.test(value)) {
      callback();
    } else if (!value) {
      callback(`${content}必填`);
    } else {
      callback(`请输入1~9999的整数`);
    }
  };


   0.1 - 999.99
  testCost_per_item = (rule, value, callback, content) => {
    var reg = /^\d+(\.\d{0,2})?$/;
    if (reg.test(value) && value >= 0 && value < 1000) {
      callback();
    } else if (!value) {
      callback(`${content}必填`);
    } else {
      callback(`请输入0.00~999.99的数字`);
    }
  };
  testWeight = (rule, value, callback, content) => {
    var reg = /^\d+(\.\d{0,1})?$/;
    ;
    if (reg.test(value) && value >= 0.1 && value < 9999.9) {
      callback();
    } else if (!value) {
      callback(`${content}必填`);
    } else {
      callback(`请输入0.1~9999.9的数字`);
    }
  };

  testAdd_item = (rule, value, callback, content) => {
    var reg = /^([1-9]\d{0,3}|9999)$/;
    if (reg.test(value)) {
      callback();
    } else if (!value) {
      callback(`${content}必填`);
    } else {
      callback(`请输入1~9999的整数`);
    }
  };
  keysList = [];
  outputKeys = () => {
    let keys = Math.floor(Math.random() * (10000 - 0)) + 0;
    if (this.keysList.indexOf() == -1) {
      this.keysList.shift(keys);
      return keys;
    } else {
      this.outputKeys();
    }
  }
  locObj = {}

  render() {
    let {visibleConfirm, listData, visible, isKg, KgColumns, columns, KgDataSource, dataSource, cost_per_item, noCheckList, checkList} = this.state;
    const {getFieldDecorator, getFieldsValue, setFieldsValue} = this.props.form;
    let pageSize = 3;
    return (
      <div>
        <Title title={this.state.titleContent}/>
        <div className='right-content-page template-page'>
          <Form className="order-search-form" onSubmit={this.handleSearch} labelCol={{span: 5}} wrapperCol={{span: 18}}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label={'模板名称'}>
                  {getFieldDecorator('template_name', {
                    rules: [{required: true, message: '模板名称最多支持50个字，请重新输入', whitespace: true, max: 50}],
                  })(<Input placeholder=""/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="发货地区">
                  {getFieldDecorator('locDetail', {
                    rules: [{required: true, message: '发货地区必填'}],
                  })(
                    <Cascader displayRender={(e, b) => {
                      if (b[1]) {
                        this.locObj.city = b[1].value + '_' + b[1].label
                      }
                      if (b[0]) {
                        this.locObj.province = b[0].value + '_' + b[0].label
                      }
                      if (b[2]) {
                        this.locObj.district = b[2].value + '_' + b[2].label
                      }
                      return e
                    }} options={CityData} placeholder={'请选择'}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="计费方式">
                  {getFieldDecorator('billing_method', {
                    initialValue: 0,
                    rules: [{required: true, message: '原因不能为空'}],
                  })(
                    <Radio.Group onChange={this.showConfirmModal}>
                      <Radio value={0}>按件数</Radio>
                      <Radio value={1}>按重量</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="配送地区">
                  <div className='introduce'>除指定地区外，其余地区的运费采用"默认运费"</div>
                  <div className='district-detail'>
                    {
                      isKg ? <div className='deliver-price'>
                        默认运费
                        {/* <Input style={{ width: 72 }} defaultValue={1}/> */}
                        <Form.Item>
                          {getFieldDecorator('first_item_kg', {
                            initialValue: isNaN(parseFloat(this.state.first_item_kg)) ? '' : parseFloat(this.state.first_item_kg).toFixed(1),
                             this.state.first_item_kg?parseFloat(this.state.first_item_kg).toFixed(1):'',
                            rules: [{
                              required: true, validator: (rule, value, callback) => {
                                this.testWeight(rule, value, callback, '首重',)
                              }
                            }],
                          })(
                            <Input style={{width: InputWidth}} onChange={(e) => {
                              this.setState({
                                first_item_kg: e.target.value
                              })
                            }}/>
                          )}
                        </Form.Item>

                        Kg内
                        <Form.Item> {getFieldDecorator('ship_cost_kg', {
                          initialValue: this.state.ship_cost_kg,
                          rules: [{
                            required: true, validator: (rule, value, callback) => {
                              this.testShip_cost(rule, value, callback, '运费')
                            }
                          }],
                        })(
                          <Input style={{width: InputWidth}} onChange={(e) => {
                            this.setState({
                              ship_cost_kg: e.target.value
                            })
                          }}/>
                        )}</Form.Item>

                        元，
                        每增加
                        <Form.Item> {getFieldDecorator('add_item_kg', {
                          initialValue: isNaN(parseFloat(this.state.add_item_kg)) ? '' : parseFloat(this.state.add_item_kg).toFixed(1),
                           initialValue: this.state.add_item_kg?parseFloat(this.state.add_item_kg).toFixed(1):'',
                          rules: [{
                            required: true, validator: (rule, value, callback) => {
                              this.testWeight(rule, value, callback, '续重')
                            }
                          }],
                        })(
                          <Input style={{width: InputWidth}} onChange={(e) => {
                            this.setState({
                              add_item_kg: e.target.value
                            })
                          }}/>
                        )}</Form.Item>
                        Kg,增加运费
                        <Form.Item>
                          {getFieldDecorator('cost_per_item_kg', {
                            initialValue: this.state.cost_per_item_kg,
                            rules: [{
                              required: true, validator: (rule, value, callback) => {
                                this.testCost_per_item(rule, value, callback, '续费')
                              }
                            }],
                          })(
                            <Input style={{width: InputWidth}} onChange={(e) => {
                              this.setState({
                                cost_per_item_kg: e.target.value
                              })
                            }}/>
                          )}
                        </Form.Item>

                        元
                      </div> : <div className='deliver-price'>
                        默认运费
                        <Form.Item>
                          {getFieldDecorator('first_item', {
                            initialValue: isNaN(parseInt(this.state.first_item)) ? '' : parseInt(this.state.first_item),
                             initialValue: this.state.first_item?parseInt(this.state.first_item):'',
                            rules: [{
                              required: true, validator: (rule, value, callback) => {
                                this.testFirst_item(rule, value, callback, '首件')
                              }
                            }],
                          })(
                            <Input style={{width: InputWidth}} onChange={(e) => {
                              this.setState({
                                first_item: e.target.value
                              })
                            }}/>
                          )}
                        </Form.Item>

                        件内
                        <Form.Item> {getFieldDecorator('ship_cost', {
                          initialValue: this.state.ship_cost,
                          rules: [{
                            required: true, validator: (rule, value, callback) => {
                              this.testShip_cost(rule, value, callback, '运费')
                            }
                          }],
                        })(
                          <Input style={{width: InputWidth}} onChange={(e) => {
                            this.setState({
                              ship_cost: e.target.value
                            })
                          }}/>
                        )}</Form.Item>

                        元，
                        每增加
                        <Form.Item> {getFieldDecorator('add_item', {
                           initialValue: this.state.add_item?parseInt(this.state.add_item):'',
                          initialValue: isNaN(parseInt(this.state.add_item)) ? '' : parseInt(this.state.add_item),
                          rules: [{
                            required: true, validator: (rule, value, callback) => {
                              this.testAdd_item(rule, value, callback, '续件')
                            }
                          }],
                        })(
                          <Input style={{width: InputWidth}} onChange={(e) => {
                            this.setState({
                              add_item: e.target.value
                            })
                          }}/>
                        )}</Form.Item>
                        件,增加运费
                        <Form.Item>
                          {getFieldDecorator('cost_per_item', {
                            initialValue: this.state.cost_per_item,
                            rules: [{
                              required: true, validator: (rule, value, callback) => {
                                this.testCost_per_item(rule, value, callback, '续费')
                              }
                            }],
                          })(
                            <Input style={{width: InputWidth}} onChange={(e) => {
                              this.setState({
                                cost_per_item: e.target.value
                              })
                            }}/>
                          )}
                        </Form.Item>

                        元
                      </div>
                    }
                    {
                      isKg ? <Table dataSource={KgDataSource} columns={KgColumns}
                                    locale={{emptyText: lang.common.tableNoData}}
                                    pagination={false
                                       {
                                           pageSize: pageSize,
                                      //     total: 25,
                                      //     size: 'small',
                                      //     showTotal: (total, page) => {
                                      //         return `共${Math.ceil(total / pageSize)}页，每页${pageSize}条`
                                      //     }
                                      // }
                                    }
                        /> :
                        <Table dataSource={dataSource} columns={columns}
                               locale={{emptyText: lang.common.tableNoData}}
                               pagination={false
                                 // {
                                 //     pageSize: pageSize,
                                 //     total: 25,
                                 //     size: 'small',
                                 //     showTotal: (total, page) => {
                                 //         return `共${Math.ceil(total / pageSize)}页，每页${pageSize}条`
                                 //     }
                                 // }
                               }
                        />
                    }
                    {/* <Table dataSource={isKg?JSON.parse(JSON.stringify(KgDataSource)):JSON.parse(JSON.stringify(dataSource))} columns={isKg?KgColumns:columns}
                                            pagination={false
                                                // {
                                                //     pageSize: pageSize,
                                                //     total: 25,
                                                //     size: 'small',
                                                //     showTotal: (total, page) => {
                                                //         return `共${Math.ceil(total / pageSize)}页，每页${pageSize}条`
                                                //     }
                                                // }
                                            }
                                        /> */}
                    <div>
                      <Button style={{width: 200}} type="primary" className='no-bg-btn' onClick={() => {
                        this.showModal([])
                      }}>
                        指定可配送地区和运费
                      </Button>
                    </div>
                    <div style={{width: 200}} className='btn-box'>
                      <RepeatButton type="primary" onClick={() => {
                        this.props.form.validateFields((err, values) => {
                          // values.delivery_province = values.locDetail[0];
                          // values.delivery_city = values.locDetail[1];
                          // values.delivery_erea = values.locDetail[2];
                          if (!err) {
                            if (isKg) {
                              let KgDataSourceData = JSON.parse(JSON.stringify(KgDataSource));
                              for (let i = 0; i < KgDataSourceData.length; i++) {
                                delete KgDataSourceData[i].key
                              }
                              values.region = KgDataSourceData;
                              values.add_item = values.add_item_kg;
                              values.cost_per_item = values.cost_per_item_kg;
                              values.first_item = values.first_item_kg;
                              values.ship_cost = values.ship_cost_kg;
                              delete values.ship_cost_kg;
                              delete values.first_item_kg;
                              delete values.cost_per_item_kg;
                              delete values.add_item_kg;
                            } else {
                              let dataSourceData = JSON.parse(JSON.stringify(dataSource));
                              for (let i = 0; i < dataSourceData.length; i++) {
                                delete dataSourceData[i].key
                              }
                              values.region = dataSourceData
                            }
                            let keys = Object.keys(values);
                            for (let i = 0; i < keys.length; i++) {

                              if (keys[i].indexOf('item_goods') != -1 && keys[i] != 'item_goods' ||
                                keys[i].indexOf('cost_goods') != -1 && keys[i] != 'cost_goods' ||
                                keys[i].indexOf('item_goods_add') != -1 && keys[i] != 'item_goods_add' ||
                                keys[i].indexOf('item_pay_money') != -1 && keys[i] != 'item_pay_money') {
                                delete values[keys[i]]
                              }
                            }
                            values.delivery_province = this.locObj.province;
                            values.delivery_city = this.locObj.city;
                            values.delivery_area = this.locObj.district;
                            // values.delivery_province = parseInt(values.locDetail[0]);
                            // values.delivery_city = parseInt(values.locDetail[1]);
                            // values.delivery_area = parseInt(values.locDetail[2]);
                            delete values.locDetail;
                            // return;
                            this.submitBtn(values);
                          }
                        });
                        // let FieldsValue = getFieldsValue();
                      }}>
                        提交
                      </RepeatButton>
                      <Button className='grey-btn' style={{marginLeft: 12, background: '#fff'}} onClick={() => {
                        console.log("this.props.goodsItem", this.props.goodsItem);
                        if (this.props.goodsItem == 1) {
                          this.props.onValue(0);
                          // this.props.onFreightTemplateModalValue = 1
                        } else {
                          this.props.history.goBack()
                        }

                      }}>
                        返回
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              </Col>
            </Row>

          </Form>
        </div>
        <Modal
          className='admin-modal-confirm'
          title="确认切换"
          visible={visibleConfirm}
          onOk={this.handleConfirmOk}
          onCancel={this.handleConfirmCancel}
          cancelText='取消'
          okText='确定'
        >
          <div className='content-box'>切换计费方式后，当前所设置的配送地区信息将被清空，确认继续吗？</div>
        </Modal>
        <Modal
          title="选择配送地区"
          className='area-template-model'
          visible={visible}
          // visible={true}
          //  onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='提交'
          cancelText='取消'
          width='800px'
          footer={null}
        >
          {
            visible ?
              <AreaTemplate onOk={this.handleOk} noCheckList={noCheckList} checkList={checkList}
                            onCancel={this.handleCancel} listData={listData}
                            ref={areaTemplate => this.areaTemplate = areaTemplate}/>
              : null
          }
        </Modal>
      </div>
    );
  }
}

export default withRouter(Form.create()(Template));

