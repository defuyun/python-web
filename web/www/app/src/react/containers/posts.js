import React from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'

import '../css/posts.css'
import {posts} from '../actions/index'

class Posts extends React.Component {
    constructor(props) {
        super(props)
        this.props.fetchPosts()
    }

    render() {
        return (
            <div className='bg-posts'>
                <div className='bg-posts-category'>
                    <span className='bg-posts-category-item bg-posts-category-title'>Title</span>
                    <span className='bg-posts-category-item bg-posts-category-created'>Created</span>
                    <span className='bg-posts-category-item bg-posts-category-modified'>Modified</span>
                </div>
                <ul className='bg-posts-list'>
                    {this.props.posts.map((post) => 
                        <li key={post.postId} className='bg-posts-item'>
                            <div className='bg-posts-title'>
                                <Link to={`/posts/${post.postId}`}>
                                    <span className='bg-posts-inner-title'>{post.title}</span>
                                </Link>
                            </div>
                            <span className='bg-posts-date bg-posts-created'>{`${post.created.year}/${post.created.month}/${post.created.day}`}</span>
                            <span className='bg-posts-date bg-posts-modified'>{`${post.modified.year}/${post.modified.month}/${post.modified.day}`}</span>
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