import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Module({
  providers: [
    {
      provide: 'DOMAIN_EVENT_SUBSCRIBER_ALS',
      useValue: new AsyncLocalStorage(),
    },
  ],
  exports: ['DOMAIN_EVENT_SUBSCRIBER_ALS'],
})
export class DomainEventSubscriberAlsModule {}
