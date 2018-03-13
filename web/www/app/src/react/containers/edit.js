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
import editText from '../actions/edit-text'


class Edit extends React.Component {
    componentWillMount() {
        const converter = new showdown.Converter()
        this.titleChange = this.titleChange.bind(this)
        this.submitPost = this.submitPost.bind(this)
        this.setState({converter})
        this.setState({publishing: false})
        this.setState({publishSuccess: false})
    }

    componentDidMount() {
        const flask = new CodeFlask()
        this.setState({flask})
        flask.run('.bg-editor', {language : 'javascript', lineNumbers: true})
        if(this.props.text) {
            flask.update(this.props.text)
        }

        flask.onUpdate((code) => {
            this.props.onEdit(code)
        })
    }

    titleChange(event) {
        this.setState({title: event.target.value})
    }

    submitPost(event) {
        const data = {
            title : this.state.title,
            post : this.props.text
        }

        this.setState({publishing: true})

        fetch('/publish', {
            body : JSON.stringify(data),
            headers: {
                'content-type' : 'application/json'
            },
            method : 'POST'
        }).then((response) => {
            this.setState({
                publishing: false, 
                publishSuccess: response.status === 200
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
                    <div className='bg-inner-display' dangerouslySetInnerHTML={{__html:this.state.converter.makeHtml(this.props.text)}} />
                    <input type='text' className='bg-title-input' placeholder='Please Enter a title' onChange={this.titleChange}/>
                    <input type='submit' className='bg-submit-post' onClick={this.submitPost} value='Submit'/>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        text: state.text
    }
} 

function mapDispatchToProps(dispatch) {
    return {
        onEdit: (text) => dispatch(editText(text))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit)