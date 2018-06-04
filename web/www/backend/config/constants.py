import os

class constants(object):
    query_dirname = os.path.join('database','queries')
    table_dirname = os.path.join('database','tables')

    backend_dirname = 'backend'
    frontend_dirname = 'frontend'

    db_user_key = 'user'
    db_pass_key = 'password'
    db_table_key = 'db'

    db_get_post_filename = 'get-post.sql'
    db_get_posts_filename = 'get-posts.sql'
    db_publish_posts_filename = 'publish-post.sql'
    db_get_user_by_id_filename = 'get-user-by-id.sql'
    db_get_user_by_name_filename = 'get-user-by-name.sql'
    db_get_user_expire_date = 'get-user-expire-date.sql'
    db_update_user = 'update-user.sql'
    db_register_user = 'register-user.sql'
    db_delete_post = 'delete-post.sql'

    web_handler_module = 'handlers'
    web_upload_root = 'upload'