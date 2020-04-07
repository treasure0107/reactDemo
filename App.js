import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Router, Redirect } from 'react-router-dom';
import { Provider } from "react-redux";
import { store, persistor } from 'store'
import httpRequest from 'utils/ajax'
import MainRouter from 'router'
import { PersistGate } from 'redux-persist/integration/react'

const App = () => {
	return (
		<Fragment>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<BrowserRouter>
						<MainRouter />
					</BrowserRouter>
				</PersistGate>
			</Provider>
		</Fragment>
	)
}

export default App;
