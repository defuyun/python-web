import React from 'react'
import {connect} from 'react-redux';

class AsyncComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {Component : null};
	}

	componentDidUpdate(prevp) {
		if(this.props.completeInit && prevp.completeInit != this.props.completeInit) {
			this.props.loader().then(
				component => this.setState({component : component.default})
			);
		}
	}

	render() {
		const {component} = this.state;
		return component ? React.createElement(component, this.props) : null;
	}
}

const map = state => {
	return {
		completeInit : state.completeInit,
	}
}

export default connect(map)(AsyncComponent);
