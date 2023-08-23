# Running with docker

Build an image:

`docker build -t site .`

Create a container from the image and run it:

`docker run --rm -p 80:80 -e APACHE2_SERVER_NAME=localhost site`