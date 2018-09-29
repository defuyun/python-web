import React from 'react';
import Nav from './nav.js';
import Router, {router} from './router.js';
import menu from './menu-model.js';

import animate from './animate.js';
import Register from './register.js';

import './app.css';

router.registerComponent(menu.register.url, animate(Register));

const app = () =>
	<div> 
		<Nav /> 
		<div className='container'>
			<Router /> 
		</div>
	</div>;

export default app;
