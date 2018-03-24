const default_catch_error = (error) => {
    console.log(`caught error while doing fetch ${error}`)
}

const http_request = (url, config, process_resp, process_respJson, catch_error) => {
    const request = fetch(url, config)
    if(process_respJson) {
        request.then((response) => {
            if(process_resp) {
                process_resp(response)
            }
            return response.json()
        }).then(({data}) => {
            process_respJson(data)
        }).catch(catch_error)
    } else if(process_resp){
        request.then(process_resp).catch(catch_error)
    } else {
        request.catch(catch_error)
    }
}

export const http_json = ({url, json, catch_error=default_catch_error, resp=undefined, respJson=undefined}) => {
    http_request(url, {
        credentials: 'include',
        body: JSON.stringify(json),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    }, resp, respJson, catch_error)
}

export const http_get = ({url, catch_error=default_catch_error, resp=undefined, respJson=undefined}) => {
    http_request(url, {
        credentials: 'include'
    }, resp, respJson, catch_error)
}