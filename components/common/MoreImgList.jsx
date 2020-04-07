

import React from "react";
import { Form, Table, Input, Modal, Upload, Icon, message, Button } from 'antd';
import "./style/moreimglist.scss";
import BigImgShow from './BigImgShow';


/**
 * 多图列表展示 点击可以看大图
 * imglist 图片列表
 * curindex 当前大图显示的索引
 * showbigimg 是否显示大图
 * <MoreImgList imglist={} ></MoreImgList>
 */
class MoreImgList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isshowalert: false,
      imglist: props.imglist || [],
      delindex: -1,
      maxnum: props.maxnum ? props.maxnum : 8,
      curindex: 0,
    };
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      imglist: nextProps.imglist
    });
  }
  showpopalertset (val) {
    this.setState({
      isshowalert: val
    })
  }
  delok () {
    this.state.imglist.splice(this.delindex, 1);
    this.setState({
      imglist: this.state.imglist
    })
    this.showpopalertset(false)
  }
  imgclick (curindex) {
    let { imglist } = this.state;
    this.setState({
      curindex: curindex,
      showbigimg: true,
    })
  }
  showbigimgchange (val) {
    this.setState({
      showbigimg: val
    });
  }


  render () {
    const { imglist, maxnum, curindex, showbigimg } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <div className="moreimglist">
          {imglist.length > 0 ? imglist.map((i, index) => {
            return (
              <img key={index} src={i.image_path} alt="" onClick={this.imgclick.bind(this, index)} />
            )
          }) : null}
        </div>
        <BigImgShow showbigimgchange={this.showbigimgchange.bind(this, false)} curindex={curindex} imglist={imglist} showbigimg={showbigimg}></BigImgShow>
      </div>
    );
  }

}

export default MoreImgList;


