import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {Layout} from 'antd'

import Editor from 'components/editor'
import Account from 'components/account'
import Posts from 'components/posts'
import Post from 'containers/post'

const {Content} = Layout

const ContentWrapper =  () => (
    <Content style={{height:'100%'}}>
        <Switch>
            <Route path='/edit' component={Editor} />
            <Route path='/login' component={Account} />
            <Route path='/register' component={Account} />
            <Route path='/signout' component={Account} />
            <Route path='/posts/:postId' component={Post} />
            <Route path='/posts' component={Posts} />
        </Switch>
    </Content>
)

export default ContentWrapper