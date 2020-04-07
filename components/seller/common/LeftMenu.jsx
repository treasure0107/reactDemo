import React, {Component, Fragment} from 'react'
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
// import { withRouter } from "react-router";
import httpRequest from 'utils/ajax'
import {sellerApi} from 'utils/api';
import ListenLocChange from 'components/common/ListenLocChange';
import './style/leftMenu.scss';

class LeftMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: '',
      labelStatus: 0,
    }
  }

  componentWillMount() {
    if (window.location.pathname.indexOf("seller/delivery") != -1) {
      this.baseInfo(this.props.shopId)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.selectIndex == nextState.selectIndex && this.props.count == nextProps.count && this.state.labelStatus == nextState.labelStatus) {
      return false
    }
    return true;
  }

  //权限
  baseInfo(shop_id) {
    httpRequest.get({
      url: sellerApi.delivery.baseInfo,
      data: {shop_id: shop_id}
    }).then(res => {
      if (res.code == "200") {
        let data = res.data.result[0];
        if (data.label) {
          // console.log("data.label.indexOf", data.label.indexOf("0"));
          if (data.label.indexOf("0") == -1) {
            this.setState({
              labelStatus: 1
            });
          }
        } else {
          this.setState({
            labelStatus: 1
          });
        }
      }
    })
  }

  render() {
    const {selectIndex, labelStatus} = this.state;
    const {count} = this.props;
    return (
      <div style={{display: 'flex', flexShrink: 0}}>
        <ul className='main-right-menu-box'>
          {
            this.props.menuList.map((item, index) => {
              return <li key={new Date().getTime() + index} className={
                this.props.isActive ? (selectIndex == index ? 'active' : '') : ''
              }>
                <Link to={item.url} className={labelStatus == 1 && item.id == 3 ? "hide" : null}>
                  <span className={`iconfont ${item.icon}`} style={{marginRight: 4}}></span>
                  {
                    item.name
                  }
                  {
                    item.numberNotice ? (count ? `（${count}）` : '') : ''
                  }
                </Link>
                {/* <div className='arrow'></div> */}
              </li>
            })
          }
        </ul>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    count: state.notice.count,
    shopId: state.sellerLogin.loginInfo.shopId,
  }
};
LeftMenu.propTypes = {
  menuList: PropTypes.array
};
export default connect(mapState, null)(ListenLocChange(LeftMenu))