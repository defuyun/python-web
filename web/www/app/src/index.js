import './index.css'
import './frameworks/bootstrap/css/bootstrap.css'
import './frameworks/fontawesome/web-fonts-with-css/css/fontawesome.css'
import './frameworks/fontawesome/svg-with-js/js/fontawesome-all'

import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './react/reducers/index'
import App from './react/components/app'


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