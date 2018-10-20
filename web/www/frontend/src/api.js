import request from './request.js';
import * as log from 'loglevel';

const registerApi = request.createRestApi({
	url : BASE_URL + '/api/user/register', 
	method : 'POST', 
	credentials : 'include',
});

const userInfoApi = request.createRestApi({
	url : BASE_URL + '/api/user/info',
	method : 'GET',
	credentials : 'include',
});

const logoutApi = request.createRestApi({
	url : BASE_URL + '/api/user/signout',
	method : 'POST',
	credentials : 'include',
})

const loginApi = request.createRestApi({
	url : BASE_URL + '/api/user/login',
	method : 'POST',
	credentials : 'include',
})

const saveApi = request.createRestApi({
	url : BASE_URL + '/api/edit/save',
	method : 'POST',
	credentials : 'include',
})

const uploadApi = request.createRestApi({
	url : BASE_URL + '/api/edit/upload',
	method : 'FILE',
	credentials : 'include',
});

const postsApi = request.createRestApi({
	url : BASE_URL + '/api/posts',
	method : 'GET',
	credentials : 'include',
})

const postApi = request.createRestApi({
	url : BASE_URL + '/api/post',
	method : 'GET',
	credentials : 'include',
});

const tagsApi = request.createRestApi({
	url : BASE_URL + '/api/tags',
	method : 'GET',
	credentials : 'include',
});

const deleteApi = request.createRestApi({
	url : BASE_URL + '/api/edit/delete',
	method : 'POST',
	credentials : 'include',
});

const api = {
	delete : deleteApi,
	tags : tagsApi,
	post : postApi,
	posts : postsApi,
	userInfo : userInfoApi,
	register : registerApi,
	login : loginApi,
	logout : logoutApi,
	upload : uploadApi,
	save : saveApi
};

export {api};
