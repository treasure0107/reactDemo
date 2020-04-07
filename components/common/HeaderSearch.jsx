import React from "react";
import { Link, withRouter } from "react-router-dom";

import { AutoComplete } from 'antd';
import "./style/hometopnav.scss";
import httpRequest from "utils/ajax";
import api from "utils/api";
import $ from "jquery";
import BuriedPoint from "components/common/BuriedPoint.jsx";

import lang from "assets/js/language/config";

const search=lang.common.search;
const { Option } = AutoComplete;



// 调用方法
// <HeaderSearch hidekeywords={true}></HeaderSearch>
// hidekeywords 可不传； true 表示在搜索框下面不显示 热门搜索词汇
// isShop 是否店铺 店铺的话搜索按钮不一样






class HeaderSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      value: '1',
      keywordslist: [],
      dataSource: [],
    };
    this.onSelect = this.onSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.search = this.search.bind(this);
    this.focus = this.focus.bind(this);
  }
  componentWillMount () {
    let params = this.props.match.params;
    let path=this.props.match.path;
    if (params.name) {
      params.name = decodeURIComponent(params.name);
    }
    if (path != '//search/category/:name?' && params.name) {
      this.setState({
        value: params.name,
      })
    } else {
      this.setState({
        value: '',
      }, () => {
      })
    }
    if (!this.props.hidekeywords) {
      this.getsearchkeywords()
    }
  }
  componentWillReceiveProps (nextProps) {
    let params = nextProps.match.params;
    let path=nextProps.match.path
    if (params.name) {
      params.name = decodeURIComponent(params.name);
    }
    this.setState({
      dataSource: []
    });
    if (path != '//search/category/:name?' && params.name) {
      this.setState({
        value: params.name,
      }, () => {
      })
    } else {
      this.setState({
        value: '',
      }, () => {
      })
    }
  }
  getsearchkeywords () {
    httpRequest.get({
      url: api.common.getsearchkeywords,
      data: { type: 0 }
    }).then(res => {
      if (res.code == 200) {
        this.setState({
          keywordslist: res.data,
        });
      }
    })
  }
  search (type) {

    // For buried point.
    if (type == "goods") {
      BuriedPoint.track({name: "点击搜商品按钮"});
    } else {
      BuriedPoint.track({name: "点击搜店铺按钮"});
    }

    let value = this.state.value
    if (this.props.isShop) {
      if (type == 'goods') {
        this.searchGoodsShop(type, value)
      } else {
        let keyword = ''
        if (value === '') {
          keyword = 'all'
        } else {
          keyword = value
        }
        this.props.history.push(`//shop/${this.props.match.params.shopId}/goodslist/search/${keyword}`)
      }
    } else {
      console.log(type,value)
      this.searchGoodsShop(type, value)
    }
  }
  searchGoodsShop (type, value) {
    let newarr = [];
    let flag = false;
    if (localStorage.historylist) {
      newarr = JSON.parse(localStorage.historylist);
      if (value) {
        newarr.map(i => {
          if (i.value == value) {
            flag = true;
          }
        })
      }

    }
    if (!flag && value) {
      newarr.unshift({ time: Date.now(), value: value });
    }

    localStorage.historylist = JSON.stringify(newarr);

    let url = '//search/' + type + '/' + encodeURIComponent(value);
    this.props.history.push(url)
  }
  componentDidMount () {
    let _this = this;
    $('.ant-input.ant-select-search__field').on('keyup', function name (e) {
      // if ((e.keyCode == 13 || e.keyCode == 9) &&( _this.state.dataSource.length == 0&&)) {
      if ((e.keyCode == 13 || e.keyCode == 9) && ($('.ant-select-dropdown')&& $('.ant-select-dropdown').find('.ant-select-dropdown-menu-item-active').length==0)) {
      // if ((e.keyCode == 13 || e.keyCode == 9) ) {
        _this.setState({ value:e.target.value  },()=>{
          _this.search(_this.props.match.params.type || 'goods')
        });

      }

    })
  }
  onChangeValue (value, item) {
    console.log(value, item)

    this.setState({
      value: value
    });
    if (!value) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.setState({
        dataSource: []
      }, () => {
        this.focus();
      })
    }
  }
  // keywordsClick (value) {
  //   this.setState({
  //     value
  //   });
  // }
  onSelect (value, item) {
    this.setState({
      dataSource: []
    }, () => {
      this.setState({
        value
      }, () => {
        // this.search('goods');
      });
    })

  }
  handleSearch (value) {
    let params = this.props.match.params;
    let path = this.props.match.path;
    let url =path == '//search/shop/:name?' ? api.search.shop_list : api.search.goods_list;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (value) {
      this.timer = setTimeout(() => {
        let data = {
          page: 1,
          size: 10,
        }
        // this.setState({
        //   dataSource: [],
        // });
        if (path == '//search/shop/:name?') {
          data.shop_name__startswith = value;
        } else {
          data.goods_name__startswith = value;
        }
        if (value) {
          httpRequest.get({
            url: url,
            data
          }).then(res => {
            if (res.code == 200) {
              let newarr = [];
              if (res.data.data && res.data.data.length) {
                res.data.data.map(i => {
                  if (path == '//search/shop/:name?' && i.shop_name) {
                    newarr.push({ html: i.shop_name.replace(value, `<u>${value}</u>`), name: i.shop_name })
                  } else if (i.goods_name) {
                    newarr.push({ html: i.goods_name.replace(value, `<u>${value}</u>`), name: i.goods_name })
                  }
                })
              }
              if (this.state.value) {
                this.setState({
                  dataSource: newarr,
                });
              }
            }
            this.timer = null;
          })
        } else {
          this.timer = null;
          this.setState({
            dataSource: []
          })
        }
      }, 300);
    } else {
      this.setState({
        dataSource: []
      }, () => {
        this.focus();
      })
    }
  }
  focus () {
    let { value } = this.state;
    // this.setState({
    //   dataSource: []
    // }, () => {
    if (!value) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (localStorage.historylist && JSON.parse(localStorage.historylist).length > 0) {
        let newarr = []
        JSON.parse(localStorage.historylist).map(i => {
          if (Date.now() - i.time <= 60 * 60 * 24 * 7 * 1000) {
            newarr.push({ html: i.value, name: i.value })
          }
        })
        console.log(newarr)
        this.setState({ dataSource: newarr });
      }
    } else {
      this.handleSearch(value);
    }
    // })

  }
  renderOption (item, index) {
    return (
      <Option key={item.name} text={item.name}>
        <div className="wordli clearfix">
          <span className='text fl' dangerouslySetInnerHTML={{ __html: item.html }}></span>
          {/* <span className='num fr'>约1个商品</span> */}
        </div>
      </Option>
    );
  }
  tosearch (item) {
    let id = item.keyword_id;
    httpRequest.noMessage().get({
      url: api.common.keywordsclick,
      data: { id }
    }).then(res => {
      this.props.history.push('//search/goods/' + item.name);
    }).catch(err => {
      this.props.history.push('//search/goods/' + item.name);
    })
  }
  render () {
    const { show, value, keywordslist, dataSource } = this.state;
    const { isShop } = this.props;
    return (
      <div className="search">
        <div className="form">
          <AutoComplete
            onSearch={this.handleSearch}
            placeholder={search.tip}
            allowClear={false}
            style={{ height: '40px' }}
            onChange={this.onChangeValue.bind(this)}
            dataSource={dataSource.map(this.renderOption.bind(this))}
            defaultActiveFirstOption={false}
            optionLabelProp={'text'}
            onFocus={this.focus}
            onSelect={this.onSelect}
            value={value}
          >
            {/* <input type="text" placeholder={'请输入搜索关键词'} value={value} onKeyDown={this.bindEnter.bind(this)} onChange={this.onChangeValue.bind(this)} /> */}
            {/* {children} */}
          </AutoComplete>
          <div className="btn" onClick={this.search.bind(this, 'goods')}>{isShop ? search.searchall : search.searchgoods}</div>
          <div className="btn button-store" onClick={this.search.bind(this, isShop ? 'thisShop' : 'shop')}>{isShop ? search.searchthisshop : search.searchshop}</div>
          {/* <Link to={`//search/shop/${value?value:'ALL'}`} className="btn" >搜商品</Link>
          <Link to={`//storesearch/${value?value:'ALL'}`} className="btn button-store" >搜店铺</Link> */}
        </div>
        {this.props.hidekeywords ? null

          :
          <p>
            {keywordslist.length > 0 ? keywordslist.map((i, index) => {
              return (
                <a onClick={this.tosearch.bind(this, i)} key={index} className='keywords'>{i.name}</a>
              )
            }) : null}

            {/* <Link to="">宣传单</Link>
            <Link to="">喷绘</Link>
            <Link to="">画册</Link>
            <Link to="">横幅</Link>
            <Link to="">展架</Link>
            <Link to="">不干胶</Link>
            <Link to="">文件夹</Link> */}
          </p>}
      </div>
    )
  }
}


export default withRouter(HeaderSearch);
