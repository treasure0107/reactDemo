import React from 'react';
import { Input,InputNumber} from 'antd'

import './style/countNum.scss'


class CountNum extends React.Component {
  
  static defaultProps = {
    defaultValue:1,
    count:1,
    min:1,
    disabled:false,
    max:99999
  }
    constructor(props){
        super(props);
        this.state = {
          count: this.props.defaultValue
        }
        this.myInput = React.createRef();
    }
    onChange = (val) =>{
      val = Math.ceil(val);
      this.setState({
        count:val
      },() => {
        this.props.countNumCall(val)
      })
    }
    computeCount = (val) => {
      
      let _val = parseInt(this.state.count) + val;
      console.log(_val,"_val");
      console.log(this.props.min ,"this.props.min ")
      if(_val<this.props.min || _val>this.props.max){
        return;
      }
      this.onChange(_val);
    }
    inputBlur =() => {
      let val = this.state.count;

      let isBol = isNaN(val) || !val || val < this.props.min;
      if(!isBol){
        return;
      }
      let _val = isBol? this.props.min : val;
      this.setState({
        count:_val
      },() => {
        this.props.countNumCall(_val)
      })
    }
    componentWillReceiveProps(nextProps){
      console.log(nextProps,"nextProps");
      if(nextProps.defaultValue===""){

        return;
      }

      let _count = nextProps.defaultValue <= this.props.min? this.props.min :
      nextProps.defaultValue >= this.props.max? this.props.max : nextProps.defaultValue;

        this.setState({
          count:_count
        })
    }

    render(){
      const {min,max,defaultValue,disabled} = this.props;
      const { count} = this.state;
      console.log("count",count)
      console.log("defaultValue",defaultValue)

      return(
        <div className="count_num">
          <span onClick={() => {!disabled && this.computeCount(-1)}} className={`reduce_bt ${(disabled || count==min)? "disable" : ""}`}>-</span>
          <InputNumber onBlur={(v) => {this.inputBlur(v)}}  disabled={disabled} ref={this.myInput} max={max} onChange={this.onChange} value={count} />
         <span onClick={() => {!disabled && this.computeCount(1)}} className={`add_bt ${(disabled || count==max)? "disable" : ""}`}>+</span>
        </div>
      )
    }
}

export default CountNum;
