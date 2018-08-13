// common
import requestDispatcher from 'common/request';
import * as constants from 'common/constants'

export const getUserInfo = requestDispatcher.createRestApi({
    url : constants.getUserInfoApi,
    method : 'GET',
    credentials : 'same-origin'
});

export const getPosts = requestDispatcher.createRestApi({
    url : constants.getPostsApi,
    method : 'GET',
    credentials : 'same-origin'
});

export const getPost = requestDispatcher.createRestApi({
    url : constants.getPostApi,
    method : 'GET',
    credentials : 'same-origin'
});
