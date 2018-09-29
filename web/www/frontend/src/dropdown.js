import React from 'react';
import Button from './button.js';

import style from './dropdown.css';

const dropdown = ({itemList}) => {
	const copy = itemList.slice();
	const head = copy[0];

	copy.shift();

	return (
		<div className='dropdown' styleName={'style.dropdown'}>
			<div className='dropdown-button'>
				<Button {...head} inversible={1}/>
			</div>
			<div className='dropdown-items'>
				{copy.map(item => 
						<div key={item.id} className='dropdown-button'>
							<Button {...item} inversible={1}/>
						</div>
				)}
			</div>
		</div>
	);
}

export default dropdown;
