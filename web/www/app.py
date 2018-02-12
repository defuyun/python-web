#! /usr/bin/python3

from aiohttp import web
from asyncio import AbstractEventLoop
from jinja2 import Environment, FileSystemLoader

import logging; logging.basicConfig(level=logging.DEBUG)
import asyncio
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
    return response

def init_jinja(app):
    # conflict with angular
    options = dict(
        variable_start_string='{@',
        variable_end_string='@}'
    )
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
    logging.info('[JINJA] setting %s to be path to template' % path)
    env = Environment(loader=FileSystemLoader(path), **options)
    app['__template__'] = env

async def init(loop:AbstractEventLoop):
    app = web.Application(loop=loop, middlewares=[
        response_factory
    ])

    init_jinja(app)
    coroweb.add_statics(app)
    coroweb.add_routes(app, 'handlers')
    srv = await loop.create_server(app.make_handler(), '127.0.0.1', 8080)
    logging.info('[APP] server started on 127.0.0.1:8080')
    return srv

if __name__ == '__main__':
    logging.info('[APP] starting web application')
    loop = asyncio.get_event_loop()
    loop.run_until_complete(init(loop))
    loop.run_forever() 