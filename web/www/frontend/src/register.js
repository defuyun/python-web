import React from 'react';
import Button from './button.js';
import Form from './form.js';

import style from './register.css';
import {empty, lessThan, moreThan, match} from './utils.js';

const inputGroup = [
	{	
		key : 'user',
		filters : [
			{
				filter : empty,
				feedback : 'username cannot be empty',
			},
			{
				filter : lessThan(4),
				feedback : 'username must be at least 4 bits long'
			},
			{
				filter : moreThan(12),
				feedback : 'username must be shorter than 12 bits'
			}
		],
		iconProps : {icon : 'user'},
		inputProps : {placeholder : 'username', type : 'text'},
	},
	{
		key : 'at',
		filters : [
			{	
				filter : empty,
				feedback : 'email cannot be empty',
			},
			{
				filter : match(RegExp('^[a-z_0-9]+@[a-z0-9]+(\.[a-z]+)+$','i')),
				feedback : 'invalid email address',
			}
		],
		iconProps : {icon : 'at'},
		inputProps : {placeholder : 'email', type : 'text'},
	},
	{
		key : 'pass',
		filters : [
			{
				filter : empty,
				feedback : 'password cannot be empty',
			},
			{
				filter : lessThan(6),
				feedback : 'password must be at least 6 bits long'
			},
			{
				filter : moreThan(30),
				feedback : 'password must be shorter than 30 bits'
			}
		],
		iconProps : {icon : 'key'},
		inputProps : {placeholder : 'password', type : 'password'},
	},
	{
		key : 'secret',
		filters : [
			{
				filter : moreThan(30),
				feedback : 'secret is below 30 bits'
			}
		],
		iconProps : {icon : 'key'},
		inputProps : {placeholder : 'secret', type : 'password'},
	},
];

const submitButton = {
	text : 'Submit',
	border : 1,
	inversible : 1,
};
	

class Register extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div key='register' className='register-box' styleName='register'>
				<Form inputGroup={inputGroup} submitButton={submitButton} />
				<div className='to-login'> or if you already have an account <a href='/login'> login </a></div>
			</div>		
		);
	}
}

export default Register;
