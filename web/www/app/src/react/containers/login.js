import React from 'react'
import {sidenav} from '../actions/index'
import CryptoJs from 'crypto-js'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import '../css/login.css'

class Login extends React.Component {
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
        const data = {
            username : this.refs.username.value,
            password : CryptoJs.SHA1(this.refs.username.value + this.refs.password.value).toString()
        }
        
        fetch('/authenticate', {
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
                console.log('login failed')
            }
        })
    }

    render() {
        return (
            <div className='bg-login-form'>
                <div className='bg-login-form-title'>Login</div>
                <input type='text' className='bg-login-input bg-login-form-user' placeholder='Input your username' ref='username'/>
                <input type='password' className='bg-login-input bg-login-form-pass' placeholder='Input your password' ref='password'/>
                <input type='button' className='bg-login-button bg-login-submit' onClick={this.submitForm} value='Submit' />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))