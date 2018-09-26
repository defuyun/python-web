const contextMenuTree = {
	home : {
		id : 'home',
		icon : 'home',
		tag : 'home',
		// this field specifies does this option require user login to display
		// 0: does not matter, 1: yes, 2: no
		display : 0,
		next : 'posts',
		url : '/home',
		// cachable: should we go through the whole render cycle if the selected item is the current active item
	},

	posts : {
		id : 'posts',
		icon : 'file',
		tag : 'posts',
		display : 0,
		next : 'edit',
		url : '/posts',
	},

	// post is not part of the linked list therefore it will not get displayed
	post : {
		id : 'post',
		url : '/posts/<:postId>',
	},

	edit : {
		id : 'edit',
		icon : 'edit',
		tag : 'edit',
		display : 1,
		next : 'account',
		url : '/edit',
	},

	account : {
		icon : 'user',
		tag : 'account',
		display : 0,
		children : [
			'register',
			'login',
			'logout',
		],
		init : 'register',
		next : null
	},

	register : {
		id : 'register',
		icon : 'user-plus',
		tag : 'register',
		display : 2,
		next : 'login',
		url : '/register',
		component: null,
	},

	login : {
		id: 'login',
		icon : 'sign-in-alt',
		tag : 'login',
		display : 2,
		next : 'logout',
		url : '/login',
		component: null,
	},

	logout : {
		id: 'logout',
		icon : 'sign-out-alt',
		tag : 'logout',
		display : 1,
		next : null
	},

	// the first option on the list
	init : 'home',
}

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
const constructNavMenu = ({menu = contextMenuTree, init = null, userInfo = null}) => {
	if(init === null) {
		init = menu.init;
	}
	
	if(init === null || init === undefined) {
		log.error('[MENU] init for constructing item cannot be null');
		return null;
	}

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

export default contextMenuTree;
export {constructNavMenu};
