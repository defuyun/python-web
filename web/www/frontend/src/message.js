import React from 'react';
import Button from './button.js';

const TextMessage = ({msgType, text, icon}) => {
	let msg = null, title = null;

	if (icon) {
		msg = <Button text={text} icon={icon} />;
	} else {
		title = <div className='title'> {msgType} </div>;
		msg = <div className='text'> {text} </div>;
	}

	return (
		<div className={'text-message' + ` ${msgType}`} >
			{title}
			{msg}
		</div>
	);
}

export {TextMessage};
