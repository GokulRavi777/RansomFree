# RansomFree - Deployment Guide

This guide details how to deploy the complete RansomFree system (Frontend + Backend + Sandbox).

## Architecture Overview
The application consists of:
1. **Flask Backend**: Exposes the `/analyze` and `/chat` APIs, and also serves the static `frontend` files.
2. **Sandbox Engine**: A Docker-in-Docker (DinD) mechanism. The Python backend spins up ephemeral `neurowall-sandbox` containers to safely execute malware payloads.

## Prerequisites
- **Docker**: Must be installed and running on the host machine.
- **Docker Compose**: Required to orchestrate the main application.

## Deployment Steps

### 1. Build the Sandbox Image First
Before launching the main application, the secure sandbox Docker image must exist on the host machine.
Navigate to the root of the project and run:
```bash
cd backend/sandbox/docker
docker build -t neurowall-sandbox .
```

### 2. Configure Environment Variables
Ensure your `.env` file exists in the root `RansomFree/` directory with your required AI API keys:
```env
GEMINI_API_KEY=your_key_here
```

### 3. Launch the Application via Docker Compose
From the root directory of the project, run:
```bash
docker-compose up -d --build
```

This will build the `ransomfree-app` container and start the server on port `5001`.

### 4. Access the Dashboard
Because the Flask application serves the static frontend, you can access the entire application by simply visiting:
👉 **http://localhost:5001**

## Security Notes
- The `docker-compose.yml` mounts `/var/run/docker.sock` to the main application container. This allows the Flask app to spawn sibling containers for the sandbox analysis.
- The sandbox containers (`neurowall-sandbox`) are spun up with `--network none`, `--cpus 0.5`, and `--memory 128m` to prevent network propagation and resource exhaustion during malware detonation.
