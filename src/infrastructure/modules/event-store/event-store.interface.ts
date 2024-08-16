import { AnyEvent } from 'ddd-node';

export interface IEventStore {
  append(event: AnyEvent): void;
  store(): Promise<void>;
}
