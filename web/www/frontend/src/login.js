import React from 'react';
import Button from './button.js';
import Form from './form.js';
import {connect} from 'react-redux';
import menu from './menu-model.js';

import style from './login.css';
import {empty, lessThan, moreThan, match} from './utils.js';
import * as log from 'loglevel';

const inputGroup = [
	{
		key : 'email',
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
		key : 'password',
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
];

let submitButton = {
	text : 'Submit',
	border : 1,
	inversible : 1,
};


class Login extends React.Component {
	constructor(props) {
		super(props);
		this.createOnChange = this.createOnChange.bind(this);
		submitButton.onClick = this.onClick.bind(this);
		for(let input of inputGroup) {
			input.inputProps.onChange = this.createOnChange(input.key);
		}
	}

	createOnChange(key) {
		function onChange(event) {
			this.setState({[key] : event.target.value});
		}
		return onChange.bind(this);
	}

	onClick() {
		const {dispatch} = this.props;
		const {email, password} = this.state;
		
		log.info(`[LOGIN] dispatching api with val : ${email}`);
		dispatch({type : 'API_CALL', id : 'login', params : {email,password}});
	}

	render() {
		return (
			<div key='login' className='login-box' styleName='login'>
				<Form inputGroup={inputGroup} submitButton={submitButton} />
				<div className='to-register'> {'or if you don\'t have an account'}	<a href={menu.register.url}> register </a></div>
			</div>		
		);
	}
}

export default connect()(Login);