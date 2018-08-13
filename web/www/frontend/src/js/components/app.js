import React from 'react';

import * as log from 'loglevel';
import {Layout} from 'antd';
import {withState, lifecycle, compose} from 'recompose';
import {connect} from 'react-redux'

// actions
import {NEW_API_REQUEST, getUserInfo} from 'actions/type';

// common
import {cookieName} from 'common/constants';
import {getCookie} from 'common/utils';

// components
import NavMenu from 'components/nav';
import Route from 'components/router';

// contents
import menu from 'contents/menu';

const App = ({expand, setExpand}) => {
	return (
		<Layout>
			<Layout.Sider collapsible collapsed={expand} onCollapse={() => setExpand(!expand)}>
				<NavMenu menu={menu}/>
			</Layout.Sider>
			<Layout.Content>
				<Route />
			</Layout.Content>
		</Layout>
	);
}

const enhance = compose(
	withState('expand', 'setExpand', false),
	lifecycle({
		componentDidMount() {
			const {dispatch} = this.props;
			if (!dispatch) {
				log.error('[APP]: no dispatch in app component, did you add connect?');
			}

			if(getCookie(cookieName) != null) {
				dispatch({type: NEW_API_REQUEST, api: getUserInfo})
				log.info('[APP]: dispatched get user info');
			}
		}
	}),
);

export default connect()(enhance(App));

