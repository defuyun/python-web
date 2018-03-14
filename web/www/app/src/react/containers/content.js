import '../css/container.css'

import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Editor from './editor'
import Posts from './posts'
import Post from './post'

class Content extends React.Component {
    render() {
        return (
            <div className='bg-content'>
                <Switch>
                    <Route path='/edit' component={Editor} />
                    <Route path='/posts/:postId' component={Post} />
                    <Route path='/posts' component={Posts} />
                </Switch>
            </div>
        )
    }
}

export default Content