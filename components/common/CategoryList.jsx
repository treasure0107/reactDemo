

import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon, message } from 'antd';
import BuriedPoint from "components/common/BuriedPoint.jsx";

import $ from "jquery";

import "./style/categorylist.scss"
import httpRequest from 'utils/ajax';
import api from 'utils/api';
import moment from 'moment';
import lang from "assets/js/language/config";

const { SubMenu } = Menu;
/**
 * lists 传进来的分类数据
 * fix 是否固定展开 不允许收缩 默认是false
 */
class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // lists: props.lists ? props.lists : [{ title: '名片', id: 1, clist: [{ name: '高档名片', id: '1' }] }, { title: '名片', id: 1, clist: [{ name: '高档名片', id: '1' }] }, { title: '名片', id: 1, clist: [{ name: '高档名片', id: '1' }] }],
      lists: [],
      fix: props.fix ? true : false,
      isshow: props.fix ? true : false,
      showright: false,
      rightdata: [],
      leftCurindex: -1,
    };
  }
  componentWillMount () {
    this.getdata();
  }
  getdata () {
    httpRequest.get({
      url: api.common.category,
      data: { category_type: 0, category_device: 0 }
    }).then(res => {
      if (res.code == 200) {
        this.setState({
          lists: res.data
        });
      }
    })
  }
  componentWillReceiveProps (nextProps) {
    let params = nextProps;
    this.setState({
      fix: nextProps.fix ? true : false,
      isshow: nextProps.fix ? true : false,
    });
  }
  mouseenter () {
    // $('.ant-menu-submenu').parent().addClass('cate-ant-menu-submenu');
    this.showorhide(true);
  }
  mouseleave () {
    //  $('.ant-menu-submenu').parent().removeClass('cate-ant-menu-submenu');
    this.showorhide(false);
    this.setState({
      showright: false,
      leftCurindex: -1,
    });
  }
  mouseenter1 (item, index) {
    this.setState({
      leftCurindex: index
    });
    if (!item.is_end && item.children.length > 0) {
      this.setState({
        showright: true,
        rightdata: item.children,
      });
    } else {
      this.setState({
        showright: false
      });
    }

    // $('.ant-menu-submenu').parent().addClass('cate-ant-menu-submenu');
  }
  mouseleave1 (item, index) {
    this.setState({
      showright: false
    });
    //  $('.ant-menu-submenu').parent().removeClass('cate-ant-menu-submenu');
  }
  showorhide (val) {
    if (!this.props.fix) {
      this.setState({
        isshow: val
      })
    }

  }
  menuClick (e) {
    // console.log('click', e);
  }
  onOpenChange (e) {
    // console.log('onOpenChange', e);

  }
  liClick (item, level) {

    // For buried point.
    let bpOptions = {};
    bpOptions["分类名称"] = item.label;
    if (level == 2) {
      let lists = this.state.lists;
      let level1Id = item.parent_id;
      let level1Label = "";
      for (let i = 0, len = lists.length; i < len; i++) {
        if (level1Id === lists[i].id) {
          level1Label = lists[i].label;
          break;
        }
      }
      bpOptions["所属一级分类"] = level1Label;
    } else if (level == 3) {
      let lists = this.state.lists;
      let rightdata = this.state.rightdata;
      let level2Id = item.parent_id;
      let level2Label = "";
      let level1Id = "";
      for (let i = 0, len = rightdata.length; i < len; i++) {
        if (level2Id == rightdata[i].id) {
          level2Label = rightdata[i].label;
          level1Id = rightdata[i].parent_id;
          break;
        }
      }
      let level1Label = "";
      for (let i = 0, len = lists.length; i < len; i++) {
        if (level1Id === lists[i].id) {
          level1Label = lists[i].label;
          break;
        }
      }
      bpOptions["所属一级分类"] = level1Label;
      bpOptions["所属二级分类"] = level2Label;
    }
    BuriedPoint.track({
      name: ( (level == 1) ? "点击运营一级分类" : (level == 2) ? "点击运营二级分类" : (level == 3) ? "点击运营三级分类" : "" ),
      options: bpOptions
    });

    console.log(item)
    // if (item.category_link) {
    //   window.open(item.category_link)
    // } else
     if (item.link_type_id == 0) {
      localStorage.setItem('catedata', JSON.stringify(item));
      if (item.link_type_value) {
        let arr = item.link_type_value.split(',');
        let url = `//search/category/${arr[arr.length - 1]}`;
        if (item.open_type) {
          window.open(url)
        } else {
          this.props.history.push(url);
        }
      } else {
        message.warn(lang.common.catnolink);
      }
      // window.open(`//search/category/${}`)
    } else if (item.link_type_id == 1) {
      let url = `//search/goods/${item.link_type_value}`;
      if (item.open_type) {
        window.open(url)
      } else {
        this.props.history.push(url);
      }
    } else if (item.link_type_id == 2) {
      let url = `//shop/${item.shop_id}/goods/${item.link_type_value.indexOf(',') > -1 ? item.link_type_value.split(',')[item.link_type_value.split(',').length - 1] : item.link_type_value}`;
      if (item.open_type) {
        window.open(url)
      } else {
        this.props.history.push(url);
      }
    } else if (item.link_type_id == 3) {
      let id = item.link_type_value.indexOf(',') > -1 ? item.link_type_value.split(',')[1] : item.link_type_value;
      let url =  `//projectpage/detail/` + id;
      if (item.open_type) {
        window.open(url)
      } else {
        window.location.href = url;
      }
    } else if (item.link_type_id == 4) {
      let url = item.link_type_value;
      if (item.open_type) {
        window.open(url)
      } else {
        window.location.href = url;
      }
    }
    // else {
    //   httpRequest.get({
    //     url: api.common.goodsCategoryLink,
    //     data: {
    //       category_id: item.id, page: 1, size: 10
    //     }
    //   }).then(res => {
    //     if (res.code == 200) {
    //       if (item.link_type_id == 1) {
    //         window.open(res.search_link)
    //       }
    //       else if (item.link_type_id == 2) {
    //         window.open(`//shop/${res.data['1'].shop_id}/goods/${res.data['1'].spu_id}`)
    //       }
    //       else if (item.link_type_id == 3) {
    //         window.open(res.link)
    //       }

    //     }
    //   })
    // }

  }
  renderdiv = (i, index) => {
    return (
      i.is_end == 1 || (i.is_end == 0 && i.children.length == 0) ? (
        <Menu.Item key={i.id} className='catemenuitem'>
          <div className="li">
            <span className='a' onClick={() => this.liClick(i)}>
              {i.label}
            </span>
            {/* <Link to={'//category/' + i.id}>{i.label}</Link> */}
          </div>
        </Menu.Item>
      ) :
        <SubMenu
          key={i.id}
          className='SubMenu'
          title={
            <div className='li'>
              <span className='a' onClick={() => this.liClick(i)}>
                {i.label}
              </span>
              {/* <Link to={'//category/' + i.id}>{i.label}</Link> */}
            </div>
          }
        >
          {i.children.map((item, ind) => (
            this.renderdiv(item, ind)
          ))}

          {/* {item.children&&item.children.length>0?item.children.map((item2, ind2) => (
              <Menu.Item key={item2.id} className='catemenuitem'>
                <div className="li">
                  <Link to={'//category/' + item2.id}>{item2.label}</Link>
                </div>
              </Menu.Item>
            )):null} */}
        </SubMenu>
    )
  }

  render () {
    const { lists, isshow, rightdata, showright, leftCurindex } = this.state;
    return (
      <div className={showright ? "showright categorylist" : "categorylist"} onMouseEnter={this.mouseenter.bind(this)} onMouseLeave={this.mouseleave.bind(this)}>
        <h3>{lang.common.allCategory} <span className='fr'>...</span></h3>
        <div className={isshow ? "menu show" : "menu"}>
          {
            lists.length > 0 && lists.map((i, index) => (
              <div className={leftCurindex == index ? "li act" : "li"} key={index}>
                <h4 className='textover' onMouseEnter={this.mouseenter1.bind(this, i, index)} onClick={() => this.liClick(i, 1)}>{i.label}</h4>
              </div>
            ))
          }
        </div>
        <div className={showright ? "show list" : "hide list"}>
          {rightdata.length > 0 && rightdata.map((i, index) => (
            <dl key={index}>
              <dt onClick={() => this.liClick(i, 2)}><span className=''>{i.label}</span>  {!i.is_end && i.children.length > 0 && <Icon type="right" />}</dt>
              <dd>
                {
                  !i.is_end && i.children.length > 0 ? i.children.map((item, ind) => (
                    <span onClick={() => this.liClick(item, 3)} key={ind}>{item.label}</span>
                  )) : null
                }
              </dd>
            </dl>
          ))}

          {/* <dl>
            <dt>奖杯奖牌</dt>
            <dd>
              <span>金属奖杯</span>
              <span>金属奖杯</span>
              <span>金属奖杯</span>
            </dd>
          </dl> */}
        </div>

        {/* <ul className={this.state.isshow ? 'show' : 'none'}>
                    {this.state.lists.length > 0 ? this.state.lists.map((i, index) => {
                        return (
                            <li key={index}>
                                <Link to={''}>{i.name}</Link>
                            </li>
                        )
                    }) : null}
                </ul> */}
      </div>
    )
  }
}

// const CityOrientation = (props) => {

// }

export default withRouter(CategoryList);


