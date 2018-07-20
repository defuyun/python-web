import React from 'react';
import {connect} from 'react-redux';
import {getPosts} from 'reduce/api';
import {withRouter} from 'react-router-dom';

import * as log from 'loglevel';

class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading : true
        }
    } 

    componentDidMount() {
        this.props.getPosts({
            callback : () => {
                log.info('[POSTS]: Completed request for posts');
                this.setState({
                    isLoading : false
                });
            }
        });

        log.info('[POSTS]: posts have mounted');
    }

    render() {
        return this.props.posts.map((postInfo) => <div key={postInfo.postId}> {postInfo.title} </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        posts : state.posts,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getPosts : (args) => dispatch(getPosts(args)),
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Posts));