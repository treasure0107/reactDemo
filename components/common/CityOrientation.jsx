

import { Icon } from "antd";
import React, { Fragment } from "react";

import $ from "jquery"


import { CityData as CityData2 } from "assets/js/city";
import './style/city-orientation.scss'
let defaultCityName = localStorage.getItem("defaultCityName");
let defaultProviceName = localStorage.getItem("defaultProviceName");
let defaultCityData = localStorage.getItem("defaultCityData");
console.log(CityData2);
let AMap = window.AMap;
AMap.plugin(['AMap.CitySearch']);
function showCityInfo () {
  //实例化城市查询类
  let citysearch = new window.AMap.CitySearch();
  //自动获取用户IP，返回当前城市
  citysearch.getLocalCity(function (status, result) {
    if (status === 'complete' && result.info === 'OK') {
      if (result && result.city && result.bounds) {
        let cityinfo = result.city;
        let citybounds = result.bounds;

        CityData2.forEach((x, y) => {
          //item.children.forEach((x, y) => {

          let grandson = x.children;
          if (grandson) {
            if (JSON.stringify(grandson).indexOf(cityinfo) > -1) {
              if (!defaultCityName) {
                defaultCityName = cityinfo;
                defaultProviceName = x.label;
                defaultCityData = JSON.stringify(x);
                localStorage.setItem("defaultCityData", defaultCityData)
                localStorage.setItem("defaultCityName", defaultCityName)
              }
            }
          }
          // if ((defaultCityName ? x.label : x.value) == (defaultCityName ? defaultCityName : window.returnCitySN.cid)) {
          //   defaultCityName = cityinfo;
          //   defaultProviceName = item.label;
          //   defaultCityData = JSON.stringify(item);
          //   localStorage.setItem("defaultCityData", defaultCityData)
          //   localStorage.setItem("defaultCityName", defaultCityName)
          // }
        })
        //});

      }
    } else {
      console.log("获取定位失败！")
    }
  });
}
//showCityInfo()

if (window.returnCitySN) {
  CityData2.forEach((item, index) => {
    item.children.forEach((x, y) => {
      let grandson = x.children;
      if (grandson) {
        if (JSON.stringify(grandson).indexOf(window.returnCitySN.cid) > -1) {
          if (!defaultCityName) {
            console.log("xxxxxxxxxxxxxxxxxxxxxxx",x)
            console.log("yyyyyyyyyyyyyyyyyyyyyyy",item)
            defaultCityName = x.label;
            defaultProviceName = item.label;
            defaultCityData = JSON.stringify(item);

            //给商品详情页使用
            localStorage.setItem("defatulCityObj",JSON.stringify({label:x.label,id:x.id,value:x.value}));//市
            localStorage.setItem("defatulProviceObj",JSON.stringify({label:item.label,id:item.id,value:item.value}));//省

            localStorage.setItem("defaultCityData", defaultCityData)
            localStorage.setItem("defaultCityName", defaultCityName)
          }
        }
      }
      if ((defaultCityName ? x.label : x.value) == (defaultCityName ? defaultCityName : window.returnCitySN.cid)) {
        defaultCityName = x.label;
        defaultProviceName = item.label;
        defaultCityData = JSON.stringify(item);

         //给商品详情页使用
         localStorage.setItem("defatulCityObj",JSON.stringify({label:x.label,id:x.id,value:x.value}));//市
         localStorage.setItem("defatulProviceObj",JSON.stringify({label:item.label,id:item.id,value:item.value}));//省
         
        localStorage.setItem("defaultCityData", defaultCityData)
        localStorage.setItem("defaultCityName", defaultCityName)
      }
    })
  })
}




/**
 * 顶部的选择地址组件
 * isShowCitySelect 展开列表
 * defaultCityName 默认选中的位置
 *
 */
