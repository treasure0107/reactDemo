

import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";

// 底部li
const FooterList = (props) => {
  return (
    <Fragment>
      {
        props.lists && props.lists.length > 0 ? props.lists.map((i, index) => {
          return (
            <dl key={index}>
              <dt>{i.sort_name}</dt>
              {
                i.grouplist.length > 0 ? i.grouplist.map((item, inx) => {
                  return <dd key={inx}><a target="_blank" href={item.doc_url}>{item.doc_name}</a></dd>
                }) : null
              }
            </dl>
          )
        }) : null
      }
    </Fragment>
  )
}

export default FooterList;