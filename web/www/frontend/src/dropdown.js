import React from 'react';
import Button from './button.js';

const dropdown = ({itemList}) => {
	const head = itemList[0];
	itemList.shift();

	return (
		<div className='dropdown'>
			<Button text={head.tag} icon={head.icon} />
			<div className='dropdown-items'>
				{itemList.map(item => <Button key={item.id} text={item.tag} icon={item.icon} />)}
			</div>
		</div>
	);
}

export default dropdown;
