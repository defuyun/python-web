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
				<div key ={guid()} className='error'>	{error} </div>							 
			})}
		</div>
	);
}

class Tags extends React.Component {
	constructor(props) {
		super(props);
		this.state = {tag : ''};
		this.taglist = {};
		
		this.tagChange = this.tagChange.bind(this);
		this.tagSubmit = this.tagSubmit.bind(this);
		this.tagMount = this.tagMount.bind(this);
		this.tagRemove = this.tagRemove.bind(this);
		this.tagKeyPress = this.tagKeyPress.bind(this);
	}

	tagChange(event) {
		this.setState({tag : event.target.value});
	}

	tagKeyPress(event) {
		const key = event.keyCode || event.charCode;
		if (key === 13) {
			event.preventDefault();
			this.tagSubmit();
		}
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

	tagMount(element) {
		if(!element) {
			return;
		}
		const tagname = element.getAttribute('ident');
		this.taglist[tagname] = element;
		setTimeout(() => element.classList.remove('out'), 100);
	}

	tagRemove(tagname) {
		return () => {
			log.info(`[TAG] removing tag ${tagname}`);
			const {draft} = this.props;
			const element = this.taglist[tagname];
			element.classList.add('out');
			delete this.taglist[tagname];
			setTimeout(() => draft.removetag(tagname),500);
		}
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
						onKeyPress : this.tagKeyPress, 
					}}
					feedback={feedback}
				/>
				{tags.map(tag => {
					return (
						<div 
							className='tag-wrapper out' 
							ident={tag} 
							key={tag} 
							ref={this.tagMount}
						>
							<div className='tag'>
								<div className='tag-name'> 
									<div className='tag-name-inner'>
										{tag} 
									</div>
								</div>
								<Button icon='times' onClick={this.tagRemove(tag)} />
							</div>
						</div>
					)				 
				})}
			</div>
		);
	}
}

class Resources extends React.Component {
	constructor(props) {
		super(props);
		this.upload = this.upload.bind(this);
		this.reslist = {};
		this.resMount = this.resMount.bind(this);
		this.resRemove = this.resRemove.bind(this);
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
					draft.addres(new resource(draft.id, file.name, reader.result, false, file));
				}
			}, false);
			reader.readAsDataURL(file);
		}
		
		
		if(files) {
			[].forEach.call(files, append);
		}
	}

	resMount(element) {
		if(!element) {
			return;
		}
		const resname = element.getAttribute('ident');
		this.reslist[resname] = element;
		setTimeout(() => element.classList.remove('out'), 100);
	}

	resRemove(name) {
		return () => {
			log.info(`[TAG] removing tag ${name}`);
			const {draft} = this.props;
			const element = this.reslist[name];
			element.classList.add('out');
			delete this.reslist[name];
			setTimeout(() => draft.removeres(name), 500);
		}
	}

	render() {
		const {draft} = this.props;
		log.info(`[RESOURCE] rerednering with resources ${JSON.stringify(draft.resources)}`)
		return (
			<div className='resources'  styleName='resources'>
				<input 
					id='file' 
					className='file-upload'
					type='file' 
					onChange={this.upload}
				 	placeholder='Add a file'
				/>
				<div className='file-u-wrapper'>
					<label className='file-upload-label' htmlFor='file'>Upload</label>
				</div>
				{draft.resources.map(resource => {
					const resname = resource.name;
					return (
						<div 
							key={resname} 
							ref={this.resMount} 
							key={resname} 
							ident={resname} 
							className='file-wrapper out'
						>
							<div className='file'>
								<div className='file-name'> {resname} </div>
								<Button icon='times' onClick={this.resRemove(resname)}/>	
							</div>
						</div>
					)					
				})}
			</div>
		);
	}
}

export {Errors, Tags, Resources};
