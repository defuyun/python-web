import React from 'react';
import AceEditor from './ace-editor.js';
import Cog from './cog.js';
import Button from './button.js';
import Input from './input.js';

import * as log from 'loglevel';
import {draft} from './draft.js';
import {connect} from 'react-redux';
import {concat} from './utils.js';

import './editor.css';

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {cogshow : true};
		this.save = this.save.bind(this);
		this.titleChange = this.titleChange.bind(this);
		this.descripChange = this.descripChange.bind(this);
		this.rerender = this.rerender.bind(this);
	}

	rerender() {
		this.setState({});
	}

	titleChange(event) {
		this.props.draft.settitle(event.target.value);
	}

	descripChange(event) {
		this.props.draft.setdescrip(event.target.value);
	}

	save() {
		const {dispatch, draft} = this.props;
		dispatch({type : 'API_CALL', id : 'save', params : draft});
	}

	render() {
		const {navisible, draft} = this.props;
		const {cogshow} = this.state;

		if (draft.rerenderFunc['editor'] !== this.rerender) {
			draft.addrerender('editor', this.rerender);
		}
		return (
			<div className='editor' styleName='editor' >
				<div className={concat('sidebar', 'display', cogshow)} styleName='sidebar'>
					<div className='sidebar-button'>
						<Button icon='angle-right' onClick={() => this.setState({cogshow : !cogshow})} />
					</div>
					<Cog draft={draft}/>
				</div>
				<div className={concat('txt-editor','cog', cogshow)} styleName='txt-editor' >
					<div className='tools' styleName='tools'>
						<div className='buttons'>
							<Button icon='save' onClick={this.save} inversible={1}/>
							<Button icon='file' onClick={draft.clear} inversible={1}/>
						</div>
						<Input inputProps={{placeholder : 'add a title', onChange : this.titleChange, value : draft.title}} />
					</div>
					<div className='descrip' styleName='descrip'>
						<Input inputProps={{placeholder : 'add descriptions', onChange : this.descripChange, value : draft.descrip}} />
					</div>
					<AceEditor resize={cogshow * 10 + navisible} draft={draft} />
				</div>
			</div>
		);
	}	
}

export default connect()(Editor);
