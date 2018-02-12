#! /usr/bin/python3

import asyncio

from aiohttp import web
from coroweb import get, post

@get('/internal/get/test/stream/{name}')
async def test_stream(request,*,name):
    return web.Response(body=name)

@get('/internal/get/test/json/{name}')
async def test_json(request,*,name):
    return {
        'name': name
    }

@get('/internal/get/test/template/{name}')
async def test_template(request,*,name):
    return {
        '__template__' : 'test.html',
        'name' : name
    }