import React from 'react';
import * as log from 'loglevel';
import Showdown from 'showdown';
import Prism from 'prismjs';
import Katex from 'katex';

import {diff} from './utils.js';

import 'katex/dist/katex.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-glsl';
import 'prismjs/themes/prism-coy.css';

import style from './view.css';

class View extends React.Component {
	constructor(props) {
		super(props);
		this.converter = new Showdown.Converter({
			tables:true,
			strikethrough:true,
			tasklists:true,
			simpleLineBreaks:true,
			openLinksInNewWindow:true,
			headerLevelStart:2,
		})

		this.supportedLanguages = [
			'latex',
			'javascript',
			'cpp',
			'csharp',
			'c',
			'glsl',
			'python',
		];

		const {draft} = this.props;
		this.rerender = this.rerender.bind(this);
		this.setContent = this.setContent.bind(this);
		this.setContentRef = this.setContentRef.bind(this);
		draft.addrerender('view', this.rerender);

		this.contentNode = null;
	}

	setContentRef(element) {
		if (element) {
			this.contentNode = element;
			this.setContent();
		}
	}

	componentDidUpdate() {
		const {draft} = this.props;
		if (draft.renderFlag) {
			setTimeout(this.setContent, 0);
		}
	}
 
	setContent() {
		log.info('[VIEW] setting content');
		let container = this.contentNode;
		if (!container) {
			return;
		}
		
		let errors = [];
		const {draft} = this.props;
		const content = draft.render(true);
		container.innerHTML = content ? this.converter.makeHtml(content) : '';
		
		const modifiedNode = diff(this.prevNode, container);
		this.prevNode = container.cloneNode(true);
		
		container.querySelectorAll('code').forEach(element =>{
			log.info(`[VIEW] parsing code segment ${element.innerHTML}`);
			if (element.classList.length === 0) {
				const firstbreak = element.innerHTML.indexOf(' ');
				const firstword = element.innerHTML.substr(0, firstbreak);
				if (this.supportedLanguages.includes(firstword)) {
					element.innerHTML = element.innerHTML.replace(element.innerHTML.substring(0,firstbreak+1),'');
					element.classList.add(firstword);
					element.classList.add(`language-${firstword}`);
				}
			}
			
			
			Prism.highlightElement(element);

			if (element.classList.contains('latex')) {
				try {
					const latexString = element.innerHTML.replace(/amp;/g, '');
					element.innerHTML = '';
					log.info(`[VIEW] rendering latex ${latexString}`);
					Katex.render(latexString, element);
				} catch (error) {
					log.info(`[VIEW] caught compile error ${error.message}`);
					errors.push(error.message);
				}
				element.classList.remove('language-latex');
			}
		});

		if (errors.length !== 0) {
			draft.adderror(errors);
		}
		
		if (modifiedNode) {
			modifiedNode.focus();
			modifiedNode.onblur = () => draft.stealFocus = false;
		}
	}

	rerender() {
		this.setState({});
	}

	render() {
		const {draft} = this.props;
		const content = this.props.draft.render();
		const title = this.props.draft.title;
		
		if (draft.rerenderFunc['view'] !== this.rerender) {
			draft.addrerender('view', this.rerender);
		}

		return (
			<div className='view' styleName='view'>
				<div className='title'> {title} </div>
				<div className='content' ref={this.setContentRef}/>
			</div>
		)
	}
}

export default View;
