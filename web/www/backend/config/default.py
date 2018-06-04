import os
from config.constants import constants

class config_default(object):
    db = {
        constants.db_user_key : 'web',
        constants.db_pass_key : 'password',
        constants.db_table_key : 'blog'
    }

    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    backend = os.path.join(root, constants.backend_dirname)
    queries = os.path.join(root, constants.query_dirname)

    cookie_name = 'python-app'
    cookie_key = 'python-app'

    cookie_expire_duration = 3
    cookie_expire_duration_second = cookie_expire_duration * 3600 * 24

    secret = 'wululu'