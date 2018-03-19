#! /usr/bin/python3

import asyncio
import uuid
import logging

from aiohttp import web
from coroweb import get, post
from database import execute

@get('/')
async def index(request):
    return {
        '__template__' : 'index.html'
    }

@get('/sidenav_options')
async def sidenav_options(request):
    return {
        'data' : [
            {'id' : 'Home', 'icon' : 'fas fa-home', 'tag' : 'home'},
            {'id' : 'Posts', 'icon' : 'fas fa-rss', 'tag' : 'posts'},
            {'id' : 'Tags', 'icon' : 'fas fa-tags', 'tag' : 'tags'},
            {'id' : 'Edit', 'icon' : 'fas fa-edit', 'tag' : 'edit'}]
    }

@post('/publish')
async def publish(request, *, post_id, title, text):
    if not post_id or not title or not text:
        return web.HTTPBadRequest()
    
    query = "INSERT INTO posts (postId, title, post) values (%s,%s,%s)"
    await execute(query, (post_id, title, text))
    return web.HTTPOk()

@get('/posts')
async def posts(request):
    query = "SELECT postId, title, created, modified from posts"
    result = list(map(lambda post : {
            'postId' : post[0],
            'title' : post[1],
            'created' : str(post[2]),
            'modified' : str(post[3])
    }, await execute(query)))

    return {
        'data': result
    }

@get('/posts/{post_id}')
async def get_post(request,*,post_id):
    query = "SELECT * from posts where postId=%s"
    (result,) = await execute(query,(post_id,))
    return {
        'data': {
            'postId':result[0],
            'title':result[1],
            'text':result[2],
            'created':str(result[3]),
            'modified':str(result[4])
        }
    }