import * as log from 'loglevel';
import React from 'react';

import animate from './animate.js';

import Register from './register.js';
import Login from './login.js';
import Edit from './edit.js';
import Posts from './posts.js';
import Post from './post.js';

import menu from './menu-model.js';

class __Router{
	constructor() {
		log.info('[ROUTER] constructing new router');
		this.update = this.update.bind(this);
		this.push = this.push.bind(this);
		this.hijackAnchor = this.hijackAnchor.bind(this);
		this.registerStore = this.registerStore.bind(this);
		this.registerRouterComponent = this.registerRouterComponent.bind(this);
		this.deregisterRouterComponent = this.deregisterRouterComponent.bind(this);
		this.registerComponent = this.registerComponent.bind(this);
		this.deregisterComponent = this.deregisterComponent.bind(this);
		
		if (!window.history) {
			log.error('[ROUTER] no history available');
		}

		this.routerComponents = [];
		this.components = {};
	}

	hijackAnchor(evt) {
		evt = evt || window.event;
		let target = evt.target || evt.srcElement;
		log.info('[ROUTER] hi jack triggered');
		while(target) {
			if(target instanceof HTMLAnchorElement) {
				let url = target.getAttribute('href');
				if (url.startsWith('http')) {
					url = url.slice(url.indexOf('/') + 2);
				}

				const [hostname, ...rest] = url.split('/');
				if (hostname.startsWith(location.hostname) || hostname === '') {
					log.info('[ROUTER] the link clicked on directs to an inner page');
					evt.preventDefault();
					const newLink = rest.join('/');
					this.push(newLink);
				}
				break;
			}
			target = target.parentNode;
		}
	} 

	push(path) {
		window.history.pushState({}, null, path);
		log.info(`[ROUTER] current location is ${window.location}`);
		this.update();
	}

	update(routerComp = null) {
		const validPath = path => path !== '';
		
		if(routerComp instanceof PopStateEvent) {
			routerComp = null;
		}

		const url = location.pathname.split('/').filter(validPath);
		let matchedComponent = null;
		let matchedProps = null;

		for (const [pathname, componentClass] of Object.entries(this.components)) {
			const componentUrl = pathname.split('/').filter(validPath);
			if (componentUrl.length !== url.length) {
				continue;
			}
			let props = {};
			let matched = true;

			for (let i = 0; i < componentUrl.length; i++) {
				let saveToProp = false;
				let currDir = componentUrl[i];
				
				if (currDir[0] === '<') {
					saveToProp = true;
					currDir = currDir.substr(1, currDir.length - 2);
				}
				const semiPos = currDir.indexOf(':');
				
				if (semiPos != -1) {
					log.info(`ROUTER] using regex for ${currDir} at path ${location.pathname}`);
					let regexStr;

					[regexStr, currDir] = currDir.split(':');
					
					const regexInst = RegExp(regexStr);
					if (!regexInst.test(url[i])) {
						matched = false;
						break;
					}
				} else {
					if (currDir !== url[i]) {
						matched = false;
						break;
					}
				}

				log.info(`[ROUTER] regex matched for ${pathname} at ${location.pathname}`);

				if (saveToProp) {
					log.info(`[ROUTER] saving to prop ${currDir} : ${url[i]}`);
					props[currDir] = url[i];
				}

			}

			if (matched) {
				matchedComponent = componentClass;
				matchedProps = {...props};
				break;
			}
		}

		if (matchedComponent === null) {
			log.info(`[ROUTER] current path ${location.pathname} did not match any components`);
		}

		if (routerComp) {
			routerComp.update(matchedComponent, matchedProps);
		} else {
			for (const rcomp of this.routerComponents) {
				rcomp.update(matchedComponent, matchedProps);
			}
		}
	}

	registerStore(store) {
		this.store = store;
		if (!this.store) {
			log.error('[ROUTER] registered store is null or undefined');
			return;
		}

		if (!this.store.dispatch) {
			log.error('[ROUTER] registered store does not contain dispatch');
			return;
		}
	}

	registerRouterComponent(component) {
		if (this.routerComponents.length === 0) {
			addEventListener('popstate', this.update);
			addEventListener('click',this.hijackAnchor, true);
		}
		this.routerComponents.push(component);
	}

	deregisterRouterComponent(component) {
		this.routerComponents.splice(routerComponents.indexOf(component),1);
		if (routerComponents.length === 0) {
			removeEventListner('popstate', this.update);
			removeEventListner('click', this.hijackAnchor, true);
		}
	}

	registerComponent(path, component) {
		log.info(`[ROUTER] registering url ${path}`);
		this.components[path] = component;	
	}

	deregisterComponent(path) {
		delete this.components[path];
	}
};

const router = new __Router();

router.registerComponent(menu.register.url, animate(Register));
router.registerComponent(menu.login.url, animate(Login));
router.registerComponent(menu.edit.url, animate(Edit));
router.registerComponent(menu.posts.url, animate(Posts));
router.registerComponent(menu.post.url, animate(Post));

class Router extends React.Component {
	constructor(props) {
		super(props);
		this.update = this.update.bind(this);
		this.state = {delay : false};
		this.setDelay = this.setDelay.bind(this);
	}

	componentWillMount() {
		router.registerRouterComponent(this);
		router.update(this);
	}

	componentWillUnmount() {
		router.deregisterRouterComponent(this);
	}

	update(component, props) {
		const prevc = this.state.component, prevp = this.state.props;
		this.setState({
			component, props, prevc, prevp, delay : true
		});
	}

	setDelay(delay) {
		function sd() {
			this.setState({delay});
		}
		return sd.bind(this);
	}

	render() {
		const {component, props, delay, prevc, prevp} = this.state;
		if (delay && prevc) {
			setTimeout(this.setDelay(false), 600);
			return React.createElement(prevc, {...prevp,delay})
		}

		if (component) {
			return React.createElement(component, props);
		}

		return null;
	}
}

export default Router;
export {router};
