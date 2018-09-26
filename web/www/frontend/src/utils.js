import * as log from 'loglevel';

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

    let pairs = document.cookie.split(';');

    if (pairs == null || pairs.length == 0) {
        log.info(`[UTILS]: cookie is empty while calling getCookie with param ${name}`);
        return null;
    }

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
