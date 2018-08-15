import React from 'react';
import {connect} from 'react-redux';
import {lifecycle, compose} from 'recompose';

import * as log from 'loglevel';

// actions
import {NEW_API_REQUEST,CURRENT_PAGE_CHANGE, getPosts} from 'actions/type';

// common
import {itemPerPage, baseUrl} from 'common/constants';

// componensts
import PostList from 'components/postlist';
import Paging from 'components/paging';

const Posts = ({posts, currentPage, dispatch}) => {
	const totalPages = posts.length / itemPerPage + posts.length % itemPerPage === 0 ? 0 : 1;
	const displayableItems = posts.slice(currentPage * itemPerPage, Math.min(posts.length, (currentPage + 1) * itemPerPage));

	return (
	   	<div>
			<PostList posts={displayableItems} />
			<Paging totalPages={totalPages} activePage={currentPage} onClickFunc={(pageNo) => dispatch({type: CURRENT_PAGE_CHANGE, newPage: pageNo})}/>
		</div>
	);
}

const enhance = compose(
	lifecycle({
		componentDidMount() {
			const {dispatch} = this.props;
			if (!dispatch) {
				log.error('[APP]: no dispatch in app component, did you add connect?');
			}
			dispatch({type: NEW_API_REQUEST, api : getPosts});
		}
	})
);

const selector = (state) => {
	return {
		currentPage : state.currentPage,
		posts : state.posts,
	}
}

export default connect(selector)(enhance(Posts));
