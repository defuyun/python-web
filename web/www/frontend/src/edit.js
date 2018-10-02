import React from 'react';
import Editor from './editor.js';

import {connect} from 'react-redux';

import './edit.css';

const Edit = ({navisible}) => { 
	const append = navisible ? ' on-nav' : '';
	return(	
		<div className={'edit' + append} styleName='edit'>
			<Editor />
		</div>
	)
}

const map = state => {
	return {
		navisible : state.navisible,
	}
}

export default connect(map)(Edit);
