import {
  RepoRegistryIdentifier,
  WorkflowContextIdentifier,
} from 'application/app.identifiers';
import { IRepoRegistry } from 'application/abstractions';
import { MyStepBody, WorkflowContext } from 'application/workflow/my-step-body';
import { AsyncLocalStorage } from 'async_hooks';
import { PrivateChatMemberRole } from 'domain/models/role/default-roles';
import { inject } from 'inversify';
import { ExecutionResult, StepBody, StepExecutionContext } from 'wfes';

export interface CreateInitiatorParticipantInput {
  userId: string;
  chatId: string;
}

export class CreateInitiatorParticipant extends MyStepBody {
  public input?: CreateInitiatorParticipantInput;

  constructor(
    @inject(WorkflowContextIdentifier)
    workflowContext: AsyncLocalStorage<WorkflowContext>,
    @inject(RepoRegistryIdentifier) private repoRegistry: IRepoRegistry,
  ) {
    super(workflowContext);
  }

  async _run(context: StepExecutionContext): Promise<ExecutionResult> {
    if (!this.input) throw new Error();

    const chat = await this.repoRegistry.chatRepo().chatOfId(this.input.chatId);

    if (!chat) throw new Error('Chat not found');

    chat.addPendingParticipant(
      this.input.userId,
      [PrivateChatMemberRole],
      Date.now() + 60000 * 2,
    );

    await this.repoRegistry.chatRepo().save(chat);

    return ExecutionResult.next();
  }
}
