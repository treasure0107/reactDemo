import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';


class FootMark extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const footMarkData = this.props.footMarkData;
    return (
      <ul className="footmark clearfix">
        {/* <li>
              <a className="footprint">
                <img src="https://oss.ecoprint.tech/data/gallery_album/10/thumb_img/1546635191561558004.png" />
              </a>
              <a className="price">¥100.00</a>
            </li> */}
        {
          footMarkData.map((item, idx) => {
            return (
              <li key={idx}>
                <Link to="/">
                  <div className="img_show">
                    <img src={item.url} />
                    <p className="del">加入购物车</p>

                  </div>
                  <p className="price">{item.price}</p>

                </Link>
              </li>
            )
          })
        }
      </ul>
    )
  }
}

function mapStateToProps(state) {
  return {
    footMarkData: state.footMarkData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    delFootmarkCollect: (tag) => {
      dispatch({ type: 'ASYNC_DEL_FOOTMARK_DATA', shop_id: tag })
    },
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(FootMark)