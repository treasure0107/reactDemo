/*
* 价格抽查弹窗
* */
import React, {Component} from 'react';
import {Button, Form, Input, Radio, message} from "antd";
import comUtil from 'utils/common.js';
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';

class SpotPricesModalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      printNum: "",
      definedPrintNum: "",
      quotation_attrs: {},
      isShow: 0,
      price: 0,
      totalPrice: 0,
      weight: 0,
      discountVal: 1,
      definedPrintNumber: 0,
      quotation_info: {}
    }
  }


  componentDidMount() {
    let definedPrintNumber = Number(this.props.quotation_info_basic.benchmark_num);
    this.setState({
      quotation_info: this.props.quotation_info_basic,
      definedPrintNumber
    })
  }

  //获取重量
  getWeight(attr_values_list, count) {
    httpRequest.post({
      url: sellerApi.goods.getWeight,
      data: {
        attr_values_list: attr_values_list,
        count: count
      }
    }).then(res => {
      if (res.code == "200") {
        this.setState({
          weight: res.data.weight
        })
      }
    })
  }

  handleOnChangePrintNum(e) {
    let reg = /\D/g;
    let definedPrintNum = e.target.value.replace(reg, "");
    this.setState({
      definedPrintNum,
    })
  }

  handleBlurPrintNum(e) {
    // let definedPrintNumber = e.target.value;
    // this.setState({
    //   definedPrintNumber
    // })
  }

  handleOnChangeGroup(e) {
    let printNum = e.target.value;
    this.setState({
      printNum
    }, () => {
      let discountVal = 1;
      this.props.step_price_new && this.props.step_price_new.map((item, index) => {
        if (Object.keys(item)[0] == printNum) {
          let val = item[Object.keys(item)];
          discountVal = parseFloat(val) / 100
        }
      });
      this.setState({
        discountVal
      })
    });


  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let obj = values;
        let arr = [];
        let attrIdArr = [];
        let numPlus = 0;
        let numMinus = 0;
        let reg = RegExp(/-/);
        let printNum = 100;
        let definedPrintNum = this.state.definedPrintNum;
        let discountVal = this.state.discountVal;
        Object.getOwnPropertyNames(obj).forEach(function (key) {
          // console.log(key.indexOf("print_num"), 'key.indexOf("print_num")');
          if (key.indexOf("attr") == 0) {
            if (obj[key]) {
              let item = obj[key].split(",")[0];
              let attrItem = obj[key].split(",")[1];
              arr.push(item);
              attrIdArr.push(attrItem);
            }
          } else if (key.indexOf("print_num") == 0) {
            printNum = obj[key];
          }
        });

        arr && arr.map((item, index) => {
          if (reg.test(item)) {
            let num = item.substr(1);
            numMinus += Number(num)
          } else {
            numPlus += Number(item)
          }
        });

        let attrNum = Number(numPlus) - Number(numMinus);
        let quotation_info_basic = this.props.quotation_info_basic;
        let benchmark_price = Number(quotation_info_basic.benchmark_price);
        let benchmark_unit_price = Number(quotation_info_basic.benchmark_unit_price);
        let benchmark_num = Number(quotation_info_basic.benchmark_num);
        if (comUtil.isEmpty(values.print_num)) {
          if (comUtil.isEmpty(definedPrintNum)) {
            message.error("没有输入数量");
            printNum = 0;
          } else {
            printNum = definedPrintNum;
            this.props.step_price_new && this.props.step_price_new.map((item, index) => {
              if (parseFloat(Object.keys(item)[0]) <= parseFloat(printNum)) {
                discountVal = parseFloat(item[Object.keys(item)]) / 100;
              }
            });
          }
        }
        let numSum = printNum / benchmark_num;
        let totalPrice = (benchmark_price + attrNum) * numSum * discountVal.toFixed(3);
        let numP = benchmark_num * numSum;
        let price = "";
        if (numP == 0) {
          price = 0.00
        } else {
          price = (totalPrice / numP).toFixed(3);
        }
        this.getWeight(attrIdArr, printNum);
        this.setState({
          isShow: 1,
          totalPrice: totalPrice,
          price: price,
        })
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {labelCol: {span: 4}, wrapperCol: {span: 19},};
    const {isShow, totalPrice, price, definedPrintNumber} = this.state;
    const {benchmark_num, benchmark_price, benchmark_unit_price} = this.props.quotation_info_basic;
    const step_price_new = this.props.step_price_new;
    return (
        <div className="Spot-Modal">
          <div>
            <span className="tit-icon">基准商品属性</span>
            <span>(每种属性单选一个属性值, 作为基准属性)</span>
          </div>
          <div>
            <Form onSubmit={this.handleSubmit.bind(this)} key={1}>
              {this.props.quotation_attrs &&
              this.props.quotation_attrs.map((item, index) => {
                return (
                    <Form.Item label={item.attr.attr_name} className="form-item" {...formItemLayout} key={index}>
                      {getFieldDecorator('attr' + index, {
                            initialValue: item.attr_value[0].price + ',' + item.attr_value[0].attr_value_id
                          }
                      )(
                          <Radio.Group>
                            {item.attr_value && item.attr_value.map((params, i) => {
                              return (
                                  <Radio value={params.price + ',' + params.attr_value_id}
                                         key={i}>{params.attr_value}</Radio>
                              )
                            })}
                          </Radio.Group>
                      )}
                    </Form.Item>
                )
              })
              }
              <Form.Item label="数量" className="form-item" {...formItemLayout} key={3}>
                {getFieldDecorator('print_num', {
                      initialValue: definedPrintNumber
                    }
                )(
                    <Radio.Group onChange={this.handleOnChangeGroup.bind(this)}>
                      <Radio value={Number(benchmark_num)} name={1}>
                        <span> {benchmark_num}{this.props.unit}</span>
                        <span className="ml5">/</span>
                        <span className="ml5">原价</span>
                      </Radio>
                      {step_price_new && step_price_new.map((item, index) => {
                        return (
                            <Radio value={Object.keys(item)[0]} key={index} name={item[Object.keys(item)]}>
                              <span>{Object.keys(item)} {this.props.unit}</span>
                              <span className="ml5">/</span>
                              <span className="ml5">
                                <span className="activeColor">{item[Object.keys(item)] / 100} </span> 折
                              </span>
                            </Radio>
                        )
                      })}
                      <Radio key="1000" name={this.state.definedPrintNum}>
                        <Input value={this.state.definedPrintNum}
                               onChange={this.handleOnChangePrintNum.bind(this)}
                               onBlur={this.handleBlurPrintNum.bind(this)}
                               className="w100 h28"/> <span>{this.props.unit} </span>
                      </Radio>
                    </Radio.Group>
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" className="btn" htmlType="submit">价格抽查</Button>
              </Form.Item>
            </Form>
          </div>
          <div className="mt30">
            <div className="tit-icon tit-m">计算结果</div>
            <div className={isShow == 0 ? "mt15 show" : "mt15 hide"}>
              <span className="tit-icon">报价总额：</span>
              <span className="activeColor">{benchmark_price}</span>
              元
              <span className="ml30">商品单价：</span>
              <span className="activeColor">{benchmark_unit_price}</span>
              <span>元/
                <span>{this.props.unit}</span>
                (参考)</span>
              <div className="mt15">
                <span className="tit-icon fwb">预估重量：</span>
                <span className="fwdc">{this.props.weight}</span>
                <span className="ml5">g</span>
              </div>
            </div>
            <div className={isShow == 1 ? "mt15 show" : "mt15 hide"}>
              <span className="tit-icon fwb">报价总额：</span>
              <span className="activeColor">{totalPrice.toFixed(3)}</span>
              元
              <span className="ml30 fwb">商品单价：</span>
              <span className="activeColor">{price}</span>
              <span>元/
                <span>{this.props.unit}</span>
                (参考)</span>
              <div className="mt15">
                <span className="tit-icon fwb">预估重量：</span>
                <span className="fwdc">{this.state.weight}</span>
                <span className="ml5">g</span>
              </div>
            </div>

          </div>
        </div>
    );
  }
}

const SpotPricesModal = Form.create()(SpotPricesModalForm);
export default SpotPricesModal;
