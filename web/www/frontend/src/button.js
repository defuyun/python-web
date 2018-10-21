import React from 'react';
import * as log from 'loglevel';
import Icon from './icon.js';
import {propsFilter, concat} from './utils.js';

import './button.css';

class Button extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {className, text, icon, inversible, border, disable} = this.props;

		if (text === undefined && icon === undefined) {
			log.error('[BUTTON] both text and icon are not defined');
			return null;
		}
		
		// inversible defaults to true so turn off you need to specify false	
		const iconElement = icon ? <Icon className='button-icon' icon={icon} /> : null;
		const textElement = text ? <div className={'button-text'}>{text}</div> : null;
		
		const buttonStylename = concat(concat(concat('button', 'inverse', inversible), 'border', border), 'disable', disable);
		
		return (
			<div
				className = {concat(buttonStylename, className, className)}
				styleName = {buttonStylename}
				{...this.props}
			>
				{iconElement}
				{textElement}	
			</div>
		);
	}
}

export default Button;
