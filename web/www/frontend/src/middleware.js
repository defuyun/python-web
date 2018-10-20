import menu from './menu-model.js';
import * as log from 'loglevel';
import {router} from './router.js';
import {api} from './api.js';
import {TextMessage} from './message.js';
import {createAggregate} from './utils.js';

let spinnerLock = 0;

const genericResponseHandler = module => store => successMsg => response => {
	log.info(`[MIDDLEWARE] received response from ${module}: <status : ${response.status}>`);
	if (response.status === 200) {
		if (successMsg) {
			store.dispatch({type : 'DISPLAY_MESSAGE', msgType : 'info', text : successMsg})
		}
		return response.headers.get('content-type').indexOf('application/json') !== -1 ? response.json() : null;
	} else {
		return response.text();
	}
};

const genericBodyHandler = store => (filter, callback) => body => {
	if (typeof(body) === 'string') {
		throw body;
	}

	const performCb = filter instanceof Function ? filter(body) : filter;
	if(performCb) {
		callback(body);
	}
	store.dispatch({type : 'HIDE_SPINNER'});
}

const genericErrorHandler = module => store => error => store.dispatch({
	type : 'DISPLAY_MESSAGE',
	msgType : 'error', 
	text : `There was an error trying to fetch ${module} ${error.toString()}`
});

export const initMiddleware = store => next => action => {
	if (action.type === 'INIT') {
		store.dispatch({type : 'API_CALL', id : 'userInfo', callback : () => store.dispatch({type : 'COMPLETE_INIT'}) });
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
	store.dispatch({type : 'HIDE_SPINNER'});
		spinnerLock += 1;
		const msgType = 'spinner', text = 'loading', icon = 'spinner';
		store.dispatch({type : 'UPDATE_MODAL', modal : {
			msgType, text, icon, display : true, manual : false, component : TextMessage,
		}});
	} else if (action.type === 'HIDE_SPINNER') {
		const {modal} = store.getState();
		spinnerLock -= 1;
		if (spinnerLock < 0) spinnerLock = 0;
		modal.display && modal.msgType === 'spinner' && spinnerLock === 0 &&
			store.dispatch({type : 'UPDATE_MODAL', modal : {display : false}});
	}

	next(action);
}

export const redirectMiddleware = store => next => action => {
	if (action.id === 'save') {
		const params = action.params;
		const unsyncedFiles = params.getunsynced();
		if (unsyncedFiles.length !== 0) {
			store.dispatch({type : 'API_CALL', id : 'upload', params, callback : () => store.dispatch({...action})});
			return;
		}
	}

	if (action.id === 'delete') {
		action.callback = createAggregate(action.callback, () => store.dispatch({type : 'NAV_ITEM_CHANGE', id : 'posts'}));
	}

	next(action)
}

export const requestMiddleware = store => next => action => {
	if (action.type === 'API_CALL') {
		const {id} = action;
		let params = action.params || {};
		let callback = action.callback || (() => {});

		store.dispatch({type : 'DISPLAY_SPINNER'});
		
		const respHandlerMaker = genericResponseHandler(id)(store);
		const respBodyHandlerMaker = genericBodyHandler(store);
		const errorHandler = genericErrorHandler(id)(store);
	

		let respHandler = respHandlerMaker();
		let respBodyHandler = respBodyHandlerMaker(true, callback);

		if (id === 'register' || id === 'userInfo' || id === 'logout' || id === 'login') {
			callback = createAggregate(({user}) => store.dispatch({type : 'USER_INFO', userInfo : user}), callback);
			respHandler = id === 'register' ? respHandlerMaker('you have successfully registered') : respHandler;
			respBodyHandler = respBodyHandlerMaker(body => body.user, callback);
		} 
		
		else if (id === 'save') {
			params = params.tosave();
			respHandler = respHandlerMaker('post has been saved');
		} 
		
		else if (id === 'upload') {
			const sync = params.syncall;
			params = params.getunsynced();
			callback = createAggregate(sync, callback);
			respBodyHandler = respBodyHandlerMaker(true, callback);
		}

		else if (id === 'posts') {
			respBodyHandler = respBodyHandlerMaker(body => body.posts, callback);
		}

		else if (id === 'post') {
			respBodyHandler = respBodyHandlerMaker(body => body.post, callback);
		}

		else if (id === 'tags') {
			respBodyHandler = respBodyHandlerMaker(body => body.tags, callback);
		}

		else if (id === 'delete') {
			params = params.tosave();
		}
		const request = api[id];

		request(params).then(respHandler).then(respBodyHandler).catch(errorHandler);
	}

	next(action);
}

export const navigationMiddleware = store => next => action => {
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
