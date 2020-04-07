import React, { Component } from 'react'
import { withRouter } from "react-router";

export default (WrappedComponent) => {
  class LocComponent extends Component {
    constructor() {
      super();
      this.state = {
        selectIndex: ''
      }
    }
    componentWillReceiveProps(nextProps) {
      let pathname = nextProps.location.pathname;
      if (this.props.location.pathname != pathname) {
        const { menuList, OrderChildrenList } = nextProps;
        for (let i = 0; i < menuList.length; i++) {
          if (menuList[i].url == pathname || pathname.indexOf(menuList[i].url) != -1 || menuList[i].url.indexOf(pathname)!=-1) {
            this._child.setState({
              selectIndex: i
            });
            break;
          } else if(menuList[i].child){
            for (let j = 0; j < menuList[i].child.length; j++) {
              if (menuList[i].child[j] == pathname || pathname.indexOf(menuList[i].child[j]) != -1 || menuList[i].child[j].indexOf(pathname) != -1) {
                this._child.setState({
                  selectIndex: i
                })
              }
              break;
            }
          }
        }
      }
    }
    componentDidMount() {
      const { menuList } = this.props;
      let pathname = this.props.location.pathname;
      for (let i = 0; i < menuList.length; i++) {
         if(menuList[i].url == pathname||pathname.indexOf(menuList[i].url) != -1){
           this._child.setState({
             selectIndex: i
           })
         }
        if (menuList[i].url == pathname || pathname.indexOf(menuList[i].url) != -1 || menuList[i].url.indexOf(pathname)!=-1) {
          this._child.setState({
            selectIndex: i
          });
          break;
        } else if(menuList[i].child){
          for (let j = 0; j < menuList[i].child.length; j++) {
            if (menuList[i].child[j] == pathname || pathname.indexOf(menuList[i].child[j]) != -1 || menuList[i].child[j].indexOf(pathname) != -1) {
              this._child.setState({
                selectIndex: i
              });
              break;
            }
          }
        }
      }
    }

    render() {
      let { isActive, menuList } = this.props
      return <WrappedComponent isActive={isActive === false ? false : true} menuList={this.props.menuList} count={this.props.count} ref={child => this._child = child} {...this.props}  />
    }
  }

  return withRouter(LocComponent)
}
