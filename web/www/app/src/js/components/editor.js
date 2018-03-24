import React from 'react'
import {Row, Col} from 'antd'
import {EditorDisplayer} from 'containers/displayer'
import CodeEditor from 'containers/code-editor'
import PostEditor from 'containers/post-editor'

const Editor = () => {
    return (
        <Row style={{height:'100%'}}>
            <Col span={12} style={{height:'100%', overflow:'auto',opacity:'0.7'}} id='doge-editor-container'>
                <PostEditor />
                <CodeEditor />
            </Col>
            <Col span={12} style={{height:'100%', overflow:'auto'}} className='doge-content-container' id='doge-displayer-container'>
                <EditorDisplayer />
            </Col>
        </Row>
    )
}

export default Editor