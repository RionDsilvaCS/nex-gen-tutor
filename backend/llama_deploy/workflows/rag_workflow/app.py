from llama_index.core import VectorStoreIndex
from llama_index.core import Settings
from llama_index.core.workflow import Event
from llama_index.core.schema import NodeWithScore
from llama_index.core.workflow import (
    Context,
    Workflow,
    StartEvent,
    StopEvent,
    step,
)
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.ollama import Ollama

from llama_index.postprocessor.flag_embedding_reranker import (
    FlagEmbeddingReranker,
)
from llama_index.core import get_response_synthesizer
from llama_index.core.response_synthesizers import ResponseMode
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import PromptTemplate
import chromadb
import os

def get_index(
        db_name: str,
        collection_name: str = "default"
    ):

    SAVE_DIR = "/home/rion/agents/nex-gen-tutor/backend/db"

    save_pth = os.path.join(SAVE_DIR, db_name)

    embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

    vectordb = chromadb.PersistentClient(path=save_pth)
    chroma_collection = vectordb.get_or_create_collection(collection_name)
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    index = VectorStoreIndex.from_vector_store(
        vector_store,
        embed_model=embed_model,
        )
    
    return index

Settings.llm = Ollama(model="gemma2:2b", request_timeout=30.0)
Settings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)
rerank = FlagEmbeddingReranker(model="BAAI/bge-reranker-base", top_n=5)

class RAGWorkflow(Workflow):
    @step
    async def retrieve(
        self, ctx: Context, ev: StartEvent
    ) -> StopEvent:
        qa_prompt_tmpl_str = (
            "Context information is below.\n"
            "---------------------\n"
            "{context_str}\n"
            "---------------------\n"
            "Given the context information and not prior knowledge, "
            "answer the query elaborately like a young enthusiastic tutor.\n"
            "Query: {query_str}\n"
            "Answer: "
        )

        qa_prompt_tmpl = PromptTemplate(qa_prompt_tmpl_str)

        query = ev.get("query")
        index = get_index(db_name=ev.get("db_name"), collection_name=ev.get("collection_name"))

        if not query:
            return None

        print(f"Query the database with: {query}")

        if index is None:
            print("Index is empty, load some documents before querying!")
            return None
        
        response_synthesizer = get_response_synthesizer(
            llm=Ollama(model="gemma2:2b", request_timeout=30.0),
            response_mode=ResponseMode.SIMPLE_SUMMARIZE,
            text_qa_template=qa_prompt_tmpl,
        )

        retriever = index.as_retriever()
        nodes = retriever.retrieve(query)

        print("Num of nodes : ",len(nodes))

        response = await response_synthesizer.asynthesize(
            query,
            nodes=nodes,
        )

        # rerank = FlagEmbeddingReranker(model="BAAI/bge-reranker-base", top_n=5)

        # query_engine = index.as_query_engine(
        #     similarity_top_k=8, node_postprocessors=[rerank]
        # )

        # response = query_engine.query(query)

        return StopEvent(result=response)

