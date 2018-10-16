import React from 'react';
import Button from './button.js';
import {router} from './router.js';
import {parseDate} from './utils.js';

import './posts-list-item.css';

class PostsListItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {id, title, description, author, tags} = this.props;
		const created = parseDate(this.props.created);
		const modified = parseDate(this.props.modified);

		return (
			<div className='posts-list-item'styleName='posts-list-item'>
				<div className='wrapper'>
					<div className='header' styleName='header'> 
						<div className='title'> {title} </div>
						<div className='timestamps' styleName='timestamp'>
							<div className='created'> {'created: ' + `${created.day}/${created.month}/${created.year}`} </div>
							<div className='modified'> {'modified: ' + `${created.day}/${created.month}/${created.year}`} </div>
						</div>
					</div>
					<div className='description' styleName='description'>
						<div className='wrapper'>
						{!description || description.length === 0 ? 'There is no description for this post' : description}
						</div>
						<div className='read-more'>
							<Button text={'read more'} onClick={() => router.push(`/posts/${id}`)} />
						</div>
					</div>
					<div className='footer' styleName='footer'>
						<div className='tags' styleName='tags'>
							{tags ? tags.map(tag => <div  key={tag} className='wrapper'> <div className='tag'> {tag} </div> </div>) : null}
						</div>
						<div className='author' styleName='author'>
							{author}
						</div>
					</div>
				</div>
			</div>	
		)
	}
}

export default PostsListItem;
