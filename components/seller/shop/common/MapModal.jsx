import React from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select, Radio,Cascader } from 'antd';
import moment from 'moment';
import { CityData } from "assets/js/city";
import _ from 'lodash'
import {BigNumber} from 'bignumber.js';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import comUtil from 'utils/common.js'
import '../../common/style/shopSet.scss'
const { RangePicker } = DatePicker;
const options = CityData;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

let format = {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0
  }
  BigNumber.config({ FORMAT: format })
class MapModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expand: false,
            locDetaile:[]
        }
    }

    componentDidMount(){
        console.log(this.props);
        this.showMap(this.props);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.address != nextProps.address){
            this.showMap(nextProps);
        }
    }
    showMap(props){
        let _this = this;
        //地图加载
        var map = new AMap.Map("map_container", {
            resizeEnable: true
        });
        AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch','AMap.CloudDataLayer'], function () {
            //输入提示
            var autoOptions = {
                input: "tipinput"
            };
            var auto = new AMap.Autocomplete(autoOptions);
            var placeSearch = new AMap.PlaceSearch({
                map: map
            });
            var marker = new AMap.Marker({
            });
            AMap.event.addListener(map, 'click', (e)=>{
                // console.log(e.lnglat.getLng())
                 _this.setState({
                     locDetaile:[new BigNumber(e.lnglat.getLng()).toFormat(4),new BigNumber(e.lnglat.getLat()).toFormat(4)]
                 })
             });
            placeSearch.search(props.address,(e,b,d)=>{
                if(e == 'complete'){
                    _this.setState({
                        locDetaile:[new BigNumber(_.get(b,'poiList.pois[0].location.Q','')).toFormat(4),new BigNumber(_.get(b,'poiList.pois[0].location.P','')).toFormat(4)]
                    })
                }
            });
            AMap.event.addListener(placeSearch, 'markerClick', (e)=>{
                _this.setState({
                    locDetaile:[new BigNumber(e.event.lnglat.Q).toFormat(4),new BigNumber(e.event.lnglat.P).toFormat(4)]
                })
            });
        
        })
    }
    render() {
        return (
            <div className='shop-map-box'>
                <div id="map_container"></div>
                {
                    this.state.locDetaile[0]&& this.state.locDetaile[0]!='NaN'?
                        <div className='map-longitude-atitude'>
                            拖动地图至目标位置，点击获得经纬度<span>{this.state.locDetaile[0] + ',' + this.state.locDetaile[1]}</span>
                        </div> :  
                        <div className='map-longitude-atitude'>
                            <span>请输入更加详细的地址信息</span>
                        </div> 
                }
               
                {/* <div className="info">
                    <div className="input-item">
                        <input id='tipinput' type="text" />
                    </div>
                </div> */}
            </div>
        );
    }
}

export default MapModal;

