import React from 'react';
import Nav from './nav.js';
import Router, {router} from './router.js';
import menu from './menu-model.js';
import Modal from './modal.js';
import {connect} from 'react-redux';
import {getCookie} from './utils.js';

import animate from './animate.js';
import Register from './register.js';
import Login from './login.js';
import Edit from './edit.js';

import './app.css';

router.registerComponent(menu.register.url, animate(Register));
router.registerComponent(menu.login.url, animate(Login));
router.registerComponent(menu.edit.url, animate(Edit));

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const {dispatch} = this.props;
		dispatch({type : 'INIT_PAGE'});
	}

	render() {
		const {display} = this.props.modal || this.props;

		return ( 
			<div className='app' styleName='app'>
				<div className={'cover' + (display ? ' on-modal' : '')} />
				<Modal {...this.props.modal} />
				<Nav /> 
				<div className={'container' + (display ? ' on-modal': '')}>
					<Router /> 
				</div>
			</div>
		);
	}
}

const map = state => {
	return {
		modal : state.modal,
	}
}

export default connect(map)(App);
