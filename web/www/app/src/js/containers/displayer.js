import React from 'react'
import {connect} from 'react-redux'
import {Row} from 'antd'

import Showdown from 'showdown'
import Prism from 'prismjs'

import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-glsl'

class Title extends React.Component {
    render() {
        if(this.props.title) {
            return <h1 style={{textAlign:'center'}} className='doge-line-border'>{this.props.title}</h1>
        } else {
            return null
        }
    }
}

class Displayer extends React.Component {
    constructor(props) {
        super(props)
        this.converter = new Showdown.Converter({
            tables:true,
            strikethrough:true,
            tasklists:true,
            simpleLineBreaks:true,
            openLinksInNewWindow:true
        })
    }

    componentDidUpdate(prevProps, prevState) {
        document.querySelectorAll('.markdown-body code').forEach((element) => {
            Prism.highlightElement(element)
        })
    }

    render() {
        return (
            <div style={{height:'100%', padding:'10px'}}>
                <Row style={{height:'5%',paddingLeft:'40px',paddingRight:'40px'}} >
                    <Title title={this.props.title}/>
                </Row>
                <Row id='doge-markdown-display' style={{height:'95%',padding:'20px', paddingLeft:'40px', paddingRight:'40px'}}>
                    <div className='markdown-body' style={{height:'100%',width:'100%'}} dangerouslySetInnerHTML={{
                        __html: this.props.content ? this.converter.makeHtml(this.props.content) : ''
                    }} />
                </Row>
            </div>
        )
    }
}

function editorMapStateToProps(state) {
    return {
        title : state.editorTitle,
        content: state.editorContent
    }
}

function postMapStateToProps(state) {
    return {
        post: state.post
    }
} 

class EditorDisplayerProt extends React.Component {
    render() {
       return <Displayer content={this.props.content} title={this.props.title}/>
    }
}

class PostDisplayerProt extends React.Component {
    render() {
       return <Displayer content={this.props.post.content} title={this.props.post.title}/>
    }
}

export const EditorDisplayer = connect(editorMapStateToProps)(EditorDisplayerProt)
export const PostDisplayer = connect(postMapStateToProps)(PostDisplayerProt)