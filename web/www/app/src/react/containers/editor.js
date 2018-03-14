import React from 'react'

import showdown from 'showdown'
import {connect} from 'react-redux'

import '../css/editor.css'
import '../../../node_modules/prismjs/themes/prism.css'
import '../../../node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css'
import '../../../node_modules/codeflask/src/codeflask.css'

import prism from 'prismjs'
import '../../../node_modules/prismjs/plugins/line-numbers/prism-line-numbers'

import CodeFlask from 'codeflask'
import {editor} from '../actions/index'

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

class Editor extends React.Component {

    componentWillMount() {
        const converter = new showdown.Converter()
        this.titleChange = this.titleChange.bind(this)
        this.submitPost = this.submitPost.bind(this)
        this.resetEdit = this.resetEdit.bind(this)
        this.setState({converter})
        this.setState({publishing: false})
        this.setState({publishSuccess: false})
    }

    componentDidMount() {
        const flask = new CodeFlask()
        this.setState({flask})
        flask.run('.bg-editor', {language : 'javascript', lineNumbers: true})
        if(this.props.edit.text) {
            flask.update(this.props.edit.text)
            this.refs.titleField.value = this.props.edit.title
        } else {
            this.props.onEdit({
                ...this.props.edit,
                postId : guid()
            })
        }

        flask.onUpdate((code) => {
            this.props.onEdit({
                ...this.props.edit,
                text : code
            })
        })
    }

    titleChange(event) {
        this.props.onEdit({
            ...this.props.edit,
            title : event.target.value
        })
    }

    resetEdit() {
        this.props.onEdit({
            postId : guid()
        })
        this.state.flask.update('')
        this.refs.titleField.value = ''
    }

    submitPost(event) {
        const data = {
            post_id : this.props.edit.postId,
            title : this.props.edit.title,
            text : this.props.edit.text
        }

        this.setState({publishing: true})

        fetch('/publish', {
            body : JSON.stringify(data),
            headers: {
                'content-type' : 'application/json'
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
            <div className='bg-publisher'>
                <div className='bg-editor'>
                </div>

                <div className='bg-display'>
                    <div className='bg-inner-display' dangerouslySetInnerHTML={{__html:this.state.converter.makeHtml(this.props.edit.text)}} />
                    <input type='text' className='bg-title-input' placeholder='Please Enter a title' onChange={this.titleChange} ref='titleField'/>
                    <input type='submit' className='bg-submit-post' onClick={this.submitPost} value='Submit'/>
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