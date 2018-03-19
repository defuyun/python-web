#! /usr/bin/python3

from aiohttp import web
from asyncio import AbstractEventLoop
from jinja2 import Environment, FileSystemLoader
from database import init_db
from config.config import config
from config.constants import constants

import logging; logging.basicConfig(level=logging.DEBUG)
import asyncio
import aiomysql
import coroweb
import os

async def response_factory(app, handler):
    async def response(request):
        resp = await handler(request)
        if isinstance(resp, web.StreamResponse):
            return resp
        elif isinstance(resp, dict):
            template = resp.get('__template__', None)
            if template is None:
                return web.json_response(resp)
            
            else:
                return web.Response(
                    body=app['__template__'].get_template(template).render(**resp).encode('utf-8'),
                    content_type='text/html',
                    charset='utf-8')

        return web.HTTPBadRequest(body='Something went wrong')
    return response

def init_jinja(app):
    # conflict with angular
    options = dict(
        variable_start_string='{@',
        variable_end_string='@}'
    )

    path = config.template
    logging.info('[JINJA] setting %s to be path to template' % path)
    env = Environment(loader=FileSystemLoader(path), **options)
    app['__template__'] = env

async def init(loop:AbstractEventLoop):
    app = web.Application(loop=loop, middlewares=[
        response_factory
    ])

    init_jinja(app)
    await init_db(app, loop)
    coroweb.add_statics(app, config.static, constants.web_static_root)
    coroweb.add_routes(app, constants.web_handler_module)
    srv = await loop.create_server(app.make_handler(), '127.0.0.1', 8080)
    logging.info('[APP] server started on 127.0.0.1:8080')
    return srv

if __name__ == '__main__':
    logging.info('[APP] starting web application')
    loop = asyncio.get_event_loop()
    loop.run_until_complete(init(loop))
    loop.run_forever() 