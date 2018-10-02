import React from 'react';
import AceEditor from 'react-ace';
import Input from './input.js';
import Button from './button.js';

import {connect} from 'react-redux';
import {guid} from './utils.js';

import 'brace/mode/markdown';
import 'brace/theme/xcode';
import 'brace/keybinding/vim';

import './editor.css';

class Editor extends React.Component {
	constructor(props) {
		super(props);
		const {draft} = this.props;
		if (draft && draft.id) {
			this.state = {...draft};
		} else {
			this.state = {...this.genp()};
		}

		this.state.displaySide = false;

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
		
		const {displaySide} = this.state;

		return (
			<div className='editor' styleName='editor'>
				<div className='tools'>
					<Input inputProps={{
						onChange : event => this.setState({title : event.target.value}),
						placeholder : 'input a title to start editing',
						value : title,
					}}/>
					<div className='button-group'>
						<Button key='new' icon='plus' onClick={this.newp} inversible={1} />
						<Button key='save' icon='save' onClick={this.save} inversible={1}/>
						<Button key='upload' icon='file-upload' onClick={this.upload} inversible={1}/>
						<Button key='erase' icon='eraser' onClick={this.erase} inversible={1}/>
					</div>
				</div>
				<div className='text-editor'>
					<div className='cog'>
						<div className={'side-toggle' + (displaySide ? ' display' : '')}>
							<Button icon='angle-right' onClick={() => this.setState({displaySide : !displaySide})} />
						</div>
						<div className='file-list'>
							{filelist.map(item => <div className='file'> item.name </div>)}
						</div>
						<div className='error-list'>
							{errorlist.map(item => <div className='error'> item.error </div>)}
						</div>
					</div>
					<div className={'ace-editor'} styleName='ace-editor'>
						<AceEditor
							mode='markdown'
							theme='xcode'
							keyboardHandler='vim'
							wrapEnabled={true}
							height='100%'
							width='100%'
						/>
					</div>
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
