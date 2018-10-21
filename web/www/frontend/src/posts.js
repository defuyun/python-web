import React from 'react';
import List from './posts-list.js';
import Tags from './posts-tag.js';

import Button from './button.js';

import {connect} from 'react-redux';
import {concat, createArr} from './utils.js';
import * as log from 'loglevel';

import './posts.css';
import posts from './posts-model.js';

class Posts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.animate = this.animate.bind(this);
	}

	animate(element) {
		element && (this.animateEle = element);
	}

	componentWillMount() {
		const {dispatch} = this.props;
		dispatch({type : 'API_CALL', id : 'posts', callback : ({posts}) => this.setState({posts : posts})});
		dispatch({type : 'API_CALL', id : 'tags', callback : ({tags}) => this.setState({tags : tags})});
	}

	refresh() {
		if (this.animate) {
			this.animateEle.classList.remove('show');
			setTimeout(() => this.setState({}), 300);
		}
	}

	componentDidUpdate(prevp, prevs) {
		if ((!prevs.posts || !prevs.tags) && (this.state.posts && this.state.tags)) {
			const __model = this.props.posts ? 
				posts.sync(this.props.posts, this.state.posts, this.state.tags, this.refresh.bind(this)) : 
				new posts(this.state.posts, this.state.tags, this.refresh.bind(this));

			this.setState({'model' : __model});
		}

		if (this.animateEle) {
			setTimeout(this.animateEle.classList.add('show'), 100);
		}
	}

	componentWillUnmount() {
		const {dispatch} = this.props;
		const {model} = this.state;
		dispatch({type : 'CACHE_POSTS', posts : model});
	}

	render() {
		const {model} = this.state;
		const {navisible} = this.props;

		if (!model) return null;
		log.info(`[POSTS] refreshing posts with ${JSON.stringify(model.displayItems)}`);
		
		const enablePrev = model.hasPrev();
		const enableNext = model.hasNext();

		return (
			<div className='posts' styleName='posts'>
				<div className={concat('tags','nav',navisible)} styleName='tags'>
					<div className='wrapper'>
						<Tags model={model} />
					</div>
				</div>
				<div className={concat(concat('prev-btn','disable',!enablePrev), 'nav',navisible)}>
					<Button icon='angle-left' onClick={enablePrev ? model.prevPage : () => {}} />
				</div>
				<div ref={this.animate} styleName='animate'>
					<List model={model} />
				</div>
				<div className={concat(concat('nxt-btn','disable',!enableNext), 'nav', navisible)}>
					<Button icon='angle-right' onClick={enableNext ? model.nextPage : () => {}} />
				</div>
			</div>
		);
	}
}

const map = state => {
	return {
		navisible : state.navisible,
		posts : state.posts,
	}
}

export default connect(map)(Posts);
