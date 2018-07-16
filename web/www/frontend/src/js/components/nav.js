import React from  'react';
import {Menu, Icon} from 'antd';
import {connect} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import {withRouter} from 'react-router-dom';
import {getRelativePath} from 'common/utils';

import * as log from 'loglevel';

// this function is expected to be binded to a component which has access to history
// arrow function does not work with bind therefore it needs to be defined as an ordinary function
// item is the Menu.Item component
// self is the dictionary in the ContextMenu that corresponds to the Menu.Item, e.g. if the Item is home, then self is ContextMenu['home']
function changeHistoryFunctionPrototype(item, self) {
    if (item == undefined) {
        log.warn('[NAV] item in changeHistroyFunctionPrototype is undefined, a valid menu item was not clicked to trigger this function')
        return;
    }

    if (self == undefined) {
        log.warn(`[NAV]: self in changeHistroyFunctionProtoype is undefined, something went wrong`);
        return;
    }

    if (self == undefined) {
        log.warn(`[NAV]: self.url in changeHistroyFunctionProtoype is undefined, something went wrong`);
        return;
    }

    log.info(`[NAV]: changeHistoryFunctionPrototype is called with ${self.url}`);
    this.props.history.push(self.url);
}

// ContextMenu is a dictionary format of the side nav
const ContextMenu = {
    home : {
        icon : 'home',
        tag : 'home',
        // does this option require user login to access,
        // 0: does not matter, 1: yes, 2: no
        user : 0,
        next : 'posts',
        url : 'home',
        onClick : changeHistoryFunctionPrototype
    },

    posts : {
        icon : 'file',
        tag : 'posts',
        user : 0,
        next : 'edit',
        url : 'posts',
        onClick : changeHistoryFunctionPrototype
    },

    edit : {
        icon : 'edit',
        tag : 'edit',
        user : 1,
        next : 'account',
        url : 'edit',
        onClick : changeHistoryFunctionPrototype
    },

    account : {
        icon : 'user',
        tag : 'account',
        user : 0,
        children : [
            'register',
            'login',
            'logout'
        ],
        init : 'register',
        next : null
    },

    register : {
        icon : 'user-add',
        tag : 'register',
        user : 2,
        next : 'login',
        url : 'register',
        onClick : changeHistoryFunctionPrototype
    },

    login : {
        icon : 'login',
        tag : 'login',
        user : 2,
        next : 'logout',
        url : 'login',
        onClick : changeHistoryFunctionPrototype
    },

    logout : {
        icon : 'logout',
        tag : 'logout',
        user : 1,
        next : null
    },

    // the first option on the list
    init : 'home',
};

// this converts the dictionary format to menu item format
// the return value is an array of objects e.g.
/*
    [
        {id : home, blabla}, 
        {id : post, blabla}, 
        ... , 
        [
            {id : account, blabla}, 
            {id : register, blabla}
        ]
    ]
*/
// the sequence in the array is the sequence they are going to be displayed
// when there is a sub array it means there is a submenu, where the root is the first item, in this example
// account is the submenu, and the root is account
// whatever follows it is the children
// so in this example register
const constructNavMenu = (init, user=null) => {
    let sidenav = [];
    let curr = init;
    while(curr != null) {
        let node = ContextMenu[curr];
        let displayOption = node.user == 0 || node.user == 1 && user != null || node.user == 2 && user == null;

        if (!displayOption) {
            curr = node.next;
            continue;
        }
        
        let sidenavFormatedChild = {id : curr, ...node};
        sidenav.push('children' in node ? [sidenavFormatedChild,...constructNavMenu(node.init, user)] : sidenavFormatedChild);

        curr = node.next;
    }

    return sidenav;
}

const Item = ({item}) => {
    return (
        <Menu.Item key={item.id}>
            <Icon type={item.icon} />
            <span>{item.tag}</span>
        </Menu.Item>
    );
}

const NestedItem = ({item}) => {
    let subArr, rootItem, children;
    [rootItem, ...subArr] = item;
    children = [...subArr];
    
    return (
        <Menu.SubMenu
            key={rootItem.id}
            title={
                <span>
                    <Icon type={rootItem.icon} />
                    <span>
                        {rootItem.tag}
                    </span>
                </span>
            }
        >
            {children.map((item) => MenuListItem({item}))}   
        </Menu.SubMenu>
    );
}

const MenuListItem = ({item}) => {
    return item instanceof Array ? NestedItem({item}) : Item({item});
}

class NavMenu extends React.Component {
    constructor(props) {
        super(props);
        this.menuItemClicked = this.menuItemClicked.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
        this.state = {
            options : constructNavMenu(ContextMenu['init'])
        };
    }

    menuItemClicked({item, key}) {
        ContextMenu[key].onClick.call(this, item, ContextMenu[key]);
    }

    selectedItem() {
        for(let [key,value] of Object.entries(ContextMenu)) {
            if (value.url === getRelativePath(this.props.location.pathname)) {
                log.info(`[NAV]: change in seleted Item, now selected item is ${key}`);
                return key;
            }
        }
        return null;
    }

    render() {
        return (
            <Menu onClick={this.menuItemClicked} selectedKeys = {[this.selectedItem()]}>
                {this.state.options.map((option) => MenuListItem({item:option}))}
            </Menu>
        );
    }
}

const mapStateToProps = (state) => {
    return {userInfo : state.userInfo};
}

export default withRouter(connect(mapStateToProps)(NavMenu));