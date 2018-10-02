import React from 'react';
import {FeedbackInput} from './input.js';
import Button from './button.js';
import * as log from 'loglevel';
import {createAggregate} from './utils.js';
import {connect} from 'react-redux';

import style from './form.css';

const _getInputByKey = (key, inputGroup) => {
	for(const value of inputGroup) {
		if(value.key === key) {
			return value;
		}
	}
	return null;
}

const _runFilters = (value, filters) => {
	for (const filter of filters) {
		if (filter.filter(value)) {
			return filter.feedback;
		}
	}
	return null;
}

class Form extends React.Component {
	constructor(props) {
		super(props);
		const {inputGroup, submitButton, dispatch} = this.props;
		
		this.state ={};

		this.createOnChange = this.createOnChange.bind(this);
		this.createOnBlur = this.createOnBlur.bind(this);
		this.runFilter = this.runFilter.bind(this);
		this.onClick = this.onClick.bind(this);

		for(let value of inputGroup) {
			this.state[value.key] = {value : '', feedback : null};
		
			value.inputProps.onChange = createAggregate(
				this.createOnChange(value.key),
				value.inputProps.onChange
			).bind(this);

			value.inputProps.onBlur = createAggregate(
				this.createOnBlur(value.key),
				value.inputProps.onBlur		
			).bind(this);
		}

		if (submitButton) {
			const {onClick} = submitButton;
			
			let aggregatedClick =  () => {
				if (!this.onClick()) {
					dispatch({type : 'DISPLAY_MESSAGE', text : 'There are invalid entries in your form', msgType : 'error'});
					return;
				}

				if (onClick instanceof Function) {
					onClick();
				}
			}
			this.props.submitButton.onClick = aggregatedClick.bind(this);
		}
	}
	
	runFilter(key) {
		const {inputGroup} = this.props;
		let hasFeedback = false;

		if (key === '__all__') {
			for(const item of inputGroup) {
				const {value} = this.state[item.key];
				const feedback = _runFilters(value, item.filters);
				if (feedback) {
					hasFeedback = true;
				}
				this.setState({[item.key] : {value : value, feedback : feedback}});
			}
		} else {
			const {value} = this.state[key];
			const inputItem = _getInputByKey(key, inputGroup);
			const feedback = _runFilters(value, inputItem.filters);
			if (feedback) {
				hasFeedback = true;
			}
			this.setState({[key] : {value : value, feedback : feedback}});
		}

		return hasFeedback;
	}

	createOnBlur(key) {
		log.info(`[FORM] creating onBlur with ${key}`);
		function onBlur() {
			log.info(`[FORM] triggered on blur for key ${key}`);
			this.runFilter(key);
		}
		return onBlur.bind(this);
	}

	createOnChange(key) {
		log.info(`[FORM] creating onChange with ${key}`);
		function onChange(event) {
			log.info(`[FORM] triggered on change for key ${key} with value ${event.target.value}`);
			this.setState({[key] : {value : event.target.value, feedback : null}});
		}
		return onChange.bind(this);
	}

	onClick() {
		return !this.runFilter('__all__');
	}

	render() {
		const {inputGroup, submitButton} = this.props;

		return (
				<div className='form' styleName='style.form'>
					{
						inputGroup.map(item => {
							return (<FeedbackInput 
								key={item.key} 
								{...item}
								feedback={this.state[item.key].feedback}
							/>)
						})
					}
					<div className='button-group'>
						<Button {...submitButton} />
					</div>
				</div>
		);
	}
}

export default connect()(Form);
