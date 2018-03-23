import React from 'react'
import {connect} from 'react-redux'
import {Input,Col,Row,Button} from 'antd'
import {editorTitleChange, editorContentChange, editorIdChange, editorNewPost} from 'actions/actions'
import {http_json} from 'common/http-helper'
import {guid} from 'common/helper'

class PostEditor extends React.Component {
    constructor(props) {
        super(props)

        this.editTitle = this.editTitle.bind(this)
        this.newEdit = this.newEdit.bind(this)
        this.cloneEdit = this.cloneEdit.bind(this)
        this.clearEdit = this.clearEdit.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.submitPost = this.submitPost.bind(this)
        
        this.functionalities = [
            {id:'edit', icon:'edit',click: this.editTitle},
            {id:'new', icon:'file-add',click: this.newEdit},
            {id:'clone', icon:'copy',click: this.cloneEdit},
            {id:'submit',icon:'cloud-upload',click: this.submitPost},
            {id:'clear',icon:'delete',click: this.clearEdit},
            {id:'upload',icon:'upload',click: this.uploadFile},
        ]

        this.state = {
            disableTitle: true
        }

        if(!this.props.id) {
            this.newEdit()
        }
    }

    editTitle(event) {
        if(this.state.disableTitle) {
            this.setState({disableTitle: false})
        }
    }

    newEdit(event) {
        this.props.newPost(guid(),'','')
    }

    cloneEdit(event) {
        this.props.IdChange(guid())
    }

    submitPost(event) {
        if(!this.props.id || !this.props.title || !this.props.content) {
            console.log('missing' + this.props.id ? '' : ' post Id' + this.props.title ? '' : ' title' + this.props.content ? '' : ' content')
            return
        }

        http_json({
            url:'/publish',
            json: {
                post_id: this.props.id,
                title: this.props.title,
                text: this.props.content
            },
            resp: (response) => {
                if(response.status === 200) {
                    console.log('success')
                }
            }
        })
    }

    clearEdit(event) {
        this.props.clear()
    }

    uploadFile(event) {

    }

    titleChange(event) {
        this.props.titleChange(event.target.value)
    }

    titleBlur(event) {
        if(event.target.value.trim().length <= 0) {
            this.refs.titleInput.focus()
            return
        } else {
            this.setState({disableTitle: true})
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.disableTitle !== nextState.disableTitle) {
            return true
        }

        if(this.props.title !== nextProps.title) {
            return true
        }

        return false
    }

    componentDidUpdate() {
        if(!this.state.disableTitle) {
            this.refs.titleInput.focus()
        }
    }

    render() {
        return (
            <Row type='flex' align='middle' className='doge-editor-toolbar'>
                <Col span={12}>
                    <Input
                        className='doge-borderless-input'
                        size='default' 
                        placeholder='Input a title by clicking on the edit button' 
                        disabled={this.state.disableTitle} 
                        onBlur={this.titleBlur.bind(this)} 
                        ref='titleInput'
                        onChange={this.titleChange.bind(this)}
                        onPressEnter={this.titleBlur.bind(this)}
                        value={this.props.title}
                    />
                </Col>
                <Button.Group size={this.functionalities.length} style={{paddingLeft:'5px'}}>
                    {this.functionalities.map((item) => 
                        <Button icon={item.icon} className='doge-borderless-button' onClick={item.click} />
                    )}
                </Button.Group>
            </Row>
        )
    }
}

function mapStateToProps({editorId,editorTitle,editorContent}) {
    return {
        id: editorId,
        title: editorTitle,
        content: editorContent
    }
}

function mapDispatchToProps(dispatch) {
    return {
        clear: () => dispatch(editorContentChange('')),
        titleChange: (title) => dispatch(editorTitleChange(title)),
        IdChange: (id) => dispatch(editorIdChange(id)),
        newPost: (id,title,content) => dispatch(editorNewPost(id,title,content))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostEditor)