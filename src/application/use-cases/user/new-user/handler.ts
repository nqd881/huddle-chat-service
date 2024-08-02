import { IAppCommandHandler } from 'application/_base/app-command';
import { NewUserCommand } from './command';
import { inject, injectable } from 'inversify';
import { RepoRegistryToken } from 'application/app.token';
import { IRepoRegistry } from 'application/output-ports/repo-registry';
import { Type } from 'application/utils/type';
import { User } from 'domain/models/user';

@injectable()
export class NewUserHandler implements IAppCommandHandler<NewUserCommand> {
  constructor(@inject(RepoRegistryToken) private repoRegistry: IRepoRegistry) {}

  commandType(): Type<NewUserCommand> {
    return NewUserCommand;
  }

  async handleCommand(command: NewUserCommand): Promise<void> {
    // const {} = command.payload;

    const user = User.create();

    await this.repoRegistry.userRepo().save(user);
  }
}
