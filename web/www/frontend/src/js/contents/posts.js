import React from 'react';
import {connect} from 'react-redux';
import {registerApiToProps} from 'components/action';

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
        this.props.getPosts(() => {
            log.info('[POSTS]: Completed request for posts');
            this.setState({
                isLoading : false
            })
        });

        log.info('[POSTS]: posts have mounted');
    }

    render() {
        return <div />
    }
}

export default withRouter(connect(null, registerApiToProps('getPosts'))(Posts));