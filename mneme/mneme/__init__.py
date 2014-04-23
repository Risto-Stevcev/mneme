from flask import Flask
from flask.ext.mongoengine import MongoEngine
from flask_wtf.csrf import CsrfProtect
import contextlib
from datetime import datetime
import hashlib
import os


_ROOT = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)
auth_users = {}


with contextlib.nested(open(os.path.join(_ROOT, 'credentials.txt'), 'r'),
                       open(os.path.join(_ROOT, 'logs/%s.log'% \
                               datetime.strftime(datetime.now(), '%m-%d-%Y')), 'a+')) as (credentials_file, log_file):
    for line in credentials_file:
        if line[:len('MONGODB')] == 'MONGODB':
            key, value = line.strip().split('=')
            app.config[key] = value

            log_file.write('(%s) [+] app.config[%s]=%s\n' % (datetime.now(), key, value))


with contextlib.nested(open(os.path.join(_ROOT, 'users.txt'), 'r'),
                       open(os.path.join(_ROOT, 'logs/%s.log'% \
                               datetime.strftime(datetime.now(), '%m-%d-%Y')), 'a+')) as (users_file, log_file):
    for line in users_file:
        if '=' in line:
            key, value = line.strip().split('=')
            auth_users[key] = hashlib.sha1(value).hexdigest()
            log_file.write('(%s) [+] %s:%s to authorized users\n' % \
                            (datetime.now(), key, hashlib.sha1(value).hexdigest()))

def is_default():
    return app.config.get('MONGODB_HOST') == 'mongodb://myusername:mypassword@oceanic.mongohq.com:10052/mneme'

if not is_default():
    db = MongoEngine(app)


    secret_key = hashlib.sha1()
    app.config["SECRET_KEY"] = secret_key.digest()

    csrf = CsrfProtect()
    csrf.init_app(app)


    def register_blueprints(app):
        # Prevents circular imports
        from mneme.views import mnemes
        app.register_blueprint(mnemes)

    register_blueprints(app)


if __name__ == '__main__':
    app.run()
