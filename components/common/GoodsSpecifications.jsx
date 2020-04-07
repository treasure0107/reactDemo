

import React from "react";

import "./style/goods-specifications.scss"
import Specifications from "./Specifications"

/**
 * 商品具体规格参数啥的
 * data 传进来的数据
 * Specifications 为二级的内容
 */
class GoodsSpecifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
        };
    }
    click(index,val){
         let arr=this.state.data.map((i,inx)=>{
             i[inx].gui[]
             i.map((item,index)=>{
                 item.check=false
             })
         })
        let data=this.state.data;
        data[index].gui.map(i=>{
            i.check=false;
        })
        data[index].gui[val].check=true;
        this.setState({
            data
        })
        this.props.changespe(data)
    }

    render () {
        return (
            <div className="goodsspecifications">
                <ul>
                    {this.state.data.length > 0 ? (
                        this.state.data.map((i,index) => {
                            return (<li key={index}>
                                <div className="name">{i.name}</div>
                                <Specifications click={val=>this.click(index,val)} data={i.gui}></Specifications>
                            </li>)
                        })
                    ) : null}

                </ul>
            </div>
        )
    }
}

 const CityOrientation = (props) => {

 }

export default GoodsSpecifications;


