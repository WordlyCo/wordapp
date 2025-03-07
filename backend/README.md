# Word App Backend

### How to run

Create database with docker

1. `docker-compose up -d`

2. `alembic upgrade head`

Install python deps

2. `pip install -r requirements.txt`

Run the server

3. `uvicorn app.main:app --reload`

### If you install libraries

Don't forget to do

`pip freeze -> requirements.txt`

Otherwise I will find you.
