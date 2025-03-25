# Word App Backend
- Welcome to the Word Bird App! Follow this step-by-step guide to get everything running locally.

# How to run

### Step 1: Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Create database with docker
```bash
docker-compose up -d
```
#### Once the database is up, apply migrations in a new terminal:
```bash
alembic upgrade head
```

### Step 3: Run the FastAPI server
```bash
uvicorn app.main:app --reload
```
### If you installed new libraries

Don't forget to do
```bash
pip freeze -> requirements.txt
```
Otherwise I will find you.
