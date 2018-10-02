import React from 'react';
import AceEditor from 'react-ace';
import Input from './input.js';
import Button from './button.js';

import {connect} from 'react-redux';
import {guid} from './utils.js';

import 'brace/mode/markdown';
import 'brace/theme/xcode';
import 'brace/keybinding/vim';

class Editor extends React.Component {
	constructor(props) {
		super(props);
		const {draft} = this.props;
		if (draft && draft.id) {
			this.state = {...draft};
		} else {
			this.state = {...this.genp()};
		}

		this.newp = this.newp.bind(this);
		this.save = this.save.bind(this);
		this.upload = this.upload.bind(this);
		this.erase = this.erase.bind(this);
	}

	genp() {
		return {
			title : null,
			id : guid(),
			content : null,
			filelist : [],
		}
	}

	newp() {
		this.setState({...this.genp()})
	}

	save() {
	
	}

	upload() {
	
	}

	erase() {
		this.setState({
			title : null,
			id : this.state.id,
			content : null,
			filelist : this.state.filelist,
		})
	}

	componentWillUnmount() {
		const {dispatch} = this.props;
		const {title, id, files, content} = this.state;

		dispatch({type : 'CACHE_DRAFT', draft : {title, id, files, content}})
	}

	render() {
		const filelist = this.state.filelist || [];
		const errorlist = this.state.errorlist || [];
		const title = this.state.title || '';

		return (
			<div className='editor'>
				<div className='tools'>
					<Input inputProps={{
						onChange : event => this.setState({title : event.target.value}),
						placeholder : 'input a title to start editing',
						value : title,
					}}/>
					<Button key='new' icon='plus' onClick={this.newp} />
					<Button key='save' icon='save' onClick={this.save} />
					<Button key='upload' icon='file-upload' onClick={this.upload} />
					<Button key='erase' icon='eraser' onClick={this.erase}/>
				</div>
				<div className='text-editor'>
					<div className='cog'>
						<div className='file-list'>
							{filelist.map(item => <div className='file'> item.name </div>)}
						</div>
						<div className='error-list'>
							{errorlist.map(item => <div className='error'> item.error </div>)}
						</div>
					</div>
					<AceEditor
						mode='markdown'
						theme='xcode'
						keyboardHandler='vim'
						wrapEnabled={true}
					/>
				</div>
			</div>
		);		
	}	
}

const map = state => {
	return {
		draft : state.draft
	}
}

export default connect()(Editor);
