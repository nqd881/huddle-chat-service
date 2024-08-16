import { Module } from '@nestjs/common';
import { ChatRepoModule } from '../repositories/chat-repo';
import { InvitationRepoModule } from '../repositories/invitation-repo';
import { ParticipantRepoModule } from '../repositories/participant-repo';
import { UserRepoModule } from '../repositories/user-repo';
import { RepoRegistry } from './repo-registry';

@Module({
  imports: [
    ParticipantRepoModule,
    InvitationRepoModule,
    UserRepoModule,
    ChatRepoModule,
  ],
  providers: [RepoRegistry],
  exports: [RepoRegistry],
})
export class RepoRegistryModule {}
