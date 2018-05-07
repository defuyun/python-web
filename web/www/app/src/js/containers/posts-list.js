import React from 'react'
import { List, Pagination } from 'antd';
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
            page: 1,
        }
        this.pageChange = this.pageChange.bind(this)
        this.props.fetchPosts()
    }

    pageChange(page, pageSize) {
        this.setState({page})
    }

    render() {
        return (
            <div style={{height:'100%'}}>
                <List
                    itemLayout="horizontal"
                    dataSource={this.props.posts.slice((this.state.page - 1) * 14, Math.min(this.props.posts.length, this.state.page * 14))}
                    renderItem={item => (
                        <List.Item style={{paddingLeft:'30px'}} className='doge-split-border' actions={[
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
                <Pagination style={{textAlign:'center',position:'absolute', bottom:'50px', left:'0', right:'0'}} defaultCurrent={1} defaultPageSize={14} total={this.props.posts.length} onChange={this.pageChange}/>
            </div>
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