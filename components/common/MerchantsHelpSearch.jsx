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

 调用方法
 <HeaderSearch hidekeywords={true}></HeaderSearch>
 hidekeywords 可不传； true 表示在搜索框下面不显示 热门搜索词汇
 isShop 是否店铺 店铺的话搜索按钮不一样

class MerchantsHelpSearch extends React.Component {
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
  }

  search(type) {
    let _this = this;
    localStorage.setItem("titleSearch", _this.state.value)
    httpRequest.get({
      url: api.helpdocument.detailscentern + '?status=0' + '&category_type=1' + '&search=' + _this.state.value,
    }).then(res => {
       console.log(res.data, '搜索出来的结果')
      _this.props.changeListId({
        type: "helpSearchListId",
        data: res.data.result,
        count: res.data.count,
        current: 1
      });
      this.props.history.push(`merchantshelp/merchantshelpsearch`)
      this.setState({
        value: ''
      })
    })
  }

   关键字搜索
  keywordVal(e) {
    let isvalue = e.target.innerHTML;
    let keyWord = e.target.getAttribute("data-keyword");
    localStorage.setItem("isvalue", e.target.innerHTML)
    httpRequest.get({
      url: api.helpdocument.tongji + '?id=' + keyWord
    }).then(res => {

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
      this.props.history.push(`merchantshelp/merchantshelpsearch`)
      this.setState({
        value: ''
      })
    })
  }

  componentDidMount() {
    setTimeout(() => {
      let helpTyle = sessionStorage.getItem("helpType");
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
    })
    let _this = this;
    $('.ant-input.ant-select-search__field').on('keydown', function name(e) {
      if ((e.keyCode == 13 || e.keyCode == 9) && _this.state.dataSource.length == 0) {
        _this.search(_this.props.match.params.type || 'goods')
      }
    })
  }

  onChangeValue(value, item) {
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
    }
  }



  render() {
    const { show, value, keywordslist, dataSource, ischach } = this.state;
    const { isShop } = this.props;
    console.log(isShop, '2222222222222')
    return (
      <div className="search">
        <div className="form">
          <AutoComplete
            placeholder={'请输入问题关键词，如：订单'}
            allowClear={false}
            style={{ height: '40px' }}
            onChange={this.onChangeValue.bind(this)}
            defaultActiveFirstOption={true}
            optionLabelProp={'text'}
            onFocus={this.focus}
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
      </div>
    )
  }
}



 取值
function mapStateToProps(state) {
  return {
    helpSearchListId: state.helpsearch.helpSearchListId,
    helpTitle: state.helpsearch.helpTitle,
    defaultSelectedKeys: state.helpsearch.defaultSelectedKeys,
    Buyermerchant: state.helpsearch.Buyermerchant
  }
}

 存值
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
)(MerchantsHelpSearch))

