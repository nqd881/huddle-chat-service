import { Inject, Injectable } from '@nestjs/common';
import { IRepoRegistry } from 'application/abstractions';
import { IChatRepo, IParticipantRepo, IUserRepo } from 'domain/repositories';
import { IInvitationRepo } from 'domain/repositories/chat-join-invitation.repo';
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
    @Inject(INVITATION_REPO) private _invitationRepo: IInvitationRepo,
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

  invitationRepo(): IInvitationRepo {
    return this._invitationRepo;
  }
}
