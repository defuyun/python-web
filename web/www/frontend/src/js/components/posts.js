import React from 'react';
import {connect} from 'react-redux';
import {lifecycle, compose} from 'recompose';

import * as log from 'loglevel';

// actions
import {NEW_API_REQUEST, getPosts} from 'actions/type';

const Posts = ({posts, currentPage, dispatch}) => {
	return posts.map((postInfo) => <a key={postInfo.postId} href={`/posts/${postInfo.postId}`}><div> {postInfo.title} </div></a> );
}

const enhance = compose(
	lifecycle({
		componentDidMount() {
			const {dispatch} = this.props;
			if (!dispatch) {
				log.error('[APP]: no dispatch in app component, did you add connect?');
			}
			dispatch({type: NEW_API_REQUEST, api : getPosts});
		}
	})
);

const selector = (state) => {
	return {
		currentPage : state.currentPage,
		posts : state.posts,
	}
}

export default connect(selector)(enhance(Posts));
