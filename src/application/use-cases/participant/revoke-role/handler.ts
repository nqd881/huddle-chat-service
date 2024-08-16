import { IAppCommandHandler } from 'application/_base/app-command';
import { inject, injectable } from 'inversify';
import { IRepoRegistry } from 'application/abstractions';
import { RepoRegistryIdentifier } from 'application/app.identifiers';
import { Type } from 'utils/types/type';
import { Role } from 'domain/models/role';
import { ParticipantService } from 'domain/services';
import { RevokeRoleCommand } from './command';

@injectable()
export class RevokeRoleHandler
  implements IAppCommandHandler<RevokeRoleCommand>
{
  constructor(
    @inject(RepoRegistryIdentifier) private repoRegistry: IRepoRegistry,
  ) {}

  commandType(): Type<RevokeRoleCommand> {
    return RevokeRoleCommand;
  }

  async handleCommand(command: RevokeRoleCommand): Promise<void> {
    const { userId } = command;

    if (!userId) throw new Error('User id must be provided');

    const { chatId, targetParticipantId, roles: roleNames } = command.payload;

    const [assignor, targetParticipant] = await Promise.all([
      this.repoRegistry.participantRepo().participantOfChat(chatId, userId),
      this.repoRegistry.participantRepo().participantOfId(targetParticipantId),
    ]);

    if (!assignor) throw new Error('Assignor not found');
    if (!targetParticipant) throw new Error('Target participant not found');

    const roles: Role[] = [];

    ParticipantService.revokeRoles(assignor, targetParticipant, roles);

    return this.repoRegistry.participantRepo().save(targetParticipant);
  }
}
