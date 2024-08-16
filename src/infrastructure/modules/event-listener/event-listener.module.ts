import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { AppCoreModule } from '../app-core';
import { EVENT_STORE, EventStoreModule } from '../event-store';
import { APP_CORE } from '../app-core/token';
import { App } from 'application/app';
import { InMemoryEventStore } from '../event-store/in-memory-event-store';
import { AnyEvent } from 'ddd-node';

@Module({
  imports: [AppCoreModule, EventStoreModule],
})
export class EventListenerModule implements OnModuleInit {
  constructor(
    @Inject(APP_CORE) private appCore: App,
    @Inject(EVENT_STORE) private eventStore: InMemoryEventStore,
  ) {}

  onModuleInit() {
    this.eventStore.emitter.on('event', (event: AnyEvent) => {
      this.appCore.handleDomainEvent(event);
    });
  }
}
