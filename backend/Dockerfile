FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

RUN adduser --disabled-password --gecos "" appuser

COPY . .

RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "Running database migrations..."\n\
alembic upgrade head\n\
\n\
echo "Starting application with Gunicorn..."\n\
exec gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}\n\
' > /code/start.sh && chmod +x /code/start.sh

RUN chown -R appuser:appuser /code

USER appuser

EXPOSE ${PORT:-8000}

CMD ["/code/start.sh"]
