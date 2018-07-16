#! /usr/bin/python3

import asyncio
import uuid
import logging
import hashlib
import aiofiles
import os
import datetime

from aiohttp import web
from coroweb import get, post
from model import User, Post

from config.constants import constants
from config.config import config

def getExpireDateTime(days):
    return str((datetime.datetime.now() + datetime.timedelta(days=days)).strftime('%Y-%m-%d %H:%M:%S'))

def getCurrentDateTime():
    return str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

async def __user2cookie__(user:User):
    s = '%s-%s-%s-%s-%s' % (user.username, user.password, user.expire, user.email, config.cookie_key)
    sha1 = hashlib.sha1(s.encode('utf-8')).hexdigest()

    logging.debug('[AUTHENTICATE] sha1 generated for user %s generated from %s' % (sha1, s))

    return '%s-%s' % (user.userId, sha1) 

def __make_auth_response__(user:User, cookie, age=config.cookie_expire_duration_second):
    user.password = '******'

    resp = web.json_response({
        'user': user
    })
    resp.set_cookie(config.cookie_name, cookie, max_age=age, httponly=True)

    return resp

@post('/api/edit/new')
async def editNew(request, *, post:dict):
    if not request.user:
        return web.HTTPBadRequest(body='not authenticated')
    
    if not post.postId or not post.title or not post.text:
        return web.HTTPBadRequest(body='missing one of the parameters')

    created = modified = getCurrentDateTime()
    post = Post(postId=post.postId, post=post.post, title=post.title, created=created, modified=modified)

    success = await post.save()

    if not success:
        return web.HTTPBadRequest(body='failed to create new post')
    
    return web.HTTPOk()

@post('/api/edit/publish')
async def editPublish(request, *, post:dict):
    if not request.user:
        return web.HTTPBadRequest(body='not authenticated')

    if not post.postId or not post.title or not post.text:
        return web.HTTPBadRequest(body='missing one of the parameters')

    _post = await Post.find(key='postId', value=post.postId)

    if not _post:
        return web.HTTPBadRequest(body='invalid postId')

    _post.title = post.title
    _post.post = post.post
    _post.modified = getCurrentDateTime()

    success = await _post.update()

    if not success:
        return web.HTTPBadRequest(body='failed to update post')
    
    return web.HTTPOk()

@post('/api/edit/delete')
async def editDelete(request,*, post:dict):
    if not request.user:
        return web.HTTPBadRequest(body='not authenticated')
    
    if not post.postId:
        return web.HTTPBadRequest(body='missing post id')

    _post = Post(postId=post.postId)

    success = await _post.delete()

    if not success:
        return web.HTTPBadRequest(body='failed to delete post')

    return web.HTTPOk()

@get('/api/posts')
async def getPosts(request):
    posts = await Post.findAll(orderBy='created', DESC=True)

    return {
        'posts': posts
    }

@get('/api/post')
async def getPost(request,*,id:str):
    post = await Post.find(key='postId', value=id)

    if not post:
        return web.HTTPBadRequest(body='post does not exist')

    return {
        'post': post
    }

@post('/api/user/login')
async def userAuth(request,*,username:str,password:str):
    user = await User.find(key='username',value=username)

    if not user:
        return web.HTTPBadRequest(body='user does not exist')
    
    if user.password != password:
        return web.HTTPBadRequest(body='incorrect password')

    user.expire = getExpireDateTime(config.cookie_expire_days)
    success = await user.update()

    if not success:
        return web.HTTPBadRequest(body='failed to update expire time')

    cookie = await __user2cookie__(user)
    return __make_auth_response__(user, cookie)

@post('/api/user/register')
async def userRegister(request,*,username, email, password, secret):
    if secret != config.secret:
        return web.HTTPBadRequest(body='incorrect secret')
    
    userId = str(uuid.uuid4().hex)
    expire = getExpireDateTime(config.cookie_expire_days)

    user = User(username=username, email=email, password=password, userId=userId, expire=expire)
    success = await user.save()

    if not success:
        return web.HTTPBadRequest(body='failed to register')

    cookie = await __user2cookie__(user)
    return __make_auth_response__(user, cookie)

@post('/api/user/signout')
async def userSignout(request):
    if not request.user:
        return web.HTTPBadRequest(body='user not signed in')
    
    request.user.expire = getCurrentDateTime()
    success = await request.user.update()

    if not success:
        return web.HTTPBadRequest(body='failed to expire session')

    return __make_auth_response__(User(), None, age=-1)

@post('/api/user/delete')
async def userDelete(request):
    if not request.user:
        return web.HTTPBadRequest(body='user not signed in')

    success = await request.user.delete()

    if not success:
        return web.HTTPBadRequest(body='failed to delete user')

    return __make_auth_response__(User(), None, age=-1)

@post('/api/edit/upload')
async def editUpload(request,*,files):
    if not request.authenticate:
        return web.HTTPBadRequest(body='not authenticated')

    for file in files:
        filename = os.path.join(config.resources, file['filename'])
        async with aiofiles.open(filename, mode='wb') as f:
            await f.write(file['data'])

    return web.Response(body='files successfully uploaded')