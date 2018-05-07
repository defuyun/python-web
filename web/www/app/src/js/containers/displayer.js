import React from 'react'
import {connect} from 'react-redux'
import {Row, notification} from 'antd'

import Showdown from 'showdown'
import Prism from 'prismjs'
import Katex from 'katex'

import 'katex/dist/katex.css'
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
            openLinksInNewWindow:true,
            headerLevelStart:2,
        })

        this.supportedLanguages = [
            'latex',
            'javascript',
            'cpp',
            'csharp',
            'c',
            'glsl',
            'python',
        ]
    }

    componentDidUpdate(prevProps, prevState) {
        document.querySelectorAll('.markdown-body code:not([class])').forEach((element) => {
            const firstBreak = element.innerHTML.indexOf(' ')
            const firstWord = element.innerHTML.substr(0, firstBreak)

            if(this.supportedLanguages.includes(firstWord)) {
                element.innerHTML = element.innerHTML.replace(element.innerHTML.substring(0,firstBreak+1),'')
                element.classList.add(firstWord)
                element.classList.add(`language-${firstWord}`)
            }
        })

        document.querySelectorAll('.markdown-body code.latex').forEach((element) => {
            try {
                const latexString = element.innerHTML.replace(/amp;/g,'')
                Katex.render(latexString, element)
                element.removeAttribute('class')
            } catch (error) {
                notification.open({
                    message: 'Latex parse error',
                    description: error.message
                })
            }
        })

        document.querySelectorAll('.markdown-body code[class]').forEach((element) => {
            Prism.highlightElement(element)
        })
    }

    render() {
        return (
            <div style={{minHeight:'100%', padding:'10px'}}>
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
    componentDidUpdate(prevProps, prevState) {
        const editor = document.querySelector('.ace_scrollbar-v')
        const displayer = document.getElementById('doge-displayer-container')
        const conversion = displayer.scrollHeight/editor.scrollHeight

        if(editor.scrollTop === 0) {
            displayer.scrollTop = 0
        } else {
            const scrollBottom = editor.offsetHeight + editor.scrollTop
            const convertedBottom = scrollBottom * conversion
            const convertedTop = convertedBottom - displayer.offsetHeight
            displayer.scrollTop = convertedTop
        }
    }
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