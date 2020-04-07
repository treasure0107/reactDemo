/*
* 库存类商品属性
* */
import React, {Component} from 'react';
import $ from 'jquery';
import UserDefinedAttrModal from './UserDefinedAttrModal';
import {Form, Tabs, Input, Checkbox, Icon, Button, Select, Row, Col, LocaleProvider, Cascader} from 'antd';

const {Option} = Select;

class InvGoodsAttr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastActive: 1,
            active: 3
        }
    }

    nextStep(active) {
        this.props.activeValue(active);
    }

    lastStep(active) {
        this.props.activeValue(active);
    }

    handleChangeGoodsType(value) {

    }

    closeAttr(val) {

    }

    addAttr() {
        $(".add-attr-select").css("display", "inline-block");
    }

    addAttrItem() {
        $(".add-attr-item").css("display", "inline-block");
    }

    addCustomAttr() {
        $(".UserDefinedAttrItem").css("display", "inline-block");
    }

    render() {
        return (
            <div className="attr-main">
                <div className="goods-tit">
                    <span className="tit-icon activeColor">确定商品属性</span>
                    <span className="ml5">XXXX</span>
                    <span className="fs12">(多选，确定能够进行生产的所有商品；您选择的属性将供买家选择)</span>
                </div>
                <div className="pt20 pb20">
                    <span className="tit-icon">基本属性</span>
                    <span>(错误填写基本属性，可能导致您的产品下架或搜索流量减少，影响产品正常销售，请认真准确填写。标*必填)</span>
                </div>
                <div className="pt10 pb10 bgc">
                    <span className="tit"><span className="asterisk">* </span>商品单位：</span>
                    <Select
                        labelInValue
                        defaultValue={{key: 'jack'}}
                        className="select-item"
                        onChange={this.handleChangeGoodsType.bind(this)}
                    >
                        <Option value="jack">Jack (100)</Option>
                        <Option value="lucy">Lucy (101)</Option>
                    </Select>

                    <span className="tit">
                               <span className="asterisk">* </span>货号：
                           </span>
                    <Input className="input-item" placeholder="请输入货号"/>
                </div>
                <div className="pt10 pb10 border-b">
                    <span className="tit"><span className="asterisk">* </span>属性项属性项：</span>
                    <Select
                        labelInValue
                        defaultValue={{key: 'jack'}}
                        className="select-item"
                        onChange={this.handleChangeGoodsType.bind(this)}
                    >
                        <Option value="jack">Jack (100)</Option>
                        <Option value="lucy">Lucy (101)</Option>
                    </Select>

                    <span className="tit "><span className="asterisk">* </span>属性项2：</span>
                    <Select
                        labelInValue
                        defaultValue={{key: 'jack'}}
                        className="select-item"
                        onChange={this.handleChangeGoodsType.bind(this)}
                    >
                        <Option value="jack">Jack (100)</Option>
                        <Option value="lucy">Lucy (101)</Option>
                    </Select>

                    <span className="tit"><span className="asterisk">* </span>属性项3：</span>
                    <Select
                        labelInValue
                        defaultValue={{key: 'jack'}}
                        className="select-item"
                        onChange={this.handleChangeGoodsType.bind(this)}
                    >
                        <Option value="jack">Jack (100)</Option>
                        <Option value="lucy">Lucy (101)</Option>
                    </Select>
                </div>
                <div>
                    <div className="pt10 pb10 border-b">
                        <span className="tit">属性项1：</span>
                        <Select
                            labelInValue
                            defaultValue={{key: 'jack'}}
                            className="select-item"
                            onChange={this.handleChangeGoodsType.bind(this)}
                        >
                            <Option value="jack">Jack (100)</Option>
                            <Option value="lucy">Lucy (101)</Option>
                        </Select>

                        <span className="tit">属性项2：</span>
                        <Select
                            labelInValue
                            defaultValue={{key: 'jack'}}
                            className="select-item"
                            onChange={this.handleChangeGoodsType.bind(this)}
                        >
                            <Option value="jack">Jack (100)</Option>
                            <Option value="lucy">Lucy (101)</Option>
                        </Select>

                        <span className="tit">属性项3：</span>
                        <Select
                            labelInValue
                            defaultValue={{key: 'jack'}}
                            className="select-item"
                            onChange={this.handleChangeGoodsType.bind(this)}
                        >
                            <Option value="jack">Jack (100)</Option>
                            <Option value="lucy">Lucy (101)</Option>
                        </Select>
                    </div>
                </div>

                <div>
                    <div className="pt20 pb16"><span className="tit-icon">规格属性</span></div>
                    <div className="spec-attr-main mt15">
                        <div className="spec-item">
                            <div className="spec-tit bgc pt19 pb16 pl20">
                                <span className="asterisk">* </span><span>纸张</span>
                            </div>
                            <div className="spec-attr pt19 pb16">
                                <span className="tit">属性值：</span>
                                <span className="attr-box">
                                    300g铜版纸
                                    <Icon type="close-circle" className="close-icon" data-attr_id="111"
                                          onClick={this.closeAttr.bind(this, "attr-id")}/>
                                </span>

                                <span className="attr-box ml16">
                                    300g铜版纸
                                    <Icon type="close-circle" className="close-icon"
                                          onClick={this.closeAttr.bind(this, "attr-id")}/>
                                </span>
                                <Select
                                    labelInValue
                                    defaultValue={{key: 'jack'}}
                                    className="select-item ml16 add-attr-select hide"
                                    onChange={this.handleChangeGoodsType.bind(this)}
                                >
                                    <Option value="jack">添加属性添加属性</Option>
                                    <Option value="lucy">Lucy (101)</Option>
                                </Select>
                                <a href="javascript:void (0);" className="ml16 add-attr"
                                   onClick={this.addAttr.bind(this)}>添加属性值</a>
                                <UserDefinedAttrModal />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bgc-tit mt30 pt10 pb10">
                    <Button type="primary" className="btn ml16" onClick={this.addAttrItem.bind(this)}>添加属性项目</Button>
                    <Button className="btn goods-btn ml16" onClick={this.addCustomAttr.bind(this)}>添加自定义属性项目</Button>
                </div>
                <div className="mt20">
                    <Select
                        labelInValue
                        defaultValue={{key: 'jack'}}
                        className="select-item ml16 add-attr-item hide"
                        onChange={this.handleChangeGoodsType.bind(this)}
                    >
                        <Option value="jack">添加属性添加属性</Option>
                        <Option value="lucy">Lucy (101)</Option>
                    </Select>
                </div>
                <div className="UserDefinedAttrItem hide">
                    <div className="spec-attr-main mt15 ">
                        <div className="spec-item">
                            <div className="spec-tit bgc pt19 pb16 pl20">
                                <Input placeholder="300g铜版纸" className="w120 ml10"/>
                            </div>
                            <div className="spec-attr pt19 pb16">
                                <span className="tit">属性值：</span>
                                <Input placeholder="300g铜版纸" className="w120 ml10"/>

                                <UserDefinedAttrModal />
                                <Button type="primary" className="btn ml20 h28">确定</Button>
                                <Button className="btn ml30 h28">取消</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="btn-box mt60">
                    <Button className="btn" onClick={this.lastStep.bind(this, this.state.lastActive)}>上一步</Button>
                    <Button type="primary" className="btn ml30"
                            onClick={this.nextStep.bind(this, this.state.active)}>下一步</Button>
                </div>
            </div>
        );
    }
}

export default InvGoodsAttr;