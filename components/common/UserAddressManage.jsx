import React, { Component, Fragment } from 'react';
import { Modal, Form, Select, Input, Button, Icon, Cascader, message, Checkbox } from 'antd';
import { CityData } from "assets/js/city";
import httpRequest from 'utils/ajax.js';
import api from "utils/api";
import './style/useraddressfrom.scss'
import { func } from 'prop-types';

// 新增收货地址弹窗组件
class UserAddressFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isshow: '',
      provincelist: [],
      addormodif: true,
      id: '',
      checked: false,
      isDefault: null,
      display: "none"
    }
  }

  componentDidMount() {
    let PleaseSelect = document.getElementsByClassName("PleaseSelect")[0].childNodes[0];
    // 是否设为默认地址
    setTimeout(() => {
      let isdefault = this.props.parms.is_default;
      if (isdefault == 0) {
        this.setState({
          isDefault: false
        })
      }
      if (isdefault == 1) {
        this.setState({
          isDefault: true
        })
      }
      if (this.props.parms.length !== 0) {
        let pickerVal = document.getElementsByClassName("PleaseSelect")[0].childNodes[0];
        let province_id = this.props.parms.province_id.split("_")[1]
        let city_id = this.props.parms.city_id.split("_")[1]
        let area_id = this.props.parms.area_id.split("_")[1]
        pickerVal.innerHTML = province_id + " / " + city_id + " / " + area_id
        return
      }
      else {
        let pickerVal = document.getElementsByClassName("PleaseSelect")[0].childNodes[0];
        pickerVal.innerHTML = "请选择省/市/区"
        return
      }
    }, 500)
  }

  // 获取省市区
  onChange(value, label) {
    if (value.length == 0) {
      this.setState({
        display: 'block'
      })
      return
    } else {
      let antcascaderinput = document.getElementsByClassName("ant-cascader-input")[0];
      antcascaderinput.style.borderColor = "#f25138"
      this.setState({
        display: 'none'
      })
    }
    var label = label;
    var provincelist = [];
    Object.keys(label).forEach(function (key) {
      provincelist.push(label[key].label);
    });
    this.setState({
      provincelist: provincelist
    }, () => {
    })
  }

  // 我的收货地址
  confirmToAdd(isAdd) {
    this.props.form.validateFields((err, values) => {
      let addressinformation = values.areaCn;
      let antcascaderinput = document.getElementsByClassName("ant-cascader-input")[0];
      if (addressinformation.length == 0) {
        antcascaderinput.style.borderColor = "#ff9500"
        this.setState({
          display: 'block'
        })
        return
      }
      let IsdefaultVal;
      let Isdefault = values.isdefault;
      let moren = values.moren || 0;
      if (moren == true) {
        moren = 1
      } else {
        moren = 0
      }
      if (Isdefault) {
        IsdefaultVal = 1
        this.setState({
          checked: true
        })
      } else {
        IsdefaultVal = 0
        this.setState({
          checked: false
        })
      }
      const areaCn = values.areaCn
      const area = values.area
      const areaCnprovice = areaCn[0]
      const areaCncity = areaCn[1]
      const areaCnarea = areaCn[2]
      const params = {
        consignee: values.name, //收货人
        mobile: values.phone,   //手机号
        province_id: area[0] + '_' + areaCnprovice, //省
        city_id: area[1] + '_' + areaCncity, //市
        area_id: area[2] + '_' + areaCnarea, //区
        address: values.address, //详细地址
        is_default: moren, //是否设为默认地址
      }
      if (!err) {
        if (isAdd) {
          httpRequest.put({
            url: api.address.addaddress,
            data: params
          }).then((res) => {
            this.addressSucc(res)
          })
        } else {
          var adders_id = this.props.parms.id
          httpRequest.post({
            url: api.address.deleteaddress + adders_id,
            data: params
          }).then((res) => {
            this.addressSucc(res)
          })
        }
      }
    })
  }

  // 新增或者修改成功后的操作
  addressSucc(res) {
    if (res.code == 200) {
      message.success(res.msg, () => {
        this.props.Adduseraddress(res.data);
      });
      this.Cancel();
    }
  }

  // 子组件给父组件传值
  Cancel(text) {
    this.props.clickCancel(text)
  }

  promange(e) {
    this.setState({ value: event.target.value });
  }

  // 新建地址时候是否设为默认地址
  whetherisdefault(e) {
    this.setState({
      isDefault: e.target.checked,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select disabled={true} showArrow={false} style={{ width: 70 }}>
        <Option value="86">+86</Option>
      </Select>,
    );
    return (
      <div className="form addmaage">
        <Form layout={'inline'}>
          <Form.Item label="地址信息">
            {getFieldDecorator('area', {
              // initialValue: [''],
              initialValue: this.state.provincelist.length == 0 && this.props.parms ? [this.props.parms.province_id.split('_')[0], this.props.parms.city_id.split('_')[0], this.props.parms.area_id.split('_')[0]] : this.state.provincelist,
              rules: [{ required: true, message: '请输入地址信息', }],
            })(
              <Cascader className="PleaseSelect" style={{ borderColor: "#ff9500" }} onChange={this.onChange.bind(this)} options={CityData} placeholder={'请选择省/市/区'} />
            )
            }
            {/* <div style={{ display: this.state.display, color: "#ff9500" }} className="ant-form-explain">请输入地址信息</div> */}
          </Form.Item>
          <Form.Item label="详细地址">
            {getFieldDecorator('address', {
              initialValue: this.props.parms ? this.props.parms.address : '',
              rules: [
                {
                  required: true,
                  message: '请输入详细地址', whitespace: true
                }
              ],
            })(
              <Input placeholder="如道路、门牌号、单元等" name={"address"} />
            )}
          </Form.Item>
          <Form.Item label="收货人姓名">
            {getFieldDecorator('name', {
              initialValue: this.props.parms ? this.props.parms.consignee : '',
              rules: [
                { required: true, message: '请输入名称', whitespace: true }
              ],
            })(
              <Input placeholder="长度字符不超过25个" maxLength={25} name={"name"} />
            )}
          </Form.Item>

          <Form.Item label="手机号码">
            {getFieldDecorator('phone', {
              initialValue: this.props.parms ? this.props.parms.mobile : '',
              rules: [
                {
                  required: true,
                  message: '请输入手机号码',
                }, {
                  pattern: /^(\d{11})$/,
                  message: '手机号码有误'
                }
              ],
            })(
              <Input addonBefore={prefixSelector} placeholder="手机号/电话号码" name={"phone"} />
            )}
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('isdefault', {

              })(
                <Checkbox checked={this.state.isDefault ? true : false} className="isdefault_box" onChange={this.whetherisdefault.bind(this)}>设置为默认收货地址</Checkbox>
              )
            }
          </Form.Item>
          <Form.Item className="manage-none">
            {
              getFieldDecorator('moren', {
                initialValue: this.state.isDefault,
                rules: [],
              })(
                <Input type="hidden" />
              )
            }
          </Form.Item>
          <Form.Item className="manage-none">
            {getFieldDecorator('areaCn', {
              initialValue: this.state.provincelist.length == 0 && this.props.parms ? [this.props.parms.province_id.split('_')[1], this.props.parms.city_id.split('_')[1], this.props.parms.area_id.split('_')[1]] : this.state.provincelist,
              rules: [],
            })(
              <Input type="hidden" />
            )}
          </Form.Item>
          <Form.Item className="manage-left">
            <div className="btnmanage">
              <Button className="call-btn" onClick={this.Cancel.bind(this, false)}>取消</Button>
              {
                this.props.xiugai ? <Button className="define-1" type="primary" onClick={() => this.confirmToAdd(false)}>确定</Button>
                  : <Button className="define-2" type="primary" onClick={() => this.confirmToAdd(true)}>确定</Button>
              }
            </div>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
const UserAddressFrom2 = Form.create({ name: 'addaddress' })(UserAddressFrom);


class UserAddressManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modificationlist: ''
    }
  }

  submit() {
    if (this.props.submit) {
      this.props.submit();
    }
  }

  handleOk(e) {

  }

  handleCancel() {
    this.props.changeShowState()

  }
  // 父组件收到子组件传过来的值
  changeResspop(data) {
    this.props.changeShowState()
  }
  Adduseraddress = (res) => {
    this.props.Adduseraddress(res)
  }
  render() {
    const { title, isShowAdd } = this.props
    return (
      <Modal
        wrapClassName='isModal'
        width={480}
        footer={null}
        title={title}
        destroyOnClose
        visible={isShowAdd}
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
        centered={true}  //垂直居中展示弹出层
      >
        <UserAddressFrom2
          parms={this.props.parms}
          xiugai={this.props.xiugai}
          clickCancel={this.changeResspop.bind(this)}
          Adduseraddress={(res) => { this.Adduseraddress(res) }}
          submit={this.submit.bind(this)}>
        </UserAddressFrom2>
      </Modal>
    )
  }
}

export default UserAddressManage;
