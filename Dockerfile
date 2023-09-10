FROM debian:bookworm-20230814-slim

EXPOSE 80
EXPOSE 443

ENV TIMECHECK_CONTENT_PATH=/var/www/wsgi/timecheck
ENV APACHE2_SERVER_NAME=localhost

# install apache2
RUN apt update \
    && apt install -y \
        apache2 \
        libapache2-mod-wsgi-py3 \
        python3-flask \
    && rm /etc/apache2/sites-enabled/000-default.conf \
    # create directories for site, wsgi, and logging
    && mkdir /var/www/html/doyouthinkyouarereal.com \
        /var/www/wsgi \
        /var/www/wsgi/timecheck \
        /var/log/apache2/doyouthinkyouarereal.com

# apache config
COPY config/apache2/ /etc/apache2/

# static site files
COPY static/ /var/www/html/doyouthinkyouarereal.com/static/

# python files
COPY timecheck/ /var/www/wsgi/

# startup script
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh \
    && a2ensite doyouthinkyouarereal.com

ENTRYPOINT [ "./entrypoint.sh" ]