class CityOrientation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCitySelect: false,
      defaultCityName: defaultCityName
    };
  }
  isSHowCity (val) {
    this.setState({
      isShowCitySelect: val,
    });
  };
  showCityData (provice = "") {
    localStorage.setItem("defaultProviceName", provice);
  }
  changeShowCityUi (defaultCityName = "") {
    if (!defaultCityName) {
      this.setState({
        isShowCitySelect: false,
      });
      return;
    }
    localStorage.setItem("defaultCityName", defaultCityName)
    this.setState({
      isShowCitySelect: false,
    });
    if (defaultCityName) {
      this.setState({
        defaultCityName: defaultCityName,
      });

    }
    //开发时应该传给后端用户填写的地区
    if (this.props.callback) {
      this.props.callback(defaultCityName)
    } else {
      setTimeout(() => {
        window.location.reload()
      }, 400)
    }

  }
  render () {

    return (
      <Fragment>
        <div className="city">
          <span className={"defaultcity " + (this.state.isShowCitySelect ? "defaultcity-on" : "")} onClick={this.isSHowCity.bind(this, !this.state.isShowCitySelect)}>
            {this.props.text ? <span>{this.props.text}</span> :
              <Fragment>
                <span className='fl'>配送至：</span>
                <em className={"address-placement"}>{this.state.defaultCityName ? this.state.defaultCityName : "选择地区"}</em>
                <b className="arr"></b>
              </Fragment>
            }
          </span>
          <CityGroup
            isShowCityUi={this.state.isShowCitySelect}
            changeShowCityUi={this.changeShowCityUi.bind(this)}
            showCityData={this.showCityData.bind(this)}
          ></CityGroup>
        </div>

      </Fragment>
    )
  }
}


function togetherData (item, obj) {
  if (item.label == "北京市") {
    obj.setState({
      cityData: {
        children: [{
          id: "35",
          label: "北京市",
          value: "110000"
        }]
      }
    })
  } else if (item.label == "上海市") {
    obj.setState({
      cityData: {
        children: [{
          id: "1",
          label: "上海市",
          value: "310000"
        }]
      }
    })
  } else if (item.label == "天津市") {
    obj.setState({
      cityData: {
        children: [{
          id: "2",
          label: "天津市",
          value: "120000"
        }]
      }
    })
  } else if (item.label == "重庆市") {
    obj.setState({
      cityData: {
        children: [{
          id: "3",
          label: "重庆市",
          value: "500000"
        }]
      }
    })
  }
  return item;
}


export class CityGroup extends React.Component {
  static defaultProps = {
    unitedLevel: 2
  }
  constructor(props) {
    super(props);
    this.state = {
      isShowCitySelect: false,
      cityData: "",
      tagLev: 1, //表示当前联级1:省，2市.3区
      cityTxt: "",
      proviceTxt: "",
      areaTxt: "",
      areaData: ""

    };
  }
  shouldComponentUpdate (nextProps, nextState) {
    // console.log("nextState.tagLev",nextState.tagLev);
    // console.log("this.state.tagLev",this.state.tagLev);
    // if(nextState.tagLev && (nextState.tagLev == this.state.tagLev)){
    //   return false;
    // }
    return true;
  }
  componentWillMount () {
    // console.log("componentWillMount")
    if (defaultCityName && this.props.unitedLevel == 2) {

      this.setState({
        cityData: JSON.parse(defaultCityData),
        cityTxt: defaultCityName,
        proviceTxt: defaultProviceName
      })
      togetherData(JSON.parse(defaultCityData), this)
    }
  }

