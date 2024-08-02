import { IEventSubscriber } from 'ddd-node';
import { Class } from 'type-fest';

export const ProcessSubscriber = (processType: string) => {
  return (target: Class<IEventSubscriber>) => {
    Reflect.defineMetadata('PROCESS_SUBSCRIBER', processType, target);
  };
};
