
import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
import "./style/backbar.scss"

class BackBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text:props.text,
        };
    }
    back(){
         this.props.history.goBack();
    }
    render(){
        const {text}=this.state;
        return(
         <div className="backbar">
             <span className='iconfont' onClick={this.back.bind(this)}>back</span>
             <span className='text'>{text}</span>
         </div>   
        )
    }
}

export default withRouter(BackBar)
