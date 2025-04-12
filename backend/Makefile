all: build up

clean: rm-container rm-volume

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

rm-container: 
	docker rm -f database

rm-volume:
	docker volume rm wordapp_postgres_data


migrate:
	alembic upgrade head

history:
	alembic history
