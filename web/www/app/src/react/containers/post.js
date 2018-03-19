import React from 'react'
import {connect} from 'react-redux'

import {post} from '../actions/index'
import showdown from 'showdown'

import '../../../node_modules/prismjs/themes/prism.css'

import '../css/editor.css'
import '../css/post.css'
import '../../../node_modules/github-markdown-css/github-markdown.css'

import Prism from 'prismjs'
import '../../../node_modules/prismjs/plugins/line-numbers/prism-line-numbers'
import '../../../node_modules/prismjs/components/prism-clike'
import '../../../node_modules/prismjs/components/prism-c'
import '../../../node_modules/prismjs/components/prism-cpp'
import '../../../node_modules/prismjs/components/prism-csharp'
import '../../../node_modules/prismjs/components/prism-python'
import '../../../node_modules/prismjs/components/prism-glsl'

class Post extends React.Component {
    constructor(props) {
        super(props)
        this.props.fetchPost(this.props.match.params.postId)
    }

    componentWillMount() {
        const converter = new showdown.Converter()
        this.setState({converter})
    }
    
    componentDidUpdate(prevProps, prevState) {
        document.querySelectorAll('.markdown-body code').forEach((element) => {
            Prism.highlightElement(element)
        })
    } 

    render() {
        return (
            <div className='bg-post'>
                <div className='bg-post-title'>
                    {this.props.post.title}
                </div>
                <div className='bg-post-content bg-editor-inner-display markdown-body' dangerouslySetInnerHTML={{__html:this.state.converter.makeHtml(this.props.post.text)}} />
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