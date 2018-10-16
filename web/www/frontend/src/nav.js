import React from 'react';
import Logo from './logo.js'
import Button from './button.js';
import SearchBar from './search-bar.js';
import Dropdown from './dropdown.js';
import {concat} from './utils.js';

import {connect} from 'react-redux';

import menu, {constructNavMenu, shouldDisplay} from './menu-model.js';
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
		const {dispatch, userInfo} = props;
		this.toggleNav = this.toggleNav.bind(this);

		for(let value of Object.values(menu)) {
			if (value.url) {
				value.onClick = () => dispatch({type : 'NAV_ITEM_CHANGE', id : value.id});
			}

			if (value.id === 'logout') {
				value.onClick = this.logout.bind(this);
			}
		}

		const [buttonItems, dropdownItems]= partition(constructNavMenu({menu}), (val) => !Array.isArray(val));
		this.state = {buttonItems, dropdownItems};
		dispatch({type : 'NAV_VISIBLE', visible : false})
	}

	componentDidUpdate(prevp) {
		const {navisible, dispatch} = this.props;
		
		if (prevp.userInfo !== this.props.userInfo) {
			dispatch({type : 'NAV_VISIBLE', visible : false})

			const [buttonItems, dropdownItems]= partition(constructNavMenu({menu, userInfo : this.props.userInfo}), (val) => !Array.isArray(val));
			setTimeout(() => {
				this.setState({buttonItems, dropdownItems})
				dispatch({type : 'NAV_VISIBLE', visible : navisible})
			}, 500);

			if (! shouldDisplay(menu[this.props.activeNavItem].display, this.props.userInfo)) {
				dispatch({type : 'NAV_ITEM_CHANGE', id : 'home'});
			}
		}

		if (prevp.completeInit !== this.props.completeInit) {
			setTimeout(() => dispatch({type : 'NAV_VISIBLE', visible : true}), 500);
		}
	}

	logout() {
		const {dispatch} = this.props;
		dispatch({type : 'API_CALL', id : 'logout'});
	}

	toggleNav(visible) {
		const {dispatch} = this.props;
		return () => dispatch({type : 'NAV_VISIBLE', visible});
	}

	render() {
		const {buttonItems, dropdownItems} = this.state;
		const visible = this.props.navisible;

		const baseStylename = 'navbar';
		const visibleStylename = visible ? ' display' : ' hide';

		const navStylename = baseStylename + visibleStylename;

		// const stylename = visible ? 'style.navbar' : ' style.navbar-hide';

		return (
			<div className={navStylename} styleName={navStylename}>
				<Logo img={egg} />
				<SingleButtons buttonItems={buttonItems} />
				<SearchGroupButtons dropdownItems={dropdownItems} />

				<div className={`visibility-toggle-button ${visible.toString()}`}>
					<Button icon={'angle-up'} inversible={0} onClick={this.toggleNav(!visible)} />
				</div>
			</div>
		)
	}
}

const map = state => {
	return {
		userInfo : state.userInfo,
		completeInit : state.completeInit,
		activeNavItem : state.activeNavItem,
		navisible : state.navisible,
	}
}

export default connect(map)(Nav);
