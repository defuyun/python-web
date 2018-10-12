import React from 'react';
import {resource} from './draft.js';
import {concat, guid} from './utils.js';
import {FeedbackInput} from './input.js';
import Button from './button.js';

import * as log from 'loglevel';
import './cog-components.css';

const Errors = ({draft}) => {
	const {errors} = draft;
	return (
		<div className='resources' styleName='resources'>
			{errors.map(error => {
				<div key ={guid()} className='error'>	error </div>							 
			})}
		</div>
	);
}

class Tags extends React.Component {
	constructor(props) {
		super(props);
		this.state = {tag : ''};
		this.tagChange = this.tagChange.bind(this);
		this.tagSubmit = this.tagSubmit.bind(this);
	}

	tagChange(event) {
		this.setState({tag : event.target.value});
	}

	tagSubmit() {
		const {draft} = this.props;
		const {tag} = this.state;

		if(tag === '' || tag === null || tag === undefined) {
			this.setState({feedback : ''});
			return;
		}
		
		if(draft.tagmap[tag]) {
			this.setState({feedback : 'tag already exists'});
			return;
		}

		draft.addtag(tag);
		this.setState({feedback : '', tag : ''});
	}

	render() {
		const {tags} = this.props.draft;
		const {feedback} = this.state;
		log.info(`[TAG] rerendering tags ${tags}`);
		return (
			<div className='resources' styleName='resources'>
				<FeedbackInput 
					inputProps={{
						value : this.state.tag,
				 		onChange : this.tagChange, 
						onBlur : this.tagSubmit,
				 		placeholder : 'Add new tag',
					}}
					feedback={feedback}
				/>
				{tags.map(tag => {
					return (<div className='tag' key={tag}>	 
						<div className='tag-name'> {tag} </div>
						<Button icon='times' onClick={() => this.props.draft.removetag(tag)} />
					</div>)				 
				})}
			</div>
		);
	}
}

class Resources extends React.Component {
	constructor(props) {
		super(props);
		this.upload = this.upload.bind(this);
	}

	upload(event) {
		const {draft} = this.props;
		const files = event.target.files;
		const reader = new FileReader();
		
		let res = [];

		const append = (file) => {
			reader.addEventListener('load', () => {
				if (!draft.resmap[file.name]) {
					log.info(`[RESOURCE] appending new file [${file.name}] with content : [${reader.result.substring(0,10)}...]`);
					draft.addres(new resource(draft.id, file.name, reader.result));
				}
			}, false);
			reader.readAsDataURL(file);
		}
		
		
		if(files) {
			[].forEach.call(files, append);
		}
	}

	render() {
		const {draft} = this.props;
		log.info(`[RESOURCE] rerednering with resources ${JSON.stringify(draft.resources)}`)
		return (
			<div className='resources' styleName='resources'>
				<input type='file' onChange={this.upload} placeholder='Add a file'/>
				{draft.resources.map(resource => {
					return (
						<div key={resource.name} className='file'>
							<div className='file-name'> {resource.name} </div>
					 		<Button icon='times' onClick={() => draft.removeres(resource.name)}/>	
						</div>
					)					
				})}
			</div>
		);
	}
}

export {Errors, Tags, Resources};
