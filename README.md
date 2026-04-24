# RansomFree 🛡️

RansomFree is an advanced ransomware detection and analysis platform. It utilizes a secure sandbox environment combined with static and dynamic (behavioral) analysis to determine the risk level of uploaded executables, scripts, and archives.

## Features
- **Modern Dashboard**: A clean, responsive UI built with vanilla JS and CSS (Lovable style).
- **Static Analysis**: Calculates Shannon entropy and searches for known ransomware strings/keywords.
- **Dynamic Sandbox Execution**: Mounts the file in an isolated, ephemeral Docker container (`neurowall-sandbox`) to monitor execution behavior and system calls (`strace`).
- **Threat Scoring**: Automatically flags files as `SAFE`, `SUSPICIOUS`, or `MALICIOUS` based on a weighted scoring engine.
- **Threat Intelligence Chatbot**: An integrated AI assistant capable of reading the sandbox reports and explaining the threats interactively. *(AI API integration pending).*

## Architecture
- **Frontend**: HTML5, CSS3, ES6 JavaScript. Uses an event-delegated architecture for seamless batch file processing.
- **Backend**: Python, Flask, Docker.

## Getting Started

### Prerequisites
- Python 3.10+
- Docker (must be running on your host machine)

### Installation
1. Clone this repository.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```bash
   python app.py
   ```
5. Open your browser and navigate to: `http://localhost:5001/`

## Note on Security
The backend executes files within a restricted Docker container with disabled networking (`--network none`) and limited resources. However, you should **never** deploy this on a public-facing host without additional security hardening, user authentication, and strict Docker daemon isolation.
