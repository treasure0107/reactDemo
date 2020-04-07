import React, {Component} from 'react'
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
import ListenLocChange from 'components/common/ListenLocChange';
import './style/headMenu.scss';
import {connect} from 'react-redux';
import {actionCreatorPurchase} from '../purchase/store'

class HeadMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: ''
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     if (this.state.selectIndex == nextState.selectIndex) {
  //         return false
  //     }
  //     return true;
  // }
  render() {
    const {selectIndex} = this.state;
    return (
      // <div>
      <ul className='main-menu-box'>
        {
          this.props.menuList.map((item, index) => {
            return <li key={new Date().getTime() + index} className={selectIndex == index ? 'active' : ''}>
              <Link to={item.url}>
                {item.name}
                {item.path == "se_purchase" && this.props.waitOfferNum ?
                  <span className="se_purchase">{this.props.waitOfferNum}</span> : null}
              </Link>

            </li>
          })
        }
      </ul>
      // </div>
    )
  }
}

HeadMenu.propTypes = {
  menuList: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    waitOfferNum: state.purchase.waitOfferNum
  }
};
export default connect(mapStateToProps, null)(ListenLocChange(HeadMenu))