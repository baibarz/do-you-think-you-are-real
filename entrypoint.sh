#!/bin/bash

echo "Starting apache2"

# environment variables for apache
source /etc/apache2/envvars

# starting apache in foreground so container does not exit
apachectl -DFOREGROUND
