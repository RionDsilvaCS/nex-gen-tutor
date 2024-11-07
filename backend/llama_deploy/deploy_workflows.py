from llama_deploy import (
    deploy_workflow,
    WorkflowServiceConfig,
    ControlPlaneConfig,
)

from llama_index.core.workflow import Workflow, StartEvent, StopEvent, step
from workflows.sample_workflow.app import SampleWorkflow

async def main():
		await deploy_workflow(
		    SampleWorkflow(),
		    WorkflowServiceConfig(
		        host="127.0.0.1", port=8010, service_name="sample_workflow"
		    ),
		    ControlPlaneConfig(),
		)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())