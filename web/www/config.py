class Config(object):
    static = 'app/build/static'
    template = 'app/build'

def get_config():
    return Config()