#!/bin/bash

echo "Starting apache2 for $APACHE2_SERVER_NAME"

# environment variables for apache
source /etc/apache2/envvars

# starting apache in foreground so container does not exit
apachectl -DFOREGROUND
