import os

def analyze(file_path: str) -> dict:
    try:
        size = os.path.getsize(file_path)
        _, ext = os.path.splitext(file_path)
        return {
            "size": size,
            "extension": ext.lower()
        }
    except Exception as e:
        return {"size": 0, "extension": "", "error": str(e)}
