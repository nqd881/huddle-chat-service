import {
  IChatRepo,
  IMessageRepo,
  IParticipantRepo,
  IUserRepo,
} from 'domain/repositories';
import { IInvitationRepo } from 'domain/repositories/chat-join-invitation.repo';

export interface IRepoRegistry {
  userRepo(): IUserRepo;

  chatRepo(): IChatRepo;

  participantRepo(): IParticipantRepo;

  invitationRepo(): IInvitationRepo;

  // messageRepo(): IMessageRepo;
}
