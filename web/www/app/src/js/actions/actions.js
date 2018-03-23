import {http_get} from 'common/http-helper'
import * as constants from 'common/constants'

const defaultDataProcessor = (data) => data

const requestDispatcher = (url, creator, dataProcessor=defaultDataProcessor) => (dispatch) => {
    const respJson = (data) => {
        dispatch(creator(dataProcessor(data)))
    }

    http_get({url, respJson})
}

export const getSidenav = requestDispatcher(constants.sidenavOptionsApi, (options) => {
    return {
        type : 'FETCH_SIDENAV_OPTIONS_SUCCESS',
        options
    }
})

export const getPost = (postId) => requestDispatcher(constants.getPostApi + postId,(post) => {
    post.content = post.text
    return {
        type: 'FETCH_POST_SUCCESS',
        post
    }
})

export const getPosts = requestDispatcher(constants.getPostsApi, (posts) => {
    return {
        type : 'FETCH_POSTS_SUCCESS',
        posts
    }
})

export const editorTitleChange = (title) => {
    return {
        type : 'EDITOR_TITLE_CHANGE',
        title
    }
}

export const editorContentChange = (content) => {
    return {
        type : 'EDITOR_CONTENT_CHANGE',
        content
    }
}

export const editorIdChange = (id) => {
    return {
        type : 'EDITOR_ID_CHANGE',
        id
    }
}

export const editorNewPost = (id, title, content) => {
    return {
        type : 'EDITOR_NEW_POST',
        id,
        title,
        content
    }
}

export const clearPost = () => {
    return {
        type : 'CLEAR_POST',
        post : {}
    }
}