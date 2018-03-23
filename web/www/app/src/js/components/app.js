import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import {Layout} from 'antd'
import Sidenav from 'containers/sidenav'
import Content from 'components/content'

const App = () => (
        <BrowserRouter>
            <Layout style={{height:'100%'}}>
                <Sidenav />
                <Layout style={{height:'100%'}} >
                    <div className='doge-content' style={{height:'100%',width:'100%'}}>
                        <Content />
                    </div>
                </Layout>
            </Layout>
        </BrowserRouter>
)

export default App