import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { logger } from 'redux-logger'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createHashHistory } from 'history'
import reducers from 'redux/reducers'
import sagas from 'redux/sagas'
import Router from 'router'
import { ApolloProvider } from '@apollo/react-hooks'
import client from 'apollo/config'
import Localization from 'components/LayoutComponents/Localization'
import * as serviceWorker from './serviceWorker'

// app styles
import './global.scss'

const history = createHashHistory()
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
const middlewares = [thunk, sagaMiddleware, routeMiddleware]
if (process.env.NODE_ENV === 'development' && true) {
  middlewares.push(logger)
}
const store = createStore(reducers(history), compose(applyMiddleware(...middlewares)))
sagaMiddleware.run(sagas)

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Localization>
        <Router history={history} />
      </Localization>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root'),
)

serviceWorker.register()
export { store, history }
