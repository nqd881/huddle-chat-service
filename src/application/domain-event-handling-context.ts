import { AnyEvent } from 'ddd-node';

export interface DomainEventHandlingContext {
  event: AnyEvent;
}
