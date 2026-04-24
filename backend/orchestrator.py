import os
from datetime import datetime
from static_analysis import entropy, strings, file_info
from sandbox import sandbox_runner
from scoring import scorer

def analyze_file(file_path: str, original_filename: str, outputs_dir: str) -> dict:
    
    # 1. Static Analysis
    entropy_result = entropy.analyze(file_path)
    strings_result = strings.analyze(file_path)
    file_info_result = file_info.analyze(file_path)

    static_analysis = {
        "entropy": entropy_result,
        "strings": strings_result,
        "file_info": file_info_result
    }

    # 2. Sandbox Analysis
    sandbox_analysis = sandbox_runner.analyze(file_path, outputs_dir)

    # 3. Scoring
    scoring_result = scorer.score_analysis(static_analysis, sandbox_analysis)

    # 4. Construct Final Response (Strict Format)
    response = {
        "file_name": original_filename,
        "status": scoring_result["status"],
        "risk_score": scoring_result["risk_score"],
        "static_analysis": {
            "entropy": static_analysis["entropy"].get("entropy", 0.0),
            "keywords": static_analysis["strings"].get("keywords", []),
            "file_type": static_analysis["file_info"].get("extension", "")
        },
        "sandbox_analysis": {
            "executed": sandbox_analysis.get("executed", False),
            "file_info": sandbox_analysis.get("file_info", ""),
            "syscalls": sandbox_analysis.get("syscalls", ""),
            "notes": sandbox_analysis.get("notes", [])
        },
        "reasons": scoring_result["reasons"],
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

    return response
