FROM debian:bookworm-20230814-slim

# Container must be run with environment variable APACHE2_SERVER_NAME

EXPOSE 80

# install apache2
RUN apt update \
    && apt install -y apache2 \
    # create site folder
    && mkdir /var/www/html/doyouthinkyouarereal.com \
    # create log folder
    && mkdir /var/log/apache2/doyouthinkyouarereal.com

# apache config
COPY config/apache2/ /etc/apache2/
RUN ln /etc/apache2/sites-available/doyouthinkyouarereal.com.conf /etc/apache2/sites-enabled/doyouthinkyouarereal.com.conf

# static site files
COPY static /var/www/html/doyouthinkyouarereal.com/static

# startup script
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]
