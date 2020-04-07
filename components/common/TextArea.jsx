import React, { Component,Fragment } from 'react';
import { Form, Input } from 'antd';
const { TextArea } = Input;
class TextAreaLimit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            WriteCount:this.props.defaultValue?this.props.defaultValue.length:'',
            refuseReason:this.props.defaultValue,
        }
    }
    componentDidMount() {
        // refundOrderDetail
    }
    render() {
        let { refuseReason, WriteCount } = this.state;
        let {  min_rows,max_rows,maxLength } = this.props;
        if (maxLength < WriteCount){
            refuseReason = refuseReason.substring(0,maxLength);
        }
        return (
            <div className='textArea-limit-box'>
                <TextArea placeholder={this.props.placeholder} value={refuseReason} autosize={{ minRows: min_rows, maxRows: max_rows }} onChange={(e) => {
                    if (e.target.value.length > maxLength) {
                        e.target.value = refuseReason;
                        return;
                    }
                    this.props.onChange(e.target.value);
                    this.setState({
                        WriteCount: e.target.value && e.target.value.length,
                        refuseReason: e.target.value
                    })
                }} />
                <div className='textArea-limit'>{WriteCount}/{maxLength}字</div>
            </div>
        )
    }
}
TextArea.defaultProps={
    min_rows:6,
    max_rows:8,
    maxLength:200,
    defaultValue:'',
    placeholder:'拒绝理由'
}
export default Form.create()(TextAreaLimit)

