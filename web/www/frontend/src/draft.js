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
		this.reset = this.reset.bind(this);
		this.syncall = this.syncall.bind(this);
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
		this.events = {};
		this.reset({});
	}

	addEventListener(eventName, funcId, func) {
		if (!this.events[eventName]) {
			this.events[eventName] = {};
		}

		this.events[eventName][funcId] = func;
	}

	removeEventListener(eventName, funcId, func) {
		if(!this.events[eventName]) {
			log.error(`[DRAFT] cannot remove event from <${eventName}> : ${eventName} does not exist`);
		}
		
		delete this.events[eventName][funcId];
	}

	syncall() {
		this.resources.map(resource => resource.fromurl = true);
	}
	
	static makeDraft(post) {
		let ret = new draft({});
		ret.reset({...post, id : post.postId, content : post.post});
		return ret;
	}

	reset({id, title, content, resources, tags, description}) {
		this.id = id || guid();
		this.title = title || '';
		this.content = content || '';
		this.resources = [];
		this.resmap = {};
		this.tags = [];
		this.tagmap = {};
		this.errors = [];
		this.description = description || '';
		this.renderFlag = true;
		this.stealFocus = false;

		resources && resources.map(res => res instanceof resource ? this.addres(res) : this.addres(new resource(id, res.name, res.data, true)));
		tags && tags.map(tag => this.addtag(tag));
	}

	clear() {
		this.reset({});
		this.update();
		Object.values(this.events['new']).map(evt => evt());
		this.rerender();
	}

	tosave() {
		const filenames = this.resources.map(res => res.name);
		return {
			postId : this.id,
			title : this.title,
			description : this.description,
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
		if (this.contentRefreshEvt) {
			clearTimeout(this.contentRefreshEvt);
		}

		this.content = content;
		
		this.contentRefreshEvt = setTimeout(() => {
			this.renderFlag = true;
			this.clearerror();
			this.rerender();
		},1000);
	}

	settitle(title) {
		this.title = title;
		this.rerender();
	}

	setdescrip(description) {
		this.description = description;
		this.rerender();
	}

	rerender() {
		Object.values(this.rerenderFunc).map(render => render());
	}

	update() {
		if (this.updateEvt) {
			clearTimeout(this.updateEvt)
		}
		this.updateEvt = setTimeout(() => Object.values(this.updateFunc).map(update => update()), 500);
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

	render(flush) {
		const content = this.resources.map(resource => `[${resource.noext}]: ${resource.data}`).join('\n\n') + '\n\n' + this.content;
		if (flush) {
			this.stealFocus = true;
			this.renderFlag = false;
		}

		return content;
	}
}

export {draft, resource};
