import React from 'react';

import {baseUrl} from 'common/constants';

const PostList = ({posts}) => {
	return posts.map((postInfo) => <a key={postInfo.postId} href={`${baseUrl}/posts/${postInfo.postId}`}><div> {postInfo.title} </div></a> )
}

export default PostList;
