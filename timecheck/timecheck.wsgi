from logging import basicConfig
from sys import path, stderr

# configure logging
basicConfig(stream=stderr)

# set search path
path.insert(0, "/var/www/wsgi/timecheck")

from app import app

application = app