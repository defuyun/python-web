import React from 'react';
import * as ace from 'brace';
import {concat} from './utils.js';

import 'brace/mode/markdown';
import 'brace/theme/tomorrow';
import 'brace/keybinding/vim';

import './ace-editor.css';
import * as log from 'loglevel';

class AceEditor extends React.Component {
	constructor(props) {
		super(props);
		const {draft} = this.props;
		this.addEditor = this.addEditor.bind(this);
		this.onChange = this.onChange.bind(this);
		this.hijackKeyPress = this.hijackKeyPress.bind(this);

		const element = document.createElement('div');
		element.className = 'ace-editor';

		const editor = ace.edit(element);	
		editor.getSession().setMode('ace/mode/markdown');
		editor.setTheme('ace/theme/tomorrow');
		editor.setKeyboardHandler('ace/keyboard/vim');
		editor.getSession().setUseWrapMode(true);
		editor.getSession().setValue(draft.content);
		editor.getSession().on('change', this.onChange);
		editor.$blockScrolling = 'Infinity';
		this.editor = editor;
		this.state = {element};
		
		draft.addEventListener('new', 'aceeditor', () => editor.getSession().setValue(draft.content));

		addEventListener('keydown', this.hijackKeyPress);
	}

	hijackKeyPress(event) {
		const {draft} = this.props;
		if (draft.stealFocus) {
			draft.stealFocus = false;
			this.editor.focus();
		}
	}

	componentWillUnmount() {
		removeEventListener('keydown', this.hijackKeyPress);
	}

	onChange(delta) {
		const {draft} = this.props;
		draft.setcontent(this.editor.getSession().getValue());
	}

	addEditor(element) {
		element && element.appendChild(this.state.element);
	}

	componentDidUpdate(prevp) {
		if (prevp.resize !== this.props.resize) {
			log.info('[ACE] resizing editor');
			setTimeout(() => this.editor.resize(), 500);
		}
	}

	render() {
		return <div ref={this.addEditor} className='ace-editor-container' styleName='ace-editor-container' />;
	}
}

export default AceEditor;
