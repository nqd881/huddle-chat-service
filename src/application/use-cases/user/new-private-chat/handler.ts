import { IAppCommandHandler } from 'application/_base/app-command';
import {
  RepoRegistryIdentifier,
  WorkflowHostIdentifier,
} from 'application/app.identifiers';
import { IRepoRegistry } from 'application/abstractions';
import { Type } from 'application/utils/type';
import { inject, injectable } from 'inversify';
import { NewPrivateChatCommand } from './command';
import { IWorkflowHost } from 'wfes';

@injectable()
export class NewPrivateChatHandler
  implements IAppCommandHandler<NewPrivateChatCommand>
{
  constructor(
    @inject(RepoRegistryIdentifier) private repoRegistry: IRepoRegistry,
    @inject(WorkflowHostIdentifier) private workflowHost: IWorkflowHost,
  ) {}

  commandType(): Type<NewPrivateChatCommand> {
    return NewPrivateChatCommand;
  }

  async handleCommand(command: NewPrivateChatCommand): Promise<void> {
    const { userId } = command;

    if (!userId) throw new Error("User's id must be provided");

    const { targetUserId } = command.payload;

    const user = await this.repoRegistry.userRepo().userOfId(userId);

    if (!user) throw new Error('User not found');

    const workflowId = await this.workflowHost.startWorkflow(
      'initiate-private-chat',
      1,
      {
        userId: user.id(),
        invitedUserId: targetUserId,
      },
    );
  }
}
