import React from "react";
import { Link, withRouter } from "react-router-dom";
import { AutoComplete, Select } from 'antd';
import "./style/hometopnav.scss";
import "./style/helpsearch.scss";
import httpRequest from "utils/ajax";
import api from "utils/api";
import $ from "jquery";
import { connect } from 'react-redux'
const { Option } = AutoComplete;


// 调用方法
// <HelpSearch hidekeywords={true}></HelpSearch>
// hidekeywords 可不传； true 表示在搜索框下面不显示 热门搜索词汇
// isShop 是否店铺 店铺的话搜索按钮不一样

class HelpSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      value: '',
      keywordslist: [],
      dataSource: [],
      current: 0,
      keyword: [],
      kwd: null,
      ischach: null,
      helpTyle: null
    };
    this.search = this.search.bind(this);
    this.focus = this.focus.bind(this);
    this.clickBuyerHelp = this.clickBuyerHelp.bind(this);
    this.clickSellerHelp = this.clickSellerHelp.bind(this);
  }

  search(type) {
    // console.log('点击搜索')
    let _this = this;
    localStorage.setItem("titleSearch", _this.state.value)
    httpRequest.get({
      url: api.helpdocument.detailscentern + '?status=0' + '&category_type=0' + '&search=' + _this.state.value,
    }).then(res => {
      // console.log(res.data, '搜索出来的结果')
      _this.props.changeListId({
        type: "helpSearchListId",
        data: res.data.result,
        count: res.data.count,
        current: 1
      });
      this.props.history.push(`//buyerhelp/buyerhelpsearch`)
      this.setState({
        value: ''
      })
    })
  }

  // 关键字搜索
  keywordVal(e) {
    let isvalue = e.target.innerHTML;
    let keyWord = e.target.getAttribute("data-keyword");
    localStorage.setItem("isvalue", e.target.innerHTML)
    httpRequest.get({
      url: api.helpdocument.tongji + '?id=' + keyWord
    }).then(res => {
      // console.log(res)
    });
    httpRequest.get({
      url: api.helpdocument.detailscentern + '?status=0' + '&search=' + isvalue,
    }).then(res => {
      this.props.changeListId({
        type: "helpSearchListId",
        data: res.data.result,
        count: res.data.count,
        current: 1
      });
      this.props.history.push(`//buyerhelp/buyerhelpsearch`)
      this.setState({
        value: ''
      })
    })
  }

  componentDidMount() {
    // let helpTyle = window.location.href.split("=")[1];
    // console.log(helpTyle, '点击切换传过来的参数')
    setTimeout(() => {
      let helpTyle = sessionStorage.getItem("helpType");
      // console.log(helpTyle, 'helpTyle')
      this.setState({
        helpTyle: helpTyle
      })
    }, 200)

    httpRequest.get({
      url: api.helpdocument.keywords + '?type=' + 6
    }).then(res => {
      this.setState({
        keyword: res.data
      })
      console.log(res, '搜索关键字')
    })
    let _this = this;
    $('.ant-input.ant-select-search__field').on('keydown', function name(e) {
      if ((e.keyCode == 13 || e.keyCode == 9) && _this.state.dataSource.length == 0) {
        _this.search(_this.props.match.params.type || 'goods')
      }
    })
  }

  onChangeValue(value, item) {
    // console.log(value, item)
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

  focus() {
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
      // this.handleSearch(value);
    }
    // })
  }

  // 点击卖家帮助
  clickSellerHelp() {
    // console.log(this.props, '点击卖家帮助')
    httpRequest.get({
      url: api.helpdocument.keywords + '?type=' + 5
    }).then(res => {
      this.setState({
        keyword: res.data,
        helpTyle: 1
      })
      // console.log(res, '搜索关键字')
    })
    this.props.contentListId({
      type: "articlecenterListId",
      data: 1
    })
    this.props.changeBuyermerchant({
      type: "articlecenterBuyermerchant",
      data: 1
    })
  }

  // 点击买家帮助
  clickBuyerHelp() {
    // console.log(this.props, '点击买家帮助')
    httpRequest.get({
      url: api.helpdocument.keywords + '?type=' + 6
    }).then(res => {
      this.setState({
        keyword: res.data,
        helpTyle: 0
      })
      // console.log(res, '搜索关键字')
    })
    this.props.contentListId({
      type: "articlecenterListId",
      data: 0
    })
    this.props.changeBuyermerchant({
      type: "articlecenterBuyermerchant",
      data: 0
    })
  }

  render() {
    const { show, value, keywordslist, dataSource, ischach } = this.state;
    const { isShop } = this.props;
    return (
      <div className="search">
        <div className="form">
          <AutoComplete
            // onSearch={this.handleSearch}
            placeholder={'请输入问题关键词，如：订单'}
            allowClear={false}
            style={{ height: '40px' }}
            onChange={this.onChangeValue.bind(this)}
            // dataSource={dataSource.map(this.renderOption.bind(this))}
            defaultActiveFirstOption={true}
            optionLabelProp={'text'}
            onFocus={this.focus}
            // onSelect={this.onSelect}
            value={value}
          >
          </AutoComplete>
          <div className="btn" onClick={this.search.bind(this, '')}>{isShop ? '搜全站' : '搜索'}</div>
        </div>
        <div className="keywords-div">
          <ul className="keywords-ul">
            {
              this.state.keyword.length > 0 ? this.state.keyword.map((item, index) => {
                return (
                  <li data-keyword={item.keyword_id} onClick={this.keywordVal.bind(this)} key={index}>{item.name}</li>
                )
              }) : null
            }
          </ul>
        </div>
        {/* <div className="select_box">
          <ul className="helpsearch_ul" id="menu-list" >
            <li onClick={this.clickBuyerHelp} className={this.props.Buyermerchant == 0 && this.state.helpTyle != 1 ? 'helpsearch_active' : ''}>买家帮助中心</li>
            <li onClick={this.clickSellerHelp} className={this.props.Buyermerchant == 1 || this.state.helpTyle == 1 ? 'helpsearch_active' : ''}>商家帮助中心</li>
          </ul>
        </div> */}
      </div>
    )
  }
}



// 取值
function mapStateToProps(state) {
  return {
    helpSearchListId: state.helpsearch.helpSearchListId,
    helpTitle: state.helpsearch.helpTitle,
    defaultSelectedKeys: state.helpsearch.defaultSelectedKeys,
    Buyermerchant: state.helpsearch.Buyermerchant
  }
}

// 存值
function mapDispatchToProps(dispatch) {
  return {
    changeListId: (state) => dispatch(state),
    contentListId: (state) => dispatch(state),
    changeBuyermerchant: (state) => dispatch(state)
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpSearch))

