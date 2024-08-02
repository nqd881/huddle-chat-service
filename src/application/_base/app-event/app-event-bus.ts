import _ from 'lodash';
import { Type } from 'utils/types/type';
import { IAppEvent, IAppEventBus, IAppEventHandler } from './interface';

export class AppEventBus<EventBase extends IAppEvent = IAppEvent>
  implements IAppEventBus
{
  private _handlersMap: Map<Type<EventBase>, IAppEventHandler<EventBase>[]> =
    new Map();

  constructor(handlers: IAppEventHandler<EventBase>[] = []) {
    this.registerHandlers(handlers);
  }

  registerHandlers(handlers: IAppEventHandler<EventBase>[]) {
    handlers.forEach((handler) => {
      this.registerHandler(handler);
    });
  }

  registerHandler<T extends EventBase>(handler: IAppEventHandler<T>) {
    const eventTypes = _.uniq(_.toArray(handler.eventTypes()));

    eventTypes.forEach((eventType) => {
      const handlers = this._handlersMap.get(eventType) || [];

      handlers.push(handler);

      this._handlersMap.set(eventType, handlers);
    });
  }

  protected getEventHandlers<T extends EventBase>(eventType: Type<T>) {
    const handlers = this._handlersMap.get(eventType);

    return handlers || [];
  }

  async publishEvent<T extends EventBase>(event: T) {
    const eventType = event.constructor as Type<T>;

    const handlers = this.getEventHandlers(eventType);

    await Promise.all(handlers.map((handler) => handler.handleEvent(event)));
  }
}
