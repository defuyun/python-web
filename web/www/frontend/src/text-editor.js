import React from 'react';
import {connect} from 'react-redux';
import * as ace from 'brace';

import 'brace/mode/markdown';
import 'brace/theme/tomorrow';
import 'brace/keybinding/vim';

import './text-editor.css';
import * as log from 'loglevel';

class AceEditor extends React.Component {
	constructor(props) {
		super(props);
		this.addEditor = this.addEditor.bind(this);
		this.onChange = this.onChange.bind(this);
		
		const element = document.createElement('div');
		element.className = 'ace-editor';

		const editor = ace.edit(element);	
		editor.getSession().setMode('ace/mode/markdown');
		editor.setTheme('ace/theme/tomorrow');
		editor.setKeyboardHandler('ace/keyboard/vim');
		editor.getSession().setUseWrapMode(true);
		editor.getSession().on('change', this.onChange);

		this.editor = editor;
		this.state = {element}
	}

	onChange(delta) {
		log.info(`[ACE] delta contains ${JSON.stringify(delta)}`);
		const {onChange} = this.props;
		if (onChange instanceof Function) {
			onChange(this.editor.getSession().getValue(), delta);
		}
	}

	addEditor(element) {
		element.appendChild(this.state.element);
	}

	componentDidUpdate(prevp) {
		if (prevp.navisible !== this.props.navisible) {
			log.info('[ACE] resizing editor');
			setTimeout(() => this.editor.resize(), 1000);
		}
	}

	render() {
		return <div ref={this.addEditor} className='ace-editor-container' styleName='ace-editor' />;
	}
}

const map = state => {
	return {
		navisible : state.navisible 
	}
}

export default connect(map)(AceEditor);
