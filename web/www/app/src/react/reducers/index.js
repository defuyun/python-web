import {combineReducers} from 'redux'

const editor = (state = '', action) => {
    switch(action.type) {
        case 'EDITOR_CHANGE_INPUT':
            return action.post
        default:
            return state
    }
}

const post = (state = {}, action) => {
    switch(action.type) {
        case 'FETCH_POST_SUCCESS':
            return action.post
        default:
            return state
    }
}

const posts = (state = [], action) => {
    switch(action.type) {
        case 'FETCH_POSTS_SUCCESS':
            return action.posts
        default:
            return state
    }
}

const sidenav = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_SIDENAV_OPTIONS_SUCCESS':
            return action.options
        default:
            return state
    }
}

const rootReducer = combineReducers({
    options: sidenav,
    edit: editor,
    posts: posts,
    post: post
})

export default rootReducer