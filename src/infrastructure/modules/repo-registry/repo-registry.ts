import { Inject, Injectable } from '@nestjs/common';
import { IRepoRegistry } from 'application/output-ports/repo-registry';
import { IChatRepo, IParticipantRepo, IUserRepo } from 'domain/repositories';
import { IChatJoinInvitationRepo } from 'domain/repositories/chat-join-invitation.repo';
import { USER_REPO } from '../repositories/user-repo';
import { CHAT_REPO } from '../repositories/chat-repo';
import { PARTICIPANT_REPO } from '../repositories/participant-repo';
import { INVITATION_REPO } from '../repositories/invitation-repo';

@Injectable()
export class RepoRegistry implements IRepoRegistry {
  constructor(
    @Inject(USER_REPO) private _userRepo: IUserRepo,
    @Inject(CHAT_REPO) private _chatRepo: IChatRepo,
    @Inject(PARTICIPANT_REPO) private _participantRepo: IParticipantRepo,
    @Inject(INVITATION_REPO) private _invitationRepo: IChatJoinInvitationRepo,
  ) {}

  userRepo(): IUserRepo {
    return this._userRepo;
  }

  chatRepo(): IChatRepo {
    return this._chatRepo;
  }

  participantRepo(): IParticipantRepo {
    return this._participantRepo;
  }

  invitationRepo(): IChatJoinInvitationRepo {
    return this._invitationRepo;
  }
}
