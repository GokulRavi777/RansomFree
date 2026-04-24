FROM python:3.10-slim

# Install docker client so the python app can run sibling containers
RUN apt-get update && apt-get install -y docker.io && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend and frontend
COPY backend/ /app/backend/
COPY frontend/ /app/frontend/
COPY .env /app/.env

WORKDIR /app/backend

# Expose Flask Port
EXPOSE 5001

# Command to run the Flask application
CMD ["python", "app.py"]
