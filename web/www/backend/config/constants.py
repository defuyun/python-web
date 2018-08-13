import os

class constants(object):
    table_dirname = os.path.join('database','tables')

    backend_dirname = 'backend'
    frontend_dirname = 'frontend'
    resources_dirname = 'resources'

    db_user_key = 'user'
    db_pass_key = 'password'
    db_db_key = 'db'

    web_handler_module = 'handlers'
    web_upload_root = 'upload'
