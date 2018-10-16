#! /usr/bin/python3

import asyncio
import uuid
import logging
import hashlib
import aiofiles
import os
import datetime
import re
import shutil

from aiohttp import web
from coroweb import get, post
from model import User, Tag, Post, Session

from config.constants import constants
from config.config import config

def getAbsPathToRes(userId, postId):
    return os.path.join(config.resources, os.path.join(userId, postId))

def getExpireDateTime(days):
    return str((datetime.datetime.now() + datetime.timedelta(days=days)).strftime('%Y-%m-%d %H:%M:%S'))

def getCurrentDateTime():
    return str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

async def __user2cookie__(user:User, session:Session):
    s = '%s-%s-%s-%s-%s' % (user.username, user.password, session.expire, user.email, config.cookie_key)
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

def __new_tag__(postId, tagname):
    s = '%s-%s' % (postId, tagname)
    sha1 = hashlib.sha1(s.encode('utf-8')).hexdigest()
    return Tag(relId=sha1, postId=postId, tagname=tagname)

async def __sync_tags__(postId:str, dbtags:list, cltags:list):
    i = j = 0

    dbtags.sort(key=lambda t : t.tagname)
    cltags.sort()
    
    logging.debug('[SYNC_TAG] db tags are [%s]' % ','.join(list(map(lambda t : t.tagname, dbtags))))
    logging.debug('[SYNC_TAG] received client tags are [%s]' % ','.join(cltags))
    
    while i < len(dbtags) and j < len(cltags):
        if dbtags[i].tagname == cltags[j]:
            i+=1;j+=1;
        elif dbtags[i].tagname < cltags[j]:
            await dbtags[i].delete()
            i+=1;
        else:
            newtg = __new_tag__(postId, cltags[j])
            await newtg.save()
            j+=1;
    
    while i < len(dbtags):
        await dbtags[i].delete()
        i+=1

    while j < len(cltags):
        newtg = __new_tag__(postId, cltags[j])
        await newtg.save()
        j+=1

def __sync_resources__(userId : str, postId :str, resources : list):
    postpath = os.path.join(config.resources, os.path.join(userId, postId))
    localfiles = list(filter(lambda f : not f.startswith('.'), os.listdir(postpath))) if os.path.exists(postpath) else []

    localfiles.sort()
    resources.sort()
    
    logging.debug('[SYNC_RES] filtered local files are [%s]' % ','.join(localfiles))
    logging.debug('[SYNC_RES] received client files are [%s]' % ','.join(resources))

    i = j = 0
    while i < len(localfiles) and j < len(resources):
        if localfiles[i] == resources[j]:
            i+=1
            j+=1
        elif localfiles[i] < resources[j]:
            filepath = os.path.join(postpath, localfiles[i])
            if os.path.exists(filepath):
                os.remove(filepath)
            i+=1
        else:
            j+=1

    while i < len(localfiles):
        filepath = os.path.join(postpath, localfiles[i])
        if os.path.exists(filepath):
            os.remove(filepath)
        i+=1


@post('/api/edit/save')
async def editSave(request, *, postId, title, description, content, resources, tags):
    if not request.user:
        return web.HTTPBadRequest(body='not authenticated')
    
    dbtags = await Tag.find(key='postId', value=postId)
    if dbtags is None:
        dbtags = []
    elif not isinstance(dbtags, list):
        dbtags = [dbtags]

    await __sync_tags__(postId, dbtags, tags)
    
    __sync_resources__(request.user.userId, postId, resources)

    post = await Post.find(key='postId', value=postId)
    if post:
        post = post[0]
        post.title = title
        post.post = content
        post.description = description
        post.modified = getCurrentDateTime()
        post.author = request.user.username

        success = await post.update()
        if not success:
            return web.HTTPBadRequest(body='failed to update post')
    else :
        created = modified = getCurrentDateTime()
        post = Post(postId=postId, post=content,author=request.user.username, description=description, title=title, created=created, modified=modified)
        
        success = await post.save()
        if not success:
            return web.HTTPBadRequest(body='failed to create new post')

    return web.HTTPOk()


@post('/api/edit/delete')
async def editDelete(request,*, postId):
    if not request.user:
        return web.HTTPBadRequest(body='not authenticated')
    
    if not postId:
        return web.HTTPBadRequest(body='missing post id')

    _post = Post(postId=postId)

    success = await _post.delete()
    
    if not success:
        return web.HTTPBadRequest(body='failed to delete post')
    
    tags = await Tag.find(key='postId', value=postId)
    
    if tags:
        for t in tags:
            await t.delete()
    
    res = getAbsPathToRes(request.user.userId, postId)

    if os.path.exists(res):
        shutil.rmtree(res)

    return web.HTTPOk()

@get('/api/tags')
async def getTags(request):
    tags = await Tag.findAll()

    return {
        'tags' : tags
    }

