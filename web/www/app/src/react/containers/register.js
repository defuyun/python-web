import React from 'react'
import {sidenav} from '../actions/index'
import CryptoJs from 'crypto-js'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import '../css/login.css'

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }

    onSubmit() {
        this.props.fetchSideNav()
        this.props.history.push('/home')
    }

    submitForm(event) {
        if(!this.refs.username.value || !this.refs.password.value || !this.refs.secret.value | !this.refs.email.value) {
            console.log('submit failed')
            return;
        }

        const data = {
            username : this.refs.username.value,
            email : this.refs.email.value,
            password : CryptoJs.SHA1(this.refs.username.value + this.refs.password.value).toString(),
            secret : this.refs.secret.value
        }

        fetch('/register', {
            credentials: 'include',
            method:'POST',
            body : JSON.stringify(data),
            headers: {
                'content-type' : 'application/json',
            },
        }).then((response) => {
            const isSuccess = response.status === 200
            if(isSuccess) {
                this.onSubmit()
            } else {
                console.log('register failed')
            }
        })
    }

    render() {
        return (
            <div className='bg-login-form'>
                <div className='bg-login-form-title'>Register</div>
                <input type='text' className='bg-login-input bg-login-form-user' placeholder='Input your username' ref='username'/>
                <input type='email' className='bg-login-input bg-login-form-email' placeholder='Input your email' ref='email'/>
                <input type='password' className='bg-login-input bg-login-form-pass' placeholder='Input your password' ref='password'/>
                <input type='text' className='bg-login-input bg-login-form-secret' placeholder='Input the secret' ref='secret'/>
                <input type='button' className='bg-register-button' onClick={this.submitForm} value='Submit' />
            </div>    
        )
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchSideNav : () => dispatch(sidenav())       
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register))