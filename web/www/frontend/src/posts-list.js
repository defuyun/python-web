import React from 'react';
import ListItem from './posts-list-item.js';

import './posts-list.css';

class PostsList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {model} = this.props;
		return (
			<div className='posts-list' styleName='posts-list'>
				{model.displayItems.map(post => <ListItem key={post.id} {...post}/> )}
			</div>
		);
	}
}

export default PostsList;
