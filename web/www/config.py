class Config(object):
    static = 'app/build/static'
    template = 'app/build'
    db = {
        'user': 'web',
        'password': 'password',
        'db': 'blog'
    }

def get_config():
    return Config()