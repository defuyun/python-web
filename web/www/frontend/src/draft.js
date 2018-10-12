import {guid, remove, removeItemByKey} from './utils.js';

class resource {
	constructor(id, name, data, fromurl) {
		this.key = name;
		this.name = name;
		this.data = data;
		this.path = id + '/' + name;
		this.fromurl = fromurl;
	}
}

class draft {
	constructor({id}) {
		this.id = id ? id : guid();
		this.title = '';
		this.content = '';
		this.resources = [];
		this.resmap = {};
		this.tags = [];
		this.tagmap = {};
		this.errors = [];

		this.addres = this.addres.bind(this);
		this.removeres = this.removeres.bind(this);
		this.addtag = this.addtag.bind(this);
		this.removetag = this.removetag.bind(this);
		this.adderror = this.adderror.bind(this);
		this.clearerror = this.clearerror.bind(this);
		this.setcontent = this.setcontent.bind(this);
		this.settitle = this.settitle.bind(this);
		this.setupdate = this.setupdate.bind(this);
		this.setrerender = this.setrerender.bind(this);
		this.tosave = this.tosave.bind(this);

		this.update = () => {};
		this.rerender = () => {};
	}

	tosave() {
		const filenames = this.resources.map(res => res.name);
		return {
			postId : this.id,
			title : this.title,
			content : this.content,
			tags : this.tags,
			resources : filenames
		}
	}

	getunsynced() {
		return this.resources.filter(res => !res.fromurl);
	}
	
	addres(resource) {
		this.resources.push(resource);
		this.resmap[resource.name] = resource;
		this.update();
	}

	removeres(name) {
		removeItemByKey(this.resources,name);
		delete this.resmap[name];
		this.update();
	}

	addtag(tag) {
		this.tags.push(tag);
		this.tagmap[tag] = true;
		this.update();
	}
	
	removetag(tag) {
		remove(this.tags, tag);
		delete this.tagmap[tag];
		this.update();
	}

	adderror(errors) {
		this.errors.concat(errors);
		this.update();
	}

	clearerror() {
		this.errors = [];
		this.update();
	}

	setcontent(content) {
		this.content = content;
		this.rerender();
	}

	settitle(title) {
		this.title = title;
		this.rerender();
	}

	setupdate(update) {
		this.update = update;
	}

	setrerender(rerender) {
		this.rerender = rerender;
	}

	render() {
		return this.content;
	}
}

export {draft, resource};
