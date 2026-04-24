import math

def calculate_entropy(data: bytes) -> float:
    if not data:
        return 0.0
    entropy = 0
    for x in range(256):
        p_x = float(data.count(x)) / len(data)
        if p_x > 0:
            entropy += - p_x * math.log(p_x, 2)
    return entropy

def analyze(file_path: str) -> dict:
    try:
        with open(file_path, 'rb') as f:
            data = f.read()
            ent = calculate_entropy(data)
            return {"entropy": round(ent, 3), "is_suspicious": ent > 7.5}
    except Exception as e:
        return {"entropy": 0.0, "is_suspicious": False, "error": str(e)}
