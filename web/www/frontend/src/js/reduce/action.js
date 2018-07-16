import * as log from 'loglevel'

export const userInfoActionCreator = ({userInfo}) => {
    return {
        type : 'FETCH_USERINFO_SUCCESS',
        userInfo
    };
}

export const postsActionCreator = ({posts}) => {
    return {
        'type' : 'FETCH_POSTS_SUCCESS',
        posts
    };
}

export const postActionCreator = ({post}) => {
    return {
        'type' : 'FETCH_POST_SUCCESS',
        post
    }
}