  showCityData (item, event) {
    event.preventDefault();
    this.setState({
      cityData: item,
      tagLev: 2,
      cityTxt: "请选择市",
      proviceTxt: item.label,

    })
    if (this.props.showCityData) {
      this.props.showCityData(item.label);
    }
    if (this.props.unitedLevel == 3) {
      return;
    }
    togetherData(item, this)

  }
  showCityData2 (item, event) {
    event.preventDefault();
    togetherData(item, this)
    localStorage.setItem("defaultCityData", JSON.stringify(item))

    this.setState({
      cityTxt: item.label,
      areaData: item,
      tagLev: 3
    });
    if (this.props.unitedLevel == 2) {
      this.props.changeShowCityUi(item.label);
    }

  }
  showCityData3 (item, event) {
    event.preventDefault();
    this.setState({
      areaTxt: item.label
    }, () => {
      let arg = this.props.unitedLevel == 3 ? this.state : "";
      this.props.changeShowCityUi(arg);

    })

  }
  changeShowState () {
    this.props.changeShowCityUi();
  }
  tabMenu (val, event) {
    event.preventDefault();
    this.setState({
      tagLev: val
    })
  }
  render () {
    const stateData = this.state;
    const unitedLevel = this.props.unitedLevel;
    // console.log("stateData=",stateData);
    return (
      <Fragment>
        <div className={"ui-city-group " + (this.props.isShowCityUi ? "" : "none")}>
          <a name="item_none_dizhi_guanbi" className="ui-city-close" onClick={this.changeShowState.bind(this)} href="javascript:void(0)"><Icon type="close" /></a>
          <div className="ui-city-group-content">
            <ul className="nav-tabs clearfix">
              <li name="item_none_dizhi_02" id="provinceShow" className={`active ${stateData.tagLev == 1 ? "current" : ""}`} onClick={this.tabMenu.bind(this, 1)} >
                <p><a href="javascript:void(0)">{stateData.proviceTxt ? stateData.proviceTxt : "选择省"}</a></p>
              </li>
              <li name="item_none_dizhi_03" id="citybShow" className={`active ${stateData.tagLev == 2 ? "current" : ""}`} onClick={this.tabMenu.bind(this, 2)}>
                <p><a href="javascript:void(0)">{stateData.cityTxt ? stateData.cityTxt : "选择市"}</a>
                </p>
              </li>
              {unitedLevel == 3 &&
                <li id="areaShow" className={`active ${stateData.tagLev == 3 ? "current" : ""}`} onClick={this.tabMenu.bind(this, 3)}>
                  <p><a href="javascript:void(0)">{stateData.areaTxt ? stateData.areaTxt : "选择区/县"}</a>
                  </p>
                </li>
              }
            </ul>
            <div className="tab-content">
              <ul className={"tab-panel pr-panel " + (stateData.tagLev == 1 ? "active" : "")}>
                <li>
                  {CityData2.map((item, index) => {
                    return (
                      <span key={index}>
                        <a name="item_none_dizhi_sheng" href="###" className={this.state.proviceTxt == item.label ? "on" : ""} onClick={this.showCityData.bind(this, item)}>{item.label}</a>
                      </span>
                    )
                  })}
                </li>
              </ul>
              <ul className={"tab-panel ct-panel " + (stateData.tagLev == 2 ? "active" : "")}>
                <li>
                  {stateData.cityData && stateData.cityData.children.map((item, index) => {
                    return (
                      <span key={index}>
                        <a name="item_none_dizhi_sheng" href="###" className={this.state.cityTxt == item.label ? "on" : ""} onClick={this.showCityData2.bind(this, item)}>{item.label}</a>
                      </span>
                    )
                  })}
                </li>
              </ul>
              {
                unitedLevel == 3 &&
                <ul className={"tab-panel ct-panel " + (stateData.tagLev == 3 ? "active" : "")}>
                  <li>
                    {stateData.areaData && stateData.areaData.children.map((item, index) => {
                      return (
                        <span key={index}>
                          <a name="item_none_dizhi_sheng" href=":void(0)" className={this.state.areaTxt == item.label ? "on" : ""} onClick={this.showCityData3.bind(this, item)}>{item.label}</a>
                        </span>
                      )
                    })}
                  </li>
                </ul>
              }

              <ul className="tab-panel ds-panel">
                <li><span><a name="item_none_dizhi_qu" href="###" role="10002791,12211,01,市中,">市中</a></span></li>
              </ul>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}





export default CityOrientation;


