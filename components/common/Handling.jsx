/**
 * Handling.jsx
 * 
 * Usage:
 * import Handling from 'components/common/Handling';
 * Handling.start();
 * Handling.stop();
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Spin, Alert } from 'antd';

import './style/handling.scss';

class Handling extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="ep-handling-box">
        <div className="ep-table">
          <div className="ep-table-middle">
            <Spin tip="Loading..." size={'large'}>
             
            </Spin>
          </div>
        </div>
      </div>
    )
  }
}

// Static variable used for storing DOM created.
let handlingDOM = null;

function start()
{
  const div = document.createElement('div');
  div.setAttribute('id','handlingDOM');
  document.body.appendChild(div);
  ReactDOM.render(<Handling />, div);
  handlingDOM = div;
}

function stop()
{
  let handlingDOM=document.getElementById('handlingDOM');
  if (handlingDOM) {
    ReactDOM.unmountComponentAtNode(handlingDOM);
    document.body.removeChild(handlingDOM);
    handlingDOM = null;
  }
}

export default {
  start() {
    start();
  },
  stop() {
    stop();
  }
};
