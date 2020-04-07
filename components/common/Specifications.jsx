

import React from "react";

import "./style/specifications.scss"

/**
 * 详情参数展示
 */
const Specifications = (props) => {
 class Specifications extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
             data: props.data,
         };
     }

     render () {
        return (
            <div className="specifications">
                {props.data.length > 0 ? (
                    props.data.map((i, index) => {
                        return (
                            <span onClick={props.click.bind(this,index)} className={i.check?'act':''} key={index}>{i.name}</span>
                        )
                    })
                ) : null}

            </div>
        )
     }
}

 const CityOrientation = (props) => {

 }

export default Specifications;


