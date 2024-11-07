from llama_index.core.workflow import (
    StartEvent,
    StopEvent,
    Workflow,
    Context,
    step,
)
from llama_index.llms.ollama import Ollama
from dotenv import load_dotenv

load_dotenv()

class SampleWorkflow(Workflow):
    @step
    async def my_step(self, ctx: Context, ev: StartEvent) -> StopEvent:

        llm = Ollama(model="llama3.2:latest", request_timeout=30.0)
        # llm = Gemini(model="models/gemini-1.5-flash-latest", api_key=os.getenv("GOOGLE_API_KEY"))
        
        query = ev.get("query")

        if not query:
            return None

        print(f"Query the with: {query}")

        response = llm.complete(query)

        return StopEvent(result=response)
