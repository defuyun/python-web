import React from 'react';

const PostDisplayer = ({title, content}) => {
	if (title && content) {
		return (<div>
			<h1> {title} </h1>
			<div> {content} </div>
		</div>);
	} else {
		return null;
	}
}

export default PostDisplayer;
