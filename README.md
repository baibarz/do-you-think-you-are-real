# Running with docker

## Running the website

Build an image:

`docker build -t site-image .`

Create a container from the image and run it:

`docker run --rm --name site-container -p 80:80 -e APACHE2_SERVER_NAME=localhost site-image`

## Other useful commands

Open a shell in a running container:

`docker exec -it site-container /bin/bash`

Stop the container and delete it:

`docker stop site-container` or `docker kill site-container`
