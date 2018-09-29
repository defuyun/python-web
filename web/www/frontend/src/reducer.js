import {combineReducers} from 'redux';
import * as log from 'loglevel';

const userInfo = (state ={}, action) => {
	log.info(`[REDUCER] triggered reducer {userInfo},`);
	if (action.type === 'USER_INFO') {
		return action.userInfo;
	}
	return state;
}

const activeNavItem = (state = 'home', action) => {
	log.info(`[REDUCER] triggered reducer {navItemChange},`);
	if (action.type === 'NAV_ITEM_CHANGE') {
		return action.id;
	}
	return state;
}

const rootReducer = combineReducers({
	userInfo,
	activeNavItem,
})

export {rootReducer};
