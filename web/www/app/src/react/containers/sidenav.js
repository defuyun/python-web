import '../css/container.css'

import React from 'react'
import {connect} from 'react-redux'
import fetchSideNav from '../actions/fetch-state'
import {withRouter, Link} from 'react-router-dom'

class SideNav extends React.Component {
    constructor(props) {
        super(props)
        this.props.fetchData()
    }

    render() {
        return (
            <div className='bg-sidenav'>
                <ul>
                    {this.props.options.map((option) => 
                        <li key={option.id} className='bg-list-item'>
                            <Link to={`/${option.tag}`}>
                                <i className={option.icon}></i>
                                <div className='bg-caption'>{option.id}</div>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        options : state.options
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchData : () => dispatch(fetchSideNav())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideNav))