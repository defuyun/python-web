import React from 'react'
import {Row, Col} from 'antd'
import PostsList from 'containers/posts-list'

const Posts = () => {
    return (
        <Row style={{height:'100%'}} type='flex' justify='center' align='middle'>
            <Col style={{height:'100%'}} span={18} className='doge-content-container'>
                <div style={{padding:'20px', paddingTop:'100px',height:'100%'}}>
                    <PostsList />
                </div>
            </Col>
        </Row>
    )
}

export default Posts