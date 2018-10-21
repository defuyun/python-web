import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {rootReducer} from './reducer.js';
import {redirectMiddleware, modalMiddleware, requestMiddleware, navigationMiddleware} from './middleware.js';

import * as log from 'loglevel';

import App from './app.js';

const initialState = {
	modal : {display : false},
	activeNavItem : 'home',
	userInfo : {},
};

const store = createStore(
	rootReducer,
	initialState,
	applyMiddleware(redirectMiddleware, modalMiddleware, requestMiddleware, navigationMiddleware)
);

render(
	<Provider store={store}>
		<App />
	</Provider>, 
	document.getElementById('root')	
);
