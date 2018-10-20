import {combineReducers} from 'redux';
import * as log from 'loglevel';

const navisible = (state = false, action) => {
	if (action.type === 'NAV_VISIBLE') {
		log.info(`[REDUCER] returning reducer {navisible} : ${action.visible}`);
		return action.visible;
	}
	return state;
}

const completeInit = (state = false, action) => {
	if (action.type === 'INIT') {
		log.info(`[REDUCER] returning reducer {completeInit} : false`);
		return false;	
	} else if (action.type === 'COMPLETE_INIT') {
		log.info(`[REDUCER] returning reducer {completeInit} : true`);
		return true;
	}
	return state;
}

const modal = (state = {}, action) => {
	if (action.type === 'UPDATE_MODAL') {
		log.info(`[REDUCER] returning reducer {modal} : ${JSON.stringify(action.modal)},`);
		return action.modal;
	}
	return state;
}

const userInfo = (state ={}, action) => {
	if (action.type === 'USER_INFO') {
		log.info(`[REDUCER] returning reducer {userInfo} : ${JSON.stringify(action.userInfo)},`);
		return action.userInfo;
	}
	return state;
}

const activeNavItem = (state = 'home', action) => {
	if (action.type === 'NAV_ITEM_CHANGE') {
		log.info(`[REDUCER] returning reducer {navItemChange} : ${JSON.stringify(action.id)},`);
		return action.id;
	}
	return state;
}

const draft = (state = null, action) => {
	if (action.type === 'CACHE_DRAFT') {
		log.info(`[REDUCER] returning reducer {draft} : ${JSON.stringify(action.draft)},`);
		return action.draft;
	}
	return state;
}

const posts = (state = null, action) => {
	if (action.type === 'CACHE_POSTS') {
		log.info(`[REDUCER] returning reducer {draft} : ${JSON.stringify(action.draft)},`);
		return action.posts;
	}
	return state;
}

const rootReducer = combineReducers({
	draft,
	userInfo,
	activeNavItem,
	modal,
	completeInit,
	navisible,
	posts,
});

export {rootReducer};
