import React from 'react';
import {connect} from 'react-redux';
import {lifecycle, compose} from 'recompose';


import PostDisplayer from 'components/postdisplayer';
import SideButtons from 'components/sidebuttons';

import {NEW_API_REQUEST, EDIT_POST_REQUEST, DELETE_POST_REQUEST, getPost} from 'actions/type';

const Post = ({userInfo, perusingPost, dispatch}) => {
	userInfo.id = 10;
	return (<div>
		<PostDisplayer title={perusingPost.title} content={perusingPost.content}/>
		{ userInfo && userInfo.id ? <SideButtons buttons={[
			{tag: 'edit', func: () => {dispatch({type: EDIT_POST_REQUEST, postId : perusingPost.postId})}},
			{tag: 'delete', func: () => {dispatch({type: DELETE_POST_REQUEST, postId : perusingPost.postId})}}
		]}/> : null}
	</div>);
}

const enhance = compose(
	lifecycle({
		componentDidMount() {
			const {dispatch, perusingPost} = this.props;
			dispatch({type: NEW_API_REQUEST,api: getPost, arg: perusingPost.postId});
		}
	})		
);

const selector = (state) => {
	return {
		perusingPost : state.perusingPost,
		userInfo : state.userInfo,
	}
}

export default connect(selector)(enhance(Post));
