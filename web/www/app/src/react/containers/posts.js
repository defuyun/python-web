import React from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'

import {posts} from '../actions/index'

class Posts extends React.Component {
    constructor(props) {
        super(props)
        this.props.fetchPosts()
    }

    render() {
        return (
            <div className='bg-posts'>
                <ul className='bg-posts-list'>
                    {this.props.posts.map((post) => 
                        <li key={post.postId} className='bg-post-item'>
                            <Link to={`/posts/${post.postId}`}>
                                <span>{post.title}</span>
                                <span>{post.created}</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        posts: state.posts
    }
}

function mapDispatchProps(dispatch) {
    return {
        fetchPosts: () => dispatch(posts())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(Posts))