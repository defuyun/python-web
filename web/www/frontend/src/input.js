import React from 'react';
import Button from './button.js';

import style from './input.css';

import * as log from 'loglevel';

class Input extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {iconProps, inputProps} = this.props;
		const iconDisabled = iconProps && (iconProps.callback === undefined || iconProps.callback === null);

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
			<div className={'input'} styleName='input'>
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
