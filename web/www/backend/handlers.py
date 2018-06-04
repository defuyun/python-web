#! /usr/bin/python3

import asyncio
import uuid
import logging
import hashlib
import aiofiles
import os

from aiohttp import web
from coroweb import get, post
from database import execute, get_query

from config.constants import constants
from config.config import config

async def __user2cookie__(user_id, username, password, email):
    update_user_query = await get_query(constants.db_update_user)
    get_expire_query = await get_query(constants.db_get_user_expire_date)

    await execute(update_user_query, (config.cookie_expire_duration, user_id))
    row = await execute(get_expire_query, (user_id,))
    if not row:
        return None
    
    ((expire,),) = row

    s = '%s-%s-%s-%s-%s' % (username, password, str(expire), email, config.cookie_key)
    sha1 = hashlib.sha1(s.encode('utf-8')).hexdigest()

    logging.debug('[AUTHENTICATE] sha1 generated for user %s generated from %s' % (sha1, s))

    return '%s-%s' % (user_id, sha1) 

def __make_auth_response__(username, email, cookie, age=config.cookie_expire_duration_second):
    resp = web.json_response({
        'data': {
            'username':username,
            'email':email
        }
    })
    resp.set_cookie(config.cookie_name, cookie, max_age=age, httponly=True)

    return resp

@get('/api/sidenav_options')
async def sidenav_options(request):
    sidenavs = [
        {'id' : 'Home', 'icon' : 'home', 'tag' : 'home', 'link' : '/home'},
        {'id' : 'Posts', 'icon' : 'file', 'tag' : 'posts', 'link' : '/posts'},
        # {'id' : 'Tags', 'icon' : 'tags', 'tag' : 'tags', 'link' : '/tags'},
    ]

    if request.authenticate:
        sidenavs.append({'id' : 'Edit', 'icon' : 'edit', 'tag' : 'edit', 'link' : '/edit'})
        sidenavs.append([
            {'id': 'Account', 'icon': 'user', 'tag': 'account'},
            {'id' : 'Signout', 'icon' : 'logout', 'tag' : 'signout', 'link' : '/signout'},
        ])
    else:
        sidenavs.append([
            {'id': 'Account', 'icon': 'user', 'tag': 'account'},
            {'id' : 'Register', 'icon' : 'user-add', 'tag' : 'register', 'link' : '/register'},
            {'id' : 'Login', 'icon' : 'login', 'tag' : 'login', 'link' : '/login'}
        ])

    return {
        'data':sidenavs
    }

@post('/api/publish')
async def publish(request, *, post_id, title, text):
    if not request.authenticate:
        return web.HTTPBadRequest(body='not authenticated')

    if not post_id or not title or not text:
        return web.HTTPBadRequest(body='missing one of the parameters')
    
    query = await get_query(constants.db_publish_posts_filename)
    await execute(query, (post_id, title, text))
    return web.HTTPOk()

@post('/api/delete')
async def delete(request,*, post_id):
    if not request.authenticate:
        return web.HTTPBadRequest(body='not authenticated')
    
    if not post_id:
        return web.HTTPBadRequest(body='missing post id')

    query = await get_query(constants.db_delete_post)
    await execute(query, (post_id,))
    return web.HTTPOk()

@get('/api/posts')
async def posts(request):
    query = await get_query(constants.db_get_posts_filename)
    result = list(map(lambda post : {
            'postId' : post[0],
            'title' : post[1],
            'created' : str(post[2]),
            'modified' : str(post[3])
    }, await execute(query)))

    return {
        'data': result
    }

@get('/api/posts/{post_id}')
async def get_post(request,*,post_id):
    query = await get_query(constants.db_get_post_filename)
    rows = await execute(query,(post_id,))
    if not rows:
        return web.HTTPBadRequest(body='post does not exist')

    (result,) = rows 
    return {
        'data': {
            'postId':result[0],
            'title':result[1],
            'text':result[2],
            'created':str(result[3]),
            'modified':str(result[4]),
            'canEdit':request.authenticate != None
        }
    }

@post('/api/login')
async def auth(request,*,username,password):
    query = await get_query(constants.db_get_user_by_name_filename)
    rows = await execute(query,(username,))
    if not rows:
        return web.HTTPBadRequest(body='user does not exist')
    
    (result,) = rows
    user_id, dbpass, email = result
    if dbpass != password:
        return web.HTTPBadRequest(body='incorrect password')

    cookie = await __user2cookie__(user_id,username,password,email)
    return __make_auth_response__(username, password, cookie)

@post('/api/register')
async def register(request,*,username, email, password, secret):
    if secret != config.secret:
        return web.HTTPBadRequest(body='incorrect secret')
    
    query = await get_query(constants.db_register_user)
    user_id = str(uuid.uuid4().hex)
    await execute(query,(user_id, username, password, email, 1))

    cookie = await __user2cookie__(user_id, username, password, email)
    return __make_auth_response__(username, password, cookie)

@post('/api/signout')
async def signout(request):
    if not request.authenticate:
        return web.HTTPBadRequest(body='user not signed in')
    
    return __make_auth_response__('','','',age=-1)

@post('/api/edit/upload')
async def upload(request,*,files):
    if not request.authenticate:
        return web.HTTPBadRequest(body='not authenticated')

    for file in files:
        filename = os.path.join(config.upload, file['filename'])
        async with aiofiles.open(filename, mode='wb') as f:
            await f.write(file['data'])

    return web.Response(body='files successfully uploaded')