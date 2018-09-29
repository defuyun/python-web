import React from 'react';
import Input from './input.js';

import style from './search-bar.css';

const SearchBar = ({onClick}) =>
	<div className='search-bar' styleName={'style.search-bar'}> 
		<Input 
				iconProps={
					{
						onClick : onClick,
						icon : 'search'
					}
				}
				
				inputProps={
					{
						type : 'text',
						placeholder : 'Search'
					}
				}
		/>
	</div>

export default SearchBar;
