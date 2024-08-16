import { IAppCommandHandler } from 'application/_base/app-command';
import { ChangeNicknameCommand } from './command';
import { inject, injectable } from 'inversify';
import { Type } from 'utils/types/type';
import { RepoRegistryIdentifier } from 'application/app.identifiers';
import { IRepoRegistry } from 'application/abstractions';
import { ParticipantService } from 'domain/services';
import { Nickname } from 'domain/models/participant/nickname';

@injectable()
export class ChangeNicknameHandler
  implements IAppCommandHandler<ChangeNicknameCommand>
{
  constructor(
    @inject(RepoRegistryIdentifier) private repoRegistry: IRepoRegistry,
  ) {}

  commandType(): Type<ChangeNicknameCommand> {
    return ChangeNicknameCommand;
  }

  async handleCommand(command: ChangeNicknameCommand): Promise<void> {
    const { userId } = command;

    if (!userId) throw new Error('User id must be provided');

    const { chatId, targetParticipantId, nickname } = command.payload;

    const [initiatorParticipant, targetParticipant] = await Promise.all([
      this.repoRegistry.participantRepo().participantOfChat(chatId, userId),
      this.repoRegistry.participantRepo().participantOfId(targetParticipantId),
    ]);

    if (!initiatorParticipant)
      throw new Error('Initiator participant not found');
    if (!targetParticipant) throw new Error('Target participant not found');

    ParticipantService.changeNickname(
      initiatorParticipant,
      targetParticipant,
      new Nickname({ value: nickname }),
    );

    return this.repoRegistry.participantRepo().save(targetParticipant);
  }
}
