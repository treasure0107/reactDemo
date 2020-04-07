
import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { connect } from 'react-redux';

import FooterList from './FooterList'
import "./style/footer.scss"
import httpRequest from "utils/ajax";
import api from "utils/api";
import lang from "assets/js/language/config";

const footer=lang.common.footer;

/**
 * 底部组件
 * lists 传进来的数据
 *
 */
class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [
         {
           title: '新手帮助',
           list: [
             { name: '关于我们1', url: 'aboutus' },
             { name: '如何注册2', url: '' },
             { name: '如何购物3', url: '' }
           ]
         },
         {
           title: '购物指南',
           list: [
             { name: '如何上传文件', url: '1' },
             { name: '支付方式说明', url: '1' },
             { name: '如何在线编辑', url: '1' }
           ]
         },
         {
           title: '会员体系',
           list: [
             { name: '会员等级', url: '1' },
             { name: '资金规则', url: '1' },
             { name: '售后原则', url: '1' }
           ]
         },
         {
           title: '关于我们',
           list: [
             { name: '公司简介', url: '1' },
             { name: '加入我们', url: '1' },
             { name: '咨询热点', url: '1' }
           ]
         },
         {
           title: '产品中心',
           list: [
             { name: '商家管理系统', url: '1' },
             { name: '产品管理中心', url: '1' },
             { name: '电传印', url: '1' }
           ]
         }
      ]
    };
  }
  componentWillMount () {
    this.getfootdoc();
  }
  componentDidMount() {
    let dom = document.getElementById("govCode");
    if( dom ){
      dom.style.display = "block";
    }
  }

  getfootdoc () {
    httpRequest.get({
      url: api.common.getfootdoc,
      data: {}
    }).then(res => {
      if (res.code == 200) {
        this.setState({
          lists: res.data,
        });
      }
    })
  }
  render () {
    const { mallentrancedata, showHeader, showQrCode, isSellerLogin } = this.props;
    const { lists } = this.state;
    return (
      <div className="footer">
        {
          showHeader && <div className="footerheader mg">
            <div className="li">
              <span>{footer.li1.span}</span>
              <div className="text">
                <h3>{footer.li1.title}</h3>
                <p>{footer.li1.text}</p>
              </div>
            </div>
            <div className="li">
              <span>{footer.li2.span}</span>
              <div className="text">
                <h3>{footer.li2.title}</h3>
                <p>{footer.li2.text}</p>
              </div>
            </div>
            <div className="li">
              <span>{footer.li3.span}</span>
              <div className="text">
                <h3>{footer.li3.title}</h3>
                <p>{footer.li3.text}</p>
              </div>
            </div>
            <div className="li">
              <span>{footer.li4.span}</span>
              <div className="text">
                <h3>{footer.li4.title}</h3>
                <p>{footer.li4.text}</p>
              </div>
            </div>
          </div>
        }
        {
          !isSellerLogin ? (
            <div className="footnavli ">
              <div className="w1200">
                {lists.length > 0 ? <FooterList lists={lists}>
                </FooterList> : null}
                <dl className='qrcodegroup'>
                  <dt>{footer.searchcode}</dt>
                  <dd >
                    <div className="qrcode">
                      <img src={require('assets/images/app.png')} alt="" />
                      <p>{footer.app}</p>
                    </div>
                    <div className="qrcode">
                      <img src={require('assets/images/us.jpg')} alt="" />
                      <p>{footer.focus}</p>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          ) : null
        }
        <div className="fotbotnav w1200">
          <p className='footernavdata'>
            {mallentrancedata.footernavdata && mallentrancedata.footernavdata.length > 0 ? mallentrancedata.footernavdata.map((i, index) => {
              return (
                <a key={index} href={i.entrance_url}>{i.entrance_name}</a>
              )
            }) : null}
          </p>
          <p className='friendslink'>
            {mallentrancedata.friendslinkdata && mallentrancedata.friendslinkdata.length > 0 ? mallentrancedata.friendslinkdata.map((i, index) => {
              return (
                <a key={index} href={i.entrance_url}>{i.entrance_name}</a>
              )
            }) : null}
          </p>
          {/* <p>
            <Link to={""}>首页</Link>
            <Link to={""}>隐私保护</Link>
            <Link to={""}>联系我们</Link>
            <Link to={""}>免责条款</Link>
            <Link to={""}>公司简介</Link>
            <Link to={""}>商家入驻</Link>
            <Link to={""}>意见反馈</Link>
          </p>
          <p>
            <Link to={""}>科技</Link>
            <Link to={""}></Link>
            <Link to={""}></Link>
            <Link to={""}></Link>
          </p> */}
          <p className="copyright"><span>©&nbsp;2018-现在&nbsp;&nbsp;科技（深圳）有限公司&nbsp;版权所有&nbsp;</span><span>ICP备案证书号:</span><a href="http:www.beian.miit.gov.cn/" target="_blank">粤ICP备18094506号-1</a>&nbsp; 互联网数据中心业务许可证 B1-20184579&nbsp; 在线数据处理与交易处理业务许可证 B2-20190536&nbsp; 公安备案号:44030502003810</p>
        </div>
      </div>
    )
  }
}

 mapStateToProps可以不传，如果不传，组件不会监听store的变化，也就是说Store的更新不会引起UI的更新
function mapStateToProps (state) {
  return {
    mallentrancedata: state.mallentrancedata,
  }
}
 mapDispatchToProps
 mapDispatchToProps用于建立组件跟store.dispatch的映射关系,可以是一个object，也可以传入函数
 如果mapDispatchToProps是一个函数，它可以传入dispatch,ownProps, 定义UI组件如何发出action，实际上就是要调用dispatch这个方法

function mapDispatchToProps (dispatch) {
  return {
    setFirendsLinkData: (state) => dispatch(state),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)


