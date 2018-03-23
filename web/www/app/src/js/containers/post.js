import React from 'react'
import {Popconfirm, Row, Col, Button, Icon} from 'antd'
import {PostDisplayer} from 'containers/displayer'
import {getPost, editorNewPost, clearPost} from 'actions/actions'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {getRelativePath} from 'common/helper'
import {http_json} from 'common/http-helper'

class Post extends React.Component {
    constructor(props) {
        super(props)
        this.onDeleteConfirm = this.onDeleteConfirm.bind(this)
        this.onCancel = this.onCancel.bind(this)

        this.functionalities = [
            {tag:'edit', icon:'edit', click:this.editClick.bind(this)},
            {tag:'delete', icon:'delete', click:() => {}, confirm:{
                title:'are you sure you want to delete this?', 
                onConfirm:this.onDeleteConfirm,
                onCancel:this.onCancel,
                okText:'Yes',
                cancelText:'No'
            }}
        ]

        const requestedPostId = getRelativePath(this.props.location.pathname)
        this.props.fetchPost(requestedPostId)
    }

    onDeleteConfirm(event) {
        http_json({
            url:'/delete',
            json:{
                post_id: this.props.post.postId
            },
            resp:(response) => {
                if(response.status === 200) {
                    this.props.history.push('/posts')
                }
            }
        })
    }

    onCancel(event) {
        console.log('cancelled')
    }

    editClick(event) {
        this.props.editPost(this.props.post.postId, this.props.post.title, this.props.post.content)
        this.props.history.push('/edit')
    }

    componentWillUnmount() {
        this.props.clearPost()
    }

    render() {
        const editorOptions = this.props.post.canEdit ? (
            <Col span={1}>
                <div style={{paddingTop:'40px',width:'100%'}}>
                {this.functionalities.map((option) => {
                        const button = <Button className='doge-borderless-button' style={{width:'100%'}} onClick={option.click}><Icon type={option.icon} />{option.tag}</Button>
                        if(option.confirm) {
                            return (
                                <Popconfirm 
                                    title={option.confirm.title}
                                    onConfirm={option.confirm.onConfirm}
                                    onCancel={option.confirm.onCancel}
                                    okText={option.confirm.okText}
                                    cancelText={option.confirm.cancelText}
                                    className='doge-content-container'
                                >
                                    {button}
                                </Popconfirm>
                            )
                        } else {
                            return button
                        }
                    }
                )}
                </div>
            </Col>
        ) : null

        return (
            <Row style={{height:'100%'}} type='flex' justify='center'>
                <Col span={18} style={{height:'100%', overflow:'auto'}} className='doge-content-container'>
                    <PostDisplayer />
                </Col>
                {editorOptions}
            </Row>
        )
    }
}

function mapStateToProps(state) {
    return {
        post: state.post
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchPost: (postId) => dispatch(getPost(postId)),
        editPost: (postId, title, content) => dispatch(editorNewPost(postId, title, content)),
        clearPost: () => dispatch(clearPost())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Post))