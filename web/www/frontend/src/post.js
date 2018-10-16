import React from 'react';
import View from './view.js';
import {draft} from './draft.js';
import * as log from 'loglevel';
import Button from './button.js';

import {connect} from 'react-redux';
import './post.css';

class Post extends React.Component {
	constructor(props) {
		super(props);	
		this.state = {};
		this.back = this.back.bind(this);
		this.edit = this.edit.bind(this);
		this.delete = this.delete.bind(this);
	}

	componentWillMount() {
		const {dispatch,postId, navisible} = this.props;
		dispatch({type : 'API_CALL', id : 'post',params : {postId}, callback : ({post}) => {
			log.info(`[POST] received post [${JSON.stringify(post)}]`);
			this.setState({draft : draft.makeDraft(post)});
		}});
		this.setState({navisible});
		dispatch({type : 'NAV_VISIBLE',visible : false});
	}

	back() {
		const {dispatch} = this.props;
		dispatch({type : 'NAV_ITEM_CHANGE', id : 'posts'})
	}

	edit() {
		const {dispatch} = this.props;
		const {draft} = this.state;

		dispatch({type : 'CACHE_DRAFT', draft});
		dispatch({type : 'NAV_ITEM_CHANGE', id : 'edit'});
	}

	delete() {
		const {dispatch} = this.props;
		const {draft} = this.state;
		dispatch({type : 'API_CALL', id : 'delete', params : draft});
	}

	componentWillUnmount() {
		const {dispatch} = this.props;
		const {navisible} = this.state;
		dispatch({type : 'NAV_VISIBLE', visible : navisible});
	}
	
	render() {
		const {draft} = this.state;
		if(!draft) {
			return null;
		}

		return (
			<div className='post' styleName='post'>
			<div className='side' styleName='side'>
				<div className='back btn'><Button icon={'arrow-left'} text={'back'} onClick={this.back} /></div>
				{this.props.userInfo && this.props.userInfo.userId ? <div className='edit btn'><Button icon={'pen'} text={'edit'} onClick={this.edit}/></div> : null}
				{this.props.userInfo && this.props.userInfo.userId ? <div className='delete btn'><Button icon={'trash-alt'} text={'delete'} onClick={this.delete}/></div> : null}
			</div>
			<div className='view' styleName='view'>
				<View draft={draft} />
			</div>
			<div className='nav' styleName='nav'>
			</div>
			</div>
		)
	}
}

const map = state => {
	return {
		navisible : state.navisible,
		userInfo : state.userInfo,
	}
}

export default connect(map)(Post);
