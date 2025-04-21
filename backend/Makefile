COMPOSE_FILE = ./deployments/docker-compose.yml

all: build up

clean: rm-container rm-volume

build:
	docker compose -f $(COMPOSE_FILE) build

up:
	docker compose -f $(COMPOSE_FILE) up -d

down:
	docker compose -f $(COMPOSE_FILE) down

rm-container: 
	docker rm -f database

rm-volume:
	docker volume rm wordapp_postgres_data


migrate:
	alembic upgrade head

history:
	alembic history
