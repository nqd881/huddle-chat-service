import {
  RepoRegistryIdentifier,
  WorkflowContextIdentifier,
} from 'application/app.identifiers';
import { IRepoRegistry } from 'application/abstractions';
import { MyStepBody, WorkflowContext } from 'application/workflow/my-step-body';
import { AsyncLocalStorage } from 'async_hooks';
import { Invitation } from 'domain/models/invitation';
import { inject } from 'inversify';
import { ExecutionResult, StepBody, StepExecutionContext } from 'wfes';

export interface InviteUserInput {
  chatId: string;
  inviterUserId: string;
  invitedUserId: string;
}

export interface InviteUserOutput {
  invitationId: string;
}

export class InviteUser extends MyStepBody {
  public input?: InviteUserInput;
  public output?: InviteUserOutput;

  constructor(
    @inject(WorkflowContextIdentifier)
    workflowContext: AsyncLocalStorage<WorkflowContext>,
    @inject(RepoRegistryIdentifier) private repoRegistry: IRepoRegistry,
  ) {
    super(workflowContext);
  }

  async _run(context: StepExecutionContext): Promise<ExecutionResult> {
    if (!this.input) throw new Error('Input must be provided');

    const inviter = await this.repoRegistry
      .participantRepo()
      .participantOfChat(this.input.chatId, this.input.inviterUserId);

    if (!inviter) throw new Error('Participant not found');

    const invitation: Invitation = inviter.inviteUser(this.input.invitedUserId);

    this.output = {
      invitationId: invitation.id(),
    };

    await this.repoRegistry.invitationRepo().save(invitation);

    return ExecutionResult.next();
  }
}
