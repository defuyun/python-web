import React from 'react';
import Button from './button.js';

import style from './dropdown.css';

const dropdown = ({itemList}) => {
	const head = itemList[0];
	itemList.shift();

	return (
		<div className='dropdown' styleName={'style.dropdown'}>
			<div className='dropdown-button'>
				<Button text={head.tag} icon={head.icon} />
			</div>
			<div className='dropdown-items'>
				{itemList.map(item => 
						<div key={item.id} className='dropdown-button'>
							<Button text={item.tag} icon={item.icon} />
						</div>
				)}
			</div>
		</div>
	);
}

export default dropdown;
