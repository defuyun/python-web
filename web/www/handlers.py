#! /usr/bin/python3

import asyncio

from aiohttp import web
from coroweb import get, post

@get('/')
async def index(request):
    return {
        '__template__' : 'index.html'
    }