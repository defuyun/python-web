import React from 'react'
import Header from '../containers/header'
import SideNav from '../containers/sidenav'
import Content from '../containers/content'
import {BrowserRouter} from 'react-router-dom'

const App = () => (
    <div>
        <Header />
        <BrowserRouter>
            <div>
                <SideNav />
                <Content />
            </div>
        </BrowserRouter>
    </div>
)

export default App