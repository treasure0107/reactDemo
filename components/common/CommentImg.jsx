import React from 'react';
import './style/commentImg.scss'

class CommentImg extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tag:-1, //当前索引
            comment_pic:this.props.comment_pic,
            len:this.props.comment_pic.length,
            tagSrc:null,
            rotate:0,
            time:0,
            iniTime:0.4
        }
    }

    switchImg = (idx) => {
        console.log(idx)
        this.setState({
            time:0,
            tagSrc: this.state.comment_pic[idx]["pic_url"],
            tag:idx,
            rotate:0
        })
    }
    switchTo = (step) => {
        let tagidx = this.state.tag + step*1;
       let _tagidx = step==-1? Math.max(tagidx,0) : Math.min(tagidx,this.state.len-1)
        this.switchImg(_tagidx)
    }
    rotateFn = () => {
        let iniTime =this.state.iniTime;
        let time =this.state.time;

        if(iniTime != time){
            this.setState({
                time:iniTime
            },() => {})
        }
        
        let rotate = this.state.rotate;
        rotate -= 90;
        this.setState({
            rotate
        })
    }

    render(){
        const { comment_pic,tagSrc,tag,len,time } = this.state;
        return(
            <div className="comment_imgs_list">
                <ul className="small_list">
                    {
                    comment_pic.map((item,idx) => {
                        return (
                        <li 
                            key={idx}
                            className={tag==idx?"tag":""} 
                            onClick={() => this.switchImg(idx)}>
                                <img src={item.pic_url}></img>
                        </li>
                        )
                    })
                    }
            </ul>
            {
                tagSrc && 
                <div className="imgShow_wrap">

                        <span onClick={() => this.switchTo(-1)} className={`iconfont2 lft ${tag==0? "disable": ""}`}>&#xe64c;</span>
                        <span onClick={() => this.switchTo(1)} className={`iconfont2 rt ${tag==len-1? "disable": ""}`}>&#xe64b;</span>
                        <span onClick={() => this.rotateFn()} className="iconfont2 rotate">&#xe603;</span>
                    <img style={{transition:"transform "+time+"s linear",transform:"rotate("+ this.state.rotate +"deg)"}} src={tagSrc}></img>
                </div>
            }
            
            </div>
        )
    }
}

export default CommentImg;