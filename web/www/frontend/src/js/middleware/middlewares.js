import * as log from 'loglevel';

// actions
import * as types from 'actions/type';

// components
import {router} from 'components/router';

// contents
import * as api from 'contents/api';
import menu from 'contents/menu';

export const requestHandlerMiddleware = store => next => action => {
	if (action.type === types.NEW_API_REQUEST) {
		log.info(`[MIDDLEWARE] dispatching new api request change ${action.api}`);
		if (action.api === types.getPosts) {
			store.dispatch({type : types.FETCH_POSTS_SUCCESS, posts : [{postId:'1001',title: 'mock test'}]});
		}
		return;
	}

	next(action);
}

export const navigationMiddleware = store => next => action => {
	if (action.type === types.ACTIVE_ITEM_CHANGE) {
		log.info(`[MIDDLEWARE] dispatching active item change ${action.item}`);
		const item = {...menu[action.item]};
		if (item.url) {
			router.push(item.url);
			store.dispatch({type: types.ACTIVE_ITEM_SET, activeItem: item.id});
		}
		return;
	}

	next(action);
}
