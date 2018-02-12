#! /usr/bin/python3

from aiohttp import web
from asyncio import AbstractEventLoop

import logging; logging.basicConfig(level=logging.DEBUG)
import asyncio
import coroweb

async def init(loop:AbstractEventLoop):
    app = web.Application(loop=loop)
    coroweb.add_routes(app, 'handlers')
    srv = await loop.create_server(app.make_handler(), '127.0.0.1', 8080)
    logging.info('[APP] server started on 127.0.0.1:8080')
    return srv

if __name__ == '__main__':
    logging.info('[APP] starting web application')
    loop = asyncio.get_event_loop()
    loop.run_until_complete(init(loop))
    loop.run_forever() 