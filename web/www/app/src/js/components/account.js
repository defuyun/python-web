import React from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import { Form, Icon, Input, Button, Checkbox, Row, Col, Tabs} from 'antd';
import {getRelativePath} from 'common/helper'
import {http_json} from 'common/http-helper'
import {getSidenav} from 'actions/actions'
import CryptoJs from 'crypto-js'

const FormItem = Form.Item;
const TabPane = Tabs.TabPane

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if (!err) {
            http_json({
                url: '/login',
                json: {
                    username:values.userName,
                    password:CryptoJs.SHA1(values.userName + values.password).toString()
                },
                resp: (response) => {
                    if(response.status === 200) {
                        this.props.fetchSidenav()
                        this.props.history.push('/home')
                    } else {
                        console.log(response)
                    }
                }
            })
        }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [
                { required: true, message: 'Please input your username!' },
                { max: 25, message: 'Username does not exceed 25 characters' },
                { pattern: /^([_a-zA-Z])[_1-9a-zA-Z]*$/, message: 'Username can only contain alphanumeric characters'}
            ],
          })(
            <Input prefix={<Icon type="user" />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
                { required: true, message: 'Please input your Password!' },
                { max: 40, message: 'password should be less than 40 characters'}
            ],
          })(
            <Input prefix={<Icon type="lock" />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" style={{float:'right'}} href="">Forgot password</a>
        </FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{width:'100%'}}>
            Log in
          </Button>
      </Form>
    );
  }
}

class NormalRegisterForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if (!err) {
            http_json({
                url: '/register',
                json: {
                    username:values.userName,
                    email:values.email,
                    password:CryptoJs.SHA1(values.userName + values.password).toString(),
                    secret:values.secret
                },
                resp: (response) => {
                    if(response.status === 200) {
                        this.props.fetchSidenav()
                        this.props.history.push('/home')
                    }
                }
            })
        }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="register-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [
                { required: true, message: 'Please input your username!' },
                { max: 25, message: 'Username must not exceed 25 characters' },
                { pattern: /^([_a-zA-Z])[_1-9a-zA-Z]*$/, message: 'Username can only contain alphanumeric characters'}
            ],
          })(
            <Input prefix={<Icon type="user" />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
                { required: true, message: 'Please input your email!' },
                { max: 100, message: 'Really? that long'},
                { pattern: /\S+@\S+\.\S+/, message: 'Email should be in the format a@b.c'}
            ],
          })(
            <Input prefix={<Icon type="mail" />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
                { required: true, message: 'Please input your Password!' },
                { max: 40, message: 'password should be less than 40 characters'}
            ],
          })(
            <Input prefix={<Icon type="lock" />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('secret', {
            rules: [
                { required: true, message: 'Please input the secret!' },
                { max: 40, message: 'You obviously don\'t know the secret'}
            ],
          })(
            <Input prefix={<Icon type="lock" />} type="password" placeholder="Secret" />
          )}
        </FormItem>
        <Button type="primary" htmlType="submit" className="register-form-button" style={{width:'100%'}}>
            Register
        </Button>
      </Form>
    );
  }
}

class Signout extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        http_json({
            url: '/signout',
            json: {
            },
            resp: (response) => {
                if(response.status === 200) {
                    this.props.fetchSidenav()
                    this.props.history.push('/home')
                }
            }
        })
    }

    render() {
        return (
            <div className="doge-signout" style={{width:'100%',height:'100%',textAlign:'center'}}>
                <h3 style={{marginTop:'10px'}}>Click on continue to complete Signout</h3>
                <div style={{width:'75%',textAlign:'center',margin:'0 auto',marginBottom:'100px'}}>You will lose the ability to edit</div>
                <Button type="primary" style={{width:'100%'}} onClick={this.handleSubmit}>
                    Signout
                </Button>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchSidenav : () => dispatch(getSidenav),
    }
}

const WrappedNormalLoginForm = withRouter(connect(null, mapDispatchToProps)(Form.create()(NormalLoginForm)));
const WrappedNormalRegisterForm = withRouter(connect(null, mapDispatchToProps)(Form.create()(NormalRegisterForm)));
const SignoutForm = withRouter(connect(null,mapDispatchToProps)(Signout));

class Account extends React.Component {
    constructor(props) {
        super(props)
        this.changeTab = this.changeTab.bind(this)
        this.state = {
            activeKey:getRelativePath(props.location.pathname)
        }
    }

    changeTab(key) {
        if(key !== this.state.activeKey) {
            this.props.history.push(`/${key}`)
            this.setState({activeKey:key})
        }
    }

    componentWillReceiveProps(nextProps) {
        const relativePath = getRelativePath(nextProps.location.pathname)
        this.changeTab(relativePath)
    }

    render() {
        const signedIn = this.state.activeKey === 'signout'
        const login = !signedIn ? 
                        (<TabPane tab='login' key='login'>
                            <WrappedNormalLoginForm />
                        </TabPane>) : null
        
        const register = !signedIn ?
                        (<TabPane tab='register' key='register'>
                            <WrappedNormalRegisterForm />
                        </TabPane>) : null
        
        const signout = signedIn ? 
                        (<TabPane tab='signout' key='signout'>
                            <SignoutForm />
                        </TabPane>) : null
        return (
            <Row type='flex' style={{height:'100%'}} justify='space-around' align='middle'>
                <Col span={12} style={{height:'600px'}} className='doge-content-container'>
                    <Tabs 
                        style={{height:'100%',width:'400px',paddingTop:'100px',margin:'0 auto'}} 
                        activeKey={this.state.activeKey} 
                        onChange={this.changeTab}
                    >
                        {login}
                        {register}
                        {signout}
                    </Tabs>
                </Col>
            </Row>
        )
    }
}

export default withRouter(Account)