import asyncio
import hashlib
import logging

from aiohttp import web

from config.config import config
from config.constants import constants
from database import execute, get_query

async def authenticate_cookie(cookie):
    cookie_list = cookie.split('-')
    if len(cookie_list) != 2:
        return web.HTTPBadRequest(body='invalid cookie %s' % cookie_list)

    user_id,sha1 = cookie.split('-')
    query = await get_query(constants.db_get_user_by_id_filename)
    rows = await execute(query,(user_id,))
    if not rows:
        return web.HTTPBadRequest(body='invalid cookie: user not found')
    
    (result,) = rows
    username, password, email, expire = result
    s = '%s-%s-%s-%s-%s' % (username, password, expire, email, config.cookie_key)
    db_sha1 = hashlib.sha1(s.encode('utf-8')).hexdigest()
    
    logging.debug('[AUTHENTICATE] sha1 fetched from db %s generated from %s' % (db_sha1, s))

    if sha1 != db_sha1:
        return web.HTTPBadRequest(body='invalid cookie: sha1 did not match')

    return [user_id, username, password, email]

async def authentication_factory(app, handler):
    async def response(request):
        request.authenticate = None
        cookie = request.cookies.get(config.cookie_name)
        if cookie:
            auth = await authenticate_cookie(cookie)
            if isinstance(auth, web.StreamResponse):
                return auth
            
            request.authenticate = auth
        
        return await handler(request)
    return response