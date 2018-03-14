import React from 'react'
import {connect} from 'react-redux'

import {post} from '../actions/index'
import showdown from 'showdown'

import '../css/editor.css'

class Post extends React.Component {
    constructor(props) {
        super(props)
        this.props.fetchPost(this.props.match.params.postId)
    }

    componentWillMount() {
        const converter = new showdown.Converter()
        this.setState({converter})
    }

    render() {
        return (
            <div className='bg-post'>
                <div className='bg-post-title'>
                    {this.props.post.title}
                </div>
                <div className='bg-post-content bg-inner-display' dangerouslySetInnerHTML={{__html:this.state.converter.makeHtml(this.props.post.text)}} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        post: state.post
    }
}

function mapDispatchProps(dispatch) {
    return {
        fetchPost: (postId) => dispatch(post(postId))
    }
}

export default connect(mapStateToProps, mapDispatchProps)(Post)