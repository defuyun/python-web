import React from 'react';
import * as log from 'loglevel';

import './animate.css';

const animate = component => class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {stage : 'enter'}
	}
	
	componentDidMount() {
		function setStage() {
			this.setState({stage : 'show'});
		}
		setTimeout(setStage.bind(this), 100);
	}

	render() {
		const {stage} = this.state;
		const {delay} = this.props;
			
		const append = delay ? 'exit' : stage;
		log.info(`[ANIMATE] append class for animate became ${append}`);
		return (
			<div className={append} styleName='animate'>
				{React.createElement(component, {...this.props})}
			</div>
		)
	}
}

export default animate;
