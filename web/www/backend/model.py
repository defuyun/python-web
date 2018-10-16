import logging
import datetime
import pymysql

from database import execute, select

class Field(object):
    def __init__(self, name, columeType, default, primary, unique):
        self.__id__= name
        self.__columeType__ = columeType
        self.__default__ = default
        self.__primary__ = primary
        self.__unique__ = unique
    
    # process is used to convert values from the database to serializable python format
    # e.g the datetime object is not serializable (it cannot be parsed into json and attached to http) therefore
    # we need to serialize it into a string when fetched from the db
    def process(self, value):
        logging.debug('[MODEL] process in field %s' % value)
        return value
    
    def __str__(self):
        return '<%s,%s,%s,%s>' % (self.__id__, self.__columeType__, self.__primary__, self.__unique__)

class ModelMetaClass(type):
    def __new__(cls, name, bases, attr):
        tablename = attr.get('__table__', None) or name
        logging.info('[MODEL] received name %s for model' % tablename)
        if tablename == 'Model':
            return type.__new__(cls, name, bases, attr)

        fields = []
        mapping = {}
        unique = set()
        primaryKey = None

        for k,v in attr.items():
            if isinstance(v, Field):
                fields.append(k)
                mapping[k] = v
                if v.__primary__:
                    if primaryKey != None:
                        raise ValueError('[MODEL] there are multiple primary key (%s,%s) for table %s' % (k, primaryKey, tablename))

                    primaryKey = k
                
                if v.__unique__:
                    unique.add(k)

        if primaryKey is None:
            raise ValueError('[MODEL] No primary key for table %s' % tablename) 

        # removing the keys from attribute as we have already extracted the fields
        # if we don't extract then when we do model.name, the getattribute function would return
        # the field object instead of something we assigned by the dictionary method
        for key in mapping.keys():
            del attr[key]
        
        attr['__mapping__'] = mapping
        attr['__fields__'] = fields
        attr['__primary__'] = primaryKey
        attr['__unique__'] = unique

        attr['__updatable__'] = list(filter(lambda field : field != primaryKey and field not in unique, fields))

        attr['__select__'] = 'select {0} from {1} where `?`=%s'.format(
            ','.join(map(lambda field : '`{0}`'.format(field), fields)),
            tablename
        )

        attr['__selectAll__'] = 'select {0} from {1}'.format(
            ','.join(map(lambda field : '`{0}`'.format(field), fields)),
            tablename
        )

        attr['__insert__'] = 'insert into `%s` (%s) values (%s)' % (
            tablename, 
            ','.join(map(lambda field : '`%s`' % field, fields)),
            ','.join(map(lambda field : '%s', fields))
        )

        attr['__update__'] = 'update `{0}` set {1} where `{2}`=%s'.format(
            tablename,
            ','.join(map(lambda field : '`{0}`=%s'.format(field), attr['__updatable__'])),
            primaryKey
        )

        attr['__destroy__'] = 'delete from `{0}` where `{1}`=%s'.format(tablename, primaryKey)

        attr['__table__'] = tablename

        logging.info('[MODEL] table %s added selectAll query string [%s]' % (attr['__table__'], attr['__selectAll__']))
        logging.info('[MODEL] table %s added select query string [%s]' % (attr['__table__'],attr['__select__']))
        logging.info('[MODEL] table %s added insert query string [%s]' % (attr['__table__'],attr['__insert__']))
        logging.info('[MODEL] table %s added update query string [%s]' % (attr['__table__'],attr['__update__']))
        logging.info('[MODEL] table %s added delete query string [%s]' % (attr['__table__'],attr['__destroy__']))

        return type.__new__(cls, name, bases, attr)

