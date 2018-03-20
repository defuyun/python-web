import React from 'react'

import showdown from 'showdown'
import {connect} from 'react-redux'

import '../css/editor.css'
import '../../../node_modules/prismjs/themes/prism.css'
import '../../../node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css'
import '../../frameworks/codeflask/codeflask.css'

import Prism from 'prismjs'
import '../../../node_modules/prismjs/plugins/line-numbers/prism-line-numbers'
import '../../../node_modules/prismjs/components/prism-clike'
import '../../../node_modules/prismjs/components/prism-c'
import '../../../node_modules/prismjs/components/prism-cpp'
import '../../../node_modules/prismjs/components/prism-csharp'
import '../../../node_modules/prismjs/components/prism-python'
import '../../../node_modules/prismjs/components/prism-glsl'

import CodeFlask from 'codeflask'
import {editor} from '../actions/index'
import EditorHeader from './editor-header'

import '../../frameworks/github/github-markdown.css'

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

class Editor extends React.Component {
    constructor(props) {
        super(props)
        this.submitPost = this.submitPost.bind(this)
    }

    componentWillMount() {
        const converter = new showdown.Converter()

        this.setState({converter})
        this.setState({publishing: false})
        this.setState({publishSuccess: false})
    }

    componentDidMount() {
        const flask = new CodeFlask()
        this.setState({flask})
        flask.run('.bg-inner-editor', {language : 'markdown', lineNumbers: true})
        if(this.props.edit.text) {
            flask.update(this.props.edit.text)
        } else {
            this.props.onEdit({
                postId : guid(),
                title : '',
                text : ''
            })
        }

        flask.onUpdate((code) => {
            this.props.onEdit({
                ...this.props.edit,
                text : code
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        document.querySelectorAll('.markdown-body code').forEach((element) => {
            Prism.highlightElement(element)
        })
    } 

    submitPost(event) {
        const data = {
            post_id : this.props.edit.postId,
            title : this.props.edit.title,
            text : this.props.edit.text
        }

        this.setState({publishing: true})
        
        if(!this.props.edit.postId || !this.props.edit.title || !this.props.edit.text) {
            console.log('failed to send message')
            return
        }

        fetch('/publish', {
            credentials: 'include',
            body : JSON.stringify(data),
            headers: {
                'content-type' : 'application/json',
            },
            method : 'POST'
        }).then((response) => {
            const isSuccess = response.status === 200
            this.setState({
                publishing: false, 
                publishSuccess: isSuccess
            })
        }).catch((error) => {
            console.log(error)
            this.setState({
                publishing: false,
                publishSuccess: false
            })
        })
    }

    render() {
        return (
            <div className='bg-editor-publisher'>
                <div className='bg-editor'>
                    <EditorHeader submit={this.submitPost} />
                    <div className='bg-inner-editor'>
                    </div>
                </div>

                <div className='bg-editor-display'>
                    <div className='bg-editor-inner-display markdown-body' dangerouslySetInnerHTML={{
                            __html:this.props.edit.text ? this.state.converter.makeHtml(this.props.edit.text) : '',
                        }} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        edit: state.edit
    }
} 

function mapDispatchToProps(dispatch) {
    return {
        onEdit: (edit) => dispatch(editor(edit))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)