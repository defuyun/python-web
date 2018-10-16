import React from 'react';
import Button from './button.js';
import {concat} from './utils.js';
import * as log from 'loglevel';

import './input.css';

class Input extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {iconProps, inputProps, className} = this.props;
		const iconDisabled = iconProps && !(iconProps.onClick instanceof Function);

		const IconElement = iconProps ? 
			(<div className='input-icon'>
				<Button 
					disable={iconDisabled ? 1 : 0}
					{...iconProps}
				/>
			</div>) : null;

		const InputElement = (<input 
			className='input-text'
			{...inputProps}
		/>);

		return (
			<div className={concat('input', className, className)} styleName='input'>
				{IconElement}
				{InputElement}
			</div>
		);
	}
}

class FeedbackInput extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {feedback} = this.props;

		return (
			<div className='feedback-input-item'>	
				<Input {...this.props} />
				<div className='invalid-feedback'> {feedback} </div>	
			</div>
		);
	}
}

export default Input;
export {FeedbackInput};
