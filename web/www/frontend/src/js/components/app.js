import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {Layout} from 'antd';
import NavMenu from 'components/nav';
import menu from 'components/menu';

import {connect} from 'react-redux'
import {cookieName} from 'common/constants'
import {getCookie} from 'common/utils'
import {ContentDirectory} from 'contents/root';
import {getUserInfo} from 'reduce/api';

import * as log from 'loglevel';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sideNavCollapsed : true
        }
        this.toggleSideNavCollaps = this.toggleSideNavCollaps.bind(this);
    }

    toggleSideNavCollaps(collapsed) {
        this.setState({sideNavCollapsed : collapsed});
    }

    componentDidMount() {
        if(getCookie(cookieName) != null) {
            this.props.getUserInfo({
                callback : () => {
                    log.info('[APP]: getUserInfo returned')
                }
            });
            log.info('[APP]: getUserInfo requested');
        }
    }

    render() {
        return (
            <BrowserRouter>
            <Layout>
                <Layout.Sider collapsible collapsed={this.state.sideNavCollapsed} onCollapse={this.toggleSideNavCollaps}>
                    <NavMenu menu={menu}/>
                </Layout.Sider>
                <Layout.Content>
                    <Switch>
                        {Object.entries(ContentDirectory).map(([key,panel]) => {
                            return (
                                <Route key={key} path={panel.url} component={panel.component} />
                            )
                        })}
                    </Switch>
                </Layout.Content>
            </Layout>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo : state.userInfo
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);