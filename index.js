import "react-app-polyfill/ie9"
import 'react-app-polyfill/stable';


import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter, Router, Redirect } from 'react-router-dom';
import { Provider } from "react-redux";
import { store, persistor } from 'store'
import httpRequest from 'utils/ajax'
import MainRouter from 'router'
import { PersistGate } from 'redux-persist/integration/react'
import { AppContainer } from 'react-hot-loader'
import "assets/style/reset.scss";

import { LocaleProvider, message } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// config message global
message.config({
  top:'35%',
  duration: 1,
  maxCount: 1,
})


if (module.hot) {
  // console.log("module.hot=", module.hot);
  module.hot.accept("./router/index.js", () => {
    const _router = require("./router/index.js").default;
    renderWithHot(_router);
  })
}

function renderWithHot (MainRouter) {
  ReactDOM.render(
    <AppContainer>
      <Fragment>
        <LocaleProvider locale={zh_CN}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <BrowserRouter>
                <MainRouter />
              </BrowserRouter>
            </PersistGate>
          </Provider>
        </LocaleProvider>
      </Fragment>
    </AppContainer>, document.getElementById('root'));
}

renderWithHot(MainRouter);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
