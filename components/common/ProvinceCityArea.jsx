
import { Cascader, Select, Button } from 'antd';
import React, { Component } from 'react';
import { CityData } from "../../assets/js/provinceCityJson";

const options = CityData;

class Provinces extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addressList: [],
      CityData: ["440000", "440300"]
    }

  }
  onChange(value, label) {
    this.setState({
      addressList: value
    }, () => {
    })
  }

  render() {
    const { value, defaultInfo, change, placeholder, label } = this.props
    // console.log(this.state.CityData,'CityData')
    return (
      <Cascader
        value={value}
        options={options}
        defaultValue={this.state.CityData}
        onChange={change || this.onChange.bind(this)}
        placeholder={placeholder ? placeholder : '请选择'}
        allowClear={false}
      />
    )
  }
}
export default Provinces;