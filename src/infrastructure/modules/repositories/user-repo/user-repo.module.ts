import { Module } from '@nestjs/common';
import { EventStoreModule } from 'infrastructure/modules/event-store';
import { InMemoryUserRepo } from './in-memory-user-repo';
import { USER_REPO } from './token';

@Module({
  imports: [EventStoreModule],
  providers: [{ provide: USER_REPO, useClass: InMemoryUserRepo }],
  exports: [USER_REPO],
})
export class UserRepoModule {}
