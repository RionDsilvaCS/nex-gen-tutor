from llama_deploy import (
    deploy_workflow,
    WorkflowServiceConfig,
    ControlPlaneConfig,
)

from llama_index.core.workflow import Workflow, StartEvent, StopEvent, step
from workflows.sample_workflow.app import SampleWorkflow
from workflows.rag_workflow.app import RAGWorkflow

async def main():
		sample_task = asyncio.create_task(
            deploy_workflow(
				SampleWorkflow(),
				WorkflowServiceConfig(
					host="127.0.0.1", port=8010, service_name="sample_workflow"
				),
				ControlPlaneConfig(),
			)
		)
                
		rag_task = asyncio.create_task(
            deploy_workflow(
				RAGWorkflow(timeout=120),
				WorkflowServiceConfig(
					host="127.0.0.1", port=8011, service_name="rag_workflow"
				),
				ControlPlaneConfig(),
			)
		)

		await asyncio.gather(sample_task, rag_task)
                
if __name__ == "__main__":
    import asyncio
    asyncio.run(main())