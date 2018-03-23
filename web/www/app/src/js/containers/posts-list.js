import React from 'react'
import { List, Button, Spin } from 'antd';
import {getPosts} from 'actions/actions'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

class PostsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            loadingMore: false,
            showLoadingMore: true,
        }
        this.props.fetchPosts()
    }

    render() {
        return (
            <List
                itemLayout="horizontal"
                dataSource={this.props.posts}
                renderItem={item => (
                    <List.Item className='doge-split-border' actions={[
                        <Link to={`/posts/${item.postId}`}>
                            read more
                        </Link>    
                    ]}>
                        <List.Item.Meta
                            title={item.title}
                        />
                        <div>{item.created}</div>
                    </List.Item>
                )}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        posts: state.posts
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchPosts: () => dispatch(getPosts)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostsList)