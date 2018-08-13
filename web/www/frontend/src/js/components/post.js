import React from 'react';
import {connect} from 'react-redux';

export const Post = ({title, content}) => {
	return (
		<div>
			<h1> title </h1>
			<div>
				content
			</div>
		</div>
	)
}
