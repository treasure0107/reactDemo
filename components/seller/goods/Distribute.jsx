import React, {Component} from 'react';
import Title from '../common/Title';
import {Tabs, Button} from 'antd';
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import httpRequest from 'utils/ajax';
import {sellerApi} from 'utils/api';
import '../common/style/distribute.scss';
import DistributeList from "./common/DistributeList";
import DistributeSale from "./common/DistributeSale";

const {TabPane} = Tabs;

class Distribute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleContent: '商品 - -我要分销',
      activeKey: '1',
    };
    this.callbackTabs = this.callbackTabs.bind(this);
  }

  callbackTabs(key) {
    if (key == 1) {
      this.setState({
        titleContent: '商品 - - 我要分销',
        activeKey: key
      })
    } else {
      this.setState({
        titleContent: '商品 - - 销售中',
        activeKey: key
      })
    }
  }

  render() {
    const {titleContent, activeKey} = this.state;
    return (
      <div>
        <Title title={titleContent}/>
        <div className="dis-list">
          <Tabs type="card" activeKey={activeKey} onChange={this.callbackTabs}>
            <TabPane tab="我要分销" key="1">
              <DistributeList activeKey={activeKey}/>
            </TabPane>
            <TabPane tab="销售中" key="2">
              <DistributeSale activeKey={activeKey}/>
            </TabPane>

          </Tabs>
        </div>
      </div>
    );
  }
}

export default Distribute;