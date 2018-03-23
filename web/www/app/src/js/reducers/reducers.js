import {combineReducers} from 'redux'

const getEditorTitleChange = (state = '', action) => {
    switch(action.type) {
        case 'EDITOR_TITLE_CHANGE':
        case 'EDITOR_NEW_POST':
            return action.title
        default:
            return state
    }
}

const getEditorContentChange = (state = '', action) => {
    switch(action.type) {
        case 'EDITOR_CONTENT_CHANGE':
        case 'EDITOR_NEW_POST':
            return action.content
        default:
            return state
    }
}

const getEditorIdChange = (state = '', action) => {
    switch(action.type) {
        case 'EDITOR_ID_CHANGE':
        case 'EDITOR_NEW_POST':
            return action.id
        default:
            return state
    }
}

const getPost = (state = {}, action) => {
    switch(action.type) {
        case 'FETCH_POST_SUCCESS':
            return action.post
        default:
            return state
    }
}

const getPosts = (state = [], action) => {
    switch(action.type) {
        case 'FETCH_POSTS_SUCCESS':
            return action.posts
        default:
            return state
    }
}

const getSidenavOptions = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_SIDENAV_OPTIONS_SUCCESS':
            return action.options
        default:
            return state
    }
}

const rootReducer = combineReducers({
    options: getSidenavOptions,
    editorTitle: getEditorTitleChange,
    editorId: getEditorIdChange,
    editorContent: getEditorContentChange,
    posts: getPosts,
    post: getPost,
})

export default rootReducer
