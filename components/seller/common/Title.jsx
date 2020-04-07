import React, { Component } from 'react';
import { Button } from 'antd';
import { withRouter } from 'react-router';

class Title extends Component {
    render() {
        let {title,back,url,history,backText} = this.props;
        return (
            <div className="ecsc-path">
                <span>{title}</span>
                {
                    back?
                    <Button type="primary" className='no-bg-btn-title' onClick={()=>{
                        !url?
                        history.goBack():
                        history.replace(url)
                    }}>{
                        backText?backText:'返回'
                    }</Button>:null
                }
            </div>
        )
    }
  }
  
  export default withRouter(Title)