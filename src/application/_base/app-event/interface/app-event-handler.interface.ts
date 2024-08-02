import { Type } from 'utils/types/type';
import { IAppEvent } from './app-event.interface';

export interface IAppEventHandler<T extends IAppEvent = IAppEvent> {
  eventTypes(): Type<T> | Type<T>[];
  handleEvent(event: T): Promise<void>;
}
