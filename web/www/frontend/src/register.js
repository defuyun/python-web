import React from 'react';
import Button from './button.js';

class Register extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='register-box'>
				<input type='text' />
				<input type='text' />
				<input type='password' />
				<input type='password' />
				<Button text={'Submit'} />
			</div>		
		);
	}
}

export default Register;
