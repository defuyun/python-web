import asyncio
import hashlib
import logging

from aiohttp import web

from config.config import config
from config.constants import constants
from model import User

import datetime

async def authenticate_cookie(cookie):
    cookie_list = cookie.split('-')
    if len(cookie_list) != 2:
        return web.HTTPBadRequest(body='invalid cookie %s' % cookie_list)

    userId,sha1 = cookie.split('-')
    
    user = await User.find(key='userId', value=userId)

    if not user:
        return web.HTTPBadRequest(body='invalid cookie: user not found')
    
    s = '%s-%s-%s-%s-%s' % (user.username, user.password, user.expire, user.email, config.cookie_key)
    db_sha1 = hashlib.sha1(s.encode('utf-8')).hexdigest()
    
    logging.debug('[AUTHENTICATE] sha1 fetched from db %s generated from %s' % (db_sha1, s))

    if sha1 != db_sha1:
        return web.HTTPBadRequest(body='invalid cookie: sha1 did not match')

    return user

async def authentication_factory(app, handler):
    async def response(request):
        request.user = None
        cookie = request.cookies.get(config.cookie_name)
        if cookie:
            authResult = await authenticate_cookie(cookie)
            if isinstance(authResult, web.StreamResponse):
                return authResult

            request.user = authResult

        return await handler(request)
    return response

async def cors_factory(app, handler):
    async def response(request):
        resp = await handler(request)
        resp.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:8000'
        return resp
    return response