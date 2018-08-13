// common
import * as constants from 'common/constants'

// ,odd;eware
import * as api from 'middleware/api';

export const getUserInfo = 'getUserInfo';
export const getPosts = 'getPosts';
export const getPost = 'getPost';

// these are not just a map but the singleton holding the state of the api
export default {
	[getUserInfo] : {
		id : getUserInfo,
		method : api.getUserInfo,
	},

	[getPosts] : {
		id : getPosts,
		method : api.getPosts,
	},

	[getPost] : {
		id : getPost,
		method : api.getPost,
	},
};

