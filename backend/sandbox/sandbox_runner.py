import json
import os
import subprocess
import shutil

DOCKER_IMAGE_NAME = "neurowall-sandbox"

def build_sandbox_image():
    docker_dir = os.path.join(os.path.dirname(__file__), 'docker')
    subprocess.run(["docker", "build", "-t", DOCKER_IMAGE_NAME, docker_dir], check=True)

def analyze(file_path: str, outputs_dir: str) -> dict:
    try:
        # Ensure image exists
        try:
             subprocess.run(["docker", "image", "inspect", DOCKER_IMAGE_NAME], check=True, capture_output=True)
        except subprocess.CalledProcessError:
             print(f"Docker image '{DOCKER_IMAGE_NAME}' not found. Building it now...")
             build_sandbox_image()

        sandbox_output_dir = os.path.join(outputs_dir, "sandbox_run")
        os.makedirs(sandbox_output_dir, exist_ok=True)
        
        # We need an absolute path for docker mounts
        abs_file_path = os.path.abspath(file_path)
        abs_sandbox_output_dir = os.path.abspath(sandbox_output_dir)

        output_json_path = os.path.join(sandbox_output_dir, "output.json")
        if os.path.exists(output_json_path):
             os.remove(output_json_path)

        # Run docker container
        docker_cmd = [
            "docker", "run", "--rm",
            "--network", "none",
            "--cpus", "0.5",
            "--memory", "128m",
            "-v", f"{abs_file_path}:/sandbox_input/input_file:ro",
            "-v", f"{abs_sandbox_output_dir}:/sandbox_output",
            DOCKER_IMAGE_NAME
        ]
        
        # We give the docker run command a slightly longer timeout than the internal sandbox timeout
        subprocess.run(docker_cmd, timeout=10, capture_output=True)

        if os.path.exists(output_json_path):
            with open(output_json_path, 'r') as f:
                return json.load(f)
        else:
            return {
                "executed": False,
                "file_info": "",
                "syscalls": "",
                "notes": ["Sandbox execution failed to produce output.json"]
            }

    except subprocess.TimeoutExpired:
         return {
                "executed": False,
                "file_info": "",
                "syscalls": "",
                "notes": ["Docker container execution timed out (host side)"]
            }
    except Exception as e:
        return {
            "executed": False,
            "file_info": "",
            "syscalls": "",
            "notes": [f"Host side sandbox error: {str(e)}"]
        }
