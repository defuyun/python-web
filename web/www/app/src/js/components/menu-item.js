import React from 'react'
import PropTypes from 'prop-types'
import {Menu, Icon} from 'antd'
import {Link} from 'react-router-dom'

class Item extends React.Component {
    render() {
        return (
            <Link to={this.props.item.link}>
                <Menu.Item key={this.props.item.key}>
                    <Icon type={this.props.item.icon} />
                    <span>{this.props.item.tag}</span>
                </Menu.Item>
            </Link>
        ) 
    }
}

class NestedItem extends React.Component {
    constructor(props) {
        super(props)
        let subArr

        [this.key, this.icon, this.tag, ...subArr] = props.item
        this.children = [...subArr]
    }

    render() {
        return (
            <Menu.SubMenu
                key={this.key}
                title={<span><Icon type={this.icon} /><span>{this.tag}</span></span>}
            >
                {this.children.map((item) => 
                    <MenuItem item={item} />    
                )}
            </Menu.SubMenu>
        )
    }
}

class MenuItem extends React.Component {
    render() {
        return(
            this.props.item instanceof Array ? <NestedItem item={this.props.item} /> : <Item item={this.props.item} />
        )
    }
}

MenuItem.PropTypes = {
    item : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.shape({
            key: PropTypes.string,
            icon: PropTypes.string,
            tag: PropTypes.string,
            link: PropTypes.string
        })
    ])
}

SubMenu.PropTypes = {
    item : PropTypes.array.isRequired
}

Item.PropTypes = {
    item : PropTypes.shape({
        key: PropTypes.string,
        icon: PropTypes.string,
        tag: PropTypes.string,
        link: PropTypes.string
    })
}

export default MenuItem