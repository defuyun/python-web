import React from 'react';
import Button from './button.js';
import {concat} from './utils.js';
import {Resources, Errors, Tags} from './cog-components.js';

import * as log from 'loglevel';
import './cog.css';

import {hot} from 'react-hot-loader';

class Cog extends React.Component {
	constructor(props) {
		super(props);
		const {draft} = this.props;
		this.update = this.update.bind(this);
		draft.setupdate(this.update);
		this.state = {active : 'resources'};
		this.headers = ['resources','errors','tags'];
		this.components = {
			resources : Resources,
			errors : Errors,
			tags : Tags,
		}
		this.setActive = this.setActive.bind(this);
	}

	update() {
		log.info('[COG] update called');
		this.setState({});
	}

	setActive(active) {
		return () => this.setState({active});
	}

	render() {
		const {draft} = this.props;
		
		if (draft.update !== this.update) {
			draft.setupdate(this.update);
		}

		const {active} = this.state;
		const content = React.createElement(this.components[active], this.props);
		return (
			<div className='cog' styleName='cog'>
				<div className='headers'>
					{this.headers.map(header => 
						<div key={header} className={concat(header,'active', header === active)}>
							<Button text={header} inversible={1} onClick={this.setActive(header)}/>
						</div>
					)}
				</div>
				{content}
			</div>
		);
	}
}

export default hot(module)(Cog);
