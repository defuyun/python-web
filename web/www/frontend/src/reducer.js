import {combineReducers} from 'redux';
import * as log from 'loglevel';

const navisible = (state = false, action) => {
	log.info(`[REDUCER] triggered reducer {navisible},`);
	if (action.type === 'NAV_VISIBLE') {
		log.info(`[REDUCER] returning reducer {navisible} : ${action.visible}`);
		return action.visible;
	}
	return state;
}

const completeInit = (state = false, action) => {
	log.info(`[REDUCER] triggered reducer {completeInit},`);
	if (action.type === 'INIT_PAGE') {
		log.info(`[REDUCER] returning reducer {completeInit} : false`);
		return false;	
	} else if (action.type === 'COMPLETE_PAGE') {
		log.info(`[REDUCER] returning reducer {completeInit} : true`);
		return true;
	}
	return state;
}

const modal = (state = {}, action) => {
	log.info(`[REDUCER] triggered reducer {modal},`);
	if (action.type === 'UPDATE_MODAL') {
		log.info(`[REDUCER] returning reducer {modal} : ${JSON.stringify(action.modal)},`);
		return action.modal;
	}
	return state;
}

const userInfo = (state ={}, action) => {
	log.info(`[REDUCER] triggered reducer {userInfo},`);
	if (action.type === 'USER_INFO') {
		log.info(`[REDUCER] returning reducer {userInfo} : ${JSON.stringify(action.userInfo)},`);
		return action.userInfo;
	}
	return state;
}

const activeNavItem = (state = 'home', action) => {
	log.info(`[REDUCER] triggered reducer {navItemChange},`);
	if (action.type === 'NAV_ITEM_CHANGE') {
		log.info(`[REDUCER] returning reducer {navItemChange} : ${JSON.stringify(action.id)},`);
		return action.id;
	}
	return state;
}

const rootReducer = combineReducers({
	userInfo,
	activeNavItem,
	modal,
	completeInit,
	navisible,
});

export {rootReducer};
