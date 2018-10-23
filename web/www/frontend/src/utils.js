import * as log from 'loglevel';
import crypto from 'crypto-js';

export const parseDate = (datetime) => {
    const [date, time] = datetime.split(' ')
    const [year, month, day] = date.split('-')
    const [hour, minute, second] = time.split(':')

    return {
        year,
        month,
        day,
        hour,
        minute,
        second
    }
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

export const getCookie = (name) => {
    if(document.cookie == undefined) {
        log.warn('[UTIL] Can you believe it, your browser does not have cookie!')
        return null;
    }
    
		log.info(`[UTIL] cookies : ${JSON.stringify(document.cookies)}`);
		
		let pairs = document.cookie.split(';');
		
    if (pairs == null || pairs.length == 0) {
        log.info(`[UTILS]: cookie is empty while calling getCookie with param ${name}`);
        return null;
    }
		
		log.info(`[UTIL] pairs of cookies : ${JSON.stringify(pairs)}`);

    for(var entry of pairs) {
        if (entry.split('='[0]) == name) {
            return entry;
        }
    }
       
    log.info(`[UTILS]: there is no cookie with key ${name} while calling getCookie`);
    return null;
}
 
export const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
export const getRelativePath = (url) => url.replace(/^.*[/]/, '');

// partitions the array into 2 based on boolean from filter, true goes into p1, false goes into p2
// [!curcial] make sure filter does not modify it's input
export const partition = (arr, filter) => {
	if (!filter instanceof Function) {
		log.warn('[UTIL] partition filter is not a function');
	}

	log.info(`[UTIL] paritioning ${JSON.stringify(arr)}`);
	
	let p1 = [], p2 = [];
	for(let i = 0; i < arr.length; i++) {
		if(filter(arr[i])) {
			p1.push(arr[i]);
		} else {
			p2.push(arr[i]);
		}
	}

	return [p1, p2];
}


function empty(str) {
	log.info(`[UTILS] empty filter with ${str}`);
	return str.length === 0;
}

function lessThan(length) {
	return function(str) {
		log.info(`[UTILS] lessThan filter with ${str} and length ${length}`);
		return str.length < length;
	}
}

function moreThan(length) {
	return function(str) {
		log.info(`[UTILS] moreThan filter with ${str} and length ${length}`);
		return str.length > length;
	}
}

function match(regex) {
	return function(str) {
		log.info(`[UTILS] match filter with ${str} and regex ${regex}`);
		return !regex.test(str);
	}
}

function createAggregate(append,orig) {
	function aggregatedFunction(...args) {
		if (append instanceof Function) {
			append(...args);
		}
		if (orig instanceof Function) {
			orig(...args);
		}
	}
	return aggregatedFunction;
}

export {empty ,lessThan, moreThan, match, createAggregate};

export const find = (arr, key) => {
	if (! (arr instanceof Array)) {
		log.error('[UTILS] input is not an array');
		return;
	}
	
	for (let i = 0; i < arr.length ; i++) {
		if (arr[i] === key) {
			return true;
		}
	}
	
	return false;
}

export const remove = (arr, key) => {
	if (! (arr instanceof Array)) {
		log.error('[UTILS] input is not an array');
		return;
	}
	
	let j = 0;
	for (let i = 0; i < arr.length ; i++) {
		if (arr[i] !== key) {
			arr[j] = arr[i];
			j++;
		}
	}

	arr.length = j;
	return arr;
}

export const rfind = (arr, key) => {
	if (! (arr instanceof Array || typeof key === 'string')) {
		log.error('[UTILS] input is not an array or string');
		return -1;
	}

	for(let i = arr.length; i >= 0; i--) {
		if (arr[i] === key) {
			return i;
		}
	}
	return -1;
}

export const getItemByKey = (arr, key) => {
	for (let item of arr) {
		if (item && item.key === key) {
			return {...item};
		}
	}
}

export const removeItemByKey = (arr, key) => {
	if (! (arr instanceof Array)) {
		log.error('[UTILS] input is not an array');
		return;
	}

	let j = 0;
	for (let i = 0; i < arr.length ; i++) {
		if (arr[i].key !== key) {
			arr[j] = arr[i];
			j++;
		}
	}

	arr.length = j;
}

export const concat = (str1, str2, filter, sep) => {
	let fres = false;

	if(filter instanceof Function) {
		fres = filter();	
	} else {
		fres = filter;
	}

	return fres ? (str1 + (sep ? sep : ' ') + str2) : str1;
}

export const createArr = (length, val) => {
	let arr = Array(length);
	for(let i = 0; i < length; i++) {
		arr[i] = val;
	}
	return arr;
}

export const encryptPassword = (user) => {
	return crypto.SHA1(user.email + user.password).toString();
}

const _diff = (prev, current) => {
	if(prev.nodeName !== current.nodeName || prev.className !== current.className) {
		return current;
	}
	
	const prevChildren = prev.children;
	const currentChildren = current.children;
	
	if (currentChildren.length === 0 && prev.innerHTML !== current.innerHTML) {
		return current;
	}

	for (let i = 0; i < Math.min(prevChildren.length, currentChildren.length); i++){
		const changeNode = _diff(prevChildren[i], currentChildren[i]);
		if (changeNode) {
			changeNode.setAttribute('tabindex','0');
			return changeNode;
		}
	}

	if (prevChildren.length !== currentChildren.length) {
		return currentChildren[currentChildren.length - 1];
	}

	return null;
}

export const diff = (prev, current) => {
	if (!prev || !current) {
		return null;
	}

	const changeNode = _diff(prev, current);
	return changeNode;
}
