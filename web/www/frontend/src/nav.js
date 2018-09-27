import React from 'react';
import Logo from './logo.js'
import Button from './button.js';
import SearchBar from './search-bar.js';
import Dropdown from './dropdown.js';

import {constructNavMenu} from './menu-model.js';
import {partition} from './utils.js';
import * as log from 'loglevel';

import egg from '../images/egg.png';

import style from './nav.css';

class Nav extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const [buttonItems, dropdownItems ]= partition(constructNavMenu({}), (val) => !Array.isArray(val));
		log.info(`[NAV] constructed\n single items : ${JSON.stringify(buttonItems)}\n dropdown items : ${JSON.stringify(dropdownItems)}`);	
		
		return (
			<div styleName={'style.navbar'}>
				<Logo img={egg} />
				<div className='single-button'>
					{buttonItems.map(item => <Button key={item.id} text={item.tag} icon={item.icon} />)}
				</div>
				<div className='search-group-button'>
					<SearchBar />
					{dropdownItems.map(itemList => <Dropdown key={itemList[0].id} itemList={itemList} />)}
				</div>
			</div>
		)
	}
}

export default Nav;
