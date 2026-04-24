import json
import os
import subprocess
import sys

INPUT_FILE = "/sandbox_input/input_file"
OUTPUT_FILE = "/sandbox_output/output.json"

def main():
    result = {
        "executed": False,
        "file_info": "",
        "syscalls": "",
        "notes": []
    }

    if not os.path.exists(INPUT_FILE):
        result["notes"].append("Input file not found.")
        write_output(result)
        return

    # Check file type
    try:
        file_cmd = subprocess.run(["file", "-b", INPUT_FILE], capture_output=True, text=True, check=True)
        file_type = file_cmd.stdout.strip()
        result["file_info"] = file_type
    except Exception as e:
        result["notes"].append(f"Failed to determine file type: {e}")
        write_output(result)
        return

    # Only execute safe types (scripts)
    if "script" not in file_type.lower():
        result["notes"].append("Not a script. Skipping blind execution.")
        write_output(result)
        return

    # Execute and trace syscalls
    try:
        # Run with strace
        # -c counts syscalls, -f follows forks
        interpreter = "sh"
        if "python" in file_type.lower() or INPUT_FILE.endswith(".py"):
             interpreter = "python"
        
        trace_cmd = ["strace", "-c", "-f", interpreter, INPUT_FILE]
        trace_process = subprocess.run(trace_cmd, capture_output=True, text=True, timeout=5)
        
        result["executed"] = True
        result["syscalls"] = trace_process.stderr # strace -c output goes to stderr
        if trace_process.returncode != 0:
             result["notes"].append(f"Execution finished with non-zero return code: {trace_process.returncode}")

    except subprocess.TimeoutExpired:
        result["executed"] = True
        result["notes"].append("Execution timed out.")
    except Exception as e:
        result["notes"].append(f"Execution failed: {e}")

    write_output(result)

def write_output(data):
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(data, f)

if __name__ == "__main__":
    main()
