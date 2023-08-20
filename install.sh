rsync -av --exclude='.gitignore' --exclude='.git' --exclude='install.sh' --exclude='config' --exclude='page_chooser' . /var/www/html/doyouthinkyouarereal.com/static

rsync -av --exclude='__pycache__' --exclude='pyproject.toml' ./page_chooser /var/www/wsgi