#! /usr/bin/python3

import asyncio

from aiohttp import web
from coroweb import get, post

@get('/')
async def index(request):
    return {
        '__template__' : 'index.html',
    }

@get('/api/sidebar/options')
async def sidebar_options(request):
    return {
        'options' : ['posts'],
    }

@get('/api/content/posts')