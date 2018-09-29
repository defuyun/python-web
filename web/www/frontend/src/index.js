import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {rootReducer} from './reducer.js';
import {navigationMiddleware} from './middleware.js';

import App from './app.js';

const store = createStore(
	rootReducer,
	applyMiddleware(navigationMiddleware)
);

render(
	<Provider store={store}>
		<App />
	</Provider>, 
	document.getElementById('root')	
);
