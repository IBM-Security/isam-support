DOCKER         = docker
DOCKER-COMPOSE = docker-compose
IMAGE          = iag-l2dashboard
HAPROXY_IMAGE  = haproxy-l2dashboard

help:
        @tput clear
        @echo ""
        @echo "Help Intructions for the ISAM L2 Dashboard Application Gateway"
        @echo ""
        @echo "up:                              Create a new container using Docker Compose."
        @echo "stop:                            Stop the container."
        @echo "start:                           Start the container."
        @echo "restart:                 Restart the container."
        @echo "down:                            Bring down the container, leave the volume, i.e. the syslog file."
        @echo "destroy:                 Bring down the container and destory the volume."
        @echo "build:                           Rebuild the IAG image."
        @echo "buildha:                 Rebuild the HAProxy image."

build:
         $(DOCKER) build -t $(IMAGE) .

buildha:
         $(DOCKER) build -t $(HAPROXY_IMAGE) --file Dockerfile-haproxy .

up:
        $(DOCKER-COMPOSE) up --detach

stop:
        $(DOCKER-COMPOSE) stop

start:
        $(DOCKER-COMPOSE) start

restart:
        $(DOCKER-COMPOSE) restart

down:
        $(DOCKER-COMPOSE) down

destroy:
        $(DOCKER-COMPOSE) down --volumes

all:
        build

clean:
        docker image rm $(IMAGE) $(HAPROXY_IMAGE)
