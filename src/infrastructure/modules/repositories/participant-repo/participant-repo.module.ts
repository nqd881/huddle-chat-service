import { Module } from '@nestjs/common';
import { EventStoreModule } from 'infrastructure/modules/event-store';
import { InMemoryParticipantRepo } from './in-memory-participant-repo';
import { PARTICIPANT_REPO } from './token';

@Module({
  imports: [EventStoreModule],
  providers: [
    {
      provide: PARTICIPANT_REPO,
      useClass: InMemoryParticipantRepo,
    },
  ],
  exports: [PARTICIPANT_REPO],
})
export class ParticipantRepoModule {}
