# Set the path
import os, sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask.ext.script import Manager, Server


_ROOT = os.path.abspath(os.path.dirname(__file__))

from mneme import app
manager = Manager(app)


@manager.option('-d', '--db', dest='db')
@manager.option('-o', '--host', dest='host')
@manager.option('-r', '--port', dest='port')
@manager.option('-u', '--username', dest='username')
@manager.option('-p', '--password', dest='password')
def register(db, host, port, username, password, default_data=False, sample_data=False):
    "Register a MongoDB database"
    if not (host and port and username and password):
        print ("Usage: register --db [DATABASE] --host [HOST]" 
               " --port [PORT] --username [USERNAME] --password [PASSWORD]")
        return

    mongodb = ['MONGODB_DB=%s\n' % db,
               'MONGODB_USERNAME=%s\n' % username,
               'MONGODB_PASSWORD=%s\n' % password,
               'MONGODB_PORT=%s\n' % port,
               'MONGODB_HOST=mongodb://%s:%s@%s:%s/%s\n' % (username, password, host, port, db)]

    with open(os.path.join(_ROOT, 'credentials.txt'),'w+') as credentials_file:
        for line in mongodb:
            credentials_file.write(line)

    print("Database registered.")


@manager.option('-u', '--username', dest='username')
@manager.option('-p', '--password', dest='password')
def authorize(username, password, default_data=False, sample_data=False):
    "Authorize a user"
    if not(username and password):
        print("Usage: authorize --username [username] --password [password]")
        return

    auth_users = {}
    with open(os.path.join(_ROOT, 'users.txt'), 'r') as users_file:
        for line in users_file:
            key, value = line.strip().split('=')
            auth_users[key] = value

    if auth_users.get(username):
        auth_users[username] = password

        with open(os.path.join(_ROOT, 'users.txt'), 'w') as users_file:
            for key, value in auth_users.items():
                users_file.write('%s=%s\n' % (key, value))

    else:
        with open(os.path.join(_ROOT, 'users.txt'), 'a') as users_file:
            users_file.write('%s=%s\n' % (username, password))


@manager.option('-d', '--date', dest='date')
def logs(date, default_data=False, sample_data=False):
    "View the server logs"
    if not date:
        print("Usage: logs --date [mm-dd-yyyy]")
        return

    if os.path.isfile(os.path.join(_ROOT, 'logs/%s.log'%date)):
        with open(os.path.join(_ROOT, 'logs/%s.log'%date)) as log_file:
            for line in log_file:
                sys.stdout.write(line)
    else:
        print("Log file doesn't exist for %s." % date)


# Turn on debugger by default and reloader
manager.add_command("runserver", Server(
    use_debugger = True,
    use_reloader = True,
    host = '0.0.0.0')
)


def main():
    manager.run()

if __name__ == "__main__":
    main()
