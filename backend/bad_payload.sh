#!/bin/bash
# RANSOMWARE SIMULATION SCRIPT
# Keywords for static detection: encrypt decrypt bitcoin ransom

echo "Starting fake malicious activity..."
echo "Simulating encryption..."
# This generates system calls for the dynamic sandbox
ls -la /
find /tmp -type f -name "*.txt" -exec rm -f {} \; 2>/dev/null
echo "Please send 1 bitcoin to decrypt your files."

sleep 1
echo "Done."
