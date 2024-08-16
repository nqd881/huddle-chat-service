import { AsyncLocalStorage } from 'async_hooks';
import { ExecutionResult, StepBody, StepExecutionContext } from 'wfes';

export interface WorkflowContext {
  workflowId: string;
}

export abstract class MyStepBody extends StepBody {
  constructor(private workflowContext: AsyncLocalStorage<WorkflowContext>) {
    super();
  }

  async run(context: StepExecutionContext): Promise<ExecutionResult> {
    return this.workflowContext.run({ workflowId: context.workflow.id }, () =>
      this._run(context),
    );
  }

  abstract _run(context: StepExecutionContext): Promise<ExecutionResult>;
}
