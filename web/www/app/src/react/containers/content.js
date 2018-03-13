import '../css/container.css'

import React from 'react'
import {Route} from 'react-router-dom'

import Edit from './edit'

class Content extends React.Component {
    render() {
        return (
            <div className='bg-content'>
                <Route path='/edit' component={Edit} />
            </div>
        )
    }
}

export default Content