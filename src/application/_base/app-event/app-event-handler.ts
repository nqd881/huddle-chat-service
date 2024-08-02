import { Type } from 'utils/types/type';
import { IAppEvent, IAppEventHandler } from './interface';

export abstract class AppEventHandler<T extends IAppEvent = IAppEvent>
  implements IAppEventHandler<T>
{
  abstract eventTypes(): Type<T> | Type<T>[];
  abstract handleEvent(event: T): Promise<void>;
}
