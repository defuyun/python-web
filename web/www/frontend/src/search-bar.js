import React from 'react';
import Icon from './icon.js';

const SearchBar = ({clickHandle}) => 
<div className='search-bar'> 
	<Icon icon='search' onClick={clickHandle} /><input type='text' name='keyword' placeholder='Search'/>
</div>

export default SearchBar;
