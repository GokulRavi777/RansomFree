import math

def predict(static_data: dict, sandbox_data: dict, risk_score: int) -> dict:
    """
    Pseudo-ML model simulating an Isolation Forest.
    Returns an anomaly score between -1.0 (Anomaly/Malicious) and 1.0 (Normal/Benign).
    """
    # 1. Extract Features
    entropy = static_data.get("entropy", {}).get("entropy", 0.0)
    keywords_count = len(static_data.get("strings", {}).get("keywords", []))
    size = static_data.get("file_info", {}).get("size", 0)
    
    sandbox_executed = sandbox_data.get("executed", False)
    syscalls = sandbox_data.get("syscalls", "")
    
    sandbox_activity_score = 0
    if sandbox_executed:
        sandbox_activity_score += 0.5
    if syscalls and "syscall" in syscalls.lower():
        sandbox_activity_score += 0.5
        
    # 2. Normalize Features
    norm_entropy = min(entropy / 8.0, 1.0)
    norm_keywords = min(keywords_count / 50.0, 1.0)
    norm_size = min(math.log10(max(size, 1)) / 7.0, 1.0) if size > 0 else 0.0
    
    # 3. Calculate Anomaly Score
    feature_sum = norm_entropy * 0.3 + norm_keywords * 0.3 + sandbox_activity_score * 0.4
    base_score = 1.0 - (risk_score / 50.0)
    adjusted_score = base_score - (feature_sum * 0.5)
    
    final_score = max(-1.0, min(1.0, adjusted_score))
    
    is_anomaly = final_score < 0
    
    return {
        "anomaly_score": final_score,
        "anomaly": is_anomaly
    }
