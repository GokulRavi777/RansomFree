FROM python:3.10-slim

RUN apt-get update && apt-get install -y strace file && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY runner.py /app/runner.py
RUN chmod +x /app/runner.py

ENTRYPOINT ["python", "/app/runner.py"]
