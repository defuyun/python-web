import React from 'react';

import Button from './button.js';

import './cog.css';

class Cog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {display : false};
	}

	render(){
		const {filelist, errorlist} = this.props;
		const {display} = this.state;

		return (
			<div className={'cog' + (display ? ' display' : '')} styleName='cog'>
				<div className='side-toggle'>
					<Button icon='angle-right' onClick={() => this.setState({display : !display})} />
				</div>
				<div className='file-list' styleName='file-list'>
					<div className='files'>
						<div className='file-list-header'> 
							Files
						</div>
						{filelist ? filelist.map(item => <div className='file'> item.name </div>) : null}
					</div>
				</div>
				<div className='error-list' styleName='error-list'>
					<div className='errors'>
						<div className='error-list-header'> 
							Errors
						</div>
						{errorlist ? errorlist.map(item => <div className='error'> item.error </div>) : null}
					</div>
				</div>
			</div>
		);
	}
}

export default Cog;
