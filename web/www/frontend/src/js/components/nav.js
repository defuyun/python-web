import React from  'react';
import * as log from 'loglevel';
import {Menu, Icon} from 'antd';
import {connect} from 'react-redux';

// actions
import {ACTIVE_ITEM_CHANGE} from 'actions/type';

// components
import Router from 'components/router';

const shouldDisplay = (displaySetting, userInfo) => {
    return displaySetting == 0 || displaySetting == 1 && userInfo != null || displaySetting == 2 && userInfo == null;
}

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
const constructNavMenu = ({menu, init, userInfo}) => {
    let sidenav = [];
    let curr = init;
    while(curr != null) {
        const node = menu[curr];
        const displayOption = shouldDisplay(node.display, userInfo)

        if (!displayOption) {
            curr = node.next;
            continue;
        }
        
        const sidenavFormatedChild = {id : curr, ...node};
        sidenav.push('children' in node ? [sidenavFormatedChild,...constructNavMenu({menu, init: node.init, userInfo})] : sidenavFormatedChild);

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

const NavMenu = ({menu, userInfo, activeItem, dispatch}) => {
    return (
        <Menu onClick={({key}) => dispatch({type : ACTIVE_ITEM_CHANGE, item : menu[key]})} selectedKeys ={[activeItem ? activeItem.id : null]}>
            {constructNavMenu({menu, init : menu.init, userInfo}).map((item) => MenuListItem({item}))}
        </Menu>
    );
};

const selector = (state) => {
    return {
        userInfo : state.userInfo,
        activeItem : state.activeItem
    }
}

export default connect(selector)(NavMenu);
