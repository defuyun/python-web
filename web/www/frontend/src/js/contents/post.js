import React from 'react';
import {connect} from 'react-redux';

class Post extends React.Component {
    constructor(props) {
        super(props);
    }

};

const mapStateToProps = (state) => {
    return {
        post : state.post
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getPost : (args) => dispatch(getPost(args))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);