#! /usr/bin/python

import config
import aiomysql
import asyncio
import logging
import aiofiles
import os

from config.config import config
from config.constants import constants

async def init_db(app, loop):
    global pool

    pool = await aiomysql.create_pool(
        host='localhost', 
        port=3306, 
        user=config.db[constants.db_user_key], 
        password=config.db[constants.db_pass_key], 
        db=config.db[constants.db_table_key], 
        loop=loop,
        autocommit=True,
        use_unicode=True,
        charset='utf8'
    )

    logging.info('[DATABASE] Created pool to database [%s]' % config.db[constants.db_table_key])

async def execute(query, args=()):
    with (await pool) as conn:
        cursor = await conn.cursor()
        await cursor.execute(query, args)
        logging.debug('[DATABASE] Affected rows from update %s' % (cursor.rowcount))
        ret = await cursor.fetchall()
        return ret

async def get_query(name:str):
    async with aiofiles.open(os.path.join(config.queries,name), 'r') as query:
        return await query.read()
