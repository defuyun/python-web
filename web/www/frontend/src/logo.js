import React from 'react';

import style from './logo.css';

const Logo = ({text = null, img = null, alt = 'image', clickHandle}) => {
	const imgElement = img ? <img className={'logo-img'} src={img} alt={alt} /> : null;
	const textElement = text ? <div className={'logo-text'}>{text}</div> : null;

	return (
		<div className={'logo'} styleName={'style.logo'} onClick={clickHandle}> 
			{imgElement} 
			{textElement} 
		</div>
	);
}



export default Logo;
