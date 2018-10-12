import * as log from 'loglevel';
import {getItemByKey, removeItemByKey} from './utils.js';

const delimeter = '/';

class fnode {
	constructor({dir, name, pnode}) {
		this.dir = dir;
		this.name = name;
		this.pnode = pnode;
		this.path = this.path.bind(this);
	}

	path() {
		return (this.pnode ? this.pnode.path() : '') + delimeter + this.name;
	}
}

class fdir extends fnode {
	constructor(args) {
		super(args);
		this.children = [];
		this.map = {};
		this.append = this.append.bind(this);
	}

	append(fnode) {
		fnode.pnode = this;
		this.children.append(fnode);
		this.map[fnode.name] = fnode;
	}
}

class ffile extends fnode {
	constructor(args) {
		super(args);
		const {url, content, useurl} = args;
		
		if (content) {
			this.content = content;
		} else if (useurl) {
			fetch(url).then(response => response.text()).then(text => {
					this.content = text;
					log.info(`[FILESYSTEM] fetched file [${url}] with first 10 char: [${content.substring(0,10)}]`);
			});
		}

		this.url = url;
		this.useurl = useurl;
	}
}

const getnode = (fnode,path) => {
	const dirs = path.split(delimeter);
	let node = fnode;
	for(const dir of dirs) {
		if (!node || !node.dir) {
			log.error(`[FILESYSTEM] ${fnode.name} does not contain file/path ${path}`);
			return null;
		}
		node = node.map[dir];
	}
	return node;
}

const getextension = (path) => {
	let ext = '';
	for(let i = path.length; i >= 0; i--) {
		ext = path[i] + ext;
		if (path[i] === '.') {
			break;
		}
	}
	return ext;
}

class commands {
	constructor({root, update}) {
		this.addfile = 'ADDF';
		this.rename = 'RENA';
		this.remove = 'REMO';
		this.edit = 'EDIT';
		this.adddir = 'ADDD';
		this.upload = 'UPL';
		
		this.cmd = {};
		this.cmd.addf = 'ADDF';
		this.cmd.addd = 'ADDD';
		this.cmd.rename = 'RENA';
		this.cmd.remove = 'REMO';

		this.commandlist = [];
		this.map = {};
		this.root = root;
		this.exc = this.exc.bind(this);
	}

	convertcmd(type) {
		switch(type) {
			case this.addfile:
			case this.edit:
			case this.upload:
				return this.cmd.addf;
			case this.remove:
				return this.cmd.remove;
			case this.rename:
				return this.cmd.rename;
		}
	}

	refreshcmd(type) {
		switch(type) {
			case this.addfile:
			case this.rename:
			case this.remove:
			case this.adddir:
			case this.upload:
				return true;
			default:
				return false;
		}
	}

	makecmd({type, newnode, oldpath}) {
		const path = newnode.path();
		const acr = this.convertcmd(type);

		if(!acr || this.map[path] && this.map[path][acr]) {
			// adddir can be ignored because addfile will also adddir or command already exists
			return null;
		}
	}

	exc({type, name, content, cnode, pnode}) {
		let newnode = cnode, oldpath = null;

		if (type === this.addfile || type === this.upload) {
			if (!pnode.dir) {
				log.error(`[FILESYSTEM] add file called on not dir node [${pnode.name}]`);
				return;
			}
			// by default we assume uploaded file deos not get the content read and assigned
			newnode = ffile({name,content, dir : false, useurl : type === this.addfile});
			pnode.append(newnode);
		} else if (type === this.rename) {
			let pnode = cnode.pnode;
			oldpath = cnode.path();
			delete pnode.map[cnode.name];
			
			cnode.name = name;
			pnode.map[name] = cnode;
		} else if (type === this.remove) {
			delete cnode.pnode.map[name || cnode.name];
		} else if (type === this.edit) {
			cnode.content = content;
			shouldUpdate = false;
		} else if (type === this.adddir) {
			newnode = fdir({name, dir : true});
			pnode.append(newnode);
		}

		const cmdobj = this.makecmd({type, newnode, oldpath});
		if (cmdobj) {
			commandlist.push(cmdobj);
		}

		if(refreshcmd(type)) {
			this.update();
		}

	}
}

export {fnode, fdir, ffile, getnode, getextension};
