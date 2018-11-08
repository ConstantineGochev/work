import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import {Router, browserHistory, HashRouter} from 'react-router'
import 'semantic-ui-css/semantic.min.css';
import reducers from './reducers'
import routes from './routes'
import App from './components/App';
import moment from 'moment'

global.moment = moment

const store = createStore(reducers, {
    auth: {authenticated: localStorage.getItem('token'),
           user_name: localStorage.getItem('user_name') }
}, applyMiddleware(thunk))

ReactDOM.render(
    <Provider store={store}>
         <Router  history={browserHistory} routes={routes} />
    </Provider>,
 document.getElementById('root'));

