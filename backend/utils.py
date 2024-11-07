import json
from llama_index.core.llms import ChatMessage
import os
import requests
from PIL import Image
import pytesseract
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
from llama_index.llms.ollama import Ollama
from llama_index.core.bridge.pydantic import BaseModel
from typing import List

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

def image_emotion(llm: str, image_string) -> str:
    
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


def generate_qa_from_img(img_pth: str) -> list:

    llm = Ollama(model="gemma2:2b", request_timeout=60.0, json_mode=True) 
    allm = Ollama(model="gemma2:2b", request_timeout=60.0) 

    text = str(pytesseract.image_to_string(Image.open(img_pth)))
        
    EXTRACTION_PROMPT = """
    Restructure all the list of questions possible refering the given below ocr extracted text word to word.
    Combine the respective sub-questions in a single question if any.

    <context>
    {raw_text}
    </context>

    Create a JSON object from the information in the context and also consider OR options.
    The JSON object must follow the below JSON schema example:

    """

    prompt = EXTRACTION_PROMPT.format(
                raw_text=text
            )

    example = """Example:
    {
        list_of_questions: [
            {
                question_count: 1,
                content: "question_content_here_1"
            },
            {
                question_count: 2,
                content: "question_content_here_2"
            }
        ]
    }"""

    prompt += example

    output = llm.complete(prompt)

    questions_list = json.loads(output.text)

    print(questions_list, end="\n\n")

    qa_list = []

    for row in questions_list['list_of_questions']:
        
        response = allm.complete(row["content"])

        data = {
            "question": row["content"],
            "answer": response.text
        }

        print(data, end="\n\n")

        qa_list.append(data)
    
    return qa_list