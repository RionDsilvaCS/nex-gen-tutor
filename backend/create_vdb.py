__import__('pysqlite3')
import sys
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

from llama_index.core import Document, VectorStoreIndex
from llama_index.core.node_parser import TokenTextSplitter
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import StorageContext
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import fitz  # PyMuPDF
import uuid
from PIL import Image
import chromadb
import io
import os

def create_db(
        db_name: str,
        collection_name: str = "default"
    ):

    documents = []

    FILE_DIR = "/home/rion/agents/nex-gen-tutor/backend/data"
    IMG_DIR = "/home/rion/agents/nex-gen-tutor/backend/img"
    SAVE_DIR = "/home/rion/agents/nex-gen-tutor/backend/db"

    files_list = os.listdir(FILE_DIR)

    for file_id in files_list:
        file_pth = os.path.join(FILE_DIR, file_id)
        pdf_file = fitz.open(file_pth)

        for page_num in range(len(pdf_file)):
            
            page = pdf_file[page_num]
            image_list = page.get_images(full=True)  
            text_list = page.get_textpage()

            doc = Document(text=text_list.extractText())

            doc_metadata = {}

            if len(image_list) < 8:
                for img_index, img in enumerate(image_list):
                    xref = img[0]  
                    base_image = pdf_file.extract_image(xref)  
                    image_bytes = base_image['image']  
                    image_ext = base_image['ext'] 

                    if image_ext in ['png', 'jpg', 'jpeg']:
                        image = Image.open(io.BytesIO(image_bytes)) 
                        image_name = f'image_page_{uuid.uuid4()}_.{image_ext}'
                        img_pth = os.path.join(IMG_DIR, image_name)
                        # print(img_pth)
                        image.save(img_pth)

                        doc_metadata["img_" + str(img_index)] = img_pth

            doc_metadata["source"] = file_id + "  " + "page no. " + str(page_num) 
            doc.metadata = doc_metadata
            documents.append(doc)

        pdf_file.close()
        os.remove(file_pth)

        print("Done with : ", file_pth)

    splitter = TokenTextSplitter(
            chunk_size=480,
            chunk_overlap=25,
        )

    nodes = splitter.get_nodes_from_documents(documents)

    embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

    save_pth = os.path.join(SAVE_DIR, db_name)

    db = chromadb.PersistentClient(path=save_pth)

    chroma_collection = db.get_or_create_collection(collection_name)
    
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)

    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    index = VectorStoreIndex(
        nodes=nodes, storage_context=storage_context, embed_model=embed_model
    )

    print("-:-:-:- ChromaDB [Vector Database] saved -:-:-:-")

