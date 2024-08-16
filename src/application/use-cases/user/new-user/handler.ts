import { IAppCommandHandler } from 'application/_base/app-command';
import { NewUserCommand } from './command';
import { inject, injectable } from 'inversify';
import { RepoRegistryIdentifier } from 'application/app.identifiers';
import { IRepoRegistry } from 'application/abstractions';
import { Type } from 'application/utils/type';
import { User } from 'domain/models/user';

@injectable()
export class NewUserHandler implements IAppCommandHandler<NewUserCommand> {
  constructor(
    @inject(RepoRegistryIdentifier) private repoRegistry: IRepoRegistry,
  ) {}

  commandType(): Type<NewUserCommand> {
    return NewUserCommand;
  }

  async handleCommand(command: NewUserCommand): Promise<void> {
    const user = User.create();

    await this.repoRegistry.userRepo().save(user);
  }
}
