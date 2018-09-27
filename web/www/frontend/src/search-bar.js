import React from 'react';
import Button from './button.js'

import style from './search-bar.css';

const SearchBar = ({clickHandle}) => 
<div className='search-bar' styleName={'style.search-bar'}> 
	<div className='search-button'>
		<Button icon={'search'} inversible={false} />
	</div>
	<input type='text' name='keyword' placeholder='Search'/>
</div>

export default SearchBar;
