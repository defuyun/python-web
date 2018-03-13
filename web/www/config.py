class Config(object):
    static = 'app/build/static'
    db = {
        'user': 'web',
        'password': 'password',
        'db': 'blog'
    }

def get_config():
    return Config()