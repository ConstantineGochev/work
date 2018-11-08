import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import App from './App';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import {Provider} from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import "video-react/dist/video-react.css";




const store = createStore(reducers, {auth: {authenticated: localStorage.getItem('authenticated'),token: localStorage.getItem('token')}},  applyMiddleware(thunk));


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
