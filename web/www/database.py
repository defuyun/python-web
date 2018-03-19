#! /usr/bin/python

import config
import aiomysql
import asyncio
import logging

async def init_db(app, loop):
    global pool

    pool = await aiomysql.create_pool(
        host='localhost', 
        port=3306, 
        user=app._config.db['user'], 
        password=app._config.db['password'], 
        db=app._config.db['db'], 
        loop=loop,
        autocommit=True,
        use_unicode=True,
        charset='utf8'
    )

    logging.info('[DATABASE] Created pool to database [%s]' % app._config.db['db'])

async def execute(query, args=()):
    with (await pool) as conn:
        cursor = await conn.cursor()
        await cursor.execute(query, args)
        logging.debug('[DATABASE] Affected rows from update %s' % (cursor.rowcount))
        ret = await cursor.fetchall()
        return ret