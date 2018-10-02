import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faAngleUp, 
	faSave,
	faEraser,
	faFileUpload,
	faPlus,
	faSpinner,
	faSignOutAlt,
	faAt,
	faKey,
	faUsersCog,
	faAngleDown, 
	faAngleDoubleUp, 
	faUserPlus, 
	faUser, 
	faSignInAlt,
 	faFile, 
	faSearch, 
	faHome, 
	faEdit,
	faTags} from '@fortawesome/free-solid-svg-icons';

import * as log from 'loglevel';

library.add(faSpinner, 
	faSave,
	faEraser,
	faFileUpload,
	faPlus,
	faSignOutAlt, 
	faAt,
	faKey, 
	faUsersCog,
	faTags,
	faAngleUp, 
	faAngleDown,
	faAngleDoubleUp, 
	faFile,
	faSearch,
	faHome,
	faEdit,
	faUserPlus, 
	faUser,
	faSignInAlt);

const Icon = (props) => {
	if (! 'icon' in props) {
		log.error('[ICON] icon was not found in props');
		return null;
	}
	
	return <FontAwesomeIcon {...props} />
}

export default Icon;
