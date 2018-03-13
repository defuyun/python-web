#! /usr/bin/python3

import asyncio

from aiohttp import web
from coroweb import get, post

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
async def publish(request,*,title,post):
    return web.HTTPOk()