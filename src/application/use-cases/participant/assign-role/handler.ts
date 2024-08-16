import { IAppCommandHandler } from 'application/_base/app-command';
import { AssignRoleCommand } from './command';
import { inject, injectable } from 'inversify';
import { IRepoRegistry } from 'application/abstractions';
import { RepoRegistryIdentifier } from 'application/app.identifiers';
import { Type } from 'utils/types/type';
import { Role } from 'domain/models/role';
import { ParticipantService } from 'domain/services';

@injectable()
export class AssignRoleHandler
  implements IAppCommandHandler<AssignRoleCommand>
{
  constructor(
    @inject(RepoRegistryIdentifier) private repoRegistry: IRepoRegistry,
  ) {}

  commandType(): Type<AssignRoleCommand> {
    return AssignRoleCommand;
  }

  async handleCommand(command: AssignRoleCommand): Promise<void> {
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

    ParticipantService.assignRoles(assignor, targetParticipant, roles);

    return this.repoRegistry.participantRepo().save(targetParticipant);
  }
}
