import React, { Component } from 'react';
// import '../common/style/evaluateList.scss';
import { Modal } from 'antd';

import _ from 'lodash';
import Item from 'antd/lib/list/Item';

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowDetail: false,
            visible: false,
            needEllipsis:false
        }
    }
    componentDidMount() {
        let pic = _.defaultTo(_.get(this.props,'record.comment_pic',[]),[]);
        if ((this.ca.offsetHeight > this.fa.offsetHeight + 1)||pic.length > 1) {
            this.setState({
                isShowDetail: true,
                needEllipsis:this.ca.offsetHeight > this.fa.offsetHeight + 1
            })
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isShowDetail != this.state.isShowDetail || nextState.visible != this.state.visible||nextState.needEllipsis != this.state.needEllipsis) {
            return true
        } else {
            return false
        }
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    modalShow = () => {
        this.setState({
            visible: true
        })
    }
    render() {
        let { record } = this.props;
        return <div className='goods-info-evaluateContent-box'>
            <img className='pic-box' src={_.get(record,'comment_pic[0].pic_url','')} />
            <div className='evaluateContent-Info' ref={fa => this.fa = fa}>
                <div ref={ca => this.ca = ca}>
                    {record.comment_content}
                </div>
                {
                    this.state.isShowDetail ? <span className='detail-box' onClick={this.modalShow}>
                        {
                            this.state.needEllipsis?<span>...</span>:null
                        }
                        <span className='detail'>查看详情</span>
                    </span> : null
                }
            </div>
            <Modal
                title="评论内容"
                visible={this.state.visible}
                onCancel={this.handleCancel}
                footer={null}
                style={{
                    height: 198,
                    width: 480,
                }}
                className='commit-detail-modal'
            >
                {
                    record.comment_pic&&record.comment_pic.map((item, index) => {
                        return <img src={item.pic_url} className='img-list' key={index} />
                    })
                }
                <div className='comment_content'>
                    {record.comment_content}
                </div>
            </Modal>
        </div>
    }
}
export default Content