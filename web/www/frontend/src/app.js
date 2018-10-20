import React from 'react';
import Modal from './modal.js';
import {connect} from 'react-redux';
import {getCookie} from './utils.js';

import AsyncComponent from './async-component.js';

import {concat} from './utils.js';
import {hot} from 'react-hot-loader';

import './app.css';


class App extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const {dispatch} = this.props;
		dispatch({type : 'INIT'});
	}

	render() {
		const {display} = this.props.modal || this.props;
		const {navisible} = this.props;
		
		return ( 
			<div className='app' styleName='app'>
				<div className={concat('cover','on-modal', display)} />
				<Modal {...this.props.modal} />
				<AsyncComponent loader={() => import('./nav.js')} />
				<div className={concat(concat('container', 'on-modal',display), 'on-nav', navisible)}>
					<AsyncComponent loader={() => import('./router.js')} />
				</div>
			</div>
		);
	}
}

const map = state => {
	return {
		modal : state.modal,
		navisible : state.navisible,
	}
}

export default hot(module)(connect(map)(App));
