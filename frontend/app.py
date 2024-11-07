from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette import EventSourceResponse
from llama_index.llms.ollama import Ollama
import time
from llama_index.llms.gemini import Gemini
import os
from dotenv import load_dotenv

from schema import ChatResponse, ChatStruct, DocResponse, CreateDB, PredictionResponse
from utils import stream_response

load_dotenv()


llm_list = ["llava:latest", "llama3.2:latest", "phi3:mini", "gemma2:2b"]

# llm = Ollama(model=llm_list[3], request_timeout=30.0)
llm = Gemini(model="models/gemini-1.5-flash-latest", api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"message": "Bazinga 🎉"}


@app.post("/chat-sample")
async def chat_sample(chat: ChatStruct) -> ChatResponse:

    start = time.time()

    response = llm.complete(chat.query)
    
    inf_time = float(time.time() - start)

    return ChatResponse(message=str(response), time=inf_time)


@app.post("/chat-sample-stream")
async def chat_sample_stream(chat: ChatStruct) -> EventSourceResponse:

    return EventSourceResponse(stream_response(llm, chat.query))

# <----------------------------------------------------------------------->

@app.post("/upload-single-doc")
async def upload_docs(file: UploadFile) -> DocResponse:

    start = time.time()

    file_content = await file.read()
    file_location = f'./data/{file.filename}'

    with open(file_location, "wb") as f: 
        f.write(file_content)

    inf_time = float(time.time() - start)

    return DocResponse(doc_id=str(file.filename), time=inf_time)


@app.post("/create-db")
async def create_database(db_info : CreateDB) -> DocResponse:

    start = time.time()

    inf_time = float(time.time() - start)

    return DocResponse(doc_id=db_info.collection_name, time=inf_time)


@app.post("/emotion-rec")
async def emotion_recognition(file: UploadFile) -> PredictionResponse:

    start = time.time()

    file_content = await file.read()
    file_location = f'./img/{file.filename}'

    with open(file_location, "wb") as f: 
        f.write(file_content)

    inf_time = float(time.time() - start)

    return PredictionResponse(prediction="Concentrating", time=inf_time)

# <----------------------------------------------------------------------->

@app.post("/chat-doc")
async def chat_sample(chat: ChatStruct) -> ChatResponse:

    start = time.time()

    response = "Chat-Doc"

    inf_time = float(time.time() - start)

    return ChatResponse(message=str(response), time=inf_time)
