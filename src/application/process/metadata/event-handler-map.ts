import { AnyEvent, EventType } from 'ddd-node';

export interface IEventHandler<T extends AnyEvent = AnyEvent> {
  (event: T): Promise<void>;
}

export class EventHandlerMap extends Map<EventType, IEventHandler<AnyEvent>> {}

export const OwnEventHandlerMapMetaKey = Symbol.for('OWN_EVENT_HANDLER_MAP');
export const EventHandlerMapMetaKey = Symbol.for('EVENT_HANDLER_MAP');

export const getOwnEventHandlerMap = (target: object): EventHandlerMap => {
  if (!Reflect.hasOwnMetadata(OwnEventHandlerMapMetaKey, target))
    Reflect.defineMetadata(
      OwnEventHandlerMapMetaKey,
      new EventHandlerMap(),
      target,
    );

  return Reflect.getMetadata(OwnEventHandlerMapMetaKey, target)!;
};

export const defineEventHandler = (
  target: object,
  eventType: string,
  eventHandler: IEventHandler,
) => {
  const eventHandlerMap = getOwnEventHandlerMap(target);

  eventHandlerMap.set(eventType, eventHandler);
};

export const getEventHandlerMap = (target: object): EventHandlerMap => {
  if (!Reflect.hasOwnMetadata(EventHandlerMapMetaKey, target)) {
    const buildEventHandlerMap = (target: object) => {
      let _target: object | null = target;

      const result: EventHandlerMap = new EventHandlerMap();

      const ownEventHandlerMaps: EventHandlerMap[] = [];

      do {
        const ownEventHandlerMap = getOwnEventHandlerMap(_target);

        ownEventHandlerMaps.unshift(ownEventHandlerMap);

        _target = Reflect.getPrototypeOf(_target);
      } while (_target !== null);

      ownEventHandlerMaps.forEach((ownEventHandlerMap) => {
        ownEventHandlerMap.forEach((eventHandler, eventType) => {
          result.set(eventType, eventHandler);
        });
      });

      return result;
    };

    Reflect.defineMetadata(
      EventHandlerMapMetaKey,
      buildEventHandlerMap(target),
      target,
    );
  }

  return Reflect.getOwnMetadata(EventHandlerMapMetaKey, target)!;
};
