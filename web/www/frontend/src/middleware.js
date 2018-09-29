import menu from './menu-model.js';
import * as log from 'loglevel';
import {router} from './router.js';

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
