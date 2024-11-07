import json
from llama_index.core.llms import ChatMessage
import os
import requests


async def stream_response(llm, query: str):
    messages = [
        ChatMessage(
            role="system", content="You are a young fun public speaker"
        ),
        ChatMessage(role="user", content=query),
    ]
    try:
        resp = llm.stream_chat(messages)
        for r in resp:
            yield {
                    "data": json.dumps(f"{r.delta}"),
                    "event": "data",
            }
        yield {"event":"end"}
    except:
        yield {
            "event": "error",
            "data": json.dumps(
                {"status_code": 500, "message": "Internal Server Error"}
            ),
        }
        raise

def image_emotion(llm: str, image_string):
    
    url = 'http://localhost:11434/api/generate'
    data = {
        "model": llm,
        "prompt": "Describe in short the image with one of these emotions Happy, Angry, Excited, Stressed or Distracted.",
        'images' : [image_string]
    }

    response = requests.post(url, json=data, stream=True)
    text = ""

    if response.status_code == 200:
        try:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    t = chunk.decode('utf-8')
                    t = json.loads(t)
                    text += t["response"]
        except Exception as e:
            print("Error reading response:", e)
            return "None"
        
    return text