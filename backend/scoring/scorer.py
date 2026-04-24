def score_analysis(static_results: dict, sandbox_results: dict) -> dict:
    score = 0
    reasons = []

    # +30 → executable file
    file_info = static_results.get("file_info", {})
    extension = file_info.get("extension", "")
    sandbox_file_info = sandbox_results.get("file_info", "").lower()
    
    if extension in [".exe", ".dll", ".sh", ".bat", ".ps1"] or "executable" in sandbox_file_info or "script" in sandbox_file_info:
        score += 30
        reasons.append("Executable file detected (+30)")

    # +25 → entropy > 7.5
    entropy_info = static_results.get("entropy", {})
    if entropy_info.get("is_suspicious", False):
        score += 25
        reasons.append(f"High entropy ({entropy_info.get('entropy', 0)}) detected (+25)")

    # +20 → suspicious keywords
    strings_info = static_results.get("strings", {})
    keywords = strings_info.get("keywords", [])
    if keywords:
        score += 20
        reasons.append(f"Suspicious keywords found: {', '.join(keywords)} (+20)")

    # +10 → large file
    size = file_info.get("size", 0)
    if size > 5 * 1024 * 1024: # 5MB threshold for "large" in this context
        score += 10
        reasons.append(f"Large file size ({size} bytes) (+10)")

    # +10 → sandbox execution detected
    if sandbox_results.get("executed", False):
        score += 10
        reasons.append("Sandbox execution was successful (+10)")

    # +10 → syscall activity
    syscalls = sandbox_results.get("syscalls", "")
    if syscalls and "syscall" in syscalls.lower() and "seconds" in syscalls.lower(): # Basic check if strace output is present
        score += 10
        reasons.append("System call activity detected during sandbox run (+10)")

    # Cap score at 100
    score = min(score, 100)

    # Classification
    if score < 20:
        status = "SAFE"
    elif score < 50:
        status = "SUSPICIOUS"
    else:
        status = "MALICIOUS"

    return {
        "risk_score": score,
        "status": status,
        "reasons": reasons
    }
