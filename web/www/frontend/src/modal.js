import React from 'react';
import {connect} from 'react-redux';
import Button from './button.js';
import * as log from 'loglevel';

import './modal.css';

class Modal extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this.hijackClick = this.hijackClick.bind(this);
	}
	
	onClick() {
		const {dispatch} = this.props;
		dispatch({type : 'UPDATE_MODAL', modal : {display : false}});
		removeEventListener('click', this.hijackClick, true);
	}

	hijackClick(evt) {
		evt = evt || window.event;
		let target = evt.target || evt.srcElement;
		let onModal = false;

		while(target) {
			if (target.className && target.className.includes && target.className.includes('modal-container')) {
				onModal = true;
				break;
			}
			target = target.parentNode;
		}

		if (!onModal) {
			this.onClick();
			log.info('[MODAL] click event outside modal');
			evt.preventDefault();	
		}
		
		if (onModal) {
			log.info('[MODAL] click event inside modal');
		}
	}

	render() {
		const {display, component, manual} = this.props;
		const className = (display ? ' display ' : '');
		
		if (display && manual) {
			addEventListener('click', this.hijackClick, true);
		}
		
		const button = manual ? <div className='modal-button'><Button onClick={this.onClick} text='Ok' inversible={1} border={1}/></div> : null;
		const displayComponent = component ? <div className='message'> {React.createElement(component, {...this.props})} </div>: null;

		return (
				<div className={'modal-container' + className} styleName='modal'>
					{displayComponent}
					{button}
			</div>
		)
	}
}	

const map = state => {
	return {...state.modal}
}

export default connect(map)(Modal);
