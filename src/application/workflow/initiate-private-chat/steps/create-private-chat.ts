import {
  RepoRegistryIdentifier,
  WorkflowContextIdentifier,
} from 'application/app.identifiers';
import { IRepoRegistry } from 'application/abstractions';
import { MyStepBody, WorkflowContext } from 'application/workflow/my-step-body';
import { AsyncLocalStorage } from 'async_hooks';
import { inject } from 'inversify';
import { ExecutionResult, StepBody, StepExecutionContext } from 'wfes';

export interface CreateChatInput {
  userId: string;
}

export interface CreateChatOutput {
  workflowId: string;
  chatId: string;
}

export class CreatePrivateChat extends MyStepBody {
  public input?: CreateChatInput;
  public output?: CreateChatOutput;

  constructor(
    @inject(WorkflowContextIdentifier)
    workflowContext: AsyncLocalStorage<WorkflowContext>,
    @inject(RepoRegistryIdentifier) private repoRegistry: IRepoRegistry,
  ) {
    super(workflowContext);
  }

  async _run(context: StepExecutionContext): Promise<ExecutionResult> {
    if (!this.input) throw new Error('Input must be provided');

    const user = await this.repoRegistry.userRepo().userOfId(this.input.userId);

    if (!user) throw new Error('User not found');

    const chat = user.createPrivateChat();

    this.output = {
      workflowId: context.workflow.id,
      chatId: chat.id(),
    };

    await this.repoRegistry.chatRepo().save(chat);

    return ExecutionResult.next();
  }
}
