import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faUserPlus, faUser, faSignInAlt, faFile, faSearch, faHome, faEdit} from '@fortawesome/free-solid-svg-icons';

import * as log from 'loglevel';

library.add(faFile, faSearch, faHome, faEdit, faUserPlus, faUser, faSignInAlt);

const Icon = (props) => {
	if (! 'icon' in props) {
		log.error('[ICON] icon was not found in props');
		return null;
	}
	
	return <FontAwesomeIcon {...props} />
}

export default Icon;
