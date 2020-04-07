import {createStore, applyMiddleware} from "redux"
import reducers from "./reducers"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../saga/index'

const sagaMiddleware = createSagaMiddleware()

const persistConfig = {
  key: 'root',
  storage,
  blacklist:['']
}

const persistedReducer = persistReducer(persistConfig, reducers)
export const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware))
export const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

store.subscribe( () => {
   // console.log(store.getState())
})