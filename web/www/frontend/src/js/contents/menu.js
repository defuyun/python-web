// components
import Posts from 'components/posts';
import Post from 'components/post';

// use home as the initial item
export const home = 'home';
export const posts = 'posts';
export const post = 'post';
export const edit = 'edit';
export const register = 'register';
export const login = 'login';
export const logout = 'logout';
export const account = 'account';

export default {
    [home] : {
		id : home,
        icon : 'home',
        tag : 'home',
        // this field specifies does this option require user login to display
        // 0: does not matter, 1: yes, 2: no
        display : 0,
        next : posts,
        url : '/home',
		// cachable: should we go through the whole render cycle if the selected item is the current active item
		cachable: true,
		component: null,
    },

    [posts] : {
		id : posts,
        icon : 'file',
        tag : 'posts',
        display : 0,
        next : edit,
        url : '/posts',
		cachable: false,
		component: Posts,
    },

	// post is not part of the linked list therefore it will not get displayed
	[post] : {
		id : post,
		url : '/posts/<:postId>',
		cachable: false,
		component: Post,
	},

    [edit] : {
		id : edit,
        icon : 'edit',
        tag : 'edit',
        display : 1,
        next : account,
        url : '/edit',
		cachable: true,
		component: null,
    },

    [account] : {
        icon : 'user',
        tag : 'account',
        display : 0,
        children : [
            register,
            login,
            logout,
        ],
        init : register,
        next : null
    },

    [register] : {
		id : register,
        icon : 'user-add',
        tag : 'register',
        display : 2,
        next : login,
        url : '/register',
		cachable: true,
		component: null,
    },

    [login] : {
		id: login,
        icon : 'login',
        tag : 'login',
        display : 2,
        next : logout,
        url : '/login',
		cachable: true,
		component: null,
    },

    [logout] : {
		id: logout,
        icon : 'logout',
        tag : 'logout',
        display : 1,
        next : null
    },

    // the first option on the list
    init : home,
}