class Model(dict, metaclass=ModelMetaClass):
    def __init__(self, **kw):
        super(Model, self).__init__(**kw)

    def __setattr__(self, key, value):
        self[key] = value
    
    def __getattr__(self, key):
        try:
            logging.debug('[MODEL] getting attr %s' % key)
            return self[key]
        except KeyError:
            logging.warning('[MODEL] could not get %s in %s' % (key, self.__table__))
            return None

    def getValue(self, key):
        value = self.__getattr__(key)
        logging.debug('[MODEL] got (%s => %s) in getValue' % (key, value))
        if value is None and key in self.__mapping__:
            return self.__mapping__[key].default() if callable(self.__mapping__[key].default) else self.__mapping__[key].default
        
        return value

    @classmethod
    def mapRow(cls, row):
        kw = {}
        for i in range(len(cls.__fields__)):
            field = cls.__fields__[i]
            value = row[i]

            kw[field] = cls.__mapping__[field].process(value)

        return kw
    
    @classmethod
    async def find(cls, key, value):
        logging.debug('[MODEL] executing query %s with args %s' % (cls.__select__.replace('?', key), value))
        row = await select(cls.__select__.replace('?', key), (value))
        logging.debug('[MODEL] row from find : %s with args : %s in table %s' % (row, (value), cls.__table__))
        
        if not len(row) > 0:
            logging.warn('[MODEL] find returned nothing')
            return None

        return list(map(lambda r : cls(**cls.mapRow(r)), row))

    @classmethod
    async def findAll(cls, **kw):
        query = cls.__selectAll__
        args = []
        if 'orderBy' in kw:
            query += ' order by %s'
            args.append(kw['orderBy'])

            if 'DESC' in kw:
                query += ' DESC'

        logging.debug('[MODEL] executing query %s with args %s' % (query, kw))
        rows = await select(query, args)
        logging.debug('[MODEL] rows from findAll : %s with args : %s in table %s' % (rows, kw, cls.__table__))

        if not len(rows) > 0:
            logging.warn('[MODEL] findAll returned nothing')
            return []

        return list(map(lambda row : cls(**cls.mapRow(row)), rows))

    async def save(self):
        args = list(map(lambda field : self.getValue(field) ,self.__fields__))
        
        logging.debug('[MODEL] executing query %s with args %s' % (self.__insert__,args))
        try:
            rows = await execute(self.__insert__, args)
        except pymysql.err.IntegrityError as err:
            logging.error('[MODEL] %s' % err)
            return False

        if rows != 1:
            logging.warn('[MODEL] affected rows of save is not 1 in table %s' % self.__table__)
            return False
        
        return True

    async def update(self):
        args = list(map(lambda field : self.getValue(field) ,self.__updatable__))
        args.append(self.getValue(self.__primary__))

        logging.debug('[MODEL] executing query %s with args %s' % (self.__update__,args))
        rows = await execute(self.__update__, args)

        if rows != 1:
            logging.warn('[MODEL] affected rows of update is not 1 in table %s' % self.__table__)
            return False
        
        return True

        
    async def delete(self):
        args = [self.getValue(self.__primary__)]
        logging.debug('[MODEL] executing query %s with args %s' % (self.__destroy__,args))
        rows = await execute(self.__destroy__, args)

        if rows != 1:
            logging.warn('[MODEL] affected rows of delete is not 1 in table %s' % self.__table__)
            return False
        
        return True

class StringField(Field):
    def __init__(self, id, ddl='VARCHAR(255)', default='', primary=False, unique=False):
        super().__init__(id, ddl, default, primary, unique)

class DateField(Field):
    def __init__(self, id, columnType='datetime', default=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), primary=False, unique=False):
        super().__init__(id, columnType, default, primary, unique)
    
    def process(self, value):
        logging.debug('[MODEL] process in datefield %s' % value)
        return str(value)

class TextField(Field):
    def __init__(self, id, columnType='text', default=''):
        super().__init__(id, columnType, default, False, False)

class User(Model):
    __table__ = 'user'

    userId = StringField(id='userId', ddl='CHAR(38)', primary=True)
    username = StringField(id='username', unique=True)
    password = StringField(id='password', ddl='CHAR(40)')
    email = StringField(id='email')

class Post(Model):
    __table__ = 'posts'

    postId = StringField(id='postId', ddl='CHAR(38)', primary=True)
    title = StringField(id='title')
    post = TextField(id='post')
    author = StringField(id='author', ddl='VARCHAR(255)')
    description = StringField(id='description', ddl='VARCHAR(255)')
    created = DateField(id='created')
    modified = DateField(id='modified')

class Tag(Model):
    __table__ = 'tag'

    relId = StringField(id='relId', ddl='CHAR(40)', primary=True)
    postId = StringField(id='postId', ddl='CHAR(38)')
    tagname = StringField(id='tagname', ddl='VARCHAR(25)')

class Session(Model):
    __table__ = 'session'
    
    sessionId = StringField(id='sessionId', ddl='CHAR(40)', primary=True)
    userId = StringField(id='userId', ddl='CHAR(38)')
    userAgent = StringField(id='userAgent', ddl='VARCHAR(255)')
    expire = DateField(id='expire')
