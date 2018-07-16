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

    the key thing to the usr is the requestInfo object in createRestApi
    * requestInfo obejct should follow the following format
    
      requestInfo = {
        config : config,
        [actionCreator] : [actionCreator]
      };

      * config is the http request config, it should specify things such as
        1. url
        2. method
      these will be used to make api calls

      * actionCreator is an optional parameter, if it exists it means we are creating an api port that updates the store once it's done
        * based on the existence of action Creator, createRestApi returns 2 different kinds of function
            1. the first one has signature (arg) => (dispatch) => {}
            
                this is the one where we have dipatch and the return function is 2 layers deep, and this function is expected to be used with mapDispatchToProps in redux
            
            2. the 2nd type (arg) => {}

                this type has no dispatch
    
      * the args parameter are arguments we wish to pass to the server. it must be in the form of a dictioanry.
        meaning when user use this api function and wishes to pass in a parameter, he/she needs to supply this parameter in the form of a dictionary

        e.g. say we want to do an api call to /api/getuserinfo and we want to pass the paramter name=calum

            we use RequestDispatcher to create the api port by doing

            requestInfo = {
                config : {
                    url : '/api/geruserInfo',
                    method : 'GET'
                }

                actionCreator : ({user}) => {
                    type : 'FETCH_USERINFO_SUCCESS',
                    user
                }
            };

            getUserInfo = requestDispatcher(requestInfo);

            this returns us with the type1 function (args) => (dispatch) => {}

            say that the api call needs parameter name=bob. to input this parameter we need to do

            getUserInfo({name : bob})

            sometimes we might want to run a callback function after request is success, this callback function is also passed in the args

            getUserInfo({name : bob, callback : function})
*/

class RequestDispatcher {
    constructor() {
        this.__constructRequest__ = this.__constructRequest__.bind(this);
        this.__inithttpRequest__ = this.__inithttpRequest__.bind(this);
        this.__createRestApi__ = this.__createRestApi__.bind(this);

        this.createRestApi = this.createRestApi.bind(this);
        this.registerRequestInfoMiddleware = this.registerRequestInfoMiddleware.bind(this);
        this.clearRequestInfoMiddleware = this.clearRequestInfoMiddleware.bind(this);

        this.requestInfoMiddlewares = [];

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


    // completes the http request cycle, the result is passed into callback
    __inithttpRequest__({config, args, callback}) {
        let request = this.__constructRequest__(config, args);
        if (!request) {
            log.error('[REQUEST] constructRequest returned null');
            return;
        }

        request.then(async (response) => {
            let json = await response.json();
            json.response = response;
            callback(json);
        }).catch(callback);
    };

    __createRestApi__ (requestInfo) {
        return (args) => {
            let actionCreator = requestInfo.actionCreator;
            let callback = args.callback;

            if (callback) {
                delete args['callback'];
            }

            if (actionCreator) {
                return (dispatch) => {
                    // in the case we have dispatch, we want to run dispatch with the passed in callback function
                    // therefore we wrap them together and use this as the new callback function
                    let callbackWrapper = (json) => {
                        if (json instanceof Error) {
                            callback({error : json});
                        } else {
                            dispatch(requestInfo.actionCreator(json));
                            log.info(`[REQUEST] called dispatch in request response`);
                            if (callback) {
                                callback(json);
                                log.info(`[REQUEST] called callback in request response`);
                            }       
                        }
                    }

                    this.__inithttpRequest__({
                        config : requestInfo.config,
                        args : args,
                        callback : callbackWrapper       
                    });
                }
            }
    
            this.__inithttpRequest__({
                config : requestInfo.config,
                args : args,
                callback : callback ? callback : (json) => {
                    log.info(`[REQUEST] no callback function specified for call with ${requestInfo}, using dummy instead`);
                }
            })
        }
    };

    createRestApi(requestInfo) {
        // this function goes through the middlewares and aggregate the request info
        if (this.requestInfoMiddlewares.length === 0) {
            return this.__createRestApi__(requestInfo);
        }

        if (this.requestInfoMiddlewares.length === 1) {
            return this.__createRestApi__(this.requestInfoMiddlewares[0](requestInfo));
        }

        // the functions in requestInfoMiddlewares follows the following signature
        // f = (requestInfo) => {doStuff(); return a new requestInfo}
        // so the input and output are both requestInfo

        // for reduce it takes in 2 such functions, they will aggregate and produce a new requestInfo
        // however to continue reduce they need to return a function following the above signature
        // therefore we create an arrow function that takes in a dummy requestInfo, and returns the one calculated on the last run
        const finalResultGenerator = this.requestInfoMiddlewares.reduce((fun1, fun2) => {
            let updatedRequestInfo = fun2(fun1(updatedRequestInfo));

            return (placeholder) => {
                return updatedRequestInfo;
            }
        })
        
        // finally when we finish we should have a function that returns the latest requestInfo, calling it gives us the requestInfo we need
        return this.__createRestApi__(finalResultGenerator());
    }

    // the purpose of these middlewares is to prepopulate the requestInfo object
    // for example when we test the app on our local machine we might want to enable cors
    // this requires us to add a new field in the request, using a middleware to do this allows us to easily remove it when we don't need it
    registerRequestInfoMiddleware(middlewares) {
        this.requestInfoMiddlewares.push(...middlewares);
    }

    clearRequestInfoMiddleware() {
        this.requestInfoMiddlewares = [];
    }
}

export default new RequestDispatcher();