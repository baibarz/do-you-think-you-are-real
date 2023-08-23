FROM debian:bookworm-20230814-slim

# Container must be run with environment variable APACHE2_SERVER_NAME

EXPOSE 80

# install apache2
RUN apt update \
    && apt install -y apache2 \
    && a2enmod wsgi \
    # create site folder
    && mkdir /var/www/html/doyouthinkyouarereal.com \
    # create log folder
    && mkdir /var/log/apache2/doyouthinkyouarereal.com

# apache config
COPY config/apache2/ /etc/apache2/
RUN rm /etc/apache2/sites-enabled/000-default.conf \
    && a2ensite doyouthinkyouarereal.com

# static site files
COPY static /var/www/html/doyouthinkyouarereal.com/static

# startup script
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]
