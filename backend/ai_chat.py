import os
import requests

def get_ai_response(query: str, analysis_data: dict) -> str:
    gemini_key = os.environ.get("GEMINI_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")
    
    system_prompt = (
        "You are a cybersecurity expert assistant for RansomFree. "
        "Explain the following malware analysis report simply and answer the user's query.\n"
        f"Analysis Data: {analysis_data}\n"
    )

    if gemini_key:
        return _call_gemini(query, system_prompt, gemini_key)
    elif openai_key:
        return _call_openai(query, system_prompt, openai_key)
    else:
        return "⚠️ Error: No API keys configured on the server. Please set GEMINI_API_KEY or OPENAI_API_KEY environment variables."

def _call_gemini(query: str, system_prompt: str, api_key: str) -> str:
    # Using the newer gemini-1.5-flash model, fallback to gemini-pro if needed
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": system_prompt + "\n\nUser Query: " + query}
                ]
            }
        ]
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return f"Gemini API Error: {str(e)}"

def _call_openai(query: str, system_prompt: str, api_key: str) -> str:
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ]
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"OpenAI API Error: {str(e)}"
