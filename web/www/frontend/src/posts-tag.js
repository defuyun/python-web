import React from 'react';
import './posts-tag.css';
import {concat} from './utils.js';

class TagItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {tagname, count, active, onClick} = this.props;
		return (
			<div className={concat('tag','active',active)} styleName='tag'>
				<div className='tagname' onClick={onClick}>
					{tagname} <span className='count'>{count}</span> 
				</div>
			</div>
		);
	}
}

class Tags extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {model} = this.props;
		const {toggleTag, tags} = model;

		return (
			<div className='tag-list' styleName='tag-list'>
				<div className='header' styleName='header'>
					<div className='wrapper'> tags </div>
				</div>
				<div className='items' styleName='items'>
					{Object.keys(tags.taglist).map(tag => <TagItem 
							key={tag} 
							active={tags.selected.includes(tag)} 
							tagname={tag} 
							count={tags.taglist[tag].length} 
							onClick={toggleTag(tag)} />)}
				</div>
			</div>
		);
	}
}

export default Tags;
