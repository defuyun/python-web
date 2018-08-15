import React from 'react';

const Paging = ({totalPages, activePage, onClickFunc}) => {
	if (totalPages > 0) {
		let pages = [];
		for (let i = 0; i < totalPages; i++) {
			pages.push(<div key={`page_${i}`} onClick={ () => onClickFunc(i)}> {i+1} </div>);
		}
		return <div>{pages}</div>;
	} else {
		return null;
	}
}

export default Paging;
