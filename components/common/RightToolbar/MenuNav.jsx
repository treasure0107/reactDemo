import React, { Fragment, useState } from 'react';
import { Icon, Button, Badge } from 'antd';
import { Link } from 'react-router-dom';
import WindowLogin from 'components/common/WindowLogin'
import BackTop from 'components/common/backTop'


//菜单
const CreateIcon = (props) => {
  return (

    (() => {

      if (props.tag == 'collect') {
        return <em className="collectObj iconfont2">&#xe67f;</em>;
      }
      if (props.tag == 'footmark') {
        return <em className="iconfont2">&#xe67d;</em>;
      }
      if (props.tag == 'coupon') {
        return <em className="iconfont2">&#xe67c;</em>;
      }
      if (props.tag == 'order') {
        return <em className="iconfont2">&#xe67b;</em>;
      }
      if (props.tag == 'cart') {
        return <em className="cartObj iconfont2">&#xe67e;</em>;

      }
    })()


  )
}



const MenuNav = ({ visible, changeVisibleVal, userName, header, isLogin, currentTag, triggerClick, triggerClick1, countNum, menuNavList }) => {
  const [showQrCode, setShowQrCode] = useState(true);
  const [showWechatQrCode, setShowWechatQrCode] = useState(false)
  // console.log(header, '111')
  return (
    <Fragment>

      <WindowLogin menuNavList={menuNavList} visible={visible} isFromRightSidebar={true} changeVisibleVal={changeVisibleVal}></WindowLogin>
      <div className="toolbar-menu">
        <ul>
          <li className="rt-menu-item">
            <Icon type="user" onClick={() => { triggerClick1('//user/UserCenter') }} />
            {isLogin ?
              <div className="aniTip user_wrap">
                <div className="user_info flexHor">
                  <Link to="//user/PersonalData">
                    <img src={!header || header == 'None' || header.indexOf('https') == -1 ? require('assets/images/default_avatar.png') : header} />
                  </Link>
                  <div className="flex1">
                    <p><span>用户名: </span>{userName}</p>
                    <p><span>级别:</span> 铜牌</p>
                  </div>
                </div>
                <div className="user_fot">
                  <Button><Link to="//user/order/">我的订单</Link></Button>
                  <Button><Link to="//user/mycollection">我的收藏</Link></Button>
                </div>
                <em></em>
              </div>
              : null}
          </li>
          {

            menuNavList.map((item, key) => {
              return (
                // <Link to={item.url}>
                <li
                  // data-url={item.url}
                  key={key}
                  className={`rt-menu-item
                      ${item.tag == "cart" ? 'cartNav' : ''}
                      ${currentTag == item.tag ? 'tagNav' : ""}`
                  }
                  onClick={() => { triggerClick(item.tag, item.url) }}
                >
                  {
                    // item.icon && <em className="iconfont2">{item.icon}</em>
                    item.icon && <CreateIcon tag={item.tag}></CreateIcon>
                  }
                  {item.aniTip && <span className="aniTip">{item.txt} <em></em><em className="border"></em></span>}
                  {item.tag == "cart" && <span className='cartn'>{item.txt}</span>}
                  {item.tag == "cart" && <Badge showZero count={countNum}></Badge>}
                </li>
              )
            })
          }
        </ul>
        <div className="botfix">
          <div className="li antiP2Hover">
            <img src={require('assets/images//home/qrcode.png')} alt=""
            //  onClick={() => {setShowQrCode(true);}}
             />

            {
              showQrCode &&
              <div className="aniTip2">
                {/* <img className='del' src={require('assets/images/delete_phone_icon.png')} alt=""
                onClick={() => {setShowQrCode(false);}}
                 /> */}
                <img className='qrcode' src={require('assets/images/app.png')} alt="" /> <em></em><em className="border"></em>
                <p>APP下载</p>
              </div>
            }

          </div>
          <div className="li">
            <Link to='//purchase/form/add/'>求购</Link>
          </div>
          <div className="li mobile">
            <img src={require('assets/images//home/phone.png')} alt="" />
            <div className="aniTip">
              4000-877-881 <em></em><em className="border"></em>
            </div>
          </div>
          <div className="li">
            <img
              src={require('assets/images//login/weixin.png')}
              alt="微信"
              // onMouseOver={() =>{
              //   setShowWechatQrCode(true);
              //   setShowQrCode(false);
              // }}
              // onMouseLeave={() => {
              //   setShowWechatQrCode(false);
              // }}
              onClick={() => {
                setShowWechatQrCode(true);
              }}
            />
            {
              showWechatQrCode &&
              <div className="aniTip2 wechatPop">
                <img className='del' src={require('assets/images/delete_phone_icon.png')} alt="" onClick={() => {
                  setShowWechatQrCode(false);
                }} />
                <img className='qrcode' src={require('assets/images//home/wechat_qrcode.png')} alt="" /> <em></em><em className="border"></em>
                <p>微信 ecoprint-cs</p>
              </div>
            }
          </div>
        </div>
        <div className="rightbacktop">
          <BackTop>
            <u><img src={require('assets/images//home/backtop.png')} alt="" /></u>
          </BackTop>
          <BackTop>
            <span className="aniTip">置顶 <em></em><em className="border"></em></span>
          </BackTop>
        </div>
      </div>
    </Fragment>
  )


}

export default MenuNav

