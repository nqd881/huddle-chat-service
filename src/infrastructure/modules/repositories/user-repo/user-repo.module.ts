import { Module } from '@nestjs/common';
import { InMemoryUserRepo } from './in-memory-user-repo';
import { USER_REPO } from './token';

@Module({
  providers: [{ provide: USER_REPO, useClass: InMemoryUserRepo }],
  exports: [USER_REPO],
})
export class UserRepoModule {}
