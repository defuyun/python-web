import React from 'react';
import * as log from 'loglevel';
import Icon from './icon.js';

import style from './button.css';

class Button extends React.Component {
	constructor(props) {
		super(props);
		this.state = {hover : false};
		this.hoverHandle = this.hoverHandle.bind(this);
	}

	hoverHandle(hoverStatus) {
		return () => {
			this.setState({hover : hoverStatus});
		}
	}
  
	render() {
		const {text, icon, clickHandle, inversible, border} = this.props;

		if (text === undefined && icon === undefined) {
			log.error('[BUTTON] both text and icon are not defined');
			return null;
		}
		
		// inversible defaults to true so turn off you need to specify false	
		const iconElement = icon ? <Icon className='button-icon' icon={icon} inverse={inversible ? this.state.hover : false}/> : null;
		const textElement = text ? <div className={'button-text'}>{text}</div> : null;
		
		const baseStylename = 'style.button';
		const buttonInverse = inversible ? ' inverse' : '';
		const buttonBorder = border ? ' border' : '';
		
		const buttonStylename = baseStylename + buttonInverse + buttonBorder;

		return (
			<div
				onMouseEnter = {this.hoverHandle(true)}
				onMouseLeave = {this.hoverHandle(false)}
				onClick = {clickHandle}
				className = {'button'}
				styleName = {buttonStylename}
			>
				{iconElement}
				{textElement}	
			</div>
		);
	}
}

export default Button;
