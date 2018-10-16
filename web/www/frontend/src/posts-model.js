import {find, remove} from './utils.js';
import * as log from 'loglevel';

class _tags {
	constructor(tags) {
		this.toggle = this.toggle.bind(this);
		this.taglist = {};
		this.selected = [];
			
		tags.map(tag => this.taglist[tag.tagname] ? this.taglist[tag.tagname].push(tag.postId) : this.taglist[tag.tagname] = [tag.postId]);
	}

	toggle(tag) {
		find(this.selected, tag) ? remove(this.selected, tag) : this.selected.push(tag);
	}
}

class posts {
	constructor(posts, tags, refresh) {
		this.toggleTag = this.toggleTag.bind(this);
		this.refreshItems = this.refreshItems.bind(this);
		this.set = this.set.bind(this);

		this.itemPerPage = 6;
		this.posts = posts;
		this.page = 0;
		this.tags = new _tags(tags);
		this.filteredItems = this.posts;
		this.displayItems = this.filteredItems.slice(this.page * this.itemPerPage, (this.page + 1) * this.itemPerPage);
		this.totalPage = Math.ceil(this.filteredItems.length / this.itemPerPage);
		this.refresh = refresh;

		this.hasNext = this.hasNext.bind(this);
		this.hasPrev = this.hasPrev.bind(this);
		this.prevPage = this.prevPage.bind(this);
		this.nextPage = this.nextPage.bind(this);
	}

	set({refresh}) {
		this.refresh = refresh;
	}

	static sync(orig, _posts, tags, refresh) {
		const selected = orig.tags.selected;
		const page = orig.page;

		let __posts = new posts(_posts, tags, refresh);
		__posts.tags.selected = selected.filter(tag => __posts.tags.taglist[tag]);
		__posts.page = page;
		__posts.refreshItems();
		return __posts;
	}

	refreshItems() {
		let tagMap = {};

		this.tags.selected.map(tag => {
			log.info(`[POSTS_MODEL] selected tag ${tag} : ${JSON.stringify(this.tags.taglist[tag])}`);
			const matchedPosts = this.tags.taglist[tag];
			matchedPosts.map(postId => tagMap[postId] ? tagMap[postId].push(tag) : tagMap[postId] = [tag]);
		});

		this.posts.map(post => post.tags = []);

		this.filteredItems = Object.keys(tagMap).length === 0 ? this.posts : this.posts.filter(post => post.tags = tagMap[post.id]);

		this.displayItems = this.filteredItems.slice(this.page * this.itemPerPage, (this.page + 1) * this.itemPerPage);
		this.totalPage = Math.ceil(this.filteredItems.length / this.itemPerPage);
		if (this.page >= this.totalPage) {
			this.page = this.totalPage - 1;
		}
	}

	toggleTag(tag) {
		return () => {
			this.tags.toggle(tag);
			this.page = 0;
			this.refreshItems();
			this.refresh();
		}
	}

	hasNext() {
		return this.page < (this.totalPage - 1);
	}

	hasPrev() {
		return this.filteredItems.length > 0 && this.page > 0;
	}

	nextPage() {
		this.page += 1;
		this.refreshItems();
		this.refresh();
	}

	prevPage() {
		this.page -= 1;
		this.refreshItems();
		this.refresh();
	}
}

export default posts;
