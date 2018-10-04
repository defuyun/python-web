import React from 'react';
import Button from './button.js';

import './cog.css';

class Cog extends React.Component {
	constructor(props) {
		super(props);
		const {lists} = this.props;
		this.state = {display : false, active : lists[0] ? lists[0].key : null}
	}

	render(){
		const {lists} = this.props;
		const {display, active} = this.state;

		return (
			<div className={'cog' + (display ? ' display' : '')} styleName='cog'>
				<div className='side-toggle'>
					<Button icon='angle-right' onClick={() => this.setState({display : !display})} />
				</div>
				<div className='headers'>
					{lists.map(list => 
						<div key={list.key} className={'header-button' + (active === list.key ? ' active' : '')}>
							<Button text={list.header} onClick={() => this.setState({active : list.key})}/> 
						</div>
					)}
				</div>
				
				{lists.map(list => {
					return (
						<div key={list.key} className={active === list.key ? 'active' : ''} styleName='list'>
							<div className='items'>
								{list.items.map(item =>
									<div className='list-item'>
										{item.text}
									</div>
								)}
							</div>
						</div>		
					);									 
				})}
			</div>
		);
	}
}

export default Cog;
