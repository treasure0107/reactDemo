
import React, { Component, Fragment } from 'react';
import SiteTopNav from './SiteTopNav';
import HomeTopNav from './HomeTopNav';
import CategoryList from './CategoryList';
import TabsNav from './TabsNav';

/**
 * 封装的头部 包含顶层位置 搜搜框 二级分类等等
 */
class MainTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render () {
        return (
            <Fragment>
                <SiteTopNav></SiteTopNav>
                <HomeTopNav></HomeTopNav>
                <div className="topmaintabs">
                    <div className="mg">
                        <CategoryList fix={this.props.fix?true:false}></CategoryList>
                        <TabsNav></TabsNav>
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default MainTop;
