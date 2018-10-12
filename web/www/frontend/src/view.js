import React from 'react';
import * as log from 'loglevel';
import Showdown from 'showdown';
import Prism from 'prismjs';
import Katex from 'katex';

import 'katex/dist/katex.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-glsl';

import './view.css';

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
		draft.setrerender(this.rerender.bind(this));
	}

	componentDidUpdate() {
		
	}

	rerender() {
		this.setState({});
	}

	render() {
		const content = this.props.draft.render();
		const title = this.props.draft.title;

		return (
			<div className='view' styleName='view'>
				<div className='title'> {title} </div>
				<div className='content' dangerouslySetInnerHTML={{
					__html : content ? this.converter.makeHtml(content) : ''
				}}/>
			</div>
		)
	}
}

export default View;
