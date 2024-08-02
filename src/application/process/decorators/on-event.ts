import { AnyEvent, EventClass } from 'ddd-node';
import { IEventHandler, defineEventHandler } from '../metadata';

export const OnEvent = <T extends AnyEvent>(eventClass: EventClass<T>) => {
  return (
    target: object,
    propertyKey: PropertyKey,
    descriptor: TypedPropertyDescriptor<IEventHandler<T>>,
  ) => {
    defineEventHandler(target, eventClass.eventType(), descriptor.value!);
  };
};
