
#! /usr/bin/python3

import functools
import logging
import inspect
import aiohttp

from aiohttp import web

def get(path):
    def decorator(func):
        logging.info('[HANDLER] register %s as GET handler' % func.__name__)
        func.__path__ = path
        func.__method__ = 'GET'
        @functools.wraps(func)
        def wrapper(*args, **kw):
            logging.info('[HANDLER] execute GET handler %s' % func.__name__)            
            return func(*args, **kw)
        return wrapper
    return decorator

def post(path):
    def decorator(func):
        logging.info('[HANDLER] register %s as POST handler' % func.__name__)
        func.__path__ = path
        func.__method__ = 'POST'
        @functools.wraps(func)
        def wrapper(*args, **kw):
            logging.info('[HANDLER] execute POST handler %s' % func.__name__)            
            return func(*args, **kw)
        return wrapper
    return decorator

def __get_named_args__(fn):
    args = []
    sig = inspect.signature(fn)
    for name, param in sig.parameters.items():
        if param.kind == inspect.Parameter.KEYWORD_ONLY or param.kind == inspect.Parameter.POSITIONAL_OR_KEYWORD:
            args.append(name)
            logging.info('[HANDLER] added named arg to %s signature' % fn.__name__)
    return args
    
def __get_required_args__(fn):
    args = []
    sig = inspect.signature(fn)
    for name, param in sig.parameters.items():
        if (param.kind == inspect.Parameter.KEYWORD_ONLY or param.kind == inspect.Parameter.POSITIONAL_OR_KEYWORD) and param.default == inspect.Parameter.empty:
            args.append(name)
            logging.info('[HANDLER] added required arg to %s signature' % fn.__name__)
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
        kw = dict(**request.match_info)
        if self.__fn__.method == 'GET':
            kw.update(request.query)
        elif self.__fn__.method == 'POST':
            if request.content_type is None:
                return web.HTTPBadRequest(body='Content type is missing')

            content_type = request.content_type.lower()
            if content_type.startswith('application/json'):
                params = await request.json()
                if not isinstance(params, dict):
                    return web.HTTPBadRequest(body='Invalid JSON object')
            
                kw.update(params)
            elif content_type.startswith('application/x-www-form-urlencoded') or content_type.startswith('multipart/form-data'):
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
        
        logging.info('[HANDLER] calling %s with args %s' % (self.__fn__.__name__, kw))
        return await self.__fn__(kw)
