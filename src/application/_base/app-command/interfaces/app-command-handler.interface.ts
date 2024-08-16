import { Type } from 'utils/types/type';
import { IAppCommand } from './app-command.interface';

export interface IAppCommandHandler<T extends IAppCommand = IAppCommand> {
  commandType(): Type<T>;
  handleCommand(command: T): Promise<void>;
}
