import os
import logging
from config.constants import constants

class config_default(object):
    db = {
        constants.db_user_key : 'web',
        constants.db_pass_key : 'password',
        constants.db_db_key: 'blog'
    }

    # move up 3 directories, so config -> backend -> root
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    backend = os.path.join(root, constants.backend_dirname)
    resources = os.path.join(root, constants.resources_dirname)

    cookie_name = 'python-app'
    cookie_key = 'python-app'

    cookie_expire_duration = 3
    cookie_expire_duration_second = cookie_expire_duration * 3600 * 24
    cookie_expire_days = 3

    secret = 'wululu'

    loglevel = logging.INFO
