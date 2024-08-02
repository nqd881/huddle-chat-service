import { Module } from '@nestjs/common';
import { UserRepoModule } from '../repositories/user-repo';
import { ChatRepoModule } from '../repositories/chat-repo';
import { ParticipantRepoModule } from '../repositories/participant-repo';
import { InvitationRepoModule } from '../repositories/invitation-repo';
import { RepoRegistry } from './repo-registry';

@Module({
  imports: [
    UserRepoModule,
    ChatRepoModule,
    ParticipantRepoModule,
    InvitationRepoModule,
  ],
  providers: [RepoRegistry],
  exports: [RepoRegistry],
})
export class RepoRegistryModule {}
