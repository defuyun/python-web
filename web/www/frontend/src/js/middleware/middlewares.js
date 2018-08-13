// actions
import * as types from 'actions/type';

// components
import {router} from 'components/router';

// contents
import * as api from 'contents/api';

export const requestHandlerMiddleware = store => next => action => {
	if (action.type === types.NEW_API_REQUEST) {
		if (action.api.id === api.getPosts) {
			store.dispatch({type : types.FETCH_POSTS_SUCCESS, posts : [{postId:'1001',title: 'mock test'}]});
		}
		return;
	}

	next(action);
}

export const navigationMiddleware = store => next => action => {
	if (action.type === types.ACTIVE_ITEM_CHANGE) {
		const item = {...action.item};
		if (item.url) {
			router.push(item.url);
			store.dispatch({type: types.ACTIVE_ITEM_SET, activeItem: item});
		}
		return;
	}

	next(action);
}
