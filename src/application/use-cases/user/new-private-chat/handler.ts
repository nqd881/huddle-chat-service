import { inject, injectable } from 'inversify';
import { IAppCommandHandler } from 'application/_base/app-command';
import { Type } from 'application/utils/type';
import { NewPrivateChatCommand } from './command';
import { ProcessStoreToken, RepoRegistryToken } from 'application/app.token';
import { IRepoRegistry } from 'application/output-ports/repo-registry';
import { InitiateChatProcess } from 'application/processes/initiate-chat.process';
import { v4 } from 'uuid';
import { IProcessStore, ProcessStatus } from 'application/process';

@injectable()
export class NewPrivateChatHandler
  implements IAppCommandHandler<NewPrivateChatCommand>
{
  constructor(
    @inject(RepoRegistryToken) private repoRegistry: IRepoRegistry,
    @inject(ProcessStoreToken) private processStore: IProcessStore,
  ) {}

  commandType(): Type<NewPrivateChatCommand> {
    return NewPrivateChatCommand;
  }

  async handleCommand(command: NewPrivateChatCommand): Promise<void> {
    const { userId } = command;

    if (!userId) throw new Error();

    const { targetUserId } = command.payload;

    const user = await this.repoRegistry.userRepo().userOfId(userId);

    if (!user) throw new Error();

    const process = new InitiateChatProcess({
      id: v4(),
      input: {
        initiatorId: userId,
        inviteeUserIds: [targetUserId],
      },
      state: {},
      status: ProcessStatus.Running,
    });

    await this.processStore.store(process);

    // const privateChat = user.createPrivateChat();

    // privateChat.addPendingParticipant(
    //   userId,
    //   [PrivateChatParticipantRole],
    //   1000,
    // );

    // privateChat.

    // privateChat.addPendingParticipant(
    //   targetUserId,
    //   [PrivateChatParticipantRole],
    //   1000,
    // );

    // await this.repoRegistry.chatRepo().save(privateChat);
  }
}
