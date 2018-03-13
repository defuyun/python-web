
#! /usr/bin/python3

import functools
import logging
import inspect
import aiohttp
import asyncio
import os

from aiohttp import web

def get(path):
    def decorator(func):
        logging.info('[HANDLER] register %s as GET handler' % func.__name__)
        @functools.wraps(func)
        def wrapper(*args, **kw):
            logging.debug('[HANDLER] execute GET handler %s' % func.__name__)            
            return func(*args, **kw)
        wrapper.__method__ = 'GET'
        wrapper.__path__ = path
        return wrapper
    return decorator

def post(path):
    def decorator(func):
        logging.info('[HANDLER] register %s as POST handler' % func.__name__)
        @functools.wraps(func)
        def wrapper(*args, **kw):
            logging.debug('[HANDLER] execute POST handler %s' % func.__name__)            
            return func(*args, **kw)
        wrapper.__method__ = 'POST'
        wrapper.__path__ = path
        return wrapper
    return decorator

def __get_named_args__(fn):
    args = []
    sig = inspect.signature(fn)
    for name, param in sig.parameters.items():
        if param.kind == inspect.Parameter.KEYWORD_ONLY or param.kind == inspect.Parameter.POSITIONAL_OR_KEYWORD:
            args.append(name)
    logging.info('[HANDLER] added named args (%s) to %s signature' % (', '.join(args), fn.__name__))
    return args
    
def __get_required_args__(fn):
    args = []
    sig = inspect.signature(fn)
    for name, param in sig.parameters.items():
        if name != 'request' and (param.kind == inspect.Parameter.KEYWORD_ONLY or param.kind == inspect.Parameter.POSITIONAL_OR_KEYWORD) and param.default == inspect.Parameter.empty:
            args.append(name)
    
    logging.info('[HANDLER] added required args (%s) to %s signature' % (', '.join(args), fn.__name__))
    return args

def __has_request_arg__(fn):
    sig = inspect.signature(fn)
    return sig.parameters.get('request', None) is not None

def __has_kw_arg__(fn):
    sig = inspect.signature(fn)
    for param in sig.parameters.values():
        if param.kind == inspect.Parameter.VAR_KEYWORD:
            return True
    return False

class RequestHandler(object):
    def __init__(self, app, fn):
        self.__app__ = app
        self.__fn__ = fn
        self.__required_args__ = __get_required_args__(fn)
        self.__named_args__ = __get_named_args__(fn)
        self.__has_request_arg__ = __has_request_arg__(fn)
        self.__has_kw_args__ = __has_kw_arg__(fn)

    async def __call__(self, request:aiohttp.web.Request):
        logging.debug('[HANDLER] start calling %s' % self.__fn__.__name__)
        kw = dict(**request.match_info)
        if self.__fn__.__method__ == 'GET':
            kw.update(request.query)
        elif self.__fn__.__method__ == 'POST':
            if request.content_type is None:
                return web.HTTPBadRequest(body='Content type is missing')

            content_type = request.content_type.lower()
            if content_type.startswith('application/json'):
                params = await request.json()
                if not isinstance(params, dict):
                    return web.HTTPBadRequest(body='Invalid JSON object')
            
                kw.update(params)
            elif content_type.startswith('application/x-www-form-urlencoded'):
                params = await request.post()
                kw.update(params)

            else:
                return web.HTTPBadRequest(body='The content type is not supported')
        
        for name in self.__required_args__:
            if kw.get(name, None) is None:
                return web.HTTPBadRequest(body='Missing argument %s' % name)
            
        if not self.__has_kw_args__:
            copy = kw
            kw = dict()
            for name, value in copy.items():
                if name in self.__named_args__:
                    kw[name] = value
        
        if self.__has_request_arg__:
            kw['request'] = request
        
        logging.debug('[HANDLER] calling %s with args %s' % (self.__fn__.__name__, kw))
        return await self.__fn__(**kw)

def add_routes(app, name):
    mod = __import__(name, globals(), locals())
    for attr in dir(mod):
        if attr.startswith('_'):
            continue

        fn = getattr(mod, attr)
        if not callable(fn):
            continue

        method = getattr(fn, '__method__', None)
        path = getattr(fn, '__path__', None)
        if method is None or path is None:
            continue
        
        if not inspect.iscoroutine(fn) and not inspect.isgeneratorfunction(fn):
            fn = asyncio.coroutine(func=fn)

        logging.info('[ADD_ROUTE] adding %s(%s) for route (%s, %s)' % (fn.__name__, ', '.join(inspect.signature(fn).parameters.keys()), method, path))
        app.router.add_route(method, path, RequestHandler(app, fn))       

def add_statics(app, path, root):
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), path)
    logging.info('[ADD_STATIC] adding %s as static path using root %s' % (path, root))
    app.router.add_static('/%s' % root, path)