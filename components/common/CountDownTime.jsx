import React,{Component,Fragment} from 'react';

import { Statistic } from 'antd';


调用方法
 timeEndBack 倒计时结束父组件执行的逻辑可不传
 endTime 必传，可选2种格式：时间戳 “1560956400000” 或 2019-08-25 12:05:59
<CountDownTime  timeEndBack={this.timeEndBack.bind(this)} endTime={"1560956400000"}></CountDownTime></span>


const Countdown = Statistic.Countdown;

const CountDownTime = (props) =>{
  const deadline = props.endTime || Date.now() + 1000 * 60 * 60 * 24 * 1 + 1000 * 30;

  return(
    <div className="rest-antd-countdown">
      <Countdown format="HH:mm:ss" title={props.title} prefix={props.prefix}  suffix={props.suffix}  value={deadline} onFinish={props.timeEndBack} />
    </div>
  )
}

export default CountDownTime;





