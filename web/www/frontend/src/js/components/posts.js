import React from 'react';
import {connect} from 'react-redux';

import * as log from 'loglevel';

const Posts = ({posts, page, dispatch}) => {
	return posts.map((postInfo) => <a href={`/posts/${postInfo.postId}`}><div key={postInfo.postId}> {postInfo.title} </div></a> );
}

export default connect()(Posts);
