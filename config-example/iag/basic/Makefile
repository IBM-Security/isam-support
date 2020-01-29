DOCKER         = docker
DOCKER-COMPOSE = docker-compose
IMAGE          = iag-l2dashboard
HAPROXY_IMAGE  = haproxy-l2dashboard

help:
        @tput clear
        @echo ""
        @echo "Help Intructions for the ISAM L2 Dashboard Application Gateway"
        @echo ""
        @echo "up:                              Create new containers using Docker Compose."
        @echo "stop:                            Stop the containers."
        @echo "start:                           Start the containers."
        @echo "restart:                 Restart the containers."
        @echo "down:                            Bring down the containers."
        @echo "destroy:                 Bring down the containers and destory the volumes and images."
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
        $(DOCKER) image rm $(HAPROXY_IMAGE)
        $(DOCKER) image rm $(IMAGE)

all: build buildha up

clean:
        docker image rm $(IMAGE) $(HAPROXY_IMAGE)
