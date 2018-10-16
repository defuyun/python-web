import {guid, remove, removeItemByKey, rfind} from './utils.js';

class resource {
	constructor(id, name, data, fromurl, file) {
		this.key = name;
		this.name = name;
		this.data = fromurl ? BASE_URL + data : data;
		this.path = id + '/' + name;
		this.fromurl = fromurl;
		this.file = file;
		const extIndex = rfind(name, '.');
		this.noext = extIndex === -1 ? name : name.substr(0, extIndex);
	}
}

class draft {
	constructor({id}) {
		this.newp = this.newp.bind(this);
		this.addres = this.addres.bind(this);
		this.removeres = this.removeres.bind(this);
		this.addtag = this.addtag.bind(this);
		this.removetag = this.removetag.bind(this);
		this.adderror = this.adderror.bind(this);
		this.clearerror = this.clearerror.bind(this);
		this.setcontent = this.setcontent.bind(this);
		this.settitle = this.settitle.bind(this);
		this.addupdate = this.addupdate.bind(this);
		this.addrerender = this.addrerender.bind(this);
		this.tosave = this.tosave.bind(this);
		this.clear = this.clear.bind(this);

		this.update = this.update.bind(this);
		this.rerender = this.rerender.bind(this);
		this.updateFunc = {};
		this.rerenderFunc = {};
		this.newp();
	}
	
	static makeDraft(post) {
		let ret = new draft({});
		ret.id = post.postId;
		ret.title = post.title;
		ret.content = post.post;
		ret.resources = post.resources.map(res => new resource(post.postId, res.name, res.data,true));
		ret.tags = post.tags;
		ret.descrip = post.description;
		return ret;
	}

	newp() {
		this.id = guid();
		this.title = '';
		this.content = '';
		this.resources = [];
		this.resmap = {};
		this.tags = [];
		this.tagmap = {};
		this.errors = [];
		this.descrip = '';
	}

	clear() {
		this.newp();
		this.update();
		this.rerender();
	}

	tosave() {
		const filenames = this.resources.map(res => res.name);
		return {
			postId : this.id,
			title : this.title,
			description : this.descrip,
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
		this.clearerror();
		this.rerender();
	}

	settitle(title) {
		this.title = title;
		this.rerender();
	}

	setdescrip(descrip) {
		this.descrip = descrip;
		this.rerender();
	}

	rerender() {
		Object.values(this.rerenderFunc).map(render => render());
	}

	update() {
		Object.values(this.updateFunc).map(update => update());
	}

	addupdate(name, update) {
		if (! (update instanceof Function)) {
			log.error('[DRAFT] upate is not a function');
			return;
		}
		this.updateFunc[name] = update;
	}

	addrerender(name, rerender) {
		if (! (rerender instanceof Function)) {
			log.error('[DRAFT] rerender is not a function');
			return;
		}
		this.rerenderFunc[name] = rerender;
	}

	render() {
		const content = this.resources.map(resource => `[${resource.noext}]: ${resource.data}`).join('\n\n') + '\n\n' + this.content;
		return content;
	}
}

export {draft, resource};
