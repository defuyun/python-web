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
async def posts(request,*,page):
    return {
        'content' : [
            {
                'title' : 'sample',
                'author' : 'human',
                'date' : '02/13/2018',
                'sequence' : 1,
                'page' : 'test.html',
            },
            {
                'title' : 'sample',
                'author' : 'human',
                'date' : '02/13/2018',
                'sequence' : 3,
                'page' : 'test.html',
            },
            {
                'title' : 'sample',
                'author' : 'human',
                'date' : '02/13/2018',
                'sequence' : 2,
                'page' : 'test.html',
            },
            {
                'title' : 'sample',
                'author' : 'human',
                'date' : '02/13/2017',
                'sequence' : 4,
                'page' : 'test.html',
            },
            {
                'title' : 'sample',
                'author' : 'human',
                'date' : '02/13/2016',
                'sequence' : 5,
                'page' : 'test.html',
            },
            {
                'title' : 'sample',
                'author' : 'human',
                'date' : '02/13/2016',
                'sequence' : 6,
                'page' : 'test.html',
            },
        ]
    }