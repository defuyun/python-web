import ReactDOM from 'react-dom';
import React from 'react';
import {createStore, applyMiddleware} from 'redux';

import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {rootReducer} from 'reduce/reducer';
import App from 'components/app';
import 'babel-polyfill';

import * as log from 'loglevel';

log.setLevel('info');

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)