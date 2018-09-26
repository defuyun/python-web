import React from 'react';
import * as log from 'loglevel';
import Icon from './icon.js';

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
		const {text, icon, clickHandle, inversible} = this.props;

		if (text === undefined && icon === undefined) {
			log.error('[BUTTON] both text and icon are not defined');
			return null;
		}
		
		// inversible defaults to true so turn off you need to specify false	
		const iconElement = icon ? <Icon icon={icon} inverse={inversible === false ? false : this.state.hover}/> : null;

		return (
			<div
				onMouseEnter = {this.hoverHandle(true)}
				onMouseLeave = {this.hoverHandle(false)}
				onClick = {clickHandle}
				style = {{cursor:'pointer'}}
				className = {'button'}
			>
				{iconElement}
				{text}
			</div>
		);
	}
}

export default Button;
