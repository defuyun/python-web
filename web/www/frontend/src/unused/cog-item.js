import React from 'react';
import Button from './button.js';
import {remove, getItemByKey} from './utils.js';

class CogTag extends React.Component {
	constructor(props) {
		super(props);
	}

	removeTag(tag) {
		return () => {
			const {dispatch} = this.props;
			let tags = getItemByKey(this.props.lists, 'tags');
			remove(tags, tag);
			dispatch({tags});
		}
	}

	render() {
		const {text, lists} = this.props;
		return (
			<div className='cog-tag'> 
				<div className='cog-tag-text'> {text} </div>
				<Button icon='times'onClick={removeTag(text)} />
			</div>
		)
	}
}

class CogItem extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const {key} = this.props;
		if (key === 'files') {
			return <CogFile {...this.props}/>
		} else if (key === 'tag') {
			return <CogTag {...this.props} />
		} else {
			return null;
		}
	}
}

export default CogItem;
