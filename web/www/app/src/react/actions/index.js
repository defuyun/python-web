const getSideNav = (options) => {
    return {
        type : 'FETCH_SIDENAV_OPTIONS_SUCCESS',
        options
    }
}

const getPost = (post) => {
    return {
        type: 'FETCH_POST_SUCCESS',
        post
    }
}

const getPosts = (posts) => {
    return {
        type : 'FETCH_POSTS_SUCCESS',
        posts
    }
}

export const editor = (post) => {
    return {
        type : 'EDITOR_CHANGE_INPUT',
        post
    }
}

export const posts = () => (dispatch) => {
    fetch('/posts')
    .then((response) => 
        response.json()
    )
    .then((responseJson) => {
        const posts = responseJson.data
        dispatch(getPosts(posts))
    })
    .catch((error) => {
        console.log(error)
    })
}

export const post = (postId) => (dispatch) => {
    fetch(`/posts/${postId}`)
    .then((response) => 
        response.json()
    )
    .then((responseJson) => {
        const post = responseJson.data
        dispatch(getPost(post))
    })
    .catch((error) => {
        console.log(error)
    })
}

export const sidenav = () => (dispatch) => {
    fetch('/sidenav_options')
    .then((response) => 
        response.json()
    )
    .then((responseJson) => {
        const data = responseJson.data
        dispatch(getSideNav(data))
    })
    .catch((error) => {
        console.log(error)
    })
}