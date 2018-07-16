import {combineReducers} from 'redux';

const userInfoReducer = (state = {}, action) => {
    switch(action.type) {
        case 'FETCH_USERINFO_SUCCESS':
            return action.userInfo;
        default:
            return state;
    }
};

const postsReducer = (state = [], action) => {
    switch(action.type) {
        case 'FETCH_POSTS_SUCCESS':
            return action.posts;
        default: 
            return state;
    }
}

const postReducer = (state = {}, action) => {
    switch(action.type) {
        case 'FETCH_POST_SUCCESS':
            return action.post;
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    userInfo : userInfoReducer,
    posts : postsReducer,
    post : postReducer
});