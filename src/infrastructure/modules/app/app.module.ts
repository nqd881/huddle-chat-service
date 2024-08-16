import { Module } from '@nestjs/common';
import { AppCoreModule } from '../app-core';
import { EventListenerModule } from '../event-listener/event-listener.module';
import { UserModule } from '../user';

@Module({
  imports: [AppCoreModule, EventListenerModule, UserModule],
})
export class AppModule {}
