from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette import EventSourceResponse
from llama_index.llms.ollama import Ollama
from llama_deploy import LlamaDeployClient, ControlPlaneConfig
from llama_index.llms.gemini import Gemini
import time
from dotenv import load_dotenv
import base64
import json
import os

from schema import ChatResponse, ChatStruct, DocResponse, CreateDB, PredictionResponse, UserStruct
from utils import stream_response, image_emotion, generate_qa_from_img
from create_vdb import create_db

load_dotenv()
# fastapi run app.py --port 8005

USER_DATA = "/home/rion/agents/nex-gen-tutor/backend/db/user.json"

client = LlamaDeployClient(ControlPlaneConfig())

llm_list = ["llava:latest", "llama3.2:latest", "phi3:mini", "gemma2:2b"]

llm = Ollama(model=llm_list[1], request_timeout=30.0)
# llm = Gemini(model="models/gemini-1.5-flash-latest", api_key=os.getenv("GOOGLE_API_KEY"))

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

    create_db(db_name=db_info.db_name, collection_name=db_info.collection_name)

    inf_time = float(time.time() - start)

    return DocResponse(doc_id=db_info.collection_name, time=inf_time)


@app.post("/emotion-rec")
async def emotion_recognition(file: UploadFile) -> PredictionResponse:

    start = time.time()
    
    image_string = base64.b64encode(await file.read()).decode("utf-8")

    prediction = image_emotion(llm_list[0], image_string)

    inf_time = float(time.time() - start)

    return PredictionResponse(prediction=prediction, time=inf_time)

# <----------------------------------------------------------------------->

@app.post("/chat-doc")
async def chat_doc(chat: ChatStruct) -> ChatResponse:

    start = time.time()
    
    session_id = "12345678"

    session = client.get_or_create_session(session_id=session_id)

    if chat.collection_name == "tenth":
        response = session.run("rag_workflow", query=chat.query, db_name=chat.db_name, collection_name=chat.collection_name)
    else:
        response = session.run("sample_workflow", query=chat.query)

    inf_time = float(time.time() - start)

    return ChatResponse(message=str(response), time=inf_time)


@app.post("/chat-image")
async def chat_image(file: UploadFile):

    start = time.time()

    file_content = await file.read()
    file_location = f'./data/{file.filename}'

    with open(file_location, "wb") as f: 
        f.write(file_content)

    list_of_qa = generate_qa_from_img(file_location)

    inf_time = float(time.time() - start)

    os.remove(file_location)

    response = { 'cards': list_of_qa}

    return response

# <----------------------------------------------------------------------->

@app.get("/get-card")
async def get_card():

    with open(USER_DATA, 'r') as file:
        db = json.load(file)

    return db

@app.post("/create-card")
async def create_card(user_info: UserStruct):

    with open(USER_DATA, 'r') as file:
        db = json.load(file)

    data = {
            "id": user_info.id,
            "title": user_info.title,
            "description": user_info.description,
            "category": user_info.category,
            "link": user_info.link
        }
    
    db["cards"].append(data)

    with open(USER_DATA, 'w') as outfile:
        json.dump(db, outfile, indent=4) 

    return db