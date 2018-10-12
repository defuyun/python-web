import React from 'react';
import Editor from './editor.js';
import View from './view.js';

import {connect} from 'react-redux';
import {concat} from './utils.js';

import './edit.css';

class Edit extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.draft && this.props.draft.id ? {draft : this.props.draft} : {draft : new draft({})};
	}

	componentWillUnmount() {
		const {dispatch} = this.props;
		dispatch({type : 'CACHE_DRAFT', draft : this.state.draft })
	}

	render() {
		const {navisible, draft} = this.props;
		return(	
			<div className={concat('edit', 'on-nav', navisible)} styleName='edit'>
				<div className='editor'>
					<Editor draft={draft} navisible={navisible} />
				</div>

				<div className='view'>
					<View draft={draft} />
				</div>
			</div>
		);
	}
}

const map = state => {
	return {
		navisible : state.navisible,
		draft : state.draft,
	}
}

export default connect(map)(Edit);
