export default {
    home : {
        icon : 'home',
        tag : 'home',
        // this field specifies does this option require user login to display
        // 0: does not matter, 1: yes, 2: no
        display : 0,
        next : 'posts',
        url : 'home',
    },

    posts : {
        icon : 'file',
        tag : 'posts',
        display : 0,
        next : 'edit',
        url : 'posts',
    },

    edit : {
        icon : 'edit',
        tag : 'edit',
        display : 1,
        next : 'account',
        url : 'edit',
    },

    account : {
        icon : 'user',
        tag : 'account',
        display : 0,
        children : [
            'register',
            'login',
            'logout'
        ],
        init : 'register',
        next : null
    },

    register : {
        icon : 'user-add',
        tag : 'register',
        display : 2,
        next : 'login',
        url : 'register',
    },

    login : {
        icon : 'login',
        tag : 'login',
        display : 2,
        next : 'logout',
        url : 'login',
    },

    logout : {
        icon : 'logout',
        tag : 'logout',
        display : 1,
        next : null
    },

    // the first option on the list
    init : 'home',
}