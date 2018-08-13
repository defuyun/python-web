import React from 'react';
import {connect} from 'react-redux';
import {lifecycle, compose} from 'recompose';

const Post = ({perusingPost, dispatch}) => {
	return (
		<div>
			<h1> perusingPost.title </h1>
			<div>
				perusingPost.content
			</div>
		</div>
	)
}

const selector = (state) => {
	return {
		perusingPost : state.perusingPost,
	}
}

export default Post;
