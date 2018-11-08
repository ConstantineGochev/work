import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers';
import axios from 'axios';
import thunk from 'redux-thunk';
import './styles/index.css';


global.axios = axios
const store_with_middleware = applyMiddleware(thunk)(createStore);
ReactDOM.render(<Provider store={store_with_middleware(reducers)}>
                    <App />
                </Provider>, document.getElementById('root'));

