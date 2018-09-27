import React from 'react';
import Logo from './logo.js'
import Button from './button.js';
import SearchBar from './search-bar.js';
import Dropdown from './dropdown.js';

import {constructNavMenu} from './menu-model.js';
import {partition} from './utils.js';
import * as log from 'loglevel';

import egg from '../images/egg.png';

import style from './nav.css'

const SingleButtons = ({buttonItems}) => {
	return (
		<div className='single-button'>
			{buttonItems.map(
					item => <Button 
						key = {item.id}
						text = {item.tag}
						icon = {item.icon}
						inversible = {true}
					/>
			)}
		</div>	
	);
}

const SearchGroupButtons = ({dropdownItems}) => {
	return (
		<div className='search-group-button'>
			<SearchBar />
			{dropdownItems.map(
					itemList => <Dropdown 
						key={itemList[0].id} 
						itemList={itemList} 
					/>
			)}
		</div>
	);
}

class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {visible : true};
	}

	componentWillMount() {
		const [buttonItems, dropdownItems ]= partition(constructNavMenu({}), (val) => !Array.isArray(val));
		this.setState({buttonItems, dropdownItems});	
	}

	render() {
		const {visible, buttonItems, dropdownItems} = this.state;
		
		const baseStylename = 'style.navbar';
		const visibleStylename = visible ? ' style.display' : ' style.hide';

		const navStylename = baseStylename + visibleStylename;

		// const stylename = visible ? 'style.navbar' : ' style.navbar-hide';

		return (
			<div styleName={navStylename}>
				<Logo img={egg} />
				<SingleButtons buttonItems={buttonItems} />
				<SearchGroupButtons dropdownItems={dropdownItems} />

				<div className={`visibility-toggle-button ${visible.toString()}`}>
					<Button icon={'angle-up'} inversible={false} clickHandle={ () => this.setState({visible : !visible})}/>
				</div>
			</div>
		)
	}
}

export default Nav;
