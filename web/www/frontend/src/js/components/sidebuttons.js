import React from 'react';

const SideButtons = ({buttons}) => {
	return <div>{buttons.forEach(button => {
		<div key={button.tag} onClick={button.func}> button.tag </div> 
	})} </div>;
}

export default SideButtons;
