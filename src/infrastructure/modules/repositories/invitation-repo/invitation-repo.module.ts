import { Module } from '@nestjs/common';
import { EventStoreModule } from 'infrastructure/modules/event-store';
import { InMemoryInvitationRepo } from './in-memory-invitation-repo';
import { INVITATION_REPO } from './token';

@Module({
  imports: [EventStoreModule],
  providers: [
    {
      provide: INVITATION_REPO,
      useClass: InMemoryInvitationRepo,
    },
  ],
  exports: [INVITATION_REPO],
})
export class InvitationRepoModule {}
