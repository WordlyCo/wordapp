FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Create a startup script
RUN echo '#!/bin/bash\n\
echo "Running migrations..."\n\
alembic upgrade head\n\
echo "Starting app..."\n\
uvicorn app.main:app --host 0.0.0.0 --port 8000\n\
' > /code/start.sh && chmod +x /code/start.sh

CMD ["/code/start.sh"]
