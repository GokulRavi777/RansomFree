import requests
import os

url = 'http://127.0.0.1:5001/analyze'

# Create a safe test file
with open('safe_test.txt', 'w') as f:
    f.write('Hello World! This is a safe text file.')

# Create a malicious script file
with open('malicious_test.sh', 'w') as f:
    f.write('''#!/bin/bash\necho "Ransom note: send bitcoin"\necho "encrypting files..."\nls -l\n''')

def test_file(filename):
    print(f"--- Testing {filename} ---")
    with open(filename, 'rb') as f:
        response = requests.post(url, files={'file': f})
        print("Status Code:", response.status_code)
        try:
            import json
            print("Response:", json.dumps(response.json(), indent=2))
        except Exception as e:
            print("Failed to decode JSON:", response.text)

if __name__ == '__main__':
    test_file('safe_test.txt')
    test_file('malicious_test.sh')
