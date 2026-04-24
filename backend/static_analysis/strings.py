import re

SUSPICIOUS_KEYWORDS = [b'encrypt', b'decrypt', b'bitcoin', b'ransom']

def analyze(file_path: str) -> dict:
    found_keywords = set()
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
            for kw in SUSPICIOUS_KEYWORDS:
                if kw in content.lower():
                    found_keywords.add(kw.decode('utf-8'))
        return {"keywords": list(found_keywords)}
    except Exception as e:
        return {"keywords": [], "error": str(e)}
