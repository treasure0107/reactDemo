import React from "react";
import { Modal } from 'antd';

import $ from "jquery";

import "./style/bigimgshow.scss"
/**
 * 详情里面的图片展示 有放大镜的效果
 * deg: 0,  // 放大图的角度
 * imglist: props.imglist, //传进来的放大图的列表
 * curbigimg: '', //当前大图路径
 * curindex: 0,  //当前大图的index
 * showbigimg: false //是否显示大图
 */
class BigImgShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deg: 0,
      imglist: props.imglist,
      curbigimg: '',
      curindex: 0,
      showbigimg: false,
      lefthover: false,
      righthover: false,
      rotehover: false,
    };
  }
  componentWillMount () {
    let props = this.props;
    if (props.imglist.length > 0) {
      this.setState({
        curbigimg: props.imglist[props.curindex].image_path
      });
    }

  }
  // imgclick (curindex) {
  //     this.setdeg(0);
  //     let {imglist}=this.state;
  //     this.setState({
  //         curindex: curindex,
  //         curbigimg: imglist[curindex].image_path
  //     })
  // }
  bigimgleft () {
    let { imglist, curindex } = this.state;
    this.setdeg(0);
    if (curindex > 0) {
      curindex--;
      this.setState({
        curindex,
        curbigimg: imglist[curindex].image_path
      })
    }

  }
  bigimgright () {
    let { imglist, curindex } = this.state;
    this.setdeg(0);
    if (curindex < imglist.length - 1) {
      curindex++;
      this.setState({
        curindex,
        curbigimg: imglist[curindex].image_path
      })
    }
  }
  turnleft () {
    this.setdeg(this.state.deg - 90);
  }
  turnright () {
    this.setdeg(this.state.deg + 90);
  }
  setdeg (deg) {
    this.state.deg = deg;
    $('#bigimgshow .imgs img').css('transform', 'rotate(' + deg + 'deg)');
  }
  delok () {

  }
  showpopalertset (val) {
    this.props.showbigimgchange(val);
  }
  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
    if (nextProps.imglist.length > 0) {
      this.setState({
        curindex: nextProps.curindex,
        imglist: nextProps.imglist,
        showbigimg: nextProps.showbigimg,
        curbigimg: nextProps.imglist[nextProps.curindex].image_path
      });
    }
    // this.setState({
    //     data: {
    //         // 筛选的条件 具体等联调时候修改
    //         comprehensive: 0,
    //         sales: 0,
    //         new: 0,
    //         comment: 0,
    //         price: 0,
    //         minprice: '',
    //         maxprice: '',
    //     }
    // });
  }
  setdata (name) {
    this.setState({
      [name]: !this.state[name]
    });
  }
  render () {
    const { curbigimg, imglist,lefthover,righthover,rotehover } = this.state;
    return (
      <Modal
        width={390}
        title="大图"
        destroyOnClose
        visible={this.state.showbigimg}
        onCancel={this.showpopalertset.bind(this, false)}
        onOk={this.showpopalertset.bind(this, false)}
        wrapClassName={'bidimgmodal'}
        cancelText={'取消'}
        okText={'确认'}
      >
        <div className="bigimgshow clearfix" id="bigimgshow">
          <div className="prev" onClick={this.bigimgleft.bind(this)} onMouseEnter={this.setdata.bind(this, 'lefthover')} onMouseLeave={this.setdata.bind(this, 'lefthover')}><img src={lefthover?require('assets/images//common/left2.png'):require('assets/images//common/left1.png')} alt="" /> </div>
          <div className="imgs">
            {/* <span onClick={this.turnleft.bind(this)} className="turnleft" >左转</span> */}
            <img src={curbigimg} alt="" />
          </div>
          <img onMouseEnter={this.setdata.bind(this, 'rotehover')} onMouseLeave={this.setdata.bind(this, 'rotehover')} src={rotehover?require('assets/images//common/rote2.png'):require('assets/images//common/rote1.png')} onClick={this.turnright.bind(this)} className="turnright" />
          <div className="next" onMouseEnter={this.setdata.bind(this, 'righthover')} onMouseLeave={this.setdata.bind(this, 'righthover')} onClick={this.bigimgright.bind(this)}> <img src={righthover?require('assets/images//common/right2.png'):require('assets/images//common/right1.png')} alt="" /> </div>
        </div>
      </Modal>

    )
  }
}
export default BigImgShow;
