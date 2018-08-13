import ReactDOM from 'react-dom';
import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import 'babel-polyfill';
import * as log from 'loglevel';
log.setLevel('info');

// actions
import {rootReducer} from 'actions/reducer';

// components
import App from 'components/app';
import Posts from 'components/posts';
import {router} from 'components/router';

// contents
import menu from 'contents/menu.js';

// middleware
import {requestHandlerMiddleware, navigationMiddleware} from 'middleware/middlewares';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk, requestHandlerMiddleware, navigationMiddleware)
)

router.registerStore(store);
Object.values(menu).filter(menuItem => menuItem.url && menuItem.component).forEach(menuItem => router.registerComponent(menuItem.url, menuItem.component));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
