import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { App } from 'application/app';
import { AnyEvent } from 'ddd-node';
import { EventEmitter } from 'events';
import { APP_CORE } from '../app-core/token';
import { IEventStore } from './event-store.interface';

@Injectable()
export class InMemoryEventStore implements IEventStore {
  private events: AnyEvent[] = [];

  public emitter = new EventEmitter();

  constructor(@Inject(forwardRef(() => APP_CORE)) private app: App) {}

  append(event: AnyEvent): void {
    this.events.push(event);
  }

  async store() {
    const { workflowId } = this.app.workflowContext().getStore() ?? {};

    if (workflowId) {
      this.events.forEach((event) => {
        event.addCorrelationId('workflowId', workflowId);
      });
    }

    const { event: handledEvent } =
      this.app.domainEventHandlingContext().getStore() ?? {};

    if (handledEvent) {
      this.events.forEach((event) => {
        for (let [key, value] of Object.entries(
          handledEvent.correlationIds(),
        )) {
          if (value) event.addCorrelationId(key, value);
        }
      });
    }

    const storedEvents = Array.from(this.events);

    setTimeout(() => {
      storedEvents.forEach((event) => {
        this.emitter.emit('event', event);
      });
    }, 100);

    this.events = [];
  }
}
