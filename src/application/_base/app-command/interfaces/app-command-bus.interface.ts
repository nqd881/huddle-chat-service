import { Type } from 'utils/types/type';
import { IAppCommandHandler } from './app-command-handler.interface';
import { IAppCommand } from './app-command.interface';

export interface IAppCommandBus {
  registerHandler(handler: IAppCommandHandler): () => void;
  deregisterHandler(commandType: Type<IAppCommand>): void;
  registerHandlers(handlers: IAppCommandHandler[]): void;
  executeCommand(command: IAppCommand): Promise<void>;
}
