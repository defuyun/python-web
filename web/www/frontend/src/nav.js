import React from 'react';
import Logo from './logo.js'
import Button from './button.js';
import SearchBar from './search-bar.js';
import Dropdown from './dropdown.js';

import {connect} from 'react-redux';

import menu, {constructNavMenu} from './menu-model.js';
import {partition} from './utils.js';
import * as log from 'loglevel';

import egg from '../images/egg.png';

import style from './nav.css'

const SingleButtons = ({buttonItems}) => {
	return (
		<div className='single-button'>
			{buttonItems.map(
					item => <Button 
						key={item.id}
						{...item}
						inversible = {1}
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
		const {dispatch} = props;
		
		for(let value of Object.values(menu)) {
			if (value.url) {
				value.onClick = () => dispatch({type : 'NAV_ITEM_CHANGE', id : value.id});
			}
		}

		const [buttonItems, dropdownItems]= partition(constructNavMenu({menu}), (val) => !Array.isArray(val));
		this.state = {visible : true, buttonItems, dropdownItems};
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
					<Button icon={'angle-up'} inversible={0} onClick={ () => this.setState({visible : !visible})}/>
				</div>
			</div>
		)
	}
}

export default connect()(Nav);
