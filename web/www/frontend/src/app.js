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
import Posts from './posts.js';
import Post from './post.js';

import {concat} from './utils.js';
import {hot} from 'react-hot-loader';

import './app.css';

router.registerComponent(menu.register.url, animate(Register));
router.registerComponent(menu.login.url, animate(Login));
router.registerComponent(menu.edit.url, animate(Edit));
router.registerComponent(menu.posts.url, animate(Posts));
router.registerComponent(menu.post.url, animate(Post));

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
		const {navisible} = this.props;
		
		return ( 
			<div className='app' styleName='app'>
				<div className={concat('cover','on-modal', display)} />
				<Modal {...this.props.modal} />
				<Nav /> 
				<div className={concat(concat('container', 'on-modal',display), 'on-nav', navisible)}>
					<Router /> 
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
