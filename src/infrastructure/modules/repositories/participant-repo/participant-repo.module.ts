import { Module } from '@nestjs/common';
import { PARTICIPANT_REPO } from './token';
import { InMemoryParticipantRepo } from './in-memory-participant-repo';

@Module({
  providers: [
    {
      provide: PARTICIPANT_REPO,
      useClass: InMemoryParticipantRepo,
    },
  ],
  exports: [PARTICIPANT_REPO],
})
export class ParticipantRepoModule {}
