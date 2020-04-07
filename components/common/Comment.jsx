

import React from "react";
import { Rate } from 'antd';
import $ from "jquery";
import "./style/comment.scss"

/**
 * 评论组件 
 * curpindex 父级列表索引
 * cursindex 当前显示大图的索引
 * curbigimg 当前显示的大图
 * deg  当前显示的角度
 * commentlist 评论的列表数据
 */
class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curpindex: -1, 
            cursindex: -1,
            curbigimg: '',
            deg: 0,
        };
    }
    imgclick (pindex, sindex) {
        let { commentlist } = this.props;
        this.setdeg(0);
        commentlist.map(i => {
            i.showimglist = false
        })
        commentlist[pindex].showimglist = true;
        this.setState({
            curpindex: pindex,
            cursindex: sindex,
            commentlist: commentlist,
            curbigimg: commentlist[pindex].imglist[sindex].url
        })
    }
    bigimgleft () {
        let { commentlist } = this.props;
        let { curpindex, cursindex } = this.state;
        this.setdeg(0);
        if (cursindex > 0) {
            cursindex--;
            this.setState({
                cursindex,
                curbigimg: commentlist[curpindex].imglist[cursindex].url
            })
        }

    }
    bigimgright () {
        let { commentlist } = this.props;
        let { curpindex, cursindex } = this.state;
        this.setdeg(0);
        if (cursindex < commentlist[curpindex].imglist.length-1) {
            cursindex++;
            this.setState({
                cursindex,
                curbigimg: commentlist[curpindex].imglist[cursindex].url
            })
        }
    }
    turnleft () {
        this.setdeg(this.state.deg - 90);
    }
    turnright () {
        this.setdeg(this.state.deg + 90);
    }
    setdeg (deg) {
        this.state.deg = deg;
        let { curpindex } = this.state;
        $('#bigimg .imgs img').css('transform', 'rotate(' + deg + 'deg)');
    }

    render () {
        const { commentlist } = this.props;
        const { curpindex, cursindex, curbigimg } = this.state;
        return (

            <div className="comment ">
                <ul>
                    {
                        commentlist.length > 0 ? commentlist.map((item, ind) => {
                            return (
                                <li key={ind} className="clearfix">
                                    <div className="user fl">
                                        <img src={item.avaimg} alt="" />
                                        <p>{item.nick}</p>
                                        <p className="time">{item.time}</p>
                                    </div>
                                    <div className="fl main">
                                        <Rate disabled={true} defaultValue={item.star}></Rate>
                                        <p>{item.content}</p>
                                        <div className="imglist">
                                            {item.imglist.length > 0 ? item.imglist.map((i, index) => {
                                                return (
                                                    <img className={curpindex == ind && cursindex == index ? 'act' : ''} key={index} src={i.url} alt="" onClick={this.imgclick.bind(this, ind, index)} />

                                                )
                                            }) : null}
                                        </div>
                                        {item.showimglist ? (
                                            <div className="bigimg clearfix" id="bigimg">
                                                <div className="prev fl" onClick={this.bigimgleft.bind(this)}> &lt; </div>
                                                <div className="imgs fl">
                                                    <span onClick={this.turnleft.bind(this)} className="turnleft" >左转</span>
                                                    <span onClick={this.turnright.bind(this)} className="turnright">右转</span>
                                                    <img src={curbigimg} alt="" />
                                                </div>
                                                <div className="next fl" onClick={this.bigimgright.bind(this)}> &gt; </div>
                                            </div>
                                        ) : null}
                                        {item.sellcomment ? (
                                            <div className="sellcomment">
                                                <p>商家回复:</p>
                                                <p>{item.sellcomment}</p>
                                            </div>
                                        ) : null}

                                    </div>
                                </li>
                            )
                        }) : null
                    }
                </ul>
            </div>
        )
    }
}

// const CityOrientation = (props) => {

// }

export default Category;


