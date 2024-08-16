import { Global, Module, forwardRef } from '@nestjs/common';
import { InMemoryEventStore } from './in-memory-event-store';
import { EVENT_STORE } from './token';
import { AppCoreModule } from '../app-core';
import { workflowContextModule } from '../workflow-als';
import { DomainEventSubscriberAlsModule } from '../domain-event-subscriber-als';

// @Global()
@Module({
  // imports: [AppCoreModule],
  // imports: [forwardRef(() => AppCoreModule)],
  imports: [
    forwardRef(() => AppCoreModule),
    // AppCoreModule,
    // workflowContextModule,
    // DomainEventSubscriberAlsModule,
  ],
  providers: [{ provide: EVENT_STORE, useClass: InMemoryEventStore }],
  exports: [EVENT_STORE],
})
export class EventStoreModule {}