@get('/api/posts')
async def getPosts(request):
    posts = await Post.findAll(orderBy='created', DESC=True)

    result = list(map(lambda p : {
        'id' : p.postId,
        'title' : p.title,
        'description' : p.description,
        'author' : p.author,
        'created' : p.created,
        'modified' : p.modified}, posts));
    
    return {
        'posts': result
    }

@get('/api/post')
async def getPost(request,*,postId:str):
    post = await Post.find(key='postId', value=postId)
    
    if not post:
        return web.HTTPBadRequest(body='post does not exist')
    
    post = post[0]

    user = await User.find(key='username', value=post.author)

    if not user:
        return  web.HTTPBadRequest(body='this author\'s posts are not available')

    user = user[0]

    path = os.path.join(user.userId, postId)
    url = os.path.join('/%s' % constants.resources_dirname, path)
    resdir = os.path.join(config.resources,path)

    post.resources = [] if not os.path.exists(resdir) else list(map(lambda x : {'name' : x, 'data': os.path.join(url, x)}, os.listdir(resdir)))
    
    tags = await Tag.find(key='postId', value=postId)
    post.tags = [] if not tags else list(map(lambda t : t.tagname, tags))

    return {
        'post': post
    }

@post('/api/user/login')
async def userAuth(request,*,email:str,password:str):
    user = await User.find(key='email',value=email)
    
    if not user:
        return web.HTTPBadRequest(body='user does not exist')
    
    user = user[0]

    if user.password != password:
        return web.HTTPBadRequest(body='incorrect password')
    
    u_agent = request.headers['User-Agent']

    s = '%s-%s' % (user.userId, u_agent)
    s_id = hashlib.sha1(s.encode('utf-8')).hexdigest()
    
    session = await Session.find(key='sessionId', value=s_id)
    success = False

    if not session:
        session = Session(sessionId=s_id, userId=user.userId, userAgent=u_agent, expire=getExpireDateTime(config.cookie_expire_days))
        success = await session.save()
    else :
        session = session[0]
        session.expire = getExpireDateTime(config.cookie_expire_days)
        success = await session.update()

    if not success:
        return web.HTTPBadRequest(body='failed to update expire time')

    cookie = await __user2cookie__(user, session)
    return __make_auth_response__(user, cookie)

@post('/api/user/register')
async def userRegister(request,*,username, email, password, secret):
    if secret != config.secret:
        return web.HTTPBadRequest(body='incorrect secret')
    user = await User.find(key='username', value=username)

    if user:
        return web.HTTPBadRequest(body='username already exists')
    
    user = await User.find(key='email', value=email)
    
    if user:
        return web.HTTPBadRequest(body='email already exists')

    userId = str(uuid.uuid4().hex)

    user = User(username=username, email=email, password=password, userId=userId)
    success = await user.save()

    if not success:
        return web.HTTPBadRequest(body='failed to register')
    
    expire = getExpireDateTime(config.cookie_expire_days)
    
    s = '%s-%s' % (userId, request.headers['User-Agent'])
    s_id = hashlib.sha1(s.encode('utf-8')).hexdigest()

    session = Session(sessionId=s_id, userId=userId, userAgent=request.headers['User-Agent'], expire=expire)
    success = await session.save()

    cookie = await __user2cookie__(user, session)
    return __make_auth_response__(user, cookie)

@post('/api/user/signout')
async def userSignout(request):
    if not request.session:
        return web.HTTPBadRequest(body='user not signed in')
    
    request.session.expire = getCurrentDateTime()
    success = await request.session.update()

    if not success:
        return web.HTTPBadRequest(body='failed to expire session')

    return __make_auth_response__(User(), None, age=-1)

@get('/api/user/info')
async def userInfo(request):
    if not request.user:
        return {'user' : {}}
    
    request.session.expire = getExpireDateTime(config.cookie_expire_days)
    success = await request.session.update()

    if not success:
        return web.HTTPBadRequest(body='failed to update session')
    
    cookie = await __user2cookie__(request.user, request.session)
    return __make_auth_response__(request.user, cookie)

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
    if not request.user:
        return web.HTTPBadRequest(body='not authenticated')
    
    ret = []
    for file in files:
        extension = file['extension']
        filename = file['filename']

        if extension is None:
            ret.append({'filename' : filename, 'error': 'NO_EXTENSION'})
            continue

        fullpath = os.path.join(os.path.join(config.resources, request.user.userId), filename);
        directory = os.path.dirname(fullpath);

        if not os.path.exists(directory):
            os.makedirs(directory)

        if os.path.isfile(fullpath):
            ret.append({'filename': filename, 'error' : 'FILE_EXISTS'})
            continue

        mode = 'wb' if re.match('^\.(jpg|png|gif|svg)$',file['extension'], flags=re.IGNORECASE) else 'w'
        async with aiofiles.open(fullpath, mode=mode) as f:
            logging.debug('[UPLOAD] adding new file %s' % fullpath)
            await f.write(file['data'])
        
        ret.append({'filename' : filename, 'path' : fullpath})

    return {'files' : ret}
