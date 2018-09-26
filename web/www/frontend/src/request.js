/*
    A helper library to do http requests
*/

import * as log from 'loglevel';

const constructQueryString = (args) => {
    let param = '?';
    for(let key in args) {
        param += key + '=' + args[key] + '&';
    }
    return encodeURI(param.slice(0,-1));
}

/*
    ********* fundalmental *********

    The RequestDispatcher class is used to create rest api ports on the frontend. the function open to user is the
    createRestApi function, which is capable of creating 2 kinds of function
    1. function that needs to dispatch to store in the redux cycle
    2. simple api calls that does not update store

    the key thing to the usr is the config object in createRestApi
    * config obejct should follow the following format
    
    config : config,

      * config is the http request config, it should specify things such as
        1. url
        2. method
      these will be used to make api calls

      * the args parameter are arguments we wish to pass to the server. it must be in the form of a dictioanry.
        meaning when user use this api function and wishes to pass in a parameter, he/she needs to supply this parameter in the form of a dictionary

        e.g. say we want to do an api call to /api/getuserinfo and we want to pass the paramter name=calum

            we use RequestDispatcher to create the api port by doing

            config : {
                url : '/api/geruserInfo',
                method : 'GET'
            }
*/

class RequestDispatcher {
    constructor() {
        this.__constructRequest__ = this.__constructRequest__.bind(this);
        this.__createRestApi__ = this.__createRestApi__.bind(this);

        this.createRestApi = this.createRestApi.bind(this);
        this.registerConfigMiddleware = this.registerConfigMiddleware.bind(this);
        this.clearConfigMiddleware = this.clearConfigMiddleware.bind(this);

        this.configMiddlewares = [];

        log.info('[REQUEST] constructed request dispatcher');
    }
    
    validateConfig(config) {
        return 'method' in config && 'url' in config;
    }

    validateArgs(args) {
        return args === null || args instanceof Object;
    }

    // constructs a request object using the config
    __constructRequest__(config, args) {
        let configLocal = {
            ...config
        };

        if(!this.validateConfig(configLocal)) {
            log.error(`[REQUEST] invalid config in http request ${configLocal}`);
            return null;
        }

        if(!this.validateArgs(args)) {
            log.error(`[REQUEST] args is in a invalid format ${args}`);
        }

        let url = configLocal.url;
        delete configLocal['url'];

        if (configLocal.method === 'POST') {
            if ('body' in configLocal) {
                log.warn(`[REQUEST] body already exists in config of the request, ${configLocal.body}, replacing it with ${args}`);
            }
            
            configLocal.body = JSON.stringify(args);
            if (!'headers' in configLocal) {
                configLocal.headers = {}
            }

            configLocal.headers.push({
                'content-type' : 'application/json'
            });

            log.info(`[REQUEST] constructed POST request config ${url}`);
        } else if (configLocal.method = 'GET') {
            url += constructQueryString(args);
            log.info(`[REQUEST] constructed GET request config ${url}`);
        }

        return fetch(url, configLocal);
    };


    __createRestApi__ (config) {
        return (args) => {
            return this.__constructRequest__(config, args)
        }
    };

    createRestApi(config) {
        // this function goes through the middlewares and aggregate the request info
        if (this.configMiddlewares.length === 0) {
            return this.__createRestApi__(config);
        }

        if (this.configMiddlewares.length === 1) {
            return this.__createRestApi__(this.configMiddlewares[0](config));
        }

        // the functions in configMiddlewares follows the following signature
        // f = (config) => {doStuff(); return a new config}
        // so the input and output are both config

        // for reduce it takes in 2 such functions, they will aggregate and produce a new config
        // however to continue reduce they need to return a function following the above signature
        // therefore we create an arrow function that takes in a dummy config, and returns the one calculated on the last run
        const finalResultGenerator = this.configMiddlewares.reduce((fun1, fun2) => {
            let updatedConfig = fun2(fun1(updatedConfig));

            return (placeholder) => {
                return updatedConfig;
            }
        })
        
        // finally when we finish we should have a function that returns the latest config, calling it gives us the config we need
        return this.__createRestApi__(finalResultGenerator());
    }

    // the purpose of these middlewares is to prepopulate the config object
    // for example when we test the app on our local machine we might want to enable cors
    // this requires us to add a new field in the request, using a middleware to do this allows us to easily remove it when we don't need it
    registerConfigMiddleware(middlewares) {
        this.configMiddlewares.push(...middlewares);
    }

    clearConfigMiddleware() {
        this.configMiddlewares = [];
    }
}
export default new RequestDispatcher();
