import React from 'react';

const Logo = ({text = 'The powerhouse of the cell', img = null, alt = 'image', clickHandle}) => {
	const imgElement = img ? <img src={img} alt={alt} /> : null;
	return (
		<div className={'logo'} onClick={clickHandle}> 
			{imgElement} {text} 
		</div>
	);
}



export default Logo;
