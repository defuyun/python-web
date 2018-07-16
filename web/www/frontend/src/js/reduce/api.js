import requestDispatcher from 'common/request';
import * as action from 'reduce/action';
import * as constants from 'common/constants'

export const getUserInfo = requestDispatcher.createRestApi({
    config : {
        url : constants.getUserInfoApi,
        method : 'GET',
        credentials : 'same-origin'
    },
    actionCreator : action.userInfoActionCreator
});

export const getPosts = requestDispatcher.createRestApi({
    config : {
        url : constants.getPostsApi,
        method : 'GET',
        credentials : 'same-origin'
    },
    actionCreator : action.postsActionCreator
});

export const getPost = requestDispatcher.createRestApi({
    config : {
        url : constants.getPostApi,
        method : 'GET',
        credentials : 'same-origin'
    },
    actionCreator : action.postActionCreator
});