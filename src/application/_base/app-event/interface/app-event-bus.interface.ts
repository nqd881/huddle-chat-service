import { IAppEventHandler } from './app-event-handler.interface';
import { IAppEvent } from './app-event.interface';

export interface IAppEventBus {
  registerHandler(handler: IAppEventHandler): void;
  registerHandlers(handlers: IAppEventHandler[]): void;
  publishEvent(event: IAppEvent): Promise<void>;
}
