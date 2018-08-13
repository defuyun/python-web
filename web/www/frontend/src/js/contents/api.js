// common
import * as constants from 'common/constants'
import requestDispatcher from 'common/request';

// types
import {getUserInfo, getPosts, getPost} from 'actions/type';

const getUserInfoApi = requestDispatcher.createRestApi({
    url : constants.getUserInfoApi,
    method : 'GET',
    credentials : 'same-origin'
});

const getPostsApi = requestDispatcher.createRestApi({
    url : constants.getPostsApi,
    method : 'GET',
    credentials : 'same-origin'
});

const getPostApi = requestDispatcher.createRestApi({
    url : constants.getPostApi,
    method : 'GET',
    credentials : 'same-origin'
});

// these are not just a map but the singleton holding the state of the api
export default {
	[getUserInfo] : {
		id : getUserInfo,
		method : getUserInfoApi,
	},

	[getPosts] : {
		id : getPosts,
		method : getPostsApi,
	},

	[getPost] : {
		id : getPost,
		method : getPostApi,
	},
};

