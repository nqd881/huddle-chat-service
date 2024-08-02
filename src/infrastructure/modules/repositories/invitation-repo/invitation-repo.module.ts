import { Module } from '@nestjs/common';
import { INVITATION_REPO } from './token';
import { InMemoryInvitationRepo } from './in-memory-invitation-repo';

@Module({
  providers: [
    {
      provide: INVITATION_REPO,
      useClass: InMemoryInvitationRepo,
    },
  ],
  exports: [INVITATION_REPO],
})
export class InvitationRepoModule {}
