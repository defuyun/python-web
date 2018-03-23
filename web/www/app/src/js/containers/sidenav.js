import React from  'react'
import {Layout, Menu, Icon} from 'antd'
import {connect} from 'react-redux'
import {getSidenav} from 'actions/actions'
import {withRouter, Link} from 'react-router-dom'
import {routeToMenuKey} from 'common/constants'
const {Sider} = Layout

const Item = ({item}) => {
    return (
        <Menu.Item key={item.id}>
            <Link to={item.link}>
                <Icon type={item.icon} />
                <span>{item.tag}</span>
            </Link>
        </Menu.Item>
    )
}

const NestedItem = ({item}) => {
    let subArr, rootItem, children
    [rootItem, ...subArr] = item
    children = [...subArr]
    
    return (
        <Menu.SubMenu
            key={rootItem.id}
            title={<span><Icon type={rootItem.icon} /><span>{rootItem.tag}</span></span>}
        >
            {children.map((item) => MenuListItem({item}))}   
        </Menu.SubMenu>
    )
}

const MenuListItem = ({item}) => {
    return item instanceof Array ? NestedItem({item}) : Item({item})
}

class Sidenav extends React.Component {
    constructor(props) {
        super(props)
        this.props.fetchSidenav()
    }

    componentWillMount() {
        this.setState({collapsed: false})
    }

    onCollapse = (collapsed) => {
        this.setState({collapsed})
    }

    render() {
        const selected = routeToMenuKey(this.props.location.pathname)
        return (
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
                style={{height:'100%'}}
            >
                <div className='logo' />
                <Menu theme='dark' mode='inline' style={{height:'100%'}} selectedKeys={selected ? [selected] : null}>
                    {this.props.options.map((option) => MenuListItem({item:option}))}
                </Menu>
            </Sider>
        )
    }
}

function mapStateToProps(state) {
    return {
        options : state.options,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchSidenav : () => dispatch(getSidenav),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidenav))