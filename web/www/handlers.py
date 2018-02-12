#! /usr/bin/python3

import asyncio

from aiohttp import web
from coroweb import get, post

@get('/internal/test/{name}')
async def testHandler(request,*,name):
    return web.Response(body=name)