import { injectable } from 'inversify';
import { Type } from 'utils/types/type';
import { IAppCommand, IAppCommandBus, IAppCommandHandler } from './interfaces';

@injectable()
export class AppCommandBus implements IAppCommandBus {
  private handlersMap: Map<Type<IAppCommand>, IAppCommandHandler> = new Map();

  registerHandler(handler: IAppCommandHandler) {
    this.handlersMap.set(handler.commandType(), handler);

    return () => this.deregisterHandler(handler.commandType());
  }

  deregisterHandler(commandType: Type<IAppCommand>): void {
    this.handlersMap.delete(commandType);
  }

  registerHandlers(handlers: IAppCommandHandler[]): void {
    handlers.forEach((handler) => {
      this.registerHandler(handler);
    });
  }

  async executeCommand(command: IAppCommand): Promise<void> {
    const commandType = command.constructor as Type<IAppCommand>;

    const handler = this.handlersMap.get(commandType);

    if (!handler) throw new Error('Command handler not found');

    await handler.handleCommand(command);
  }
}
