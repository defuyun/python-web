import {combineReducers} from 'redux';

//actions
import {ACTIVE_ITEM_SET, FETCH_USERINFO_SUCCESS, FETCH_POSTS_SUCCESS, FETCH_POST_SUCCESS, CURRENT_PAGE_CHANGE} from 'actions/type';

const activeItemReducer = (state = '', action) => {
	switch(action.type) {
		case ACTIVE_ITEM_SET:
			return action.activeItem;
		default: 
			return state;
	}
}

const userInfoReducer = (state = {}, action) => {
    switch(action.type) {
        case FETCH_USERINFO_SUCCESS:
            return action.userInfo;
        default:
            return state;
    }
};

const postsReducer = (state = [], action) => {
    switch(action.type) {
        case FETCH_POSTS_SUCCESS:
            return action.posts;
        default: 
            return state;
    }
}

const perusingPostReducer = (state = {}, action) => {
    switch(action.type) {
        case FETCH_POST_SUCCESS:
            return action.post;
        default:
            return state;
    }
}

const currentPageReducer = (state = 0, action) => {
	switch(action.type) {
		case CURRENT_PAGE_CHANGE:
			return action.newPage;
		default:
			return state;
	}
}

export const rootReducer = combineReducers({
    userInfo : userInfoReducer,
    posts : postsReducer,
    perusingPost : perusingPostReducer,
	activeItem : activeItemReducer,
	currentPage : currentPageReducer,
});
