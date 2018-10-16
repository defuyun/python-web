import menu from './menu-model.js';
import * as log from 'loglevel';
import {router} from './router.js';
import * as api from './api.js';
import {TextMessage} from './message.js';

import crypto from 'crypto-js';

let spinnerLock = 0;

export const initMiddleware = store => next => action => {
	log.info('[MIDDLEWARE] enter init middleware');
	if (action.type === 'INIT_PAGE') {
		setTimeout(() => store.dispatch({type : 'API_CALL', id : 'userInfo'}), 200);
	}
	next(action);
}

const delayModalUpdate = (modal, store, action) => {
	if (action.type === 'DISPLAY_SPINNER') {
		spinnerLock += 1;
	}

	if (action.type === 'DISPLAY_SPINNER' && modal.msgType === 'spinner') {
		return;
	}

	store.dispatch({type : 'UPDATE_MODAL', modal : {display : false}});
	setTimeout(() => store.dispatch({...action}), 500);
}

export const modalMiddleware = store => next => action => {
	log.info('[MIDDLEWARE] enter modal middleware');
	
	if (action.type === 'DISPLAY_MESSAGE' || action.type === 'DISPLAY_SPINNER') {
		const {modal} = store.getState();
		if (modal.display) {
			delayModalUpdate(modal, store, action);
			return next(action);
		}
	}

	if (action.type === 'DISPLAY_MESSAGE') {
		const {msgType, text} = action;
		spinnerLock = 0;
		store.dispatch({type : 'UPDATE_MODAL', modal : {
			msgType, text, display : true, manual : true, component : TextMessage,
		}});
	} else if (action.type === 'DISPLAY_SPINNER') {
		spinnerLock += 1;
		const msgType = 'spinner', text = 'loading', icon = 'spinner';
		store.dispatch({type : 'UPDATE_MODAL', modal : {
			msgType, text, icon, display : true, manual : false, component : TextMessage,
		}});
	} else if (action.type === 'HIDE_SPINNER') {
		const {modal} = store.getState();
		spinnerLock -= 1;
		modal.display && modal.msgType === 'spinner' && spinnerLock === 0 &&
			store.dispatch({type : 'UPDATE_MODAL', modal : {display : false}});
	}

	next(action);
}

export const requestMiddleware = store => next => action => {
	log.info('[MIDDLEWARE] enter request middleware');
	if (action.type === 'API_CALL') {
		const {id, params, callback} = action;
		
		const genericResponseHandler = module => response => {
			log.info(`[MIDDLEWARE] received response from ${module} ${JSON.stringify(response)}`);
			return response.status === 200 ? response.json() : response.text();
		};

		const genericBodyHandler = (filter, callback) => body => {
			if(filter(body)) {
				callback(body);
				setTimeout(() => store.dispatch({type : 'HIDE_SPINNER'}),1000);
			} else {
				throw body;
			}
		}

		const genericErrorHandler = module => error => store.dispatch({
			type : 'DISPLAY_MESSAGE',
			msgType : 'error', 
			text : `There was an error trying to fetch ${module} ${error.toString()}`
		});

		store.dispatch({type : 'DISPLAY_SPINNER'});
		
		if (id === 'register') { 			
			let args = {...params};
			args.password = crypto.SHA1(args.email + args.password).toString();

			api.registerApi(args).then(genericResponseHandler(id))
			.then(genericBodyHandler(
				body => body.user, 
				({user}) => {
					store.dispatch({type : 'USER_INFO', userInfo : user});
					setTimeout(() => store.dispatch({type : 'DISPLAY_MESSAGE', msgType : 'info', text : 'you have succesfully registered'}),500);
					return true;
				}
			))
			.catch(genericErrorHandler(id));
		}
		
		if (id === 'userInfo') {
			api.userInfoApi({}).then(genericResponseHandler(id))
			.then(genericBodyHandler(
				body => body.user,
				({user}) => {
					store.dispatch({type : 'USER_INFO', userInfo : user});
					if (!store.getState().completeInit) {
						setTimeout(() => store.dispatch({type : 'COMPLETE_PAGE'}), 1000);
					}
				}			
			))
			.catch(genericErrorHandler(id));
		}

		if (id === 'logout') {
			api.logoutApi({}).then(genericResponseHandler(id))
			.then(genericBodyHandler(
				body => body.user,
				({user}) => 
					store.dispatch({type : 'USER_INFO', userInfo : user})))
			.catch(genericErrorHandler(id));
		}

		if (id === 'login') {
			let args = {...params};
			args.password = crypto.SHA1(args.email + args.password).toString();
			
			api.loginApi(args).then(genericResponseHandler(id))
			.then(genericBodyHandler(
				body => body.user,
				({user}) => store.dispatch({type : 'USER_INFO', userInfo : user})))
			.catch(genericErrorHandler(id));
		}

		if (id === 'save') {
			const {uploaded} = action;
			if (!uploaded) {
				store.dispatch({type : 'API_CALL',id : 'upload', params, save : true});
			} else {
				api.saveApi(params.tosave()).then(response => {
					if (response.status === 200) {
						store.dispatch({type : 'DISPLAY_MESSAGE', msgType : 'info', text : 'post has been saved'});
					} else {
						throw 'save was not successful'
					}
				}).catch(genericErrorHandler(id));
			}
		}

		if (id === 'upload') {
			const files = params.getunsynced();
			if (files.length !== 0) {
				api.uploadApi(files).then(response => {
					if( response.status !== 200) {
						throw 'upload was not successful';
					}
				}).catch(genericErrorHandler(id));
			}
			
			if(action.save) {
				setTimeout(() => store.dispatch({type : 'API_CALL', id : 'save', params, uploaded : true}),1000);
			}
		}

		if (id === 'posts') {
			api.postsApi({}).then(genericResponseHandler(id)).then(genericBodyHandler(
				body => body.posts,
				callback		
			)).catch(genericErrorHandler(id));
		}

		if (id === 'tags') {
			api.tagsApi({}).then(genericResponseHandler(id)).then(genericBodyHandler(
				body => body.tags,
				callback		
			)).catch(genericErrorHandler(id));
		}

		if (id === 'post') {
			api.postApi(params).then(genericResponseHandler(id)).then(genericBodyHandler(
				body => body.post,
				callback		
			)).catch(genericErrorHandler(id));
		}

		if (id === 'delete') {
			api.deleteApi(params.tosave()).then(response => {
				if (response.status !== 200) {
					throw 'failed to delete post'; 
				}
				store.dispatch({type : 'HIDE_SPINNER'});
				store.dispatch({type : 'NAV_ITEM_CHANGE', id : 'posts'});
			}).catch(genericErrorHandler(id));
		}
	}

	next(action);
}

export const navigationMiddleware = store => next => action => {
	log.info('[MIDDLEWARE] enter navigation middleware');
	if (action.type === 'NAV_ITEM_CHANGE') {
		const item = menu[action.id];
		if(item) {
			router.push(item.url);		
		} else {
			log.warn(`[MIDDLEWARE] invalid transition in navigation for ${action.id}`);
		}
	}
	next(action);
}
