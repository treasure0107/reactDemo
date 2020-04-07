

import { Icon } from "antd";
import React, { Fragment } from "react";
import { CityData } from "assets/js/city";
import './style/city-orientation.scss'
import { func } from "prop-types";

class CityGroup extends React.Component {
  static defaultProps = {
    tagLev: 1,
    unitedLevel: 2,
    provinceList: CityData,
  }
  constructor(props) {
    super(props);
    this.state = {
      tagLev: this.props.tagLev || 1, //表示当前联级1:省，2市.3区
      proObj: this.props.proObj, //{id,value,label}
      cityObj: this.props.cityObj,
      areaObj: this.props.areaObj,
      provinceList: this.props.provinceList || CityData,
      cityList: null,
      areaList: null
    };
  }
  componentWillMount () {

    this.initCity();

  }
  shouldComponentUpdate (nextProps, nextState) {
    // let uL = this.props.unitedLevel;
    // let pd = nextState.proObj.label != this.state.proObj.label && nextState.cityObj.label != this.state.cityObj.label;
    // uL == 3 && (pd = pd && nextState.areaObj.label != this.state.areaObj.label);

    // if (pd) {
    //   return false;
    // }
    return true;
  }
  componentWillReceiveProps (prev) {

    if (prev.proObj.label != this.state.proObj.label || prev.cityObj.label != this.state.cityObj.label) {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      this.setState({
        proObj: prev.proObj,
        cityObj: prev.cityObj,
        areaObj: prev.areaObj
      }, function () {
        this.initCity();
      })
    } else {
      this.setState({
        proObj: prev.proObj,
        cityObj: prev.cityObj,
        areaObj: prev.areaObj
      })
    }

  }

  //初始化
  initCity () {
    let _cityList = this.state.provinceList.find(item => item.label == this.props.proObj.label)["children"];
    let _areaList = _cityList.find(item => item.label == this.props.cityObj.label);
    let arr = (typeof _areaList === "undefined") ? _cityList[0]["children"] : _areaList["children"];
    this.setState({
      cityList: _cityList,
      areaList: arr
    })


  }

  //选择省
  choisePro (item, event) {
    event.preventDefault();
    const { id, value, label, children } = item;
     let childrens=children;
    if(this.props.unitedLevel==2){
      childrens=this.togetherData(item, this);
    }
    this.setState({
      proObj: Object.assign({}, this.state.proObj, { id, value, label }),
      cityObj: { label: "选择市" },
      areaObj: { label: "选择区/县" },
      cityList: childrens,
      areaList: null,
      tagLev: 2
    })
  }
  //选择市
  choiseCity (item, event) {
    event.preventDefault();
    const { id, value, label, children } = item;


    if (this.props.unitedLevel == 2) {
      this.setState({
        cityObj: Object.assign({}, this.state.cityObj, { id, value, label })
      }, () => {
        this.cityCall({
          proObj: this.state.proObj,
          cityObj: this.state.cityObj
        })
      })
      return;
    }

    this.setState({
      cityObj: Object.assign({}, this.state.cityObj, { id, value, label }),
      areaObj: { label: "选择区/县" },
      areaList: children,
      tagLev: 3
    })
  }
  //选择区
  choiseArea (item, event) {
    event.preventDefault();
    const { id, value, label } = item;
    this.setState({
      areaObj: Object.assign({}, this.state.areaObj, { id, value, label }),
    }, function () {
      this.cityCall({
        proObj: this.state.proObj,
        cityObj: this.state.cityObj,
        areaObj: this.state.areaObj
      })
    });

  }

  //数据回传
  cityCall (item) {
    console.log(item, "qqqqqqqq")
    this.props.cityCall(item);
  }
  //切换选项
  tabMenu (val, event) {
    event.preventDefault();
    this.setState({
      tagLev: val
    })
  }
  togetherData (item, obj) {
    let cityList = item.children;
    if (item.label == "北京市") {
      cityList = [{
        id: "35",
        label: "北京市",
        value: "110000"
      }]
    } else if (item.label == "上海市") {
      cityList = [{
        id: "1",
        label: "上海市",
        value: "310000"
      }]
    } else if (item.label == "天津市") {
      cityList = [{
        id: "2",
        label: "天津市",
        value: "120000"
      }]
    } else if (item.label == "重庆市") {
      cityList = [{
        id: "3",
        label: "重庆市",
        value: "500000"
      }]
    }
    return cityList;
  }

  render () {
    const { tagLev, proObj, cityObj, areaObj, provinceList, cityList, areaList } = this.state;
    const { isShowCityUi } = this.props;
    const unitedLevel = this.props.unitedLevel;
    return (
      <Fragment>
        <div className={`ui-city-group ${!isShowCityUi ? "none" : ""}`}>
          <a name="item_none_dizhi_guanbi" className="ui-city-close" onClick={() => { this.cityCall("") }} href="javascript:void(0)"><Icon type="close" /></a>
          <div className="ui-city-group-content">
            <ul className="nav-tabs clearfix">
              <li name="item_none_dizhi_02" id="provinceShow" className={`active ${tagLev == 1 ? "current" : ""}`} onClick={this.tabMenu.bind(this, 1)} >
                <p><a href="javascript:void(0)">{proObj.label}</a></p>
              </li>
              <li name="item_none_dizhi_03" id="citybShow" className={`active ${tagLev == 2 ? "current" : ""}`} onClick={this.tabMenu.bind(this, 2)}>
                <p><a href="javascript:void(0)">{cityObj.label}</a>
                </p>
              </li>
              {
                unitedLevel == 3 &&
                <li id="areaShow" className={`active ${tagLev == 3 ? "current" : ""}`} onClick={this.tabMenu.bind(this, 3)}>
                  <p><a href="javascript:void(0)">{areaObj.label}</a>
                  </p>
                </li>
              }

            </ul>
            <div className="tab-content">
              <ul className={`tab-panel pr-panel ${tagLev == 1 ? "active" : ""}`}>
                <li>
                  {provinceList && provinceList.map((item, index) => {
                    return (
                      <span key={index} onClick={this.choisePro.bind(this, item)}>
                        <a name="item_none_dizhi_sheng" href="###" className={item.label == proObj.label ? "on" : ""}>{item.label}</a>
                      </span>
                    )
                  })}
                </li>
              </ul>
              <ul className={`tab-panel pr-panel ${tagLev == 2 ? "active" : ""}`}>
                <li>
                  {cityList && cityList.map((item, index) => {
                    return (
                      <span key={index} onClick={this.choiseCity.bind(this, item)}>
                        <a name="item_none_dizhi_sheng" href="###" className={item.label == cityObj.label ? "on" : ""}>{item.label}</a>
                      </span>
                    )
                  })}
                </li>
              </ul>

              {
                unitedLevel == 3 &&
                <ul className={`tab-panel pr-panel ${tagLev == 3 ? "active" : ""}`}>
                  <li>
                    {areaList && areaList.map((item, index) => {
                      return (
                        <span key={index} onClick={this.choiseArea.bind(this, item)}>
                          <a name="item_none_dizhi_sheng" href=":void(0)" className={item.label == areaObj.label ? "on" : ""}>{item.label}</a>
                        </span>
                      )
                    })}
                  </li>
                </ul>
              }


            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}





export default CityGroup;